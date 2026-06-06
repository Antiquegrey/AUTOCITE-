import { PDFParse } from "pdf-parse";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface PdfPage {
  text: string;
  pageNumber: number;
}

interface TextChunk {
  text: string;
  page: number;
}

// Parse PDF buffer page-by-page using modern PDFParse class
export async function parsePdfByPages(buffer: Buffer): Promise<PdfPage[]> {
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  await parser.destroy();
  
  return result.pages.map((p: any) => ({
    text: p.text || "",
    pageNumber: p.num
  }));
}

// Chunk text by page
export function chunkPages(pages: PdfPage[], chunkSize = 800, chunkOverlap = 50): TextChunk[] {
  const chunks: TextChunk[] = [];
  
  for (const page of pages) {
    const text = page.text;
    const pageNum = page.pageNumber;
    
    if (text.length <= chunkSize) {
      if (text.trim().length > 0) {
        chunks.push({ text: text.trim(), page: pageNum });
      }
      continue;
    }
    
    let start = 0;
    while (start < text.length) {
      let end = start + chunkSize;
      if (end >= text.length) {
        end = text.length;
      } else {
        // Find last space to avoid cutting a word in half
        const lastSpace = text.lastIndexOf(" ", end);
        if (lastSpace > start + chunkSize / 2) {
          end = lastSpace;
        }
      }
      
      const chunkText = text.substring(start, end).trim();
      if (chunkText.length > 0) {
        chunks.push({ text: chunkText, page: pageNum });
      }
      
      start = end - chunkOverlap;
      if (start >= text.length || end === text.length) {
        break;
      }
    }
  }
  
  return chunks;
}

// Generate embedding for a single query using Gemini text-embedding-004
export async function getEmbedding(text: string): Promise<number[]> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

// Generate embeddings in batch (handling chunk sizes of 100)
export async function getEmbeddingsBatch(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
  const model = genAI.getGenerativeModel({ model: "gemini-embedding-2" });
  
  const batchSize = 100;
  const embeddings: number[][] = [];
  
  for (let i = 0; i < texts.length; i += batchSize) {
    const chunk = texts.slice(i, i + batchSize);
    const requests = chunk.map(text => ({
      content: { role: "user", parts: [{ text }] }
    }));
    const result = await model.batchEmbedContents({ requests });
    const chunkEmbeddings = result.embeddings.map(e => e.values);
    embeddings.push(...chunkEmbeddings);
  }
  return embeddings;
}

// Compute cosine similarity between two vectors
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
