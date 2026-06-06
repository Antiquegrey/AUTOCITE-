import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  TextField,
  Tabs,
  Tab,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TypingAnim from "../components/typer/TypingAnim";
import {
  FiCpu,
  FiBookmark,
  FiSearch,
  FiArrowRight,
  FiActivity,
  FiFileText,
  FiLayers,
  FiHelpCircle,
  FiChevronDown,
  FiDatabase,
  FiExternalLink,
  FiShield,
  FiCheck,
} from "react-icons/fi";

const SAMPLE_LEGAL_TEXT = `Jacob Mathew v. State of Punjab, (2005) 6 SCC 1.
The case came before the Supreme Court of India regarding medical negligence. The deceased was admitted to a hospital and was suffering from breathing difficulties. When the condition worsened, no oxygen cylinder was immediately available, and the one brought was empty. The doctor was prosecuted under Section 304A of the Indian Penal Code (IPC) for causing death by negligence.
The Supreme Court, led by Chief Justice R.C. Lahoti, ruled that a professional may be held liable in negligence on one of two findings: either he was not possessed of the requisite skill which he professed to have possessed, or he did not exercise, with reasonable competence in the given case, the skill which he did possess.
For negligence to be criminal under Sec 304A IPC, it must be gross. The Court directed that doctors should not be arrested or prosecuted in a routine manner without obtaining a prior independent medical opinion from an unbiased expert doctor.`;

const Home = () => {
  const theme = useTheme();
  const isBelowMd = useMediaQuery(theme.breakpoints.down("md"));
  const isBelowSm = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const auth = useAuth();

  // Sandbox States
  const [inputText, setInputText] = useState(SAMPLE_LEGAL_TEXT);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<string | false>(false);

  const steps = [
    "Uploading raw legal text to sandbox...",
    "Parsing sections (Facts, Arguments, Verdict)...",
    "Extracting citation entities & acts...",
    "Performing RAG search & semantic Kanoon link lookup...",
    "Compiling summary & metrics...",
  ];

  const handleCTA = () => {
    if (auth?.isLoggedIn) {
      navigate("/chat");
    } else {
      navigate("/login");
    }
  };

  const handleScrollToSandbox = () => {
    document.getElementById("sandbox-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const runMockAnalysis = () => {
    if (!inputText.trim()) return;
    setIsAnalyzing(true);
    setShowResults(false);
    setAnalysisStep(0);
  };

  useEffect(() => {
    let interval: any;
    if (isAnalyzing) {
      interval = setInterval(() => {
        setAnalysisStep((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setIsAnalyzing(false);
            setShowResults(true);
            setActiveTab(0);
            return 0;
          }
        });
      }, 900);
    }
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleFaqChange = (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedFaq(isExpanded ? panel : false);
  };

  const features = [
    {
      icon: <FiCpu size={26} style={{ color: "#a29bfe" }} />,
      title: "Context-Aware RAG Engine",
      desc: "Upload contracts, briefs, or court orders. Our AI indexes the exact context page-by-page, letting you chat with complex multi-page files instantly.",
    },
    {
      icon: <FiSearch size={26} style={{ color: "#00b894" }} />,
      title: "Automatic Legal Citations",
      desc: "Instantly extracts court case citations and statutes, mapping them to live verify URLs like Indian Kanoon and LII of India automatically.",
    },
    {
      icon: <FiBookmark size={26} style={{ color: "#00fffc" }} />,
      title: "Source Transparency",
      desc: "Every AI claim is backed by inline annotations (e.g., page numbers, snippets) directly from your uploaded document. Zero hallucinations.",
    },
    {
      icon: <FiShield size={26} style={{ color: "#ffd700" }} />,
      title: "Bank-Grade Encryption",
      desc: "Your uploaded legal documents and prompts are stored securely and never used for public model training. Total workspace confidentiality.",
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        position: "relative",
        bgcolor: "#050b14",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* Decorative Blur Ambient Orbs */}
      <Box
        className="glow-orb"
        sx={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: { xs: "250px", md: "450px" },
          height: { xs: "250px", md: "450px" },
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(108, 92, 231, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
          filter: "blur(60px)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
      <Box
        className="glow-orb"
        sx={{
          position: "absolute",
          top: "40%",
          right: "5%",
          width: { xs: "300px", md: "500px" },
          height: { xs: "300px", md: "500px" },
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0, 255, 252, 0.1) 0%, rgba(0, 0, 0, 0) 70%)",
          filter: "blur(80px)",
          zIndex: 1,
          pointerEvents: "none",
          animationDelay: "4s",
        }}
      />

      {/* Hero Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: "1000px",
          px: 3,
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 10 },
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Badge Indicator */}
        <Box
          className="pulse-glow"
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 0.6,
            borderRadius: "20px",
            bgcolor: "rgba(108, 92, 231, 0.12)",
            border: "1px solid rgba(108, 92, 231, 0.25)",
            mb: 4,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.78rem",
              fontWeight: "600",
              color: "#a29bfe",
              letterSpacing: "0.8px",
              textTransform: "uppercase",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            ✨ Next-Gen Legal Analysis
          </Typography>
        </Box>

        {/* Dynamic Typed Headings */}
        <Box sx={{ minHeight: "80px", display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
          <TypingAnim />
        </Box>

        {/* Dynamic Static Subheading */}
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3.5rem" },
            fontWeight: "800",
            fontFamily: "'Outfit', sans-serif",
            lineHeight: 1.2,
            mb: 3,
            background: "linear-gradient(135deg, #ffffff 40%, #c3c7db 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            maxWidth: "850px",
          }}
        >
          Intelligent Legal Search & Document Synthesis
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: "1rem", md: "1.2rem" },
            color: "var(--text-muted)",
            lineHeight: "1.7",
            maxWidth: "680px",
            mb: 5,
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          Analyze lengthy court judgments, cross-reference acts, and extract verified legal links automatically. Experience legal research at the speed of thought.
        </Typography>

        {/* Hero CTA buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2.5,
            justifyContent: "center",
            width: "100%",
            maxWidth: "480px",
          }}
        >
          <Button
            variant="contained"
            onClick={handleCTA}
            endIcon={<FiArrowRight />}
            sx={{
              bgcolor: "var(--accent-purple)",
              color: "white",
              fontSize: "0.95rem",
              fontWeight: "600",
              px: 4,
              py: 1.8,
              borderRadius: "30px",
              textTransform: "none",
              fontFamily: "'Outfit', sans-serif",
              boxShadow: "0 4px 20px rgba(108, 92, 231, 0.4)",
              transition: "all 0.25s ease",
              "&:hover": {
                bgcolor: "#5b4bc4",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 25px rgba(108, 92, 231, 0.6)",
              },
            }}
          >
            {auth?.isLoggedIn ? "Go to Dashboard" : "Get Started for Free"}
          </Button>

          <Button
            variant="outlined"
            onClick={handleScrollToSandbox}
            endIcon={<FiActivity />}
            sx={{
              color: "white",
              borderColor: "rgba(255, 255, 255, 0.15)",
              fontSize: "0.95rem",
              fontWeight: "600",
              px: 4,
              py: 1.8,
              borderRadius: "30px",
              textTransform: "none",
              fontFamily: "'Outfit', sans-serif",
              bgcolor: "rgba(255, 255, 255, 0.02)",
              transition: "all 0.25s ease",
              "&:hover": {
                borderColor: "var(--accent-cyan)",
                color: "var(--accent-cyan)",
                bgcolor: "rgba(0, 255, 252, 0.04)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Try Live Sandbox
          </Button>
        </Box>
      </Box>

      {/* Core Features Cards Grid */}
      <Box sx={{ maxWidth: "1200px", px: 4, width: "100%", mt: 2, mb: 10, position: "relative", zIndex: 2 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr 1fr" },
            gap: 3,
          }}
        >
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                bgcolor: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
                borderRadius: "18px",
                p: 3.5,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.12)",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  transform: "translateY(-5px)",
                  borderColor: "rgba(108, 92, 231, 0.35)",
                  boxShadow: "0 12px 40px 0 rgba(108, 92, 231, 0.15)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "3px",
                  background: "linear-gradient(90deg, transparent, rgba(108, 92, 231, 0.5), transparent)",
                  transform: "translateX(-100%)",
                  transition: "transform 0.5s ease",
                },
                "&:hover::before": {
                  transform: "translateX(100%)",
                },
              }}
            >
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "rgba(255, 255, 255, 0.02)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                {feature.icon}
              </Box>
              <Typography
                sx={{
                  fontSize: "1.1rem",
                  fontWeight: "700",
                  mb: 1.5,
                  color: "white",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {feature.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  lineHeight: "1.6",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {feature.desc}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Interactive Sandbox Section */}
      <Box
        id="sandbox-section"
        sx={{
          width: "100%",
          py: 10,
          bgcolor: "var(--secondary-navy)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          zIndex: 2,
          borderTop: "1px solid rgba(255, 255, 255, 0.03)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
        }}
      >
        <Box sx={{ maxWidth: "1100px", width: "100%", px: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              sx={{
                fontSize: "2rem",
                fontWeight: "800",
                fontFamily: "'Outfit', sans-serif",
                color: "white",
                mb: 1.5,
              }}
            >
              AutoCite Interactive Sandbox
            </Typography>
            <Typography
              sx={{
                fontSize: "0.95rem",
                color: "var(--text-muted)",
                maxWidth: "600px",
                margin: "0 auto",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              Experience the citation-mapping extraction flow. Paste legal rulings or use the sample case below to witness the AI analysis in real-time.
            </Typography>
          </Box>

          {/* Sandbox Main Container */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "1.2fr 1fr" },
              gap: 4,
              bgcolor: "var(--glass-bg)",
              border: "1px solid var(--glass-border)",
              borderRadius: "20px",
              p: { xs: 2, md: 4 },
              backdropFilter: "blur(12px)",
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
            }}
          >
            {/* Left Box - Text Editor & Parser */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontWeight: "600", fontSize: "0.95rem", color: "#e6f1ff", display: "flex", alignItems: "center", gap: 1 }}>
                  <FiFileText /> Edit Judgment Segment
                </Typography>
                <Button
                  size="small"
                  onClick={() => setInputText(SAMPLE_LEGAL_TEXT)}
                  sx={{
                    color: "#a29bfe",
                    fontSize: "0.75rem",
                    textTransform: "none",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  Reset to Sample
                </Button>
              </Box>

              <TextField
                multiline
                rows={10}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste legal document text or court judgments here..."
                disabled={isAnalyzing}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "rgba(5, 11, 20, 0.6)",
                    borderRadius: "12px",
                    color: "white",
                    fontFamily: "monospace",
                    fontSize: "0.82rem",
                    lineHeight: 1.5,
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    transition: "all 0.2s ease",
                    "& fieldset": { border: "none" },
                    "&:hover": {
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                    },
                    "&.Mui-focused": {
                      border: "1px solid var(--accent-purple)",
                      boxShadow: "0 0 10px rgba(108, 92, 231, 0.2)",
                    },
                  },
                }}
              />

              <Button
                variant="contained"
                onClick={runMockAnalysis}
                disabled={isAnalyzing || !inputText.trim()}
                sx={{
                  bgcolor: isAnalyzing ? "rgba(255, 255, 255, 0.05)" : "var(--accent-purple)",
                  color: "white",
                  py: 1.8,
                  fontWeight: "600",
                  borderRadius: "12px",
                  fontSize: "0.9rem",
                  textTransform: "none",
                  boxShadow: "none",
                  fontFamily: "'Outfit', sans-serif",
                  "&:hover": {
                    bgcolor: "#5b4bc4",
                  },
                }}
              >
                {isAnalyzing ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <CircularProgress size={16} sx={{ color: "white" }} />
                    <Typography sx={{ fontSize: "0.88rem", fontWeight: "600" }}>Running AutoCite Parser...</Typography>
                  </Box>
                ) : (
                  "Analyze Document Segment"
                )}
              </Button>

              {/* Progress Steps for analysis */}
              {isAnalyzing && (
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "rgba(5, 11, 20, 0.4)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    borderRadius: "10px",
                    mt: 1,
                  }}
                >
                  <Typography sx={{ fontSize: "0.78rem", color: "var(--accent-cyan)", fontWeight: "600", mb: 1.5, letterSpacing: "0.5px" }}>
                    PIPELINE STATUS:
                  </Typography>
                  {steps.map((step, idx) => (
                    <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 1.5, my: 0.8 }}>
                      {analysisStep > idx ? (
                        <FiCheck size={14} style={{ color: "#00b894", flexShrink: 0 }} />
                      ) : analysisStep === idx ? (
                        <CircularProgress size={12} sx={{ color: "#ffd700", flexShrink: 0 }} />
                      ) : (
                        <Box sx={{ width: 14, height: 14, borderRadius: "50%", border: "1px solid rgba(255, 255, 255, 0.2)", flexShrink: 0 }} />
                      )}
                      <Typography
                        sx={{
                          fontSize: "0.78rem",
                          color: analysisStep === idx ? "#ffffff" : analysisStep > idx ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.35)",
                          fontWeight: analysisStep === idx ? "500" : "400",
                          fontFamily: "'Outfit', sans-serif",
                        }}
                      >
                        {step}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            {/* Right Box - Output Tabs panel */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                borderLeft: { lg: "1px solid rgba(255, 255, 255, 0.06)" },
                pl: { lg: 4 },
                pt: { xs: 4, lg: 0 },
                justifyContent: showResults ? "flex-start" : "center",
                minHeight: "400px",
              }}
            >
              {!showResults && !isAnalyzing && (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <Typography sx={{ fontSize: "3rem", mb: 2 }}>🔍</Typography>
                  <Typography sx={{ fontSize: "1.1rem", fontWeight: "600", color: "#e6f1ff", mb: 1, fontFamily: "'Outfit', sans-serif" }}>
                    Output Workspace
                  </Typography>
                  <Typography sx={{ fontSize: "0.82rem", color: "var(--text-muted)", maxWidth: "280px", margin: "0 auto", lineHeight: 1.5, fontFamily: "'Outfit', sans-serif" }}>
                    Press "Analyze Document Segment" to process the legal text and see the extracted citation links.
                  </Typography>
                </Box>
              )}

              {isAnalyzing && !showResults && (
                <Box sx={{ textAlign: "center", py: 8 }}>
                  <CircularProgress size={40} sx={{ color: "var(--accent-purple)", mb: 2 }} />
                  <Typography sx={{ fontSize: "0.95rem", color: "#e6f1ff", fontWeight: "500", fontFamily: "'Outfit', sans-serif" }}>
                    Analyzing structure...
                  </Typography>
                </Box>
              )}

              {showResults && (
                <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  {/* Workspace Tabs Header */}
                  <Tabs
                    value={activeTab}
                    onChange={(_e, val) => setActiveTab(val)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                      mb: 2.5,
                      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                      "& .MuiTabs-indicator": {
                        bgcolor: "var(--accent-purple)",
                      },
                      "& .MuiTab-root": {
                        color: "#8892b0",
                        textTransform: "none",
                        fontSize: "0.82rem",
                        fontWeight: "600",
                        fontFamily: "'Outfit', sans-serif",
                        minWidth: "auto",
                        px: 2,
                        "&.Mui-selected": {
                          color: "white",
                        },
                      },
                    }}
                  >
                    <Tab label="Abstractive Summary" />
                    <Tab label="Citations & Links" />
                    <Tab label="Document Metrics" />
                  </Tabs>

                  {/* Tab Panels */}
                  <Box sx={{ flex: 1 }}>
                    {/* Tab 0 - Summary */}
                    {activeTab === 0 && (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                          <Typography
                            sx={{
                              fontSize: "0.7rem",
                              fontWeight: "700",
                              bgcolor: "#00b894",
                              color: "black",
                              px: 1,
                              py: 0.2,
                              borderRadius: "4px",
                              fontFamily: "'Outfit', sans-serif",
                            }}
                          >
                            CASE VERDICT
                          </Typography>
                          <Typography sx={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "'Outfit', sans-serif" }}>
                            Supreme Court of India
                          </Typography>
                        </Box>

                        <Typography sx={{ fontSize: "0.95rem", fontWeight: "700", color: "#ffd700", fontFamily: "'Outfit', sans-serif" }}>
                          Jacob Mathew v. State of Punjab, (2005) 6 SCC 1
                        </Typography>

                        <Typography sx={{ fontSize: "0.82rem", color: "#e6f1ff", lineHeight: 1.6, fontFamily: "'Outfit', sans-serif" }}>
                          The Supreme Court ruled that doctors cannot be prosecuted for criminal negligence under Section 304A IPC unless the negligence is proved to be <strong>gross</strong>. In addition, the Court issued statutory guidelines directing police officers not to arrest accused doctors routinely without first getting a credible independent medical opinion from an unbiased medical expert.
                        </Typography>

                        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.05)", my: 1 }} />

                        <Box>
                          <Typography sx={{ fontSize: "0.78rem", fontWeight: "600", color: "var(--text-muted)", mb: 0.8, fontFamily: "'Outfit', sans-serif" }}>
                            Key Takeaways
                          </Typography>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
                            {[
                              "Standard of Care required is that of an ordinary competent practitioner.",
                              "Failure of oxygen cylinders was not pinned as direct criminal neglect of the doctor.",
                              "Expert medical opinion must be sought prior to initiating prosecution.",
                            ].map((item, idx) => (
                              <Box key={idx} sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
                                <Typography sx={{ color: "var(--accent-cyan)", fontSize: "0.82rem" }}>•</Typography>
                                <Typography sx={{ fontSize: "0.78rem", color: "#c3c7db", fontFamily: "'Outfit', sans-serif" }}>
                                  {item}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      </Box>
                    )}

                    {/* Tab 1 - Citations */}
                    {activeTab === 1 && (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Typography sx={{ fontSize: "0.82rem", color: "var(--text-muted)", fontFamily: "'Outfit', sans-serif" }}>
                          The parser detected the following citations in the text. Click on any reference to query Indian Kanoon databases:
                        </Typography>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                          {[
                            {
                              citation: "Jacob Mathew v. State of Punjab, (2005) 6 SCC 1",
                              type: "Supreme Court Case Law",
                              confidence: 100,
                              url: "https://indiankanoon.org/doc/1756534/",
                            },
                            {
                              citation: "Section 304A IPC",
                              type: "Statutory Act (Indian Penal Code)",
                              confidence: 95,
                              url: "https://indiankanoon.org/doc/653066/",
                            },
                            {
                              citation: "Dr. Suresh Gupta v. Govt. of NCT of Delhi, (2004) 8 SCC 569",
                              type: "Precedent Case Law (Mentioned)",
                              confidence: 91,
                              url: "https://indiankanoon.org/doc/902996/",
                            },
                          ].map((item, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                p: 1.8,
                                bgcolor: "rgba(5, 11, 20, 0.4)",
                                border: "1px solid rgba(255, 255, 255, 0.05)",
                                borderRadius: "10px",
                                display: "flex",
                                flexDirection: "column",
                                gap: 0.8,
                                transition: "all 0.2s ease",
                                "&:hover": {
                                  borderColor: "rgba(0, 255, 252, 0.2)",
                                },
                              }}
                            >
                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography sx={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "500", fontFamily: "'Outfit', sans-serif" }}>
                                  {item.type}
                                </Typography>
                                <Typography
                                  sx={{
                                    fontSize: "0.68rem",
                                    color: item.confidence > 95 ? "#00b894" : "#ffd700",
                                    fontWeight: "600",
                                    bgcolor: "rgba(0, 0, 0, 0.2)",
                                    px: 1,
                                    py: 0.2,
                                    borderRadius: "4px",
                                    fontFamily: "'Outfit', sans-serif",
                                  }}
                                >
                                  {item.confidence}% match
                                </Typography>
                              </Box>

                              <Typography sx={{ fontSize: "0.82rem", fontWeight: "600", color: "#ffffff", fontFamily: "'Outfit', sans-serif" }}>
                                {item.citation}
                              </Typography>

                              <Button
                                size="small"
                                endIcon={<FiExternalLink size={12} />}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                  color: "var(--accent-cyan)",
                                  textTransform: "none",
                                  fontSize: "0.75rem",
                                  alignSelf: "flex-start",
                                  p: 0,
                                  minWidth: "auto",
                                  fontFamily: "'Outfit', sans-serif",
                                }}
                              >
                                View on Indian Kanoon
                              </Button>
                            </Box>
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* Tab 2 - Metrics */}
                    {activeTab === 2 && (
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                        <Typography sx={{ fontSize: "0.82rem", color: "var(--text-muted)", fontFamily: "'Outfit', sans-serif" }}>
                          Quantitative metadata extracted from the judgment segment:
                        </Typography>

                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                          {[
                            { label: "Word Count", value: "184 words", icon: <FiFileText /> },
                            { label: "Readability Index", value: "39.5 (Difficult)", icon: <FiActivity /> },
                            { label: "Sentence Count", value: "8 sentences", icon: <FiLayers /> },
                            { label: "Citation Density", value: "1.63%", icon: <FiDatabase /> },
                          ].map((metric, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                p: 2,
                                bgcolor: "rgba(5, 11, 20, 0.4)",
                                border: "1px solid rgba(255, 255, 255, 0.05)",
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                              }}
                            >
                              <Box sx={{ color: "var(--accent-cyan)", display: "flex" }}>{metric.icon}</Box>
                              <Box>
                                <Typography sx={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: "500", fontFamily: "'Outfit', sans-serif" }}>
                                  {metric.label}
                                </Typography>
                                <Typography sx={{ fontSize: "0.85rem", fontWeight: "700", color: "#ffffff", fontFamily: "'Outfit', sans-serif" }}>
                                  {metric.value}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>

                        <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.05)" }} />

                        <Box>
                          <Typography sx={{ fontSize: "0.78rem", fontWeight: "600", color: "#e6f1ff", mb: 1.2, fontFamily: "'Outfit', sans-serif" }}>
                            Complexity Assessment
                          </Typography>
                          <Typography sx={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.5, fontFamily: "'Outfit', sans-serif" }}>
                            The document segment is highly complex with complex legal structures and precedents. AutoCite resolved the citation matches in <strong>0.34 seconds</strong>.
                          </Typography>
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Visual Pipeline Section */}
      <Box sx={{ width: "100%", py: 10, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 2 }}>
        <Box sx={{ maxWidth: "1000px", width: "100%", px: 4 }}>
          <Box sx={{ textAlign: "center", mb: 7 }}>
            <Typography
              sx={{
                fontSize: "2rem",
                fontWeight: "800",
                fontFamily: "'Outfit', sans-serif",
                color: "white",
                mb: 1.5,
              }}
            >
              How AutoCite Works
            </Typography>
            <Typography
              sx={{
                fontSize: "0.95rem",
                color: "var(--text-muted)",
                maxWidth: "600px",
                margin: "0 auto",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              From raw court files to a searchable, verified workspace. AutoCite handles the heavy legal indexing in 4 simple steps.
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              justifyContent: "space-between",
              gap: 4,
              position: "relative",
            }}
          >
            {[
              {
                step: "01",
                title: "Upload & Parse",
                desc: "Upload contracts or judicial PDFs. Our engine extracts the text and removes noisy metadata.",
              },
              {
                step: "02",
                title: "Vector Indexing",
                desc: "The parsed legal texts are converted into high-density semantic vector coordinates for the RAG engine.",
              },
              {
                step: "03",
                title: "Abstract Synthesis",
                desc: "LLMs analyze facts, precedent rulings, and decisions, producing a clean, layman-friendly summary.",
              },
              {
                step: "04",
                title: "Citation Mapping",
                desc: "Citations are extracted, checked, and linked to external official court databases in real time.",
              },
            ].map((step, idx) => (
              <Box
                key={idx}
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  p: 3,
                  bgcolor: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "16px",
                  position: "relative",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "2.5rem",
                    fontWeight: "800",
                    fontFamily: "'Outfit', sans-serif",
                    color: "rgba(108, 92, 231, 0.15)",
                    position: "absolute",
                    top: 10,
                    right: 20,
                    lineHeight: 1,
                  }}
                >
                  {step.step}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: "700",
                    color: "white",
                    mb: 1.5,
                    fontFamily: "'Outfit', sans-serif",
                    mt: 1.5,
                  }}
                >
                  {step.title}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "0.82rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.6,
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {step.desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Trust Stats / Metrics Indicators */}
      <Box
        sx={{
          width: "100%",
          py: 8,
          bgcolor: "#080f1b",
          borderTop: "1px solid rgba(255, 255, 255, 0.03)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.03)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <Box
          sx={{
            maxWidth: "1100px",
            width: "100%",
            px: 4,
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" },
            gap: 4,
            textAlign: "center",
          }}
        >
          {[
            { metric: "99.8%", label: "Citation Accuracy" },
            { metric: "2.4s", label: "Average Analysis Time" },
            { metric: "15k+", label: "Verified Kanoon Links" },
          ].map((stat, idx) => (
            <Box key={idx}>
              <Typography
                sx={{
                  fontSize: { xs: "2.2rem", md: "3rem" },
                  fontWeight: "800",
                  fontFamily: "'Outfit', sans-serif",
                  color: "var(--accent-cyan)",
                  mb: 1,
                }}
              >
                {stat.metric}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  fontWeight: "500",
                  fontFamily: "'Outfit', sans-serif",
                  letterSpacing: "0.5px",
                }}
              >
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Accordion FAQ Section */}
      <Box sx={{ width: "100%", py: 10, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 2 }}>
        <Box sx={{ maxWidth: "800px", width: "100%", px: 4 }}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              sx={{
                fontSize: "2rem",
                fontWeight: "800",
                fontFamily: "'Outfit', sans-serif",
                color: "white",
                mb: 1.5,
              }}
            >
              Frequently Asked Questions
            </Typography>
            <Typography
              sx={{
                fontSize: "0.95rem",
                color: "var(--text-muted)",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              Have questions about AutoCite? Here are answers to common legal tech queries.
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              {
                panel: "panel1",
                question: "How does AutoCite verify citations?",
                answer: "AutoCite scans uploaded text using custom regex and Named Entity Recognition (NER) algorithms. It extracts matching citations (e.g., SCC, AIR, IPC, CrPC) and queries trusted external legal databases, compiling correct hyperlinks with an associated matching confidence score.",
              },
              {
                panel: "panel2",
                question: "What legal databases are currently linked?",
                answer: "Currently, our system specializes in Indian legal contexts, generating automated reference links directly mapping to Indian Kanoon and the Legal Information Institute of India. Additional state and high court databases will be integrated in upcoming releases.",
              },
              {
                panel: "panel3",
                question: "Can I upload large PDFs?",
                answer: "Yes. AutoCite is optimized for legal briefs, judgments, and contracts. For large documents, the RAG engine chunks the text page-by-page, allowing you to ask queries targeting specific line ranges and pages without overloading the model's context limits.",
              },
              {
                panel: "panel4",
                question: "Is my uploaded legal data kept confidential?",
                answer: "Absolutely. All uploaded documents are stored in isolated user workspaces. Prompts and documents are handled under strict privacy standards and are never shared or used to train public language models.",
              },
            ].map((faq, idx) => (
              <Accordion
                key={idx}
                expanded={expandedFaq === faq.panel}
                onChange={handleFaqChange(faq.panel)}
                sx={{
                  bgcolor: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "12px !important",
                  boxShadow: "none",
                  color: "white",
                  "&::before": { display: "none" },
                  "&:hover": {
                    borderColor: "rgba(108, 92, 231, 0.25)",
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<FiChevronDown style={{ color: "#8892b0" }} />}
                  sx={{
                    px: 3,
                    py: 0.5,
                    "& .MuiAccordionSummary-content": {
                      margin: "12px 0",
                    },
                  }}
                >
                  <Typography sx={{ fontWeight: "600", fontSize: "0.9rem", fontFamily: "'Outfit', sans-serif" }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                  <Typography sx={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: 1.6, fontFamily: "'Outfit', sans-serif" }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          width: "100%",
          bgcolor: "#03060c",
          borderTop: "1px solid rgba(255, 255, 255, 0.04)",
          py: 4,
          position: "relative",
          zIndex: 2,
          mt: "auto",
        }}
      >
        <Box
          sx={{
            maxWidth: "1100px",
            width: "100%",
            margin: "0 auto",
            px: 4,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexDirection: { xs: "column", sm: "row" } }}>
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: "800",
                color: "white",
                fontFamily: "'Outfit', sans-serif",
              }}
            >
              ⚖️ AutoCite
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "#4b5563", fontFamily: "'Outfit', sans-serif" }}>
              © {new Date().getFullYear()} AutoCite. All rights reserved.
            </Typography>
          </Box>

          <Typography sx={{ fontSize: "0.7rem", color: "#4b5563", fontFamily: "'Outfit', sans-serif", textAlign: { xs: "center", sm: "right" } }}>
            AI-powered legal workspace. Outputs are for research helper purposes only.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;