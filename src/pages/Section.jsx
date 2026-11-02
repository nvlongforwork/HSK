import LearningIcon from "../components/LearningIcon";
import { useLanguage } from "../i18n/useLanguage";
import { useParams, Link } from "react-router-dom";
import hsk1Lessons from "../data/hsk1";
import { lessonSections, exerciseTypes } from "../data/hsk1";
import BounceCard from "../components/BounceCard";
import PinyinText from "../components/PinyinText";
import MarkdownRenderer from "../components/MarkdownRenderer";
import Unit1Vocabulary from "../components/Unit1Vocabulary";
import useMarkdown from "../hooks/useMarkdown";
import { getContentUrl, getAudioBaseUrl } from "../utils/mediaUrl";

const pageStyle = {
  width: "100%",
  maxWidth: "1000px",
  margin: "0 auto",
  padding: "24px 24px 40px",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "24px",
};

const iconStyle = {
  fontSize: "clamp(32px, 4vw, 44px)",
  display: "block",
  lineHeight: 1,
  marginBottom: "8px",
};

const titleZhStyle = {
  lineHeight: 1.3,
  fontFamily: "var(--font-serif)",
  fontSize: "var(--fs-h1)",
  fontWeight: 900,
  color: "var(--red-primary)",
  marginBottom: "2px",
};

const titleEnStyle = {
  fontSize: "clamp(20px, 1.7vw, 24px)",
  lineHeight: 1.4,
  color: "var(--ink-medium)",
};

const lessonInfoStyle = {
  fontSize: "clamp(20px, 1.35vw, 22px)",
  lineHeight: 1.5,
  color: "var(--ink-light)",
  marginTop: "8px",
};

const contentBoxStyle = {
  background: "var(--white)",
  borderRadius: "var(--radius-md)",
  padding: "40px 32px",
  boxShadow: "var(--shadow-md)",
  border: "1px solid rgba(212, 160, 23, 0.12)",
  textAlign: "center",
  marginTop: "32px",
};

const placeholderTitleStyle = {
  fontFamily: "var(--font-serif)",
  fontSize: "var(--fs-h2)",
  color: "var(--ink-medium)",
  marginBottom: "16px",
};

const placeholderDescStyle = {
  fontSize: "var(--fs-body)",
  color: "var(--ink-light)",
  lineHeight: 1.8,
};

const backLinkStyle = {
  display: "inline-block",
  marginTop: "24px",
  padding: "10px 24px",
  background: "linear-gradient(135deg, var(--red-primary), var(--red-dark))",
  color: "#fff",
  borderRadius: "var(--radius-sm)",
  fontSize: "var(--fs-small)",
  fontWeight: 500,
  transition: "transform 0.2s, box-shadow 0.2s",
};

const decorDividerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "16px",
  margin: "20px 0",
};

const decorLineStyle = {
  flex: 1,
  height: "1px",
  background: "linear-gradient(90deg, transparent, var(--gold-primary), transparent)",
};

const decorCharStyle = {
  fontFamily: "var(--font-serif)",
  fontSize: "clamp(20px, 1.5vw, 22px)",
  textAlign: "center",
  lineHeight: 1.5,
  color: "var(--gold-dark)",
};

const exerciseCardStyle = {
  background: "var(--white)",
  borderRadius: "var(--radius-md)",
  overflow: "hidden",
  boxShadow: "var(--shadow-md)",
  border: "1px solid rgba(212, 160, 23, 0.12)",
  textAlign: "center",
  minWidth: 0,
  minHeight: "180px",
  padding: "24px 12px",
  gap: "8px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};

const exerciseIconStyle = {
  fontSize: "clamp(32px, 4vw, 44px)",
  display: "block",
  marginBottom: "4px",
  lineHeight: 1.2,
};

const exerciseTitleZhStyle = {
  fontFamily: "var(--font-serif)",
  fontSize: "var(--fs-h3)",
  fontWeight: 700,
  color: "var(--ink-dark)",
  lineHeight: 1.3,
};

const exerciseTitleEnStyle = {
  fontSize: "clamp(20px, 1.5vw, 22px)",
  color: "var(--ink-light)",
  lineHeight: 1.4,
  maxWidth: "100%",
  overflowWrap: "anywhere",
};

const sectionFileMap = {
  vocabulary: "vocabulary.md",
  grammar: "grammar.md",
};

const loadingStyle = {
  textAlign: "center",
  padding: "40px",
  fontSize: "var(--fs-body)",
  color: "var(--ink-light)",
};

const spinnerStyle = {
  display: "inline-block",
  width: "40px",
  height: "40px",
  border: "4px solid var(--cream-dark)",
  borderTopColor: "var(--red-primary)",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};

export default function Section() {
  const { t } = useLanguage();
  const { level, lessonSlug, sectionId } = useParams();
  const levelNum = parseInt(level);
  const lessonMatch = lessonSlug?.match(/lesson-(\d+)/);
  const lessonNum = lessonMatch ? parseInt(lessonMatch[1]) : NaN;

  const lesson = levelNum === 1 ? hsk1Lessons.find((l) => l.id === lessonNum) : null;
  const section = lessonSections.find((s) => s.id === sectionId);

  const mdFile = sectionFileMap[sectionId];
  const contentUrl = mdFile ? getContentUrl(levelNum, lessonNum, mdFile) : null;
  const { content, loading } = useMarkdown(contentUrl);

  if (!lesson || !section) {
    return (
      <main style={pageStyle}>
        <div style={{ textAlign: "center", padding: "80px 24px" }}>
          <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "var(--fs-h2)", color: "var(--ink-medium)", marginBottom: "12px" }}>
            <PinyinText>未找到</PinyinText>{t(" Not Found")}</h2>
          <p style={{ fontSize: "var(--fs-body)", color: "var(--ink-light)" }}>
            <PinyinText>该页面不存在</PinyinText>{t(" This page does not exist")}</p>
        </div>
      </main>
    );
  }

  const isExercises = sectionId === "exercises";
  const isUnit1Vocabulary = levelNum === 1 && lessonNum === 1 && sectionId === "vocabulary";
  const renderedContentStyle = sectionId === "grammar"
    ? { ...contentBoxStyle, textAlign: "left", background: "transparent", padding: 0, border: 0, boxShadow: "none" }
    : { ...contentBoxStyle, textAlign: "left" };

  return (
    <main style={pageStyle}>
      {isExercises ? (
        <>
          <div style={decorDividerStyle}>
            <div style={decorLineStyle} />
            <span style={decorCharStyle}>
              <PinyinText>选择练习类型</PinyinText>
              <br />
              {t("Choose Exercise Type")}
            </span>
            <div style={decorLineStyle} />
          </div>

          <div className="sections-grid exercise-types-grid">
            {exerciseTypes.map((ex, index) => (
              <BounceCard
                key={ex.id}
                to={`/hsk/${levelNum}/${lessonSlug}/exercises/${ex.id}`}
                style={exerciseCardStyle}
                delay={index}
              >
                <span style={exerciseIconStyle}><LearningIcon name={ex.id} /></span>
                <div style={exerciseTitleZhStyle}>
                  <PinyinText>{ex.titleZh}</PinyinText>
                </div>
                <div style={exerciseTitleEnStyle}>{t(ex.titleEn)}</div>
              </BounceCard>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <Link
              to={`/hsk/${levelNum}/${lessonSlug}`}
              style={backLinkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(196, 30, 58, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <PinyinText>返回课程</PinyinText>{t(" Back to Lesson")}</Link>
          </div>
        </>
      ) : loading ? (
        <div style={loadingStyle} className="fade-in-up">
          <div style={spinnerStyle} />
          <p style={{ marginTop: "16px" }}>
            <PinyinText>加载中</PinyinText>{t(" Loading...")}</p>
        </div>
      ) : content ? (
        <div style={renderedContentStyle} className="fade-in-up">
          {isUnit1Vocabulary ? <Unit1Vocabulary key={content} content={content} audioBaseUrl={getAudioBaseUrl(levelNum, lessonNum)} /> : <MarkdownRenderer content={content} audioBaseUrl={sectionId === "vocabulary" ? getAudioBaseUrl(levelNum, lessonNum) : undefined} groupTopics={sectionId === "grammar"} />}
          <div style={{ textAlign: "center" }}>
            <Link
              to={`/hsk/${levelNum}/${lessonSlug}`}
              style={backLinkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(196, 30, 58, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <PinyinText>返回课程</PinyinText>{t(" Back to Lesson")}</Link>
          </div>
        </div>
      ) : (
        <div style={contentBoxStyle} className="fade-in-up">
          <h2 style={placeholderTitleStyle}>
            <PinyinText>内容即将更新</PinyinText>{t(" Content Coming Soon")}</h2>
          <p style={placeholderDescStyle}>
            <PinyinText>该部分的学习内容正在编写中。</PinyinText>
            <br />{t("The learning content for this section is being prepared.")}</p>
          <Link
            to={`/hsk/${levelNum}/${lessonSlug}`}
            style={backLinkStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(196, 30, 58, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <PinyinText>返回课程</PinyinText>{t(" Back to Lesson")}</Link>
        </div>
      )}
    </main>
  );
}
