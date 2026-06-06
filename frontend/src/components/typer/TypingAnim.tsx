import { TypeAnimation } from "react-type-animation";

const TypingAnim = () => {
  return (
    <TypeAnimation
      sequence={[
        "Legal-AI RAG Assistant",
        1500,
        "Chat with your legal PDFs 📄",
        1500,
        "AI-Powered Legal Research ⚖️",
        1500,
        "Get citations & cited sources 🔍",
        1500,
      ]}
      speed={50}
      className="typing-theme"
      style={{
        color: "white",
        display: "inline-block",
        textShadow: "1px 1px 20px #000",
      }}
      repeat={Infinity}
    />
  );
};

export default TypingAnim;