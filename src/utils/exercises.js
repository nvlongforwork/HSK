// Lesson Markdown remains the single source of exercise content.
export function parseExercises(markdown = "") {
  const result = { multipleChoice: [], fillIn: [], flashcards: [] };
  let section = "";
  let question = null;
  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();
    const heading = line.match(/^#{1,6}\s+(.+)/);
    if (heading) {
      section = heading[1].trim().toLowerCase();
      question = null;
      continue;
    }
    if (section === "multiple choice") {
      const prompt = line.match(/^\d+\.\s+(.+)/);
      const option = line.match(/^-\s+([A-Z])[).]\s+(.+)/);
      if (prompt) {
        question = { prompt: prompt[1], options: [] };
        result.multipleChoice.push(question);
      } else if (option && question) {
        question.options.push({ label: option[1],
          text: option[2].replace(/\s*[✓✔]\s*/g, "").trim(),
          correct: /[✓✔]/.test(option[2]) });
      }
    } else if (section === "fill in the blanks") {
      const item = line.match(/^\d+\.\s+(.+?)\s*→\s*(.+)$/);
      if (item) result.fillIn.push({ prompt: item[1], answer: item[2].trim(),
        selfReview: /\[|\breorder\s*:/i.test(item[2]) });
    } else if (section === "flashcards" && line.startsWith("|")) {
      const cells = line.replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
      if (cells.length === 2 && cells.every(Boolean) &&
          !cells.every((cell) => /^:?-+:?$/.test(cell)) && cells[0].toLowerCase() !== "front") {
        result.flashcards.push({ front: cells[0], back: cells[1] });
      }
    }
  }
  result.multipleChoice = result.multipleChoice.filter((item) =>
    item.options.length >= 2 && item.options.filter((option) => option.correct).length === 1);
  return result;
}

export function normalizeAnswer(value) {
  // Permit IME width variants, whitespace and sentence punctuation, keeping tones and script.
  return value.normalize("NFKC").replace(/[\s\p{P}]/gu, "").toLowerCase();
}

export function isCorrectAnswer(value, expected) {
  const normalized = normalizeAnswer(value);
  return normalized.length > 0 && normalized === normalizeAnswer(expected);
}
