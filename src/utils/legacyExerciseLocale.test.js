import test from "node:test";
import assert from "node:assert/strict";
import { displayLegacyExercise, displayLegacyOption } from "./legacyExerciseLocale.js";

test("supplementary writing cues and feedback follow the selected language", () => {
  const item = { prompt: 'Viết từ có nghĩa là "bạn" (chỉ một người)', answer: "你", explanation: "你 nghĩa là bạn." };
  assert.deepEqual(displayLegacyExercise(item, "vi", false), { prompt: item.prompt, explanation: item.explanation });
  const english = displayLegacyExercise(item, "en", false);
  assert.match(english.prompt, /Write the missing Chinese characters.*meaning: you/);
  assert.equal(english.explanation, "你 means “you”.");
});

test("English meaning questions translate every option and its answer", () => {
  const item = { prompt: '"你们" nghĩa là gì?', options: [
    { text: "Bạn (một người)", correct: false }, { text: "Các bạn (nhiều người)", correct: true },
  ] };
  assert.equal(displayLegacyExercise(item, "en", true).prompt, "What does 你们 mean?");
  assert.equal(displayLegacyOption(item.options[1].text, "en"), "you (plural)");
  assert.equal(displayLegacyOption(item.options[1].text, "vi"), "Các bạn (nhiều người)");
});
