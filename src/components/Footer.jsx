import PinyinText from "./PinyinText";

const footerStyle = {
  background: "linear-gradient(135deg, #8B0000 0%, #C41E3A 100%)",
  color: "rgba(255,255,255,0.8)",
  textAlign: "center",
  padding: "32px 24px",
  marginTop: "auto",
  fontSize: "var(--fs-small)",
};

const decorTopStyle = {
  height: "4px",
  background: "linear-gradient(90deg, #F5D77B, #D4A017, #F5D77B, #D4A017, #F5D77B)",
};

const footerTextZhStyle = {
  fontFamily: "var(--font-serif)",
  fontSize: "clamp(18px, 2vw, 22px)",
  color: "#F5D77B",
  marginBottom: "8px",
};

export default function Footer() {
  return (
    <footer>
      <div style={decorTopStyle} />
      <div style={footerStyle}>
        <p style={footerTextZhStyle}><PinyinText>学无止境</PinyinText></p>
        <p>Learning Never Ends</p>
        <p style={{ marginTop: "12px", opacity: 0.6, fontSize: "clamp(14px, 1.5vw, 16px)" }}>
          HSK Learning App &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
