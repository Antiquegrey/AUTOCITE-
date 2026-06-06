import { Router } from "express";
import multer from "multer";
import { verifyToken } from "../utils/token-manager.js";
import {
  deleteDocument,
  getUserDocuments,
  uploadDocument,
} from "../controller/document-controller.js";

const documentRoutes = Router();

// Multer configuration for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // Limit size to 10MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

documentRoutes.post(
  "/upload",
  verifyToken,
  upload.single("file"),
  uploadDocument
);
documentRoutes.get("/all", verifyToken, getUserDocuments);
documentRoutes.delete("/delete/:id", verifyToken, deleteDocument);

export default documentRoutes;
