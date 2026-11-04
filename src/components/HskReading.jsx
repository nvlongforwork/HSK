import { useState } from "react";
import { useLanguage } from "../i18n/useLanguage";
import pinyinMap from "../data/pinyin";
import { readingSections } from "../data/hsk1Reading";

// Ruby is visible on touch screens as well as desktops. A few common words
// need word-level readings instead of a character's default reading.
const readings = {
  "什么": "shén me", "名字": "míng zi", "儿子": "ér zi", "女儿": "nǚ ér",
  "衣服": "yī fu", "东西": "dōng xi", "先生": "xiān sheng", "漂亮": "piào liang",
  "中国": "zhōng guó", "一个": "yí ge", "不会": "bú huì", "不客气": "bú kè qi",
  "不少": "bù shǎo", "对不起": "duì bu qǐ", "没关系": "méi guān xi",
  "怎么样": "zěn me yàng", "哪儿": "nǎr", "这儿": "zhèr", "那儿": "nàr",
};
const sortedWords = Object.keys(readings).sort((a, b) => b.length - a.length);

export function VisiblePinyin({ children }) {
  const output = [];
  for (let i = 0; i < children.length;) {
    const word = sortedWords.find((candidate) => children.startsWith(candidate, i));
    if (word) {
      output.push(<ruby key={i}>{word}<rt>{readings[word]}</rt></ruby>);
      i += word.length;
    } else {
      const char = children[i];
      output.push(pinyinMap[char] ? <ruby key={i}>{char}<rt>{pinyinMap[char]}</rt></ruby> : <span key={i}>{char}</span>);
      i += 1;
    }
  }
  return <span lang="zh-CN" className="hsk-ruby">{output}</span>;
}

function AnswerOptions({ choices, name, selected, checked, correctIndex, onSelect }) {
  return <div className="exercise-options hsk-options">{choices.map((choice, index) => (
    <label key={index} className={`exercise-option${checked && index === correctIndex ? " is-correct" : ""}${checked && selected === index && index !== correctIndex ? " is-incorrect" : ""}`}>
      <input type="radio" name={name} checked={selected === index} disabled={checked} onChange={() => onSelect(index)} />
      <span>{String.fromCharCode(65 + index)}. <VisiblePinyin>{choice}</VisiblePinyin></span>
    </label>
  ))}</div>;
}

export default function HskReading({ lesson }) {
  const { language } = useLanguage();
  const vi = language === "vi";
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const groups = readingSections.map((section) => ({ ...section, items: lesson[section.id] }));
  const total = groups.reduce((count, group) => count + group.items.length, 0);
  const answered = Object.keys(answers).length;
  let score = 0;
  for (const group of groups) group.items.forEach((item, index) => {
    const target = group.id === "judge" ? Number(item[2]) : group.id === "fill" ? item[1] : index;
    if (answers[`${group.id}-${index}`] === target) score += 1;
  });

  return <form className="exercise-panel hsk-reading" onSubmit={(event) => { event.preventDefault(); setChecked(true); }}>
    <p className="exercise-instruction">{vi
      ? "Đọc câu tiếng Trung, chọn đáp án rồi kiểm tra để xem phản hồi. Phiên âm luôn hiển thị trên mỗi chữ."
      : "Read the Chinese, choose an answer, then check your work. Pinyin is shown above the characters."}</p>
    <p className="exercise-meta">{answered} / {total} {vi ? "câu đã làm" : "answered"}</p>
    <p className="exercise-scope">{vi
      ? "Luyện đọc theo dạng HSK 1 cũ. Bài đọc đối chiếu câu thay cho câu hỏi có tranh; phần nghe sẽ bổ sung khi có bản ghi âm từng câu. Đây là bài luyện theo từng bài học, không phải đề thi thử."
      : "Old HSK 1 style reading practice. Sentence comparison stands in for picture questions; listening needs sentence recordings. These are lesson drills, not a mock exam."}</p>
    {groups.map((group) => <section key={group.id} className="hsk-reading-section" aria-labelledby={`hsk-${group.id}`}>
      <h2 id={`hsk-${group.id}`}><VisiblePinyin>{group.zh}</VisiblePinyin> <span>{vi ? group.vi : group.en}</span></h2>
      <p className="exercise-instruction">{{
        judge: vi ? "Hai câu có cùng nội dung không?" : "Do the two sentences say the same thing?",
        match: vi ? "Chọn câu đáp phù hợp với lời nói." : "Choose the fitting response.",
        reply: vi ? "Ghép câu hỏi với câu trả lời phù hợp." : "Match each question with its answer.",
        fill: vi ? "Chọn một từ từ ngân hàng từ để điền vào chỗ trống." : "Choose a word from the word bank for each blank.",
      }[group.id]}</p>
      {group.id !== "judge" && <div className="hsk-word-bank" aria-label={vi ? "Ngân hàng đáp án" : "Answer bank"}>
        <strong>{vi ? "Ngân hàng đáp án:" : "Answer bank:"}</strong>
        {(group.id === "fill" ? lesson.bank : [group.items[0][1][0], group.items[1][1][0], group.items[0][1][2]])
          .map((word, index) => <span key={index}>{String.fromCharCode(65 + index)}. <VisiblePinyin>{word}</VisiblePinyin></span>)}
      </div>}
      {group.items.map((item, index) => {
        const key = `${group.id}-${index}`;
        const correctIndex = group.id === "judge" ? Number(item[2]) : group.id === "fill" ? item[1] : index;
        const choices = group.id === "judge" ? [vi ? "Không đúng" : "Different", vi ? "Đúng" : "Same"]
          : group.id === "fill" ? lesson.bank : [group.items[0][1][0], group.items[1][1][0], group.items[0][1][2]];
        const answer = group.id === "judge" ? choices[correctIndex] : choices[correctIndex];
        return <fieldset className="exercise-question" key={key}>
          <legend>{index + 1}. <VisiblePinyin>{item[0]}</VisiblePinyin>
            {group.id === "judge" && <span className="hsk-compare"><VisiblePinyin>{item[1]}</VisiblePinyin></span>}
          </legend>
          <AnswerOptions choices={choices} name={key} selected={answers[key]} checked={checked}
            correctIndex={correctIndex} onSelect={(value) => setAnswers({ ...answers, [key]: value })} />
          {checked && <p className={`exercise-feedback ${answers[key] === correctIndex ? "text-correct" : "text-incorrect"}`}>
            {answers[key] === correctIndex ? (vi ? "✓ Đúng. " : "✓ Correct. ") : (vi ? "Đáp án: " : "Answer: ")}
            {group.id === "judge" ? answer : <VisiblePinyin>{answer}</VisiblePinyin>}
          </p>}
        </fieldset>;
      })}
    </section>)}
    <div className="exercise-result" role="status" aria-live="polite">{checked && (vi ? `Kết quả: ${score} / ${total}` : `Score: ${score} / ${total}`)}</div>
    {checked && <p className="exercise-explanation"><strong>{vi ? "Ghi nhớ: " : "Remember: "}</strong>{lesson.tip[language]}</p>}
    <div className="exercise-actions">{checked
      ? <button className="exercise-button" type="button" onClick={() => { setAnswers({}); setChecked(false); }}>
          {vi ? "Làm lại" : "Try again"}</button>
      : <button className="exercise-button" type="submit" disabled={answered !== total}>{vi ? "Kiểm tra đáp án" : "Check answers"}</button>}</div>
  </form>;
}
