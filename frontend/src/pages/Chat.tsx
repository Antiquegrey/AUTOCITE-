import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Typography, Button, IconButton, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/chat/ChatItem";
import { IoMdSend } from "react-icons/io";
import { FiPaperclip, FiTrash2, FiFolder, FiMenu, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  deleteUserChats,
  getUserChats,
  sendChatRequest,
  uploadDocument,
  getUserDocuments,
  deleteDocument,
} from "../helpers/api-communicator";
import toast from "react-hot-toast";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: Array<{ file: string; page: number; snippet: string }>;
};

type DocumentItem = {
  _id: string;
  filename: string;
  createdAt: string;
};

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const auth = useAuth();

  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isGenerating]);

  // Load chat history & uploaded documents
  const loadInitialData = async () => {
    if (auth?.isLoggedIn && auth.user) {
      try {
        const chatData = await getUserChats();
        setChatMessages([...chatData.chats]);
        
        const docData = await getUserDocuments();
        setDocuments(docData.documents || []);
      } catch (err) {
        console.error("Failed to load initial data:", err);
      }
    }
  };

  useLayoutEffect(() => {
    loadInitialData();
  }, [auth]);

  // Redirect if not logged in
  useEffect(() => {
    if (!auth?.user) {
      navigate("/login");
    }
  }, [auth, navigate]);

  // Handle sending message
  const handleSubmit = async (customMessage?: string) => {
    const messageText = customMessage || inputRef.current?.value || "";
    if (!messageText.trim()) return;

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    // Add user message to UI immediately
    const userMsg: Message = { role: "user", content: messageText };
    setChatMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    try {
      const data = await sendChatRequest(messageText);
      setChatMessages([...data.chats]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to get response");
    } finally {
      setIsGenerating(false);
    }
  };

  // Pre-populate prompt from suggestion chips
  const handleSuggestionClick = (prompt: string) => {
    handleSubmit(prompt);
  };

  // Handle file uploads
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const loadingToastId = toast.loading(`Uploading and indexing ${file.name}...`);

    try {
      await uploadDocument(file);
      toast.success("Document indexed successfully", { id: loadingToastId });
      // Reload documents list
      const docData = await getUserDocuments();
      setDocuments(docData.documents || []);
    } catch (err: any) {
      console.error("Upload failed:", err);
      toast.error(err.response?.data?.message || "Failed to upload document", { id: loadingToastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handle document deletion
  const handleDeleteDocument = async (id: string, filename: string) => {
    const loadingToastId = toast.loading(`Deleting ${filename}...`);
    try {
      await deleteDocument(id);
      toast.success("Document deleted", { id: loadingToastId });
      setDocuments((prev) => prev.filter((doc) => doc._id !== id));
    } catch (err) {
      console.error("Deletion failed:", err);
      toast.error("Failed to delete document", { id: loadingToastId });
    }
  };

  // Handle clearing chats
  const handleClearConversation = async () => {
    try {
      toast.loading("Clearing chats...", { id: "clearchats" });
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Conversation cleared", { id: "clearchats" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to clear chats", { id: "clearchats" });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "calc(100vh - 64px)", // subtract header height
        bgcolor: "#07070a", // Solid Monotone deep black
        color: "white",
        overflow: "hidden",
      }}
    >
      {/* Sleek Monotone Sidebar */}
      <Box
        sx={{
          width: isSidebarOpen ? { md: "280px", xs: "100%" } : "0px",
          height: "100%",
          bgcolor: "#0b0c10", // Strictly dark grey monotone
          borderRight: isSidebarOpen ? "1px solid rgba(255, 255, 255, 0.04)" : "none",
          display: isSidebarOpen ? "flex" : "none",
          flexDirection: "column",
          transition: "width 0.2s ease",
          zIndex: 10,
          position: { xs: "absolute", md: "relative" },
        }}
      >
        {/* Sidebar Header */}
        <Box
          sx={{
            p: 2.5,
            borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: "600", fontSize: "0.9rem", color: "#e5e7eb", fontFamily: "'Outfit', sans-serif" }}>
            Document Library
          </Typography>
          <IconButton onClick={() => setIsSidebarOpen(false)} sx={{ color: "#9ca3af", display: { md: "none" } }}>
            <FiX />
          </IconButton>
        </Box>

        {/* List of Documents */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
          {documents.length === 0 ? (
            <Box sx={{ py: 3, px: 2, textAlign: "center", border: "1px dashed rgba(255, 255, 255, 0.05)", borderRadius: 2 }}>
              <Typography sx={{ fontSize: "0.78rem", color: "#6b7280", fontFamily: "'Outfit', sans-serif" }}>
                No documents uploaded. Upload a PDF in the button below to start.
              </Typography>
            </Box>
          ) : (
            documents.map((doc) => (
              <Box
                key={doc._id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.2,
                  px: 1.5,
                  bgcolor: "rgba(255, 255, 255, 0.01)",
                  border: "1px solid rgba(255, 255, 255, 0.03)",
                  borderRadius: "8px",
                  transition: "all 0.15s ease",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.03)",
                    borderColor: "rgba(255, 255, 255, 0.08)",
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, overflow: "hidden", mr: 1 }}>
                  <FiFolder style={{ color: "#9ca3af", flexShrink: 0 }} />
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      fontFamily: "'Outfit', sans-serif",
                      color: "#d1d5db",
                    }}
                  >
                    {doc.filename}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => handleDeleteDocument(doc._id, doc.filename)}
                  sx={{
                    color: "#ef4444",
                    p: 0.5,
                    "&:hover": { bgcolor: "rgba(239, 68, 68, 0.08)" },
                  }}
                >
                  <FiTrash2 size={13} />
                </IconButton>
              </Box>
            ))
          )}
        </Box>

        {/* Sidebar Footer Buttons */}
        <Box sx={{ p: 2, borderTop: "1px solid rgba(255, 255, 255, 0.04)", display: "flex", flexDirection: "column", gap: 1.2 }}>
          {/* Upload Button */}
          <input
            type="file"
            accept=".pdf"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <Button
            variant="contained"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            startIcon={isUploading ? <CircularProgress size={14} color="inherit" /> : <FiPaperclip />}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.03)", // Monotone Dark style
              border: "1px solid rgba(255, 255, 255, 0.08)",
              color: "white",
              fontWeight: "600",
              borderRadius: "10px",
              py: 1,
              textTransform: "none",
              fontSize: "0.85rem",
              fontFamily: "'Outfit', sans-serif",
              boxShadow: "none",
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.06)", boxShadow: "none" },
            }}
          >
            {isUploading ? "Uploading..." : "Upload Legal PDF"}
          </Button>

          {/* Clear Conversations Button */}
          <Button
            variant="outlined"
            onClick={handleClearConversation}
            sx={{
              borderColor: "rgba(255, 255, 255, 0.05)",
              color: "#9ca3af",
              fontWeight: "500",
              borderRadius: "10px",
              py: 1,
              textTransform: "none",
              fontSize: "0.82rem",
              fontFamily: "'Outfit', sans-serif",
              "&:hover": {
                borderColor: "rgba(255, 255, 255, 0.15)",
                bgcolor: "rgba(255, 255, 255, 0.02)",
                color: "white",
              },
            }}
          >
            Clear Conversation
          </Button>
        </Box>
      </Box>

      {/* Main Chat Area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
          bgcolor: "#07070a", // solid monotone background
        }}
      >
        {/* Toggle Sidebar Button */}
        {!isSidebarOpen && (
          <IconButton
            onClick={() => setIsSidebarOpen(true)}
            sx={{
              position: "absolute",
              top: 15,
              left: 15,
              color: "#9ca3af",
              bgcolor: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.04)",
              "&:hover": { bgcolor: "rgba(255, 255, 255, 0.05)" },
              zIndex: 5,
            }}
          >
            <FiMenu />
          </IconButton>
        )}

        {/* Centered Chat Header */}
        <Box sx={{ pt: 3, pb: 1, textAlign: "center", borderBottom: "1px solid rgba(255, 255, 255, 0.02)" }}>
          <Typography
            sx={{
              fontSize: "1.3rem",
              fontWeight: "700",
              fontFamily: "'Outfit', sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              color: "#e5e7eb",
            }}
          >
            ⚖️ Legal RAG Assistant
          </Typography>
          <Typography
            sx={{
              fontSize: "0.72rem",
              color: "#6b7280",
              letterSpacing: "0.5px",
              mt: 0.2,
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            AI-powered legal research · cited sources
          </Typography>
        </Box>

        {/* Messages Body */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: { md: 4, xs: 2 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          {chatMessages.length === 0 ? (
            /* Premium Monotone Landing State */
            <Box
              sx={{
                margin: "auto",
                maxWidth: "600px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                py: 4,
              }}
            >
              {/* Scale Icon (Slight purple glow feature) */}
              <Typography
                sx={{
                  fontSize: "3.2rem",
                  mb: 3,
                  filter: "drop-shadow(0 0 15px rgba(162, 155, 254, 0.35))",
                }}
              >
                ⚖️
              </Typography>

              <Typography
                sx={{
                  fontSize: "1.65rem",
                  fontWeight: "700",
                  fontFamily: "'Outfit', sans-serif",
                  mb: 1,
                  color: "#f3f4f6",
                }}
              >
                How can I help you today?
              </Typography>

              <Typography
                sx={{
                  fontSize: "0.85rem",
                  color: "#6b7280",
                  mb: 4,
                  lineHeight: "1.5",
                  fontFamily: "'Outfit', sans-serif",
                  maxWidth: "400px",
                }}
              >
                Ask any question about your uploaded legal documents.
              </Typography>

              {/* Suggestions Chips (Monotone grey) */}
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: 1.2,
                }}
              >
                {[
                  "Key contract terms",
                  "Liability clauses",
                  "Penalties & remedies",
                ].map((suggest, index) => (
                  <Button
                    key={index}
                    onClick={() => handleSuggestionClick(suggest)}
                    sx={{
                      bgcolor: "#111218",
                      border: "1px solid rgba(255, 255, 255, 0.05)",
                      borderRadius: "20px",
                      px: 2.2,
                      py: 0.8,
                      color: "#9ca3af",
                      fontSize: "0.78rem",
                      textTransform: "none",
                      fontFamily: "'Outfit', sans-serif",
                      transition: "all 0.15s ease",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.03)",
                        borderColor: "rgba(255, 255, 255, 0.15)",
                        color: "white",
                        transform: "translateY(-1px)",
                      },
                    }}
                  >
                    {suggest}
                  </Button>
                ))}
              </Box>
            </Box>
          ) : (
            /* Render Chat History */
            chatMessages.map((chat, index) => (
              <ChatItem
                content={chat.content}
                role={chat.role}
                sources={chat.sources}
                key={index}
              />
            ))
          )}

          {/* Typing Loading Indicator */}
          {isGenerating && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%",
                my: 2,
              }}
            >
              <Typography
                sx={{
                  color: "#00b894",
                  fontWeight: "600",
                  fontSize: "0.7rem",
                  letterSpacing: "1px",
                  mb: 0.5,
                  pl: 0.5,
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                ASSISTANT
              </Typography>
              <Box
                sx={{
                  bgcolor: "#111218",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  borderRadius: "0px 16px 16px 16px",
                  p: 2,
                  px: 2.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <CircularProgress size={14} sx={{ color: "#a29bfe" }} />
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    color: "#6b7280",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  Searching legal documents...
                </Typography>
              </Box>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Input Bar Section */}
        <Box
          sx={{
            p: 3,
            pb: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Pill-shaped Border Container (Monotone charcoal) */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: "800px",
              bgcolor: "#111218", // Deep charcoal input
              border: "1px solid rgba(255, 255, 255, 0.06)",
              borderRadius: "30px",
              p: 0.5,
              px: 2,
              transition: "border-color 0.2s ease-in-out",
              "&:focus-within": {
                borderColor: "rgba(162, 155, 254, 0.35)", // Subtle purple focus glow
              },
            }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask a legal question..."
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              style={{
                flex: 1,
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
                color: "white",
                fontSize: "0.9rem",
                padding: "10px",
                fontFamily: "'Outfit', sans-serif",
              }}
            />
            {/* The single colorful feature CTA: Purple Circular Send Button */}
            <IconButton
              onClick={() => handleSubmit()}
              sx={{
                bgcolor: "#6c5ce7", // Accent purple
                color: "white",
                p: 0.8,
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                transition: "all 0.15s",
                "&:hover": {
                  bgcolor: "#5b4bc4",
                  transform: "scale(1.04)",
                },
              }}
            >
              <IoMdSend size={16} />
            </IconButton>
          </Box>

          {/* Legal Advice Disclaimer */}
          <Typography
            sx={{
              fontSize: "0.68rem",
              color: "#4b5563",
              mt: 1,
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            Responses are AI-generated and may not constitute legal advice.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;