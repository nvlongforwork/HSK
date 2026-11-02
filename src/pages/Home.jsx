import hskLevels from "../data/hskLevels";
import BounceCard from "../components/BounceCard";
import PinyinText from "../components/PinyinText";
import "./home.css";

const cardPatternStyle = {
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  opacity: 0.08,
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
};

export default function Home() {
  return (
    <main className="home-page">
      <header className="home-hero fade-in-up">
        <div className="home-title">
          <h1><PinyinText>汉语水平考试</PinyinText></h1>
          <p>Chinese Proficiency Test</p>
        </div>
        <p className="home-intro">
          <PinyinText>选择你的学习等级，开始你的中文之旅</PinyinText>
          <span>Choose your level and start your Chinese journey</span>
        </p>
      </header>

      <section className="home-levels" aria-labelledby="home-levels-title">
        <h2 id="home-levels-title" className="home-divider">
          <PinyinText>学习等级</PinyinText> Levels
        </h2>
        <div className="home-grid">
          {hskLevels.map((level, index) => (
            <BounceCard key={level.id} to={`/hsk/${level.id}`} delay={index}
              style={{ background: "var(--white)", borderRadius: "var(--radius-md)",
                overflow: "hidden", boxShadow: "var(--shadow-md)",
                border: "1px solid rgba(212, 160, 23, 0.15)" }}>
              <div className="home-card-top" style={{ background: `linear-gradient(135deg, ${level.color}, ${level.color}CC)` }}>
                <div style={cardPatternStyle} aria-hidden="true" />
                <span className="home-card-number" aria-hidden="true">{level.id}</span>
                <h3 className="home-card-title"><PinyinText>{level.titleZh}</PinyinText></h3>
                <p className="home-card-subtitle">{level.titleEn}</p>
              </div>
              <div className="home-card-bottom">
                <div className="home-card-description">
                  <p><PinyinText>{level.descZh}</PinyinText></p>
                  <p>{level.descEn}</p>
                </div>
                <span className="home-card-arrow" aria-hidden="true">➜</span>
              </div>
            </BounceCard>
          ))}
        </div>
      </section>
    </main>
  );
}
