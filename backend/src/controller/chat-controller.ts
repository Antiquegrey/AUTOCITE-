import { NextFunction, Request, Response } from "express";
import User from "../models/Users.js";
import Document from "../models/Document.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getEmbedding, cosineSimilarity } from "../utils/rag-helper.js";

function postprocessAnswer(answer: string): string {
  return answer.replace(/\]([A-Za-z0-9])/g, '] $1').trim();
}

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message } = req.body;
  try {
    const user = await User.findById(res.locals.jwtData.id);
    if (!user)
      return res
        .status(401)
        .json({ message: "User not registered OR Token malfunctioned" });

    // 1. Check if user has uploaded any legal documents
    const documents = await Document.find({ userId: user._id });
    
    let retrievedChunks: Array<{ text: string; page: number; filename: string; score: number }> = [];
    let sources: Array<{ file: string; page: number; snippet: string }> = [];

    if (documents.length > 0) {
      try {
        // 2. Generate embedding for query
        const queryEmbedding = await getEmbedding(message);

        // 3. Collect and score all chunks from user documents
        const scoredChunks: Array<{ text: string; page: number; filename: string; score: number }> = [];
        
        for (const doc of documents) {
          for (const chunk of doc.chunks) {
            const score = cosineSimilarity(queryEmbedding, chunk.embedding);
            scoredChunks.push({
              text: chunk.text,
              page: chunk.page,
              filename: doc.filename,
              score
            });
          }
        }

        // 4. Sort and pick top K (K=5)
        scoredChunks.sort((a, b) => b.score - a.score);
        retrievedChunks = scoredChunks.slice(0, 5);

        // 5. Build sources array
        sources = retrievedChunks.map(chunk => ({
          file: chunk.filename,
          page: chunk.page,
          snippet: chunk.text.length > 300 ? chunk.text.substring(0, 300) + "..." : chunk.text
        }));
      } catch (embError) {
        console.error("RAG retrieval failed (using fallbacks):", embError);
      }
    }

    // grab chats of user from DB and map to Gemini structure (avoid system messages in history)
    const history = user.chats
      .filter(c => c.role === "user" || c.role === "assistant")
      .map(({ role, content }) => ({
        role: role === "user" ? "user" : "model",
        parts: [{ text: content }],
      }));

    // Add user's latest message to history
    history.push({ role: "user", parts: [{ text: message }] });

    // Initialize Google Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    
    // Construct prompt template with context
    let systemInstruction = `You are a specialized Legal AI Assistant for the Indian Legal Domain. 
Your primary tasks are:
1. Summarize lengthy legal texts and documents provided by the user.
2. Extract citations of cases mentioned in the text.
3. When you extract a case or citation, you MUST format it as a markdown link pointing to a search query on Indian Kanoon.
   Format: [Case Name](https://indiankanoon.org/search/?formInput=Case%20Name)
   Example: [Kesavananda Bharati v. State of Kerala](https://indiankanoon.org/search/?formInput=Kesavananda%20Bharati%20v.%20State%20of%20Kerala)

Always be precise, structured, and professional.`;

    if (retrievedChunks.length > 0) {
      const contextStr = retrievedChunks
        .map((c, i) => `--- Passage ${i + 1} [Source: ${c.filename}, Page ${c.page}] ---\n${c.text}`)
        .join("\n\n");

      systemInstruction += `\n\n### ADDITIONAL RAG INSTRUCTIONS:
1. Answer the question using ONLY the retrieved context provided below.
2. For every factual claim in your answer, include an inline citation in the exact format: [Source: <filename>, Page <N>]
3. If the context does not contain sufficient information to answer, respond with exactly: 
   "Based on the provided documents, I cannot find sufficient information to answer this question."
   Do NOT speculate or use outside knowledge.

### CONTEXT (retrieved from user uploaded documents):
${contextStr}`;
    } else {
      systemInstruction += `\n\nNote: The user has not uploaded any documents yet. If they ask about documents or specific context, politely remind them to upload their PDF files first. Otherwise, answer their general legal questions accurately.`;
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-3.5-flash",
      systemInstruction,
    });

    const chatResult = await model.generateContent({
      contents: history,
    });

    let responseMessage = chatResult.response.text() || "";
    responseMessage = postprocessAnswer(responseMessage);

    // Save message history to DB
    user.chats.push({ content: message, role: "user" });
    user.chats.push({ content: responseMessage, role: "assistant", sources });
    await user.save();

    return res.status(200).json({ chats: user.chats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    return res.status(200).json({ message: "OK", chats: user.chats });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};

export const deleteChats = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //user token check
    const user = await User.findById(res.locals.jwtData.id);
    if (!user) {
      return res.status(401).send("User not registered OR Token malfunctioned");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions didn't match");
    }
    //@ts-ignore
    user.chats = [];
    await user.save();
    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: "ERROR", cause: error.message });
  }
};