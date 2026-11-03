import test from "node:test";
import assert from "node:assert/strict";
import { CLOZE_START_LESSON, getClozePassage } from "../data/hsk1Cloze.js";
import pinyinMap from "../data/pinyin.js";

test("cloze starts with a short passage in lesson 7 and grows from lesson 9", () => {
  assert.equal(CLOZE_START_LESSON, 7);
  for (let n = 1; n < 7; n++) assert.equal(getClozePassage(n), null);
  assert.equal(getClozePassage(16), null);
  for (let n = 7; n <= 15; n++) {
    const passage = getClozePassage(n);
    assert.equal(passage.questions.length, n <= 8 ? 3 : 5, `lesson ${n}`);
    const gaps = [...passage.text.matchAll(/\{(\d+)\}/g)].map((match) => Number(match[1]));
    assert.deepEqual(gaps, passage.questions.map((_, i) => i + 1), `lesson ${n} blanks`);
    for (const item of passage.questions) {
      assert.equal(item.options.length, 4);
      assert.equal(new Set(item.options).size, 4, `lesson ${n} distinct options`);
      assert.ok(item.correct >= 0 && item.correct < 4);
      assert.ok(item.explanation.en && item.explanation.vi);
    }
    const chars = [...passage.text, ...passage.questions.flatMap((q) => q.options.flatMap((o) => [...o]))];
    for (const char of chars) if (/[一-鿿]/.test(char)) assert.ok(pinyinMap[char], `lesson ${n}: ${char}`);
  }
});

test("correct choices are distributed across A–D rather than revealing one fixed position", () => {
  const positions = new Set();
  for (let n = 7; n <= 15; n++) for (const item of getClozePassage(n).questions) positions.add(item.correct);
  assert.deepEqual([...positions].sort(), [0, 1, 2, 3]);
});
