import { useParams, Link } from "react-router-dom";
import hsk1Lessons from "../data/hsk1";
import { lessonSections } from "../data/hsk1";

const pageStyle = {
  maxWidth: "1000px",
  margin: "0 auto",
  padding: "40px 24px 60px",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "40px",
};

const iconStyle = {
  fontSize: "clamp(56px, 8vw, 80px)",
  display: "block",
  marginBottom: "12px",
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

const lessonInfoStyle = {
  fontSize: "var(--fs-body)",
  color: "var(--ink-light)",
  marginTop: "12px",
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
  marginTop: "32px",
  padding: "12px 32px",
  background: "linear-gradient(135deg, var(--red-primary), var(--red-dark))",
  color: "#fff",
  borderRadius: "var(--radius-sm)",
  fontSize: "var(--fs-body)",
  fontWeight: 500,
  transition: "transform 0.2s, box-shadow 0.2s",
};

export default function Section() {
  const { level, lessonSlug, sectionId } = useParams();
  const levelNum = parseInt(level);
  const lessonMatch = lessonSlug?.match(/lesson-(\d+)/);
  const lessonNum = lessonMatch ? parseInt(lessonMatch[1]) : NaN;

  const lesson = levelNum === 1 ? hsk1Lessons.find((l) => l.id === lessonNum) : null;
  const section = lessonSections.find((s) => s.id === sectionId);

  if (!lesson || !section) {
    return (
      <main style={pageStyle}>
        <div style={{ textAlign: "center", padding: "80px 24px" }}>
          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "var(--fs-h2)",
              color: "var(--ink-medium)",
              marginBottom: "12px",
            }}
          >
            未找到 Not Found
          </h2>
          <p style={{ fontSize: "var(--fs-body)", color: "var(--ink-light)" }}>
            该页面不存在 This page does not exist
          </p>
        </div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={headerStyle} className="fade-in-up">
        <span style={iconStyle}>{section.icon}</span>
        <h1 style={titleZhStyle}>{section.titleZh}</h1>
        <p style={titleEnStyle}>{section.titleEn}</p>
        <p style={lessonInfoStyle}>
          {lesson.titleZh} &middot; {lesson.topicZh}
          <br />
          {lesson.titleEn} &middot; {lesson.topicEn}
        </p>
      </div>

      <div style={contentBoxStyle} className="fade-in-up">
        <h2 style={placeholderTitleStyle}>内容即将更新 Content Coming Soon</h2>
        <p style={placeholderDescStyle}>
          该部分的学习内容正在编写中。
          <br />
          The learning content for this section is being prepared.
          <br />
          <br />
          教师可以在此处添加{section.titleZh}内容。
          <br />
          Teachers can add {section.titleEn.toLowerCase()} content here.
        </p>

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
          返回课程 Back to Lesson
        </Link>
      </div>
    </main>
  );
}
