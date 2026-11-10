import test from "node:test";
import assert from "node:assert/strict";
import { getWorksheetPinyin, MAX_CHARACTERS, MAX_CHARACTERS_PER_PAGE, paginateWritingWords, parseWritingWords, WORKSHEET_ROW } from "./writingWorksheet.js";

test("extracts Chinese words from lines and common separators", () => {
  assert.deepEqual(parseWritingWords("我们，想\n学习; hello 你好"), {
    words: ["我们", "想", "学习", "你好"], characters: 7, valid: true,
  });
  assert.equal(parseWritingWords("ABC 123").valid, false);
  assert.equal(parseWritingWords("我".repeat(MAX_CHARACTERS + 1)).valid, false);
});

test("fits at most seven characters on each A4 page, including multi-character words", () => {
  assert.equal(MAX_CHARACTERS_PER_PAGE, 7);
  assert.deepEqual([1, 7, 8, 14, 15].map((n) => paginateWritingWords(["我".repeat(n)]).map((page) => page.length)), [
    [1], [7], [7, 1], [7, 7], [7, 7, 1],
  ]);
  const pages = paginateWritingWords(["我们", "想", "学习", "你好", "谢谢"]);
  assert.deepEqual(pages.map((page) => page.map(({ char }) => char).join("")), ["我们想学习你好", "谢谢"]);
  assert.deepEqual(pages[1][0], { word: "谢谢", wordIndex: 4, char: "谢", charIndex: 0 });
});

test("keeps heading, stroke guide and writing grid in separate vertical bands", () => {
  assert.ok(WORKSHEET_ROW.headerBaseline + WORKSHEET_ROW.headerFont * 0.25 < WORKSHEET_ROW.strokesTop);
  assert.ok(WORKSHEET_ROW.strokesTop + WORKSHEET_ROW.strokesMaxSize < WORKSHEET_ROW.gridTop);
  assert.ok(WORKSHEET_ROW.gridTop + WORKSHEET_ROW.gridSize < WORKSHEET_ROW.pitch);
  assert.ok(WORKSHEET_ROW.top + 6 * WORKSHEET_ROW.pitch + WORKSHEET_ROW.gridTop + WORKSHEET_ROW.gridSize < 288);
});

test("keeps HSK 1 tone marks, neutral tones, initials and textbook polyphonic readings", () => {
  for (const [word, expected] of Object.entries({
    我们: "wǒmen", 你们: "nǐmen", 想: "xiǎng", 学习: "xuéxí",
    谢谢: "xièxie", 不客气: "bú kèqi", 谁: "shéi", 喂: "wéi", 了: "le",
    认识: "rènshi", 衣服: "yīfu", 一点儿: "yìdiǎnr", 好: "hǎo", 你好: "nǐ hǎo",
  })) assert.equal(getWorksheetPinyin(word), expected, word);
});
