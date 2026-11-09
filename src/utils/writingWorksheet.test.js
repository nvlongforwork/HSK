import test from "node:test";
import assert from "node:assert/strict";
import { getWorksheetPinyin, MAX_CHARACTERS, MAX_CHARACTERS_PER_PAGE, paginateWritingWords, parseWritingWords, pdfFromJpegs } from "./writingWorksheet.js";

test("extracts Chinese words from lines and common separators", () => {
  assert.deepEqual(parseWritingWords("我们，想\n学习; hello 你好"), {
    words: ["我们", "想", "学习", "你好"], characters: 7, valid: true,
  });
  assert.equal(parseWritingWords("ABC 123").valid, false);
  assert.equal(parseWritingWords("我".repeat(MAX_CHARACTERS + 1)).valid, false);
});

test("exports a readable two-page A4 PDF document", () => {
  // Minimal JPEG byte sequence exercises binary streams without a browser canvas.
  const jpeg = "data:image/jpeg;base64,/9j/2Q==";
  const pdf = pdfFromJpegs([
    { dataUrl: jpeg, width: 100, height: 150 },
    { dataUrl: jpeg, width: 100, height: 150 },
  ]);
  const document = new TextDecoder("latin1").decode(pdf);
  assert.match(document, /^%PDF-1\.4/);
  assert.match(document, /\/Count 2/);
  assert.equal((document.match(/\/MediaBox \[0 0 595\.276 841\.89\]/g) || []).length, 2);
  assert.match(document, /startxref\n\d+\n%%EOF$/);
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

test("keeps HSK 1 tone marks, neutral tones, initials and textbook polyphonic readings", () => {
  for (const [word, expected] of Object.entries({
    我们: "wǒmen", 你们: "nǐmen", 想: "xiǎng", 学习: "xuéxí",
    谢谢: "xièxie", 不客气: "bú kèqi", 谁: "shéi", 喂: "wéi", 了: "le",
    认识: "rènshi", 衣服: "yīfu", 一点儿: "yìdiǎnr", 你好: "nǐ hǎo",
  })) assert.equal(getWorksheetPinyin(word), expected, word);
});
