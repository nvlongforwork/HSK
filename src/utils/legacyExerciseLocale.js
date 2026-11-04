import glosses from "../data/hsk1ExerciseGlosses.js";

const englishOptions = {
  "Bạn (một người)": "you (one person)",
  "Ông/bà (kính trọng)": "you (respectful)",
  "Các bạn (nhiều người)": "you (plural)",
  "Cảm ơn": "thank you",
  "Không có gì": "you're welcome",
  "Tạm biệt": "goodbye",
  "Xin chào": "hello",
};

export function displayLegacyOption(option, language) {
  return language === "en" ? englishOptions[option] || option : option;
}

function chineseContext(prompt) {
  const chunks = prompt.match(/[_一-鿿，。？！；：、\s]+/gu) || [];
  return chunks.map((part) => part.trim()).filter((part) => /[一-鿿]/u.test(part))
    .sort((a, b) => b.length - a.length)[0]?.trim() || "";
}

export function displayLegacyExercise(item, language, multipleChoice) {
  if (language === "vi") return { prompt: item.prompt, explanation: item.explanation };

  const answer = multipleChoice ? item.options.find((option) => option.correct)?.text : item.answer;
  const meaningQuestion = multipleChoice && /nghĩa là gì/i.test(item.prompt);
  if (meaningQuestion) {
    const context = chineseContext(item.prompt);
    return { prompt: `What does ${context} mean?`, explanation: `The answer is “${displayLegacyOption(answer, "en")}”.` };
  }
  const meaning = glosses[answer];
  const context = chineseContext(item.prompt);
  const task = multipleChoice ? "Choose the best Chinese answer" : "Write the missing Chinese characters";
  const cue = meaning ? ` (meaning: ${meaning})` : "";
  return {
    prompt: `${context ? `${context} — ` : ""}${task}${cue}.`,
    explanation: meaning ? `${answer} means “${meaning}”.` : "Check the completed Chinese expression against the lesson examples.",
  };
}
