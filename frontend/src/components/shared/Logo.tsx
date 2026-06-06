import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";

const Logo = () => {
  return (
    <div
      style={{
        display: "flex",
        marginRight: "auto",
        alignItems: "center",
        gap: "15px",
      }}
    >
      <Link to={"/"} style={{ textDecoration: "none" }}>
        <span style={{ fontSize: "28px", filter: "drop-shadow(0 0 10px rgba(162, 155, 254, 0.4))" }}>⚖️</span>
      </Link>{" "}
      <Typography
        sx={{
          display: { md: "block", sm: "none", xs: "none" },
          mr: "auto",
          fontWeight: "800",
          fontFamily: "'Outfit', sans-serif",
          textShadow: "2px 2px 20px #000",
        }}
      >
        <span style={{ fontSize: "20px" }}>AUTOCITE</span>
      </Typography>
    </div>
  );
};

export default Logo;