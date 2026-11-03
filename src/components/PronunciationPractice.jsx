import { useEffect, useState } from "react";
import { useLanguage } from "../i18n/useLanguage";
import { SpeakerIcon } from "./AudioButton";
import "./pronunciation-practice.css";

const item = (answer, pinyin, other, otherPinyin) => ({ answer, pinyin, other, otherPinyin });

// All prompts use words or short phrases from the HSK 1 lessons. Only the
// character choices are shown until the learner has listened and answered.
const questions = {
  1: [item("八", "bā", "爸", "bà"), item("十", "shí", "是", "shì")],
  2: [item("妈妈", "māma", "马", "mǎ"), item("爸爸", "bàba", "八", "bā")],
  3: [item("七", "qī", "吃", "chī"), item("不是", "bú shì", "不吃", "bù chī")],
  4: [item("书", "shū", "十", "shí"), item("是老师", "shì lǎoshī", "是学生", "shì xuésheng")],
  5: [item("女儿", "nǚ'ér", "儿子", "érzi"), item("一个", "yí ge", "一杯", "yì bēi")],
  6: [item("今天", "jīntiān", "今年", "jīnnián"), item("吃饭", "chīfàn", "吃菜", "chīcài")],
  7: [item("明天", "míngtiān", "昨天", "zuótiān"), item("星期三", "xīngqī sān", "星期四", "xīngqī sì")],
  8: [item("米饭", "mǐfàn", "面条", "miàntiáo"), item("苹果", "píngguǒ", "水果", "shuǐguǒ")],
  9: [item("电话", "diànhuà", "电脑", "diànnǎo"), item("电视", "diànshì", "电影", "diànyǐng")],
  10: [item("妈妈", "māma", "马", "mǎ"), item("杯子", "bēizi", "杯", "bēi")],
  11: [item("什么", "shénme", "谁", "shéi"), item("我们", "wǒmen", "我", "wǒ")],
  12: [item("星期五", "xīngqī wǔ", "星期六", "xīngqī liù"), item("吃苹果", "chī píngguǒ", "吃米饭", "chī mǐfàn")],
  13: [item("明天来", "míngtiān lái", "明天见", "míngtiān jiàn"), item("来中国", "lái Zhōngguó", "来学校", "lái xuéxiào")],
  14: [item("我买书", "wǒ mǎi shū", "你买书", "nǐ mǎi shū"), item("你是谁", "nǐ shì shéi", "我是谁", "wǒ shì shéi")],
  15: [item("坐飞机", "zuò fēijī", "坐火车", "zuò huǒchē"), item("看电影", "kàn diànyǐng", "看电视", "kàn diànshì")],
};

function mandarinVoice(voices) {
  return voices.find((v) => /^zh[-_]CN$/i.test(v.lang))
    || voices.find((v) => /^(zh[-_]Hans|cmn[-_])/i.test(v.lang))
    || voices.find((v) => /^zh[-_]/i.test(v.lang) && !/[-_](HK|MO)$/i.test(v.lang))
    || null;
}

export default function PronunciationPractice({ lessonNum }) {
  const { t } = useLanguage();
  const [voice, setVoice] = useState(null);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [heard, setHeard] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const speech = typeof window !== "undefined" ? window.speechSynthesis : null;
  const list = questions[lessonNum];

  useEffect(() => {
    if (!speech) return;
    const refresh = () => setVoice(mandarinVoice(speech.getVoices()));
    refresh();
    speech.addEventListener("voiceschanged", refresh);
    return () => {
      speech.removeEventListener("voiceschanged", refresh);
      speech.cancel();
    };
  }, [speech]);

  if (!list) return null;
  const current = list[index];
  const options = index % 2 ? [current.other, current.answer] : [current.answer, current.other];

  function play() {
    if (!voice || failed) return;
    speech.cancel();
    const utterance = new SpeechSynthesisUtterance(current.answer);
    utterance.voice = voice;
    utterance.lang = voice.lang;
    utterance.rate = 0.85;
    utterance.onstart = () => { setPlaying(true); setHeard(true); };
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => { setPlaying(false); setFailed(true); };
    speech.speak(utterance);
  }

  function next() {
    speech?.cancel();
    setPlaying(false);
    setHeard(false);
    setSelected(null);
    setIndex((value) => (value + 1) % list.length);
  }

  return (
    <section className="pronunciation-practice" aria-label={t("Listening check")}>
      <h3>{t("Listening check")}</h3>
      <p>{t("Listen to the Mandarin voice installed on your device, then choose what you heard. Replay as needed.")}</p>
      {!voice || failed ? (
        <p className="pronunciation-practice-unavailable" role="status">
          {t("A Mandarin voice is not available on this device. Enable a Chinese voice in your system settings to use this listening activity.")}
        </p>
      ) : (
        <>
          <div className="pronunciation-practice-toolbar">
            <span>{t("Question")} {index + 1}/{list.length}</span>
            <button type="button" onClick={play} aria-label={t("Play the phrase again")}>
              <SpeakerIcon size="26" playing={playing} />
              {t(heard ? "Replay" : "Listen")}
            </button>
          </div>
          <div className="pronunciation-practice-options">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                lang="zh-CN"
                disabled={!heard || selected !== null}
                onClick={() => setSelected(option)}
                className={selected !== null ? option === current.answer ? "correct" : option === selected ? "incorrect" : "" : ""}
              >
                {option}
              </button>
            ))}
          </div>
          {selected !== null && (
            <div className="pronunciation-practice-feedback" role="status">
              <strong>{t(selected === current.answer ? "Correct!" : "Listen once more and compare.")}</strong>
              <span>{current.answer} · {current.pinyin}</span>
              <span>{current.other} · {current.otherPinyin}</span>
              <button type="button" onClick={next}>{t(index === list.length - 1 ? "Practice again" : "Next question")}</button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
