import { Link, useLocation } from "react-router-dom";

const headerStyle = {
  background: "linear-gradient(135deg, #8B0000 0%, #C41E3A 50%, #8B0000 100%)",
  padding: "0",
  position: "sticky",
  top: 0,
  zIndex: 100,
  boxShadow: "0 4px 20px rgba(139, 0, 0, 0.3)",
};

const innerStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "16px 24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "8px",
};

const logoStyle = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  color: "#FFFFFF",
  textDecoration: "none",
};

const logoCharStyle = {
  fontFamily: "var(--font-serif)",
  fontSize: "clamp(28px, 4vw, 40px)",
  fontWeight: 900,
  color: "#F5D77B",
  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
  lineHeight: 1,
};

const logoTextStyle = {
  display: "flex",
  flexDirection: "column",
  lineHeight: 1.2,
};

const logoTitleStyle = {
  fontSize: "clamp(18px, 2.5vw, 24px)",
  fontWeight: 700,
  color: "#FFFFFF",
  letterSpacing: "1px",
};

const logoSubStyle = {
  fontSize: "clamp(12px, 1.5vw, 14px)",
  color: "#F5D77B",
  fontWeight: 400,
  letterSpacing: "0.5px",
};

const breadcrumbStyle = {
  color: "rgba(255,255,255,0.7)",
  fontSize: "clamp(14px, 1.5vw, 18px)",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flexWrap: "wrap",
};

const breadcrumbLinkStyle = {
  color: "#F5D77B",
  textDecoration: "none",
};

const separatorStyle = {
  color: "rgba(255,255,255,0.4)",
};

const decorBarStyle = {
  height: "4px",
  background: "linear-gradient(90deg, #F5D77B, #D4A017, #F5D77B, #D4A017, #F5D77B)",
  backgroundSize: "200% 100%",
};

export default function Header() {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);

  const buildBreadcrumbs = () => {
    if (pathParts.length < 2 || pathParts[0] !== "hsk") return null;

    const crumbs = [];
    const level = pathParts[1];

    crumbs.push(
      <Link key="home" to="/" style={breadcrumbLinkStyle}>首页 Home</Link>,
      <span key="sep1" style={separatorStyle}>/</span>
    );

    if (pathParts.length === 2) {
      crumbs.push(<span key="level" style={{ color: "#fff" }}>HSK {level}</span>);
    } else {
      crumbs.push(
        <Link key="level" to={`/hsk/${level}`} style={breadcrumbLinkStyle}>HSK {level}</Link>,
        <span key="sep2" style={separatorStyle}>/</span>
      );

      const lessonSlug = pathParts[2];
      const lessonMatch = lessonSlug?.match(/lesson-(\d+)/);

      if (lessonMatch) {
        const lessonNum = lessonMatch[1];

        if (pathParts.length === 3) {
          crumbs.push(
            <span key="lesson" style={{ color: "#fff" }}>
              第{lessonNum}课 Lesson {lessonNum}
            </span>
          );
        } else {
          crumbs.push(
            <Link key="lesson" to={`/hsk/${level}/${lessonSlug}`} style={breadcrumbLinkStyle}>
              第{lessonNum}课
            </Link>,
            <span key="sep3" style={separatorStyle}>/</span>
          );
          const sectionNames = {
            vocabulary: "词汇 Vocabulary",
            grammar: "语法 Grammar",
            exercises: "练习 Exercises",
          };
          crumbs.push(
            <span key="section" style={{ color: "#fff" }}>
              {sectionNames[pathParts[3]] || pathParts[3]}
            </span>
          );
        }
      }
    }

    return <nav style={breadcrumbStyle}>{crumbs}</nav>;
  };

  return (
    <header>
      <div style={headerStyle}>
        <div style={innerStyle}>
          <Link to="/" style={logoStyle}>
            <span style={logoCharStyle}>汉</span>
            <div style={logoTextStyle}>
              <span style={logoTitleStyle}>HSK Learning</span>
              <span style={logoSubStyle}>汉语水平考试</span>
            </div>
          </Link>
          <div>{buildBreadcrumbs()}</div>
        </div>
      </div>
      <div style={decorBarStyle} />
    </header>
  );
}
