import { useLanguage } from "../i18n/useLanguage";
import { Link, useLocation } from "react-router-dom";
import PinyinText from "./PinyinText";
import LanguageSwitch from "./LanguageSwitch";
import { CLOZE_START_LESSON } from "../data/hsk1Cloze";

const headerStyle = {
  background: "linear-gradient(135deg, #8B0000 0%, #C41E3A 50%, #8B0000 100%)",
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
  fontSize: "clamp(20px, 2.5vw, 24px)",
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
  fontSize: "clamp(20px, 1.5vw, 22px)",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  flexWrap: "wrap",
};

const linkStyle = { color: "#F5D77B", textDecoration: "none" };
const sepStyle = { color: "rgba(255,255,255,0.4)" };
const activeStyle = { color: "#fff" };

const decorBarStyle = {
  height: "4px",
  background: "linear-gradient(90deg, #F5D77B, #D4A017, #F5D77B, #D4A017, #F5D77B)",
};

const sectionNames = {
  vocabulary: { zh: "词汇", en: "Vocabulary" },
  grammar: { zh: "语法", en: "Grammar" },
  exercises: { zh: "练习", en: "Exercises" },
  "practice-tests": { zh: "模拟测试", en: "Practice Tests" },
};

const exerciseNames = {
  "hsk-reading": { zh: "阅读练习", en: "HSK Reading Practice" },
  "multiple-choice": { zh: "完形填空", en: "Cloze Reading" },
  "read-and-fill": { zh: "汉字填空", en: "Extra Writing Practice" },
  "flashcards": { zh: "闪卡", en: "Flashcards" },
  "listen-and-fill": { zh: "听力填空", en: "Listen & Fill" },
};

export default function Header() {
  const { t } = useLanguage();
  const location = useLocation();
  const p = location.pathname.split("/").filter(Boolean);

  const crumbs = [];

  if (p.length >= 2 && p[0] === "hsk") {
    const level = p[1];
    crumbs.push(
      <Link key="h" to="/" style={linkStyle}><PinyinText>首页</PinyinText>{t(" Home")}</Link>,
      <span key="s0" style={sepStyle}>/</span>
    );

    if (p.length === 2) {
      crumbs.push(<span key="l" style={activeStyle}>{t("HSK ")}{level}</span>);
    } else {
      crumbs.push(
        <Link key="l" to={`/hsk/${level}`} style={linkStyle}>{t("HSK ")}{level}</Link>,
        <span key="s1" style={sepStyle}>/</span>
      );

      const lessonSlug = p[2];
      const m = lessonSlug.match(/lesson-(\d+)/);
      if (m) {
        const num = m[1];
        if (p.length === 3) {
          crumbs.push(<span key="le" style={activeStyle}><PinyinText>第{num}课</PinyinText>{t(" L")}{num}</span>);
        } else {
          crumbs.push(
            <Link key="le" to={`/hsk/${level}/${lessonSlug}`} style={linkStyle}><PinyinText>第{num}课</PinyinText></Link>,
            <span key="s2" style={sepStyle}>/</span>
          );

          const sectionId = p[3];
          const sec = sectionNames[sectionId];

          if (p.length === 4) {
            crumbs.push(
              <span key="se" style={activeStyle}>
                {sec ? <><PinyinText>{sec.zh}</PinyinText> {t(sec.en)}</> : sectionId}
              </span>
            );
          } else if (sectionId === "exercises" && p[4]) {
            crumbs.push(
              <Link key="se" to={`/hsk/${level}/${lessonSlug}/exercises`} style={linkStyle}>
                <PinyinText>练习</PinyinText>
              </Link>,
              <span key="s3" style={sepStyle}>/</span>
            );
            const ex = p[4] === "multiple-choice" && Number(num) < CLOZE_START_LESSON
              ? { zh: "单句选择", en: "Sentence Choice" } : exerciseNames[p[4]];
            crumbs.push(
              <span key="ex" style={activeStyle}>
                {ex ? <><PinyinText>{ex.zh}</PinyinText> {t(ex.en)}</> : p[4]}
              </span>
            );
          }
        }
      }
    }
  }

  return (
    <header>
      <div style={headerStyle}>
        <div style={innerStyle}>
          <Link to="/" style={logoStyle}>
            <span style={logoCharStyle}><PinyinText>汉</PinyinText></span>
            <div style={logoTextStyle}>
              <span style={logoTitleStyle}>{t("HSK Learning")}</span>
              <span style={logoSubStyle}><PinyinText>汉语水平考试</PinyinText></span>
            </div>
          </Link>
          <div className="header-controls">
            {crumbs.length > 0 && <nav style={breadcrumbStyle}>{crumbs}</nav>}
            <LanguageSwitch />
          </div>
        </div>
      </div>
      <div style={decorBarStyle} />
    </header>
  );
}
