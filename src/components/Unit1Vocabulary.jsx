import { useState, useCallback } from "react";
import { useLanguage } from "../i18n/useLanguage";
import { parseVocabulary } from "../utils/vocabulary";
import { unit1ExampleMeanings } from "../data/unit1ExampleMeanings";
import PinyinText from "./PinyinText";
import AudioButton, { stripTones, useAudioPlayer, SpeakerIcon } from "./AudioButton";
import MarkdownRenderer from "./MarkdownRenderer";
import "./unit1-vocabulary.css";

export default function Unit1Vocabulary({ content, audioBaseUrl }) {
  const { language, t } = useLanguage();
  const entries = parseVocabulary(content);
  const [mode, setMode] = useState("list");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  if (!entries.length) return <MarkdownRenderer content={content} />;
  const entry = entries[index];
  const exampleMeaning = unit1ExampleMeanings[entry.example]?.[language];

  const audioSrc = audioBaseUrl ? `${audioBaseUrl}/${stripTones(entry.pinyin)}.mp3` : null;
  const { play: playAudio } = useAudioPlayer(audioSrc);

  function move(step) {
    setIndex((current) => Math.min(entries.length - 1, Math.max(0, current + step)));
    setFlipped(false);
  }

  function selectMode(next) {
    setMode(next);
    setFlipped(false);
  }

  const handleFlip = useCallback(() => {
    setFlipped((current) => {
      const next = !current;
      if (next && audioSrc) playAudio();
      return next;
    });
  }, [audioSrc, playAudio]);

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
            <caption className="vocabulary-sr-only">{t("Unit 1 vocabulary list")}</caption>
            <thead><tr>
              <th scope="col">#</th>
              {audioBaseUrl && <th scope="col" className="vocabulary-audio-col"><SpeakerIcon size="22" /></th>}
              <th scope="col">汉字</th><th scope="col">拼音</th>
              <th scope="col">{language === "vi" ? "Tiếng Việt" : "English"}</th>
              <th scope="col"><PinyinText>例句</PinyinText><span>{t("Example")}</span></th>
            </tr></thead>
            <tbody>{entries.map((item, row) => (
              <tr key={`${item.word}-${row}`}>
                <td className="vocabulary-row-number">{row + 1}</td>
                {audioBaseUrl && (
                  <td className="vocabulary-audio-cell">
                    <AudioButton src={`${audioBaseUrl}/${stripTones(item.pinyin)}.mp3`} />
                  </td>
                )}
                <th scope="row" className="vocabulary-word" lang="zh-CN"><PinyinText>{item.word}</PinyinText></th>
                <td className="vocabulary-pinyin">{item.pinyin}</td>
                <td className="vocabulary-meaning" lang={language}>{t(item.meaning)}</td>
                <td className="vocabulary-example" lang="zh-CN"><PinyinText>{item.example || "—"}</PinyinText></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <section id="vocabulary-panel-cards" role="tabpanel" aria-labelledby="vocabulary-tab-cards" hidden={mode !== "cards"}>
        <p id="vocabulary-flip-help" className="vocabulary-flip-help">{t("Click the card to reveal the meaning and example.")}</p>
        <p className="vocabulary-position" role="status">{t("Card")} {index + 1} / {entries.length}</p>
        <div className="vocabulary-card-scene">
          <button className={`vocabulary-flashcard${flipped ? " is-flipped" : ""}`} type="button"
            aria-pressed={flipped} aria-describedby="vocabulary-flip-help"
            onClick={handleFlip}
            onKeyDown={(event) => {
              if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                event.preventDefault(); move(event.key === "ArrowLeft" ? -1 : 1);
              }
            }}>
            <span key={`${entry.word}-${index}`} className="vocabulary-card-rotator">
              <span className="vocabulary-card-face vocabulary-card-front" aria-hidden={flipped} inert={flipped}>
                <span className="vocabulary-front-word" lang="zh-CN">{entry.word}</span>
                {audioBaseUrl && (
                  <span className="vocabulary-card-audio">
                    <AudioButton src={`${audioBaseUrl}/${stripTones(entry.pinyin)}.mp3`} size="24px" />
                  </span>
                )}
                <span className="vocabulary-flip-cue">{t("Tap to flip")}</span>
              </span>
              <span className="vocabulary-card-face vocabulary-card-back" aria-hidden={!flipped} inert={!flipped}>
                <span className="vocabulary-back-meaning" lang={language}>{t(entry.meaning)}</span>
                <span className="vocabulary-card-pinyin">{entry.pinyin}</span>
                <span className="vocabulary-card-example" lang="zh-CN">{entry.example || entry.word}</span>
                {exampleMeaning && <span className="vocabulary-card-translation" lang={language}>{exampleMeaning}</span>}
                <span className="vocabulary-flip-cue">{t("Click to see the Chinese word")}</span>
              </span>
            </span>
          </button>
        </div>
        <div className="vocabulary-card-controls">
          <button type="button" disabled={index === 0} onClick={() => move(-1)}>← {t("Previous")}</button>
          <button type="button" className="vocabulary-flip-control" onClick={handleFlip}>{t("Flip card")}</button>
          <button type="button" disabled={index === entries.length - 1} onClick={() => move(1)}>{t("Next")} →</button>
        </div>
        <button className="vocabulary-restart" type="button" onClick={() => { setIndex(0); setFlipped(false); }}>{t("Restart cards")}</button>
      </section>


    </div>
  );
}
