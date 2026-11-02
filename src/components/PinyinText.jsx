import { useState } from "react";
import pinyinMap from "../data/pinyin";

const isChinese = (char) => /[一-鿿]/.test(char);

const tooltipStyle = {
  position: "absolute",
  bottom: "100%",
  left: "50%",
  transform: "translateX(-50%)",
  background: "var(--red-dark)",
  color: "#fff",
  padding: "4px 10px",
  borderRadius: "6px",
  fontSize: "clamp(14px, 1.5vw, 18px)",
  fontFamily: "var(--font-sans)",
  fontWeight: 400,
  whiteSpace: "nowrap",
  pointerEvents: "none",
  marginBottom: "4px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
  zIndex: 1000,
};

const arrowStyle = {
  position: "absolute",
  top: "100%",
  left: "50%",
  transform: "translateX(-50%)",
  width: 0,
  height: 0,
  borderLeft: "5px solid transparent",
  borderRight: "5px solid transparent",
  borderTop: "5px solid var(--red-dark)",
};

function ChineseChar({ char }) {
  const [show, setShow] = useState(false);
  const pinyin = pinyinMap[char];

  if (!pinyin) return <span>{char}</span>;

  return (
    <span
      style={{ position: "relative", cursor: "help", display: "inline-block" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {char}
      {show && (
        <span style={tooltipStyle}>
          {pinyin}
          <span style={arrowStyle} />
        </span>
      )}
    </span>
  );
}

export default function PinyinText({ children, style, className }) {
  if (typeof children !== "string") {
    return <span style={style} className={className}>{children}</span>;
  }

  const chars = Array.from(children);
  return (
    <span style={style} className={className}>
      {chars.map((char, i) =>
        isChinese(char) ? <ChineseChar key={i} char={char} /> : char
      )}
    </span>
  );
}
