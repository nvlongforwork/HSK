import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function BounceCard({ to, children, style, delay = 0 }) {
  const [bouncing, setBouncing] = useState(false);
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const handleClick = (e) => {
    e.preventDefault();
    setBouncing(true);

    setTimeout(() => {
      setBouncing(false);
      navigate(to);
    }, 400);
  };

  const baseStyle = {
    cursor: "pointer",
    transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease",
    animationDelay: `${delay * 0.08}s`,
    ...style,
  };

  return (
    <div
      ref={cardRef}
      className={`bounce-in ${bouncing ? "bounce-click" : ""}`}
      style={baseStyle}
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(196, 30, 58, 0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      {children}
    </div>
  );
}
