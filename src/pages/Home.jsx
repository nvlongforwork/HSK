import hskLevels from "../data/hskLevels";
import BounceCard from "../components/BounceCard";
import PinyinText from "../components/PinyinText";

const pageStyle = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "40px 24px 60px",
};

const heroStyle = {
  textAlign: "center",
  marginBottom: "48px",
};

const heroTitleStyle = {
  fontFamily: "var(--font-serif)",
  fontSize: "var(--fs-h1)",
  fontWeight: 900,
  color: "var(--red-primary)",
  marginBottom: "8px",
  lineHeight: 1.2,
};

const heroSubStyle = {
  fontSize: "var(--fs-h3)",
  color: "var(--ink-medium)",
  fontWeight: 400,
};

const heroDescStyle = {
  fontSize: "var(--fs-body)",
  color: "var(--ink-light)",
  marginTop: "16px",
  maxWidth: "600px",
  marginLeft: "auto",
  marginRight: "auto",
};

const gridStyle = {};

const cardStyle = {
  background: "var(--white)",
  borderRadius: "var(--radius-md)",
  overflow: "hidden",
  boxShadow: "var(--shadow-md)",
  border: "1px solid rgba(212, 160, 23, 0.15)",
};

const cardTopStyle = (color) => ({
  background: `linear-gradient(135deg, ${color}, ${color}CC)`,
  padding: "28px 24px",
  position: "relative",
  overflow: "hidden",
});

const cardPatternStyle = {
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  opacity: 0.08,
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
};

const levelNumStyle = {
  fontFamily: "var(--font-serif)",
  fontSize: "clamp(48px, 6vw, 72px)",
  fontWeight: 900,
  color: "rgba(255,255,255,0.25)",
  position: "absolute",
  right: "16px",
  top: "50%",
  transform: "translateY(-50%)",
  lineHeight: 1,
};

const cardTitleZhStyle = {
  fontFamily: "var(--font-serif)",
  fontSize: "var(--fs-card-title)",
  fontWeight: 700,
  color: "#FFFFFF",
  position: "relative",
  zIndex: 1,
};

const cardTitleEnStyle = {
  fontSize: "var(--fs-card-desc)",
  color: "rgba(255,255,255,0.85)",
  position: "relative",
  zIndex: 1,
  marginTop: "4px",
};

const cardBottomStyle = {
  padding: "20px 24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const cardDescStyle = {
  fontSize: "var(--fs-card-desc)",
  color: "var(--ink-medium)",
};

const cardArrowStyle = {
  fontSize: "clamp(20px, 2.5vw, 28px)",
  color: "var(--red-primary)",
};

const decorDividerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "16px",
  margin: "40px 0 32px",
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

export default function Home() {
  return (
    <main style={pageStyle}>
      <div style={heroStyle} className="fade-in-up">
        <h1 style={heroTitleStyle}>
          <PinyinText>汉语水平考试</PinyinText>
        </h1>
        <p style={heroSubStyle}>Chinese Proficiency Test</p>
        <p style={heroDescStyle}>
          <PinyinText>选择你的学习等级，开始你的中文之旅</PinyinText>
          <br />
          Choose your level and start your Chinese journey
        </p>
      </div>

      <div style={decorDividerStyle}>
        <div style={decorLineStyle} />
        <span style={decorCharStyle}>
          <PinyinText>学习等级</PinyinText> Levels
        </span>
        <div style={decorLineStyle} />
      </div>

      <div className="home-grid">
        {hskLevels.map((level, index) => (
          <BounceCard
            key={level.id}
            to={`/hsk/${level.id}`}
            style={cardStyle}
            delay={index}
          >
            <div style={cardTopStyle(level.color)}>
              <div style={cardPatternStyle} />
              <span style={levelNumStyle}>{level.id}</span>
              <div style={cardTitleZhStyle}>
                <PinyinText>{level.titleZh}</PinyinText>
              </div>
              <div style={cardTitleEnStyle}>{level.titleEn}</div>
            </div>
            <div style={cardBottomStyle}>
              <div style={cardDescStyle}>
                <div><PinyinText>{level.descZh}</PinyinText></div>
                <div>{level.descEn}</div>
              </div>
              <span style={cardArrowStyle}>&#10132;</span>
            </div>
          </BounceCard>
        ))}
      </div>
    </main>
  );
}
