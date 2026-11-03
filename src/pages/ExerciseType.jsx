import LearningIcon from "../components/LearningIcon";
import { useLanguage } from "../i18n/useLanguage";
import { useParams, Link } from "react-router-dom";
import hsk1Lessons, { exerciseTypes } from "../data/hsk1";
import PinyinText from "../components/PinyinText";
import { Quiz, Flashcards } from "../components/ExerciseActivities";
import useMarkdown from "../hooks/useMarkdown";
import { getContentUrl } from "../utils/mediaUrl";
import { parseExercises } from "../utils/exercises";
import HskReading from "../components/HskReading";
import { getReadingLesson } from "../data/hsk1Reading";
import ClozePassage from "../components/ClozePassage";
import { CLOZE_START_LESSON, getClozePassage } from "../data/hsk1Cloze";
import "./exercises.css";

export default function ExerciseType() {
  const { t } = useLanguage();
  const { level, lessonSlug, exerciseId } = useParams();
  const lessonNum = Number(lessonSlug?.match(/^lesson-(\d+)$/)?.[1]);
  const lesson = level === "1" ? hsk1Lessons.find((item) => item.id === lessonNum) : null;
  const exercise = exerciseTypes.find((item) => item.id === exerciseId);
  const valid = Boolean(lesson && exercise);
  const listening = exerciseId === "listen-and-fill";
  const reading = exerciseId === "hsk-reading";
  const cloze = exerciseId === "multiple-choice" && lessonNum >= CLOZE_START_LESSON;
  const url = valid && !listening && !reading && !cloze ? getContentUrl(1, lessonNum, "exercises.md") : null;
  const { content, loading, error, retry } = useMarkdown(url);
  const data = parseExercises(content || "");
  const items = exerciseId === "multiple-choice" ? data.multipleChoice
    : exerciseId === "read-and-fill" ? data.fillIn : data.flashcards;
  const sessionKey = `${level}/${lessonSlug}/${exerciseId}/${content}`;

  return (
    <main className="exercise-page">
      {!valid ? (
        <section className="exercise-panel">
          <h1>{t("未找到 · Not Found")}</h1>
          <p>{t("This lesson or exercise does not exist.")}</p>
          <Link className="exercise-back" to="/">{t("首页 · Back to Home")}</Link>
        </section>
      ) : (
        <>
          <header className="exercise-heading fade-in-up">
            <span className="exercise-icon" aria-hidden="true"><LearningIcon name={exercise.id} /></span>
            <h1><PinyinText>{exerciseId === "multiple-choice" ? cloze ? "完形填空" : "单句选择" : exercise.titleZh}</PinyinText></h1>
            <p>{exerciseId === "multiple-choice" ? cloze ? t("Cloze Reading") : t("Sentence Choice") : t(exercise.titleEn)}</p>
            <p className="exercise-meta"><PinyinText>{t(`${lesson.titleZh} · ${lesson.topicZh}`)}</PinyinText><br />{t(lesson.titleEn)} · {t(lesson.topicEn)}</p>
          </header>
          <nav className="exercise-tabs" aria-label={t("Exercise types")}>
            {exerciseTypes.map((item) => (
              <Link key={item.id} to={`/hsk/1/${lessonSlug}/exercises/${item.id}`}
                aria-current={item.id === exerciseId ? "page" : undefined}>
                {item.id === "multiple-choice" ? t(lessonNum >= CLOZE_START_LESSON ? "Cloze Reading" : "Sentence Choice") : t(item.titleEn)}
              </Link>
            ))}
          </nav>
          {!reading && !cloze && <p className="exercise-scope">{t("These extra exercises retain the original Vietnamese prompts and explanations. The HSK reading practice above supports English and Vietnamese feedback.")}</p>}
          {reading ? <HskReading key={lessonNum} lesson={getReadingLesson(lessonNum)} />
            : cloze ? <ClozePassage key={lessonNum} lessonNum={lessonNum} passage={getClozePassage(lessonNum)} /> : listening ? (
            <section className="exercise-panel">
              <h2>{t("听力即将更新 · Audio coming soon")}</h2>
              <p>{t("Listening exercises will be available when lesson recordings are added. Try the other exercise types while you wait.")}</p>
            </section>
          ) : loading ? <p className="exercise-panel" role="status">{t("加载中 · Loading exercises…")}</p>
            : error ? (
              <section className="exercise-panel" role="alert">
                <h2>{t("Unable to load exercises")}</h2>
                <p>{t("Please check your connection and try again.")}</p>
                <button className="exercise-button" type="button" onClick={retry}>{t("重试 · Retry")}</button>
              </section>
            ) : items.length === 0 ? (
              <section className="exercise-panel"><h2>{t("暂无练习 · No exercises available")}</h2><p>{t("This lesson does not yet contain this exercise type.")}</p></section>
            ) : exerciseId === "flashcards" ? <Flashcards key={sessionKey} cards={items} />
              : <Quiz key={sessionKey} items={items} multipleChoice={exerciseId === "multiple-choice"} />}
          <Link className="exercise-back" to={`/hsk/1/${lessonSlug}/exercises`}>{t("← 返回练习 · Back to Exercises")}</Link>
        </>
      )}
    </main>
  );
}
