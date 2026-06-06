import { Request, Response, NextFunction } from "express";
import Document from "../models/Document.js";
import { parsePdfByPages, chunkPages, getEmbeddingsBatch } from "../utils/rag-helper.js";

// Upload legal PDF document and perform RAG ingestion
export const uploadDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No PDF file uploaded" });
    }

    const userId = res.locals.jwtData.id;
    const filename = req.file.originalname;

    // Check if user has already uploaded a document with the same filename
    const existingDoc = await Document.findOne({ userId, filename });
    if (existingDoc) {
      return res.status(400).json({ message: "A document with this name already exists" });
    }

    // 1. Extract text page-by-page from PDF
    const pages = await parsePdfByPages(req.file.buffer);
    if (pages.length === 0) {
      return res.status(400).json({ message: "The PDF document contains no readable text" });
    }

    // 2. Chunk text pages
    const chunks = chunkPages(pages);
    if (chunks.length === 0) {
      return res.status(400).json({ message: "No text chunks could be extracted from the document" });
    }

    // 3. Generate embeddings for each chunk
    const chunkTexts = chunks.map(c => c.text);
    const embeddings = await getEmbeddingsBatch(chunkTexts);

    // 4. Map embeddings back to chunks
    const finalChunks = chunks.map((chunk, index) => ({
      text: chunk.text,
      page: chunk.page,
      embedding: embeddings[index]
    }));

    // 5. Save document and its chunks in MongoDB
    const doc = new Document({
      userId,
      filename,
      chunks: finalChunks
    });

    await doc.save();

    return res.status(201).json({
      message: "Document uploaded and indexed successfully",
      document: {
        id: doc._id,
        filename: doc.filename,
        chunksCount: doc.chunks.length,
        createdAt: doc.createdAt
      }
    });
  } catch (error: any) {
    console.error("Error during document upload:", error);
    return res.status(500).json({ message: "Failed to upload and index document", error: error.message });
  }
};

// Get all uploaded documents for the current user
export const getUserDocuments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.jwtData.id;
    const documents = await Document.find({ userId }).select("filename createdAt");
    return res.status(200).json({ message: "OK", documents });
  } catch (error: any) {
    console.error("Error fetching user documents:", error);
    return res.status(500).json({ message: "Failed to fetch documents", error: error.message });
  }
};

// Delete an uploaded document
export const deleteDocument = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.jwtData.id;
    const documentId = req.params.id;

    const document = await Document.findOneAndDelete({ _id: documentId, userId });
    if (!document) {
      return res.status(404).json({ message: "Document not found or access denied" });
    }

    return res.status(200).json({ message: "Document deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting document:", error);
    return res.status(500).json({ message: "Failed to delete document", error: error.message });
  }
};
