import { useState } from "react";
import { useLanguage } from "../i18n/useLanguage";
import { VisiblePinyin } from "./HskReading";

export default function ClozePassage({ passage, lessonNum }) {
  const { language } = useLanguage();
  const vi = language === "vi";
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const count = passage.questions.length;
  const score = passage.questions.reduce((total, item, index) => total + (answers[index] === item.correct ? 1 : 0), 0);
  const parts = passage.text.split(/\{(\d+)\}/g);

  return <form className="exercise-panel cloze-panel" onSubmit={(event) => { event.preventDefault(); setChecked(true); }}>
    <p className="exercise-instruction">{vi
      ? "Đọc toàn bộ đoạn văn trước, rồi chọn một đáp án cho mỗi chỗ trống."
      : "Read the whole passage first, then choose one answer for each blank."}</p>
    <p className="exercise-scope">{vi
      ? `Bài ${lessonNum}: luyện đọc cloze mở rộng. HSK 1 cũ chọn từ điền vào câu đơn; đoạn văn này dùng để củng cố kiến thức, không phải dạng đề thi thật.`
      : `Lesson ${lessonNum}: extended cloze reading. Old HSK 1 selects words for individual sentences; this passage consolidates lesson knowledge and is not an official exam item.`}</p>
    <div className="cloze-layout">
      <section className="cloze-passage" aria-label={vi ? "Đoạn văn" : "Reading passage"}>
        <h2>{vi ? "Đọc đoạn văn" : "Reading passage"}</h2>
        <p>{parts.map((part, index) => index % 2
          ? <a key={index} className="cloze-gap" href={`#cloze-question-${part}`} aria-label={vi ? `Chỗ trống số ${part}` : `Blank ${part}`}>
              ({part}) {checked ? <VisiblePinyin>{passage.questions[Number(part) - 1].options[passage.questions[Number(part) - 1].correct]}</VisiblePinyin> : "____"}
            </a>
          : <VisiblePinyin key={index}>{part}</VisiblePinyin>)}</p>
      </section>
      <div className="cloze-questions">
        <p className="exercise-meta">{Object.keys(answers).length} / {count} {vi ? "câu đã làm" : "answered"}</p>
        {passage.questions.map((item, index) => (
          <fieldset id={`cloze-question-${index + 1}`} className="exercise-question" key={index}>
            <legend>{vi ? `Chỗ trống ${index + 1}` : `Blank ${index + 1}`}</legend>
            <div className="exercise-options cloze-options">
              {item.options.map((option, optionIndex) => <label key={optionIndex}
                className={`exercise-option${checked && optionIndex === item.correct ? " is-correct" : ""}${checked && answers[index] === optionIndex && optionIndex !== item.correct ? " is-incorrect" : ""}`}>
                <input type="radio" name={`cloze-${index}`} checked={answers[index] === optionIndex} disabled={checked}
                  onChange={() => setAnswers({ ...answers, [index]: optionIndex })} />
                <span>{String.fromCharCode(65 + optionIndex)}. <VisiblePinyin>{option}</VisiblePinyin></span>
              </label>)}
            </div>
            {checked && <div className={`exercise-feedback ${answers[index] === item.correct ? "text-correct" : "text-incorrect"}`}>
              <p>{answers[index] === item.correct ? (vi ? "✓ Đúng" : "✓ Correct") : (vi ? "Đáp án đúng:" : "Correct answer:")} <VisiblePinyin>{item.options[item.correct]}</VisiblePinyin></p>
              <p className="exercise-explanation">{item.explanation[language]}</p>
            </div>}
          </fieldset>
        ))}
      </div>
    </div>
    <div className="exercise-result" role="status" aria-live="polite">{checked && (vi ? `Kết quả: ${score} / ${count}` : `Score: ${score} / ${count}`)}</div>
    <div className="exercise-actions">{checked
      ? <button className="exercise-button" type="button" onClick={() => { setAnswers({}); setChecked(false); }}>
          {vi ? "Làm lại" : "Try again"}</button>
      : <button className="exercise-button" type="submit" disabled={Object.keys(answers).length !== count}>
          {vi ? "Kiểm tra đáp án" : "Check answers"}</button>}</div>
  </form>;
}
