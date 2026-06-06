import { Box, Typography } from "@mui/material";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Source {
  file: string;
  page: number;
  snippet: string;
}

const ChatItem = ({
  content,
  role,
  sources,
}: {
  content: string;
  role: "user" | "assistant";
  sources?: Source[];
}) => {
  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return role === "assistant" ? (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
        my: 2.5,
      }}
    >
      {/* Signature feature: Emerald Green Assistant Header */}
      <Typography
        sx={{
          color: "#00b894", // Green feature highlight
          fontWeight: "600",
          fontSize: "0.72rem",
          letterSpacing: "1px",
          mb: 0.8,
          pl: 0.5,
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        ASSISTANT
      </Typography>

      {/* Monotone Dark Assistant Bubble */}
      <Box
        sx={{
          bgcolor: "#111218", // Deep near-black background
          border: "1px solid rgba(255, 255, 255, 0.05)", // Ultra-subtle border
          borderRadius: "0px 16px 16px 16px",
          p: 2.5,
          width: "100%",
          maxWidth: { md: "80%", xs: "95%" },
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          color: "#d1d5db", // Monotone off-white text
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || "");
              return !inline && match ? (
                <SyntaxHighlighter
                  style={coldarkDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            a: ({ node, ...props }) => (
              <a
                {...props}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#a29bfe", // Soft purple link
                  textDecoration: "underline",
                  fontWeight: "500",
                }}
              />
            ),
            p: ({ children }) => (
              <Typography
                sx={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: "0.92rem",
                  lineHeight: "1.65",
                  mb: 1.5,
                  "&:last-child": { mb: 0 },
                }}
              >
                {children}
              </Typography>
            ),
          }}
        >
          {content}
        </ReactMarkdown>

        {/* Cited Sources section */}
        {sources && sources.length > 0 && (
          <Box
            sx={{
              mt: 2.5,
              pt: 2,
              borderTop: "1px solid rgba(255, 255, 255, 0.04)",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.7rem",
                color: "#6b7280", // Muted grey
                fontWeight: "600",
                letterSpacing: "0.5px",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              CITED SOURCES
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {sources.map((src, i) => (
                <Box
                  key={i}
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    bgcolor: "#161720", // Monotone dark tag
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: "20px",
                    fontSize: "0.7rem",
                    color: "#9ca3af", // Slate grey text
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                      borderColor: "rgba(255, 255, 255, 0.15)",
                      color: "white",
                    },
                  }}
                  title={src.snippet}
                >
                  📄 {src.file} (Page {src.page})
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        width: "100%",
        my: 1.5,
      }}
    >
      {/* Monotone Dark Slate User Bubble */}
      <Box
        sx={{
          bgcolor: "#24252e", // Monotone dark slate
          border: "1px solid rgba(255, 255, 255, 0.04)",
          borderRadius: "16px 16px 0px 16px",
          p: 1.8,
          px: 2.2,
          maxWidth: { md: "65%", xs: "90%" },
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
          color: "#e5e7eb", // Off-white user text
        }}
      >
        <Typography
          sx={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "0.92rem",
            lineHeight: "1.5",
          }}
        >
          {content}
        </Typography>
      </Box>

      {/* Muted Timestamp below User Bubble */}
      <Typography
        sx={{
          fontSize: "0.68rem",
          color: "#4b5563", // Very muted grey
          mt: 0.5,
          mr: 1,
          fontFamily: "'Outfit', sans-serif",
        }}
      >
        {formatTime()}
      </Typography>
    </Box>
  );
};

export default ChatItem;