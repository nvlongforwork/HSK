import { useParams } from "react-router-dom";
import hskLevels from "../data/hskLevels";
import hsk1Lessons from "../data/hsk1";
import BounceCard from "../components/BounceCard";
import PinyinText from "../components/PinyinText";

const pageStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "40px 24px 60px",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "40px",
};

const titleZhStyle = {
  fontFamily: "var(--font-serif)",
  fontSize: "var(--fs-h1)",
  fontWeight: 900,
  color: "var(--red-primary)",
  marginBottom: "4px",
};

const titleEnStyle = {
  fontSize: "var(--fs-h3)",
  color: "var(--ink-medium)",
};

const descStyle = {
  fontSize: "var(--fs-body)",
  color: "var(--ink-light)",
  marginTop: "12px",
};

const decorDividerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "16px",
  margin: "32px 0 28px",
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

const gridStyle = {};

const cardStyle = {
  background: "var(--white)",
  borderRadius: "var(--radius-md)",
  overflow: "hidden",
  boxShadow: "var(--shadow-sm)",
  border: "1px solid rgba(212, 160, 23, 0.12)",
  textAlign: "center",
};

const cardInnerStyle = {
  padding: "20px 12px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "8px",
};

const lessonNumStyle = (color) => ({
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  background: `linear-gradient(135deg, ${color}, ${color}CC)`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontWeight: 700,
  fontSize: "clamp(18px, 2vw, 22px)",
  flexShrink: 0,
});

const lessonTitleZhStyle = {
  fontFamily: "var(--font-serif)",
  fontSize: "var(--fs-card-desc)",
  fontWeight: 700,
  color: "var(--ink-dark)",
  lineHeight: 1.3,
};

const lessonTopicStyle = {
  fontSize: "clamp(14px, 1.5vw, 18px)",
  color: "var(--ink-light)",
  lineHeight: 1.3,
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
  const { level } = useParams();
  const levelNum = parseInt(level);
  const levelData = hskLevels.find((l) => l.id === levelNum);

  if (!levelData) {
    return (
      <main style={pageStyle}>
        <div style={comingSoonStyle}>
          <h2 style={comingSoonTitleStyle}>
            <PinyinText>未找到</PinyinText> Not Found
          </h2>
          <p style={comingSoonDescStyle}>
            <PinyinText>该学习等级不存在</PinyinText> This level does not exist
          </p>
        </div>
      </main>
    );
  }

  if (levelNum !== 1) {
    return (
      <main style={pageStyle}>
        <div style={headerStyle} className="fade-in-up">
          <h1 style={titleZhStyle}>
            <PinyinText>{levelData.titleZh}</PinyinText>
          </h1>
          <p style={titleEnStyle}>{levelData.titleEn}</p>
          <p style={descStyle}>
            <PinyinText>{levelData.descZh}</PinyinText> &middot; {levelData.descEn}
          </p>
        </div>
        <div style={comingSoonStyle}>
          <h2 style={comingSoonTitleStyle}>
            <PinyinText>即将推出</PinyinText> Coming Soon
          </h2>
          <p style={comingSoonDescStyle}>
            <PinyinText>该等级的课程正在准备中，敬请期待！</PinyinText>
            <br />
            Lessons for this level are being prepared. Stay tuned!
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={headerStyle} className="fade-in-up">
        <h1 style={titleZhStyle}>
          <PinyinText>{levelData.titleZh}</PinyinText>
        </h1>
        <p style={titleEnStyle}>{levelData.titleEn}</p>
        <p style={descStyle}>
          <PinyinText>{levelData.descZh}</PinyinText> &middot; {hsk1Lessons.length}<PinyinText>课</PinyinText>
          <br />
          {levelData.descEn} &middot; {hsk1Lessons.length} Lessons
        </p>
      </div>

      <div style={decorDividerStyle}>
        <div style={decorLineStyle} />
        <span style={decorCharStyle}>
          <PinyinText>课程列表</PinyinText> Lessons
        </span>
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
              <div style={lessonNumStyle(levelData.color)}>{lesson.id}</div>
              <div style={lessonTitleZhStyle}>
                <PinyinText>{lesson.titleZh}</PinyinText>
              </div>
              <div style={lessonTopicStyle}>
                <PinyinText>{lesson.topicZh}</PinyinText>
              </div>
              <div style={lessonTopicStyle}>{lesson.topicEn}</div>
            </div>
          </BounceCard>
        ))}
      </div>
    </main>
  );
}
