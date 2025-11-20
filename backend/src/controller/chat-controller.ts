import { NextFunction, Request, Response } from "express";
import User from "../models/Users.js";
import Groq from "groq-sdk";

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

    // grab chats of user
    const chats = user.chats.map(({ role, content }) => ({
      role: role === "user" ? "user" : "assistant",
      content,
    }));
    chats.push({ content: message, role: "user" });
    user.chats.push({ content: message, role: "user" });

    // Initialize Groq
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    // Add system prompt for Legal AI context
    const systemMessage = {
      role: "system",
      content: `You are a specialized Legal AI Assistant for the Indian Legal Domain. 
      Your primary tasks are:
      1. Summarize lengthy legal texts and documents provided by the user.
      2. Extract citations of cases mentioned in the text.
      3. When you extract a citation, you MUST format it as a markdown link pointing to a search query on Indian Kanoon.
      
      Format for links: [Case Name](https://indiankanoon.org/search/?formInput=Case%20Name)
      Example: [Kesavananda Bharati v. State of Kerala](https://indiankanoon.org/search/?formInput=Kesavananda%20Bharati%20v.%20State%20of%20Kerala)
      
      Always be precise and professional. If no legal text is provided, ask the user to provide one.`
    };

    // get latest response
    const chatCompletion = await groq.chat.completions.create({
      messages: [systemMessage, ...chats] as any,
      model: "llama-3.3-70b-versatile",
    });

    const responseMessage = chatCompletion.choices[0]?.message?.content || "";

    user.chats.push({ content: responseMessage, role: "assistant" });
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