import { useLanguage } from "../i18n/useLanguage";
import { useParams } from "react-router-dom";
import hskLevels from "../data/hskLevels";
import hsk1Lessons from "../data/hsk1";
import BounceCard from "../components/BounceCard";
import PinyinText from "../components/PinyinText";

const pageStyle = {
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "24px 24px 40px",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "16px",
};

const titleZhStyle = {
  fontFamily: "var(--font-serif)",
  fontSize: "clamp(26px, 2.5vw, 36px)",
  fontWeight: 900,
  color: "var(--red-primary)",
  marginBottom: "2px",
  lineHeight: 1.3,
};

const titleEnStyle = {
  fontSize: "clamp(20px, 1.7vw, 24px)",
  lineHeight: 1.4,
  color: "var(--ink-medium)",
};

const descStyle = {
  fontSize: "clamp(20px, 1.35vw, 22px)",
  lineHeight: 1.5,
  color: "var(--ink-light)",
  marginTop: "8px",
};

const decorDividerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "16px",
  margin: "16px 0",
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

const cardStyle = {
  background: "var(--white)",
  borderRadius: "var(--radius-md)",
  overflow: "hidden",
  boxShadow: "var(--shadow-sm)",
  border: "1px solid rgba(212, 160, 23, 0.12)",
  textAlign: "center",
};

const cardInnerStyle = {
  padding: "16px 20px",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "16px",
};

const lessonNumStyle = (color, textColor) => ({
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  background: color,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: textColor,
  fontWeight: 700,
  fontSize: "clamp(20px, 2vw, 22px)",
  flexShrink: 0,
});

const lessonTextStyle = {
  flex: 1,
  minWidth: 0,
  textAlign: "left",
};

const lessonTitleZhStyle = {
  fontFamily: "var(--font-serif)",
  fontSize: "var(--fs-card-desc)",
  fontWeight: 700,
  color: "var(--ink-dark)",
  lineHeight: 1.3,
};

const lessonTopicStyle = {
  fontSize: "clamp(20px, 1.5vw, 22px)",
  color: "var(--ink-light)",
  lineHeight: 1.4,
};

const comingSoonStyle = {
  textAlign: "center",
  padding: "80px 24px",
};

const comingSoonTitleStyle = {
  fontFamily: "var(--font-serif)",
  fontSize: "var(--fs-h2)",
  color: "var(--ink-medium)",
  marginBottom: "12px",
};

const comingSoonDescStyle = {
  fontSize: "var(--fs-body)",
  color: "var(--ink-light)",
};

export default function HskLevel() {
  const { t } = useLanguage();
  const { level } = useParams();
  const levelNum = parseInt(level);
  const levelData = hskLevels.find((l) => l.id === levelNum);

  if (!levelData) {
    return (
      <main style={pageStyle}>
        <div style={comingSoonStyle}>
          <h2 style={comingSoonTitleStyle}>
            <PinyinText>未找到</PinyinText>{t(" Not Found")}</h2>
          <p style={comingSoonDescStyle}>
            <PinyinText>该学习等级不存在</PinyinText>{t(" This level does not exist")}</p>
        </div>
      </main>
    );
  }

  if (levelNum !== 1) {
    return (
      <main style={pageStyle}>
        <div style={comingSoonStyle}>
          <h2 style={comingSoonTitleStyle}>
            <PinyinText>即将推出</PinyinText>{t(" Coming Soon")}</h2>
          <p style={comingSoonDescStyle}>
            <PinyinText>该等级的课程正在准备中，敬请期待！</PinyinText>
            <br />{t("Lessons for this level are being prepared. Stay tuned!")}</p>
        </div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={decorDividerStyle}>
        <div style={decorLineStyle} />
        <span style={decorCharStyle}>
          <PinyinText>课程列表</PinyinText>{t(" Lessons")}</span>
        <div style={decorLineStyle} />
      </div>

      <div className="lessons-grid">
        {hsk1Lessons.map((lesson, index) => (
          <BounceCard
            key={lesson.id}
            to={`/hsk/1/lesson-${lesson.id}`}
            style={cardStyle}
            delay={index}
          >
            <div style={cardInnerStyle}>
              <div style={lessonNumStyle(levelData.color, levelData.textColor)}>{lesson.id}</div>
              <div style={lessonTextStyle}>
                <div style={lessonTitleZhStyle}>
                  <PinyinText>{lesson.titleZh}</PinyinText>
                </div>
                <div style={lessonTopicStyle}>
                  <PinyinText>{lesson.topicZh}</PinyinText>
                </div>
                <div style={lessonTopicStyle}>{t(lesson.topicEn)}</div>
              </div>
            </div>
          </BounceCard>
        ))}
      </div>
    </main>
  );
}
