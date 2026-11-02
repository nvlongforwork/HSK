import LearningIcon from "../components/LearningIcon";
import { useLanguage } from "../i18n/useLanguage";
import { useParams } from "react-router-dom";
import hsk1Lessons from "../data/hsk1";
import { lessonSections } from "../data/hsk1";
import BounceCard from "../components/BounceCard";
import PinyinText from "../components/PinyinText";

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

const titleZhStyle = {
  lineHeight: 1.3,
  fontFamily: "var(--font-serif)",
  fontSize: "var(--fs-h1)",
  fontWeight: 900,
  color: "var(--red-primary)",
  marginBottom: "2px",
};

const titleEnStyle = {
  fontSize: "clamp(18px, 1.7vw, 24px)",
  lineHeight: 1.4,
  color: "var(--ink-medium)",
};

const topicStyle = {
  fontSize: "clamp(16px, 1.35vw, 18px)",
  lineHeight: 1.5,
  color: "var(--ink-light)",
  marginTop: "12px",
  fontFamily: "var(--font-serif)",
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
  fontSize: "var(--fs-body)",
  color: "var(--gold-dark)",
};

const sectionCardStyle = {
  background: "var(--white)",
  borderRadius: "var(--radius-md)",
  overflow: "hidden",
  boxShadow: "var(--shadow-md)",
  border: "1px solid rgba(212, 160, 23, 0.12)",
  textAlign: "center",
  padding: "20px 12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "6px",
};

const sectionIconStyle = {
  fontSize: "clamp(32px, 4vw, 42px)",
  display: "block",
  lineHeight: 1,
};

const sectionTitleZhStyle = {
  fontFamily: "var(--font-serif)",
  fontSize: "var(--fs-card-title)",
  fontWeight: 700,
  color: "var(--ink-dark)",
};

const sectionTitleEnStyle = {
  fontSize: "var(--fs-card-desc)",
  color: "var(--ink-light)",
};

const notFoundStyle = {
  textAlign: "center",
  padding: "80px 24px",
};

const notFoundTitleStyle = {
  fontFamily: "var(--font-serif)",
  fontSize: "var(--fs-h2)",
  color: "var(--ink-medium)",
  marginBottom: "12px",
};

const notFoundDescStyle = {
  fontSize: "var(--fs-body)",
  color: "var(--ink-light)",
};

export default function Lesson() {
  const { t } = useLanguage();
  const { level, lessonSlug } = useParams();
  const levelNum = parseInt(level);
  const lessonMatch = lessonSlug?.match(/lesson-(\d+)/);
  const lessonNum = lessonMatch ? parseInt(lessonMatch[1]) : NaN;

  const lesson = levelNum === 1 ? hsk1Lessons.find((l) => l.id === lessonNum) : null;

  if (!lesson) {
    return (
      <main style={pageStyle}>
        <div style={notFoundStyle}>
          <h2 style={notFoundTitleStyle}>
            <PinyinText>未找到</PinyinText>{t(" Not Found")}</h2>
          <p style={notFoundDescStyle}>
            <PinyinText>该课程不存在</PinyinText>{t(" This lesson does not exist")}</p>
        </div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={decorDividerStyle}>
        <div style={decorLineStyle} />
        <span style={decorCharStyle}>
          <PinyinText>学习内容</PinyinText>{t(" Content")}</span>
        <div style={decorLineStyle} />
      </div>

      <div className="sections-grid">
        {lessonSections.map((section, index) => (
          <BounceCard
            key={section.id}
            to={`/hsk/${levelNum}/${lessonSlug}/${section.id}`}
            style={sectionCardStyle}
            delay={index}
          >
            <span style={sectionIconStyle}><LearningIcon name={section.id} /></span>
            <div style={sectionTitleZhStyle}>
              <PinyinText>{section.titleZh}</PinyinText>
            </div>
            <div style={sectionTitleEnStyle}>{t(section.titleEn)}</div>
          </BounceCard>
        ))}
      </div>
    </main>
  );
}
