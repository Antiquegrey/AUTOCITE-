import { Box, Avatar } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatItem = ({
  content,
  role,
}: {
  content: string;
  role: "user" | "assistant";
}) => {
  const auth = useAuth();
  return role == "assistant" ? (
    <Box
      sx={{
        display: "flex",
        p: 2,
        bgcolor: "var(--glass-bg)",
        border: "1px solid var(--glass-border)",
        gap: 2,
        borderRadius: 2,
        my: 1,
      }}
    >
      <Avatar sx={{ ml: "0", bgcolor: "transparent" }}>
        <img src="legal_avatar.png" alt="openai" width={"30px"} />
      </Avatar>
      <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
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
                style={{ color: "var(--accent-gold)", textDecoration: "underline" }}
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </Box>
    </Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        p: 2,
        bgcolor: "var(--secondary-navy)",
        gap: 2,
        borderRadius: 2,
      }}
    >
      <Avatar sx={{ ml: "0", bgcolor: "black", color: "white" }}>
        {auth?.user?.name ? auth.user.name[0] : "U"}
        {auth?.user?.name && auth.user.name.split(" ")[1] ? auth.user.name.split(" ")[1][0] : ""}
      </Avatar>
      <Box>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </Box>
    </Box>
  );
};

export default ChatItem;