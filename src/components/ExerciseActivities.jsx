import { useLanguage } from "../i18n/useLanguage";
import { useState } from "react";
import PinyinText from "./PinyinText";
import { isCorrectAnswer } from "../utils/exercises";

export function Quiz({ items, multipleChoice = false }) {
  const { t } = useLanguage();
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const scoreItems = items.filter((item) => !item.selfReview);
  const correct = (item, index) => multipleChoice
    ? item.options.find((option) => option.label === answers[index])?.correct === true
    : isCorrectAnswer(answers[index] || "", item.answer);
  const score = items.reduce((total, item, index) =>
    total + (!item.selfReview && correct(item, index) ? 1 : 0), 0);
  const answered = items.filter((_, index) => answers[index]?.trim()).length;

  function reset() { setAnswers({}); setChecked(false); }

  return (
    <form className="exercise-panel" onSubmit={(event) => { event.preventDefault(); setChecked(true); }}>
      <p className="exercise-instruction">
        <PinyinText>{t(multipleChoice ? "选择正确答案" : "用汉字填空")}</PinyinText>
        {t(multipleChoice ? " · Choose one answer for each question." : " · Type the missing Chinese characters.")}
      </p>
      <p className="exercise-meta">{answered} / {items.length}{t(" answered")}</p>
      {items.map((item, index) => {
        const feedbackId = `feedback-${index}`;
        return (
          <fieldset className="exercise-question" key={index}>
            <legend>{index + 1}. <PinyinText>{t(item.prompt)}</PinyinText></legend>
            {multipleChoice ? (
              <div className="exercise-options">
                {item.options.map((option) => (
                  <label key={option.label} className={`exercise-option${checked && option.correct ? " is-correct" : ""}${checked && answers[index] === option.label && !option.correct ? " is-incorrect" : ""}`}>
                    <input type="radio" name={`question-${index}`} value={option.label}
                      checked={answers[index] === option.label} disabled={checked}
                      aria-describedby={checked ? feedbackId : undefined}
                      onChange={() => setAnswers({ ...answers, [index]: option.label })} />
                    <span>{option.label}. <PinyinText>{t(option.text)}</PinyinText></span>
                  </label>
                ))}
              </div>
            ) : (
              <input className="exercise-input" aria-label={t(`Answer to question ${index + 1}`)}
                aria-describedby={checked ? feedbackId : undefined}
                lang="zh-CN" autoComplete="off" spellCheck={false}
                value={answers[index] || ""} disabled={checked}
                onChange={(event) => setAnswers({ ...answers, [index]: event.target.value })} />
            )}
            {item.selfReview && <p className="exercise-meta">{t("Open response / teacher review · Excluded from automatic scoring.")}</p>}
            {checked && (
              <>
                <p id={feedbackId} className={`exercise-feedback ${item.selfReview ? "" : correct(item, index) ? "text-correct" : "text-incorrect"}`}>
                  {t(item.selfReview ? "Review with your teacher. Model / note: " : correct(item, index) ? "✓ Correct! " : "Try this answer: ")}
                  <PinyinText>{t(multipleChoice
                    ? item.options.filter((option) => option.correct).map((option) => `${option.label}. ${option.text}`).join("")
                    : item.answer)}</PinyinText>
                </p>
                {item.explanation && (
                  <div className="exercise-explanation">
                    <PinyinText>{t(item.explanation)}</PinyinText>
                  </div>
                )}
              </>
            )}
          </fieldset>
        );
      })}
      <div className="exercise-result" role="status" aria-live="polite">
        {checked && <p>{t(scoreItems.length ? `Score: ${score} / ${scoreItems.length}` : "Ready for teacher review.")}</p>}
      </div>
      <div className="exercise-actions">
        {!checked ? <button className="exercise-button" disabled={answered !== items.length} type="submit">{t("检查答案 · Check answers")}</button>
          : <button className="exercise-button" type="button" onClick={reset}>{t("再试一次 · Try again")}</button>}
      </div>
    </form>
  );
}

export function Flashcards({ cards }) {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const card = cards[index];
  function move(step) {
    setIndex((value) => (value + step + cards.length) % cards.length);
    setFlipped(false);
  }
  return (
    <section className="exercise-panel" aria-label={t("Flashcard practice")}>
      <p className="exercise-instruction">{t("翻转卡片 · Tap the card to reveal its meaning.")}</p>
      <p className="exercise-meta" aria-live="polite">{t("Card ")}{index + 1} / {cards.length} · {known.length} / {cards.length}{t(" marked as learned")}</p>
      <button type="button" className="exercise-flashcard" aria-pressed={flipped}
        aria-label={t(flipped ? "Show Chinese word" : "Reveal pinyin and meaning")} onClick={() => setFlipped(!flipped)}>
        <span className="exercise-meta">{t(flipped ? "拼音 / Meaning" : "汉字 / Chinese")}</span>
        <span className={flipped ? "flashcard-back" : "flashcard-front"} lang="zh-CN"><PinyinText>{t(flipped ? card.back : card.front)}</PinyinText></span>
        <span className="exercise-meta">{t("点击翻转 · Tap to flip")}</span>
      </button>
      <div className="exercise-actions">
        <button type="button" className="exercise-button secondary" onClick={() => move(-1)}>{t("← Previous")}</button>
        <button type="button" className="exercise-button" aria-pressed={known.includes(index)}
          onClick={() => setKnown(known.includes(index) ? known.filter((value) => value !== index) : [...known, index])}>
          {t(known.includes(index) ? "✓ Learned · Undo" : "我会了 · Mark learned")}
        </button>
        <button type="button" className="exercise-button secondary" onClick={() => move(1)}>{t("Next →")}</button>
      </div>
      {known.length === cards.length && <p className="exercise-result" role="status">{t("太棒了！ · You have reviewed every card!")}</p>}
      <button className="exercise-reset" type="button" onClick={() => { setIndex(0); setKnown([]); setFlipped(false); }}>{t("Restart cards")}</button>
    </section>
  );
}
