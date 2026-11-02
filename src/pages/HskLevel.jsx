import { useParams } from "react-router-dom";
import hskLevels from "../data/hskLevels";
import hsk1Lessons from "../data/hsk1";
import BounceCard from "../components/BounceCard";

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

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "20px",
};

const cardStyle = {
  background: "var(--white)",
  borderRadius: "var(--radius-md)",
  overflow: "hidden",
  boxShadow: "var(--shadow-sm)",
  border: "1px solid rgba(212, 160, 23, 0.12)",
};

const cardInnerStyle = {
  padding: "24px",
  display: "flex",
  alignItems: "center",
  gap: "16px",
};

const lessonNumStyle = (color) => ({
  width: "56px",
  height: "56px",
  borderRadius: "50%",
  background: `linear-gradient(135deg, ${color}, ${color}CC)`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontWeight: 700,
  fontSize: "clamp(20px, 2.5vw, 24px)",
  flexShrink: 0,
});

const lessonInfoStyle = {
  flex: 1,
  minWidth: 0,
};

const lessonTitleZhStyle = {
  fontFamily: "var(--font-serif)",
  fontSize: "var(--fs-card-title)",
  fontWeight: 700,
  color: "var(--ink-dark)",
};

const lessonTitleEnStyle = {
  fontSize: "var(--fs-card-desc)",
  color: "var(--ink-light)",
  marginTop: "2px",
};

const lessonTopicStyle = {
  fontSize: "var(--fs-small)",
  color: "var(--ink-medium)",
  marginTop: "6px",
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
          <h2 style={comingSoonTitleStyle}>未找到 Not Found</h2>
          <p style={comingSoonDescStyle}>该学习等级不存在 This level does not exist</p>
        </div>
      </main>
    );
  }

  if (levelNum !== 1) {
    return (
      <main style={pageStyle}>
        <div style={headerStyle} className="fade-in-up">
          <h1 style={titleZhStyle}>{levelData.titleZh}</h1>
          <p style={titleEnStyle}>{levelData.titleEn}</p>
          <p style={descStyle}>
            {levelData.descZh} &middot; {levelData.descEn}
          </p>
        </div>
        <div style={comingSoonStyle}>
          <h2 style={comingSoonTitleStyle}>即将推出 Coming Soon</h2>
          <p style={comingSoonDescStyle}>
            该等级的课程正在准备中，敬请期待！
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
        <h1 style={titleZhStyle}>{levelData.titleZh}</h1>
        <p style={titleEnStyle}>{levelData.titleEn}</p>
        <p style={descStyle}>
          {levelData.descZh} &middot; {hsk1Lessons.length}课
          <br />
          {levelData.descEn} &middot; {hsk1Lessons.length} Lessons
        </p>
      </div>

      <div style={decorDividerStyle}>
        <div style={decorLineStyle} />
        <span style={decorCharStyle}>课程列表 Lessons</span>
        <div style={decorLineStyle} />
      </div>

      <div style={gridStyle}>
        {hsk1Lessons.map((lesson, index) => (
          <BounceCard
            key={lesson.id}
            to={`/hsk/1/lesson-${lesson.id}`}
            style={cardStyle}
            delay={index}
          >
            <div style={cardInnerStyle}>
              <div style={lessonNumStyle(levelData.color)}>{lesson.id}</div>
              <div style={lessonInfoStyle}>
                <div style={lessonTitleZhStyle}>{lesson.titleZh}</div>
                <div style={lessonTitleEnStyle}>{lesson.titleEn}</div>
                <div style={lessonTopicStyle}>{lesson.topicZh} &middot; {lesson.topicEn}</div>
              </div>
            </div>
          </BounceCard>
        ))}
      </div>
    </main>
  );
}
