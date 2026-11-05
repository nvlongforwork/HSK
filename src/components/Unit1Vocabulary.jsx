import { useState, useCallback } from "react";
import { useLanguage } from "../i18n/useLanguage";
import { parseVocabulary } from "../utils/vocabulary";
import { unit1ExampleMeanings } from "../data/unit1ExampleMeanings";
import PinyinText from "./PinyinText";
import AudioButton, { useAudioPlayer, SpeakerIcon } from "./AudioButton";
import MarkdownRenderer from "./MarkdownRenderer";
import useMandarinVoice from "../hooks/useMandarinVoice";
import { getVocabularyRecordingUrl } from "../data/hsk1AudioWords";
import { getUnit1VocabularyImage } from "../data/unit1VocabularyImages";
import "./unit1-vocabulary.css";

export default function Unit1Vocabulary({ content }) {
  const { language, t } = useLanguage();
  const entries = parseVocabulary(content);
  const [mode, setMode] = useState("list");

  const [deck, setDeck] = useState(() => entries.map((_, i) => i));
  const [deckIndex, setDeckIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(() => new Set());
  const [round, setRound] = useState(1);
  const [completed, setCompleted] = useState(false);

  const currentEntryIndex = deck[deckIndex];
  const entry = entries[currentEntryIndex] || entries[0];
  const exampleMeaning = unit1ExampleMeanings[entry?.example]?.[language];

  const voice = useMandarinVoice();
  const audioSrc = entry ? getVocabularyRecordingUrl(entry.word) : null;
  const { play: playAudio } = useAudioPlayer(audioSrc, entry?.word, voice);

  function selectMode(next) {
    setMode(next);
    if (next === "cards") {
      setDeck(entries.map((_, i) => i));
      setDeckIndex(0);
      setFlipped(false);
      setKnown(new Set());
      setRound(1);
      setCompleted(false);
    }
  }

  const handleFlip = useCallback(() => {
    setFlipped((current) => {
      const next = !current;
      if (next) playAudio();
      return next;
    });
  }, [playAudio]);

  if (!entries.length) return <MarkdownRenderer content={content} />;

  function handleKnown() {
    const newKnown = new Set(known);
    newKnown.add(currentEntryIndex);
    setKnown(newKnown);
    advanceCard(newKnown);
  }

  function handleAgain() {
    advanceCard(known);
  }

  function advanceCard(currentKnown) {
    const nextIndex = deckIndex + 1;
    if (nextIndex < deck.length) {
      setDeckIndex(nextIndex);
      setFlipped(false);
    } else {
      const remaining = deck.filter((i) => !currentKnown.has(i));
      if (remaining.length === 0) {
        setCompleted(true);
      } else {
        setDeck(remaining);
        setDeckIndex(0);
        setFlipped(false);
        setRound((r) => r + 1);
      }
    }
  }

  function restartCards() {
    setDeck(entries.map((_, i) => i));
    setDeckIndex(0);
    setFlipped(false);
    setKnown(new Set());
    setRound(1);
    setCompleted(false);
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
            <caption className="vocabulary-sr-only">{t("Unit 1 vocabulary list")}</caption>
            <thead><tr>
              <th scope="col">#</th>
              <th scope="col" className="vocabulary-audio-col"><SpeakerIcon size="22" /></th>
              <th scope="col">汉字</th><th scope="col">拼音</th>
              <th scope="col">{language === "vi" ? "Tiếng Việt" : "English"}</th>
              <th scope="col"><PinyinText>图片</PinyinText><span>{t("Image")}</span></th>
              <th scope="col"><PinyinText>例句</PinyinText><span>{t("Example")}</span></th>
            </tr></thead>
            <tbody>{entries.map((item, row) => (
              <tr key={`${item.word}-${row}`}>
                <td className="vocabulary-row-number">{row + 1}</td>
                <td className="vocabulary-audio-cell">
                  <AudioButton src={getVocabularyRecordingUrl(item.word)} text={item.word} voice={voice} />
                </td>
                <th scope="row" className="vocabulary-word" lang="zh-CN"><PinyinText>{item.word}</PinyinText></th>
                <td className="vocabulary-pinyin">{item.pinyin}</td>
                <td className="vocabulary-meaning" lang={language}>{t(item.meaning)}</td>
                <td className="vocabulary-image-cell">
                  {getUnit1VocabularyImage(item.word) && <img src={getUnit1VocabularyImage(item.word)} alt="" loading="lazy" width="126" height="92" />}
                </td>
                <td className="vocabulary-example" lang="zh-CN"><PinyinText>{item.example || "—"}</PinyinText></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <section id="vocabulary-panel-cards" role="tabpanel" aria-labelledby="vocabulary-tab-cards" hidden={mode !== "cards"}>
        {completed ? (
          <div className="vocabulary-completed">
            <span className="vocabulary-completed-icon">🎉</span>
            <h3 className="vocabulary-completed-title">
              <PinyinText>太棒了</PinyinText>{t("! Excellent!")}
            </h3>
            <p className="vocabulary-completed-desc">
              <PinyinText>你已经掌握了所有词汇</PinyinText>
              <br />{t("You have mastered all the vocabulary!")}
            </p>
            <p className="vocabulary-completed-stats">
              {entries.length} {t("words")} &middot; {round} {round === 1 ? t("round") : t("rounds")}
            </p>
            <button type="button" className="vocabulary-restart-btn" onClick={restartCards}>
              <PinyinText>再练一次</PinyinText> {t("Practice again")}
            </button>
          </div>
        ) : (
          <>
            <div className="vocabulary-progress-bar">
              <div className="vocabulary-progress-info">
                <span><PinyinText>第</PinyinText>{round}<PinyinText>轮</PinyinText> {t("Round")} {round}</span>
                <span>{known.size} / {entries.length} <PinyinText>已掌握</PinyinText> {t("mastered")}</span>
              </div>
              <div className="vocabulary-progress-track">
                <div className="vocabulary-progress-fill" style={{ width: `${(known.size / entries.length) * 100}%` }} />
              </div>
              <p className="vocabulary-position" role="status">
                {t("Card")} {deckIndex + 1} / {deck.length}
                {deck.length < entries.length && <span> ({deck.length} <PinyinText>需要复习</PinyinText> {t("to review")})</span>}
              </p>
            </div>

            <div className="vocabulary-card-scene">
              <button className={`vocabulary-flashcard${flipped ? " is-flipped" : ""}`} type="button"
                aria-pressed={flipped}
                onClick={handleFlip}>
                <span key={`${entry.word}-${currentEntryIndex}-${round}`} className="vocabulary-card-rotator">
                  <span className="vocabulary-card-face vocabulary-card-front" aria-hidden={flipped} inert={flipped}>
                    {getUnit1VocabularyImage(entry.word) && <img className="vocabulary-card-image" src={getUnit1VocabularyImage(entry.word)} alt={entry.word} width="453" height="326" />}
                    <span className="vocabulary-flip-cue">{t("Tap to flip")}</span>
                  </span>
                  <span className="vocabulary-card-face vocabulary-card-back" aria-hidden={!flipped} inert={!flipped}>
                    <span className="vocabulary-back-word" lang="zh-CN">{entry.word}</span>
                    <span className="vocabulary-back-meaning" lang={language}>{t(entry.meaning)}</span>
                    <span className="vocabulary-card-pinyin">{entry.pinyin}</span>
                    <span className="vocabulary-card-example" lang="zh-CN">{entry.example || entry.word}</span>
                    {exampleMeaning && <span className="vocabulary-card-translation" lang={language}>{exampleMeaning}</span>}
                    <span className="vocabulary-card-audio">
                      <AudioButton src={audioSrc} text={entry.word} voice={voice} size="32px" />
                    </span>
                  </span>
                </span>
              </button>
            </div>

            {flipped ? (
              <div className="vocabulary-judge-controls">
                <button type="button" className="vocabulary-btn-again" onClick={handleAgain}>
                  <span className="vocabulary-btn-icon">🔄</span>
                  <PinyinText>学习</PinyinText> {t("Study again")}
                </button>
                <button type="button" className="vocabulary-btn-known" onClick={handleKnown}>
                  <span className="vocabulary-btn-icon">✓</span>
                  <PinyinText>已掌握</PinyinText> {t("Got it")}
                </button>
              </div>
            ) : (
              <div className="vocabulary-card-controls">
                <button type="button" className="vocabulary-flip-control" onClick={handleFlip}>
                  <PinyinText>翻转卡片</PinyinText> {t("Flip card")}
                </button>
              </div>
            )}

            <button className="vocabulary-restart" type="button" onClick={restartCards}>
              <PinyinText>重新开始</PinyinText> {t("Restart")}
            </button>
          </>
        )}
      </section>
    </div>
  );
}
