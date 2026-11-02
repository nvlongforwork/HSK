import { useParams, Link } from "react-router-dom";
import hsk1Lessons, { exerciseTypes } from "../data/hsk1";
import PinyinText from "../components/PinyinText";
import { Quiz, Flashcards } from "../components/ExerciseActivities";
import useMarkdown from "../hooks/useMarkdown";
import { getContentUrl } from "../utils/mediaUrl";
import { parseExercises } from "../utils/exercises";
import "./exercises.css";

export default function ExerciseType() {
  const { level, lessonSlug, exerciseId } = useParams();
  const lessonNum = Number(lessonSlug?.match(/^lesson-(\d+)$/)?.[1]);
  const lesson = level === "1" ? hsk1Lessons.find((item) => item.id === lessonNum) : null;
  const exercise = exerciseTypes.find((item) => item.id === exerciseId);
  const valid = Boolean(lesson && exercise);
  const listening = exerciseId === "listen-and-fill";
  const url = valid && !listening ? getContentUrl(1, lessonNum, "exercises.md") : null;
  const { content, loading, error, retry } = useMarkdown(url);
  const data = parseExercises(content || "");
  const items = exerciseId === "multiple-choice" ? data.multipleChoice
    : exerciseId === "read-and-fill" ? data.fillIn : data.flashcards;
  const sessionKey = `${level}/${lessonSlug}/${exerciseId}/${content}`;

  return (
    <main className="exercise-page">
      {!valid ? (
        <section className="exercise-panel">
          <h1>未找到 · Not Found</h1>
          <p>This lesson or exercise does not exist.</p>
          <Link className="exercise-back" to="/">首页 · Back to Home</Link>
        </section>
      ) : (
        <>
          <header className="exercise-heading fade-in-up">
            <span className="exercise-icon" aria-hidden="true">{exercise.icon}</span>
            <h1><PinyinText>{exercise.titleZh}</PinyinText></h1>
            <p>{exercise.titleEn}</p>
            <p className="exercise-meta"><PinyinText>{`${lesson.titleZh} · ${lesson.topicZh}`}</PinyinText><br />{lesson.titleEn} · {lesson.topicEn}</p>
          </header>
          <nav className="exercise-tabs" aria-label="Exercise types">
            {exerciseTypes.map((item) => (
              <Link key={item.id} to={`/hsk/1/${lessonSlug}/exercises/${item.id}`}
                aria-current={item.id === exerciseId ? "page" : undefined}>{item.titleEn}</Link>
            ))}
          </nav>
          {listening ? (
            <section className="exercise-panel">
              <h2>听力即将更新 · Audio coming soon</h2>
              <p>Listening exercises will be available when lesson recordings are added. Try the other exercise types while you wait.</p>
            </section>
          ) : loading ? <p className="exercise-panel" role="status">加载中 · Loading exercises…</p>
            : error ? (
              <section className="exercise-panel" role="alert">
                <h2>Unable to load exercises</h2>
                <p>Please check your connection and try again.</p>
                <button className="exercise-button" type="button" onClick={retry}>重试 · Retry</button>
              </section>
            ) : items.length === 0 ? (
              <section className="exercise-panel"><h2>暂无练习 · No exercises available</h2><p>This lesson does not yet contain this exercise type.</p></section>
            ) : exerciseId === "flashcards" ? <Flashcards key={sessionKey} cards={items} />
              : <Quiz key={sessionKey} items={items} multipleChoice={exerciseId === "multiple-choice"} />}
          <Link className="exercise-back" to={`/hsk/1/${lessonSlug}/exercises`}>← 返回练习 · Back to Exercises</Link>
        </>
      )}
    </main>
  );
}
