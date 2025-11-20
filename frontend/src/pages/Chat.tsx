import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Box, Avatar, Typography, Button, IconButton } from "@mui/material";
import { red } from "@mui/material/colors";
import { useAuth } from "../context/AuthContext";
import ChatItem from "../components/chat/ChatItem";
import { IoMdSend } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
  deleteUserChats,
  getUserChats,
  sendChatRequest,
} from "../helpers/api-communicator";
import toast from "react-hot-toast";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = useAuth();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  // Handle sending a new message
  const handleSubmit = async () => {
    const content = inputRef.current?.value as string;
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }

    // Add user message immediately to UI
    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);

    // Send to API and get response
    try {
      const chatData = await sendChatRequest(content);
      setChatMessages([...chatData.chats]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message");
    }
  };

  // Handle deleting all chats
  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Deleted Chats Successfully", { id: "deletechats" });
    } catch (error) {
      console.log(error);
      toast.error("Deleting chats failed", { id: "deletechats" });
    }
  };

  // Load chats on mount
  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading("Loading Chats", { id: "loadchats" });
      getUserChats()
        .then((data) => {
          setChatMessages([...data.chats]);
          toast.success("Successfully loaded chats", { id: "loadchats" });
        })
        .catch((err) => {
          console.log(err);
          toast.error("Loading Failed", { id: "loadchats" });
        });
    }
  }, [auth]);

  // Redirect if not logged in
  useEffect(() => {
    if (!auth?.user) {
      navigate("/login");
    }
  }, [auth, navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        width: "100%",
        height: "100%",
        mt: 3,
        gap: 3,
      }}
    >
      {/* Sidebar / User Info (Hidden on small screens) */}
      <Box
        sx={{
          display: { md: "flex", xs: "none", sm: "none" },
          flex: 0.2,
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "60vh",
            bgcolor: "var(--glass-bg)",
            backdropFilter: "blur(10px)",
            border: "1px solid var(--glass-border)",
            borderRadius: 5,
            flexDirection: "column",
            mx: 3,
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
          }}
        >
          <Avatar
            sx={{
              mx: "auto",
              my: 2,
              bgcolor: "transparent",
              color: "black",
              fontWeight: 700,
              width: 80,
              height: 80,
            }}
          >
            <img src="legal_avatar.png" alt="avatar" width="100%" />
          </Avatar>
          <Typography sx={{ mx: "auto", fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", color: "var(--accent-gold)" }}>
            Legal AI Assistant
          </Typography>
          <Typography sx={{ mx: "auto", fontFamily: "'Outfit', sans-serif", my: 4, p: 3, textAlign: "center", fontSize: "0.9rem" }}>
            I can help you summarize legal documents, extract citations, and provide links to Indian Kanoon.
          </Typography>
          <Button
            onClick={handleDeleteChats}
            sx={{
              width: "200px",
              my: "auto",
              color: "black",
              fontWeight: "700",
              borderRadius: 3,
              mx: "auto",
              bgcolor: "var(--accent-gold)",
              ":hover": {
                bgcolor: "#e6c200",
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
          display: "flex",
          flex: { md: 0.8, xs: 1, sm: 1 },
          flexDirection: "column",
          px: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: "40px",
            color: "var(--accent-gold)",
            mb: 2,
            mx: "auto",
            fontWeight: "700",
            fontFamily: "'Playfair Display', serif",
            textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          Legal AI Assistant
        </Typography>

        {/* Chat Messages Container */}
        <Box
          sx={{
            width: "100%",
            height: "60vh",
            borderRadius: 3,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            overflow: "scroll",
            overflowX: "hidden",
            overflowY: "auto",
            scrollBehavior: "smooth",
          }}
        >
          {chatMessages.map((chat, index) => (
            <ChatItem content={chat.content} role={chat.role} key={index} />
          ))}
        </Box>

        {/* Input Area */}
        <div
          style={{
            width: "100%",
            borderRadius: 8,
            backgroundColor: "var(--glass-bg)",
            backdropFilter: "blur(10px)",
            border: "1px solid var(--glass-border)",
            display: "flex",
            margin: "auto",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            style={{
              width: "100%",
              backgroundColor: "transparent",
              padding: "30px",
              border: "none",
              outline: "none",
              color: "white",
              fontSize: "20px",
            }}
          />
          <IconButton onClick={handleSubmit} sx={{ color: "white", mx: 1 }}>
            <IoMdSend />
          </IconButton>
        </div>
      </Box>
    </Box>
  );
};

export default Chat;