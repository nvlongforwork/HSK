import { useState } from "react";
import { useLanguage } from "../i18n/useLanguage";
import { parseVocabulary } from "../utils/vocabulary";
import { getUnit1Visual, unit1ExampleMeanings } from "../data/unit1VocabularyVisuals";
import PinyinText from "./PinyinText";
import MarkdownRenderer from "./MarkdownRenderer";
import "./unit1-vocabulary.css";

function Illustration({ word, large = false }) {
  const { language, t } = useLanguage();
  const visual = getUnit1Visual(word);
  if (!visual) return <span className="vocabulary-no-image">{t("No illustration yet")}</span>;
  return (
    <span className={`vocabulary-illustration${large ? " large" : ""}`}>
      <span className="vocabulary-picture">
        <img src={visual.src} alt={visual.alt[language]} width="72" height="72" loading={large ? "eager" : "lazy"} />
        {visual.accentSrc && <img className="vocabulary-picture-accent" src={visual.accentSrc} alt="" width="32" height="32" aria-hidden="true" />}
      </span>
      {visual.hint && <span className="vocabulary-picture-hint">{visual.hint[language]}</span>}
    </span>
  );
}

export default function Unit1Vocabulary({ content }) {
  const { language, t } = useLanguage();
  const entries = parseVocabulary(content);
  const [mode, setMode] = useState("list");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  if (!entries.length) return <MarkdownRenderer content={content} />;
  const entry = entries[index];
  const exampleMeaning = unit1ExampleMeanings[entry.example]?.[language];

  function move(step) {
    setIndex((current) => Math.min(entries.length - 1, Math.max(0, current + step)));
    setFlipped(false);
  }

  function selectMode(next) {
    setMode(next);
    setFlipped(false);
  }

  function tabKeys(event) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === "Home" ? "list" : event.key === "End" ? "cards" : mode === "list" ? "cards" : "list";
    selectMode(next);
    document.getElementById(`vocabulary-tab-${next}`)?.focus();
  }

  return (
    <div className="unit1-vocabulary">
      <div className="vocabulary-mode-bar">
        <div role="tablist" className="vocabulary-modes" aria-label={t("Vocabulary study mode")} onKeyDown={tabKeys}>
          <button id="vocabulary-tab-list" type="button" role="tab" aria-selected={mode === "list"}
            aria-controls="vocabulary-panel-list" tabIndex={mode === "list" ? 0 : -1} onClick={() => selectMode("list")}>
            <PinyinText>词汇表</PinyinText><span>{t("Word list")}</span>
          </button>
          <button id="vocabulary-tab-cards" type="button" role="tab" aria-selected={mode === "cards"}
            aria-controls="vocabulary-panel-cards" tabIndex={mode === "cards" ? 0 : -1} onClick={() => selectMode("cards")}>
            <PinyinText>闪卡</PinyinText><span>{t("Flashcards")}</span>
          </button>
        </div>
        <span className="vocabulary-total">{entries.length} {t("words")}</span>
      </div>

      <section id="vocabulary-panel-list" role="tabpanel" aria-labelledby="vocabulary-tab-list" hidden={mode !== "list"}>
        <p className="vocabulary-table-hint">{t("Swipe the table to see all columns.")}</p>
        <div className="vocabulary-table-wrap" tabIndex={mode === "list" ? 0 : -1} role="region" aria-label={t("Unit 1 vocabulary table")}>
          <table className="vocabulary-table">
            <caption className="vocabulary-sr-only">{t("Unit 1 vocabulary with pictures and examples")}</caption>
            <thead><tr>
              <th scope="col">#</th><th scope="col">汉字</th><th scope="col">拼音</th>
              <th scope="col">{language === "vi" ? "Tiếng Việt" : "English"}</th>
              <th scope="col"><PinyinText>图片</PinyinText><span>{t("Image")}</span></th>
              <th scope="col"><PinyinText>例句</PinyinText><span>{t("Example")}</span></th>
            </tr></thead>
            <tbody>{entries.map((item, row) => (
              <tr key={`${item.word}-${row}`}>
                <td className="vocabulary-row-number">{row + 1}</td>
                <th scope="row" className="vocabulary-word" lang="zh-CN"><PinyinText>{item.word}</PinyinText></th>
                <td className="vocabulary-pinyin">{item.pinyin}</td>
                <td className="vocabulary-meaning" lang={language}>{t(item.meaning)}</td>
                <td className="vocabulary-image-cell"><Illustration word={item.word} /></td>
                <td className="vocabulary-example" lang="zh-CN"><PinyinText>{item.example || "—"}</PinyinText></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <section id="vocabulary-panel-cards" role="tabpanel" aria-labelledby="vocabulary-tab-cards" hidden={mode !== "cards"}>
        <p id="vocabulary-flip-help" className="vocabulary-flip-help">{t("Click the card to reveal the meaning, picture and example.")}</p>
        <p className="vocabulary-position" role="status">{t("Card")} {index + 1} / {entries.length}</p>
        <button className={`vocabulary-flashcard${flipped ? " is-flipped" : ""}`} type="button"
          aria-pressed={flipped} aria-describedby="vocabulary-flip-help"
          onClick={() => setFlipped((current) => !current)}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1);
            }
          }}>
          {flipped ? (
            <>
              <span className="vocabulary-back-meaning" lang={language}>{t(entry.meaning)}</span>
              <span className="vocabulary-card-pinyin">{entry.pinyin}</span>
              <Illustration word={entry.word} large />
              <span className="vocabulary-card-example" lang="zh-CN"><PinyinText>{entry.example || entry.word}</PinyinText></span>
              {exampleMeaning && <span className="vocabulary-card-translation" lang={language}>{exampleMeaning}</span>}
              <span className="vocabulary-flip-cue">{t("Click to see the Chinese word")}</span>
            </>
          ) : (
            <>
              <span className="vocabulary-front-word" lang="zh-CN">{entry.word}</span>
              <span className="vocabulary-flip-cue">{t("Tap to flip")}</span>
            </>
          )}
        </button>
        <div className="vocabulary-card-controls">
          <button type="button" disabled={index === 0} onClick={() => move(-1)}>← {t("Previous")}</button>
          <button type="button" className="vocabulary-flip-control" onClick={() => setFlipped((current) => !current)}>{t("Flip card")}</button>
          <button type="button" disabled={index === entries.length - 1} onClick={() => move(1)}>{t("Next")} →</button>
        </div>
        <button className="vocabulary-restart" type="button" onClick={() => { setIndex(0); setFlipped(false); }}>{t("Restart cards")}</button>
      </section>

      <p className="vocabulary-credits">{t("Illustrations")}: <a href="https://openmoji.org/" target="_blank" rel="noreferrer">OpenMoji</a> · <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer">CC BY-SA 4.0</a></p>
    </div>
  );
}
