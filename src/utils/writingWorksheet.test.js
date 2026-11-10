import test from "node:test";
import assert from "node:assert/strict";
import { getWorksheetPinyin, layoutWorksheetRows, MAX_CHARACTERS, MAX_CHARACTERS_PER_PAGE, paginateWritingWords, parseWritingWords, WORKSHEET_ROW } from "./writingWorksheet.js";

test("extracts Chinese words from lines and common separators", () => {
  assert.deepEqual(parseWritingWords("我们，想\n学习; hello 你好"), {
    words: ["我们", "想", "学习", "你好"], entries: ["我们", "想", "学习", "你好"], characters: 7, valid: true,
  });
  assert.equal(parseWritingWords("ABC 123").valid, false);
  assert.equal(parseWritingWords("我".repeat(MAX_CHARACTERS + 1)).valid, false);
});

test("a sentence gets a full reading and a contextual reading for every character", () => {
  const parsed = parseWritingWords("银行行李。\n学");
  assert.deepEqual(parsed.words, ["银行行李", "学"]);
  assert.equal(parsed.entries[0].display, "银行行李。");
  assert.deepEqual(parsed.entries[0].readings, ["yín", "háng", "xíng", "li"]);
  assert.equal(parsed.entries[0].pinyin, "yín háng xíng li");
  assert.equal(parsed.entries[1], "学");
  assert.deepEqual(parseWritingWords("我。").entries, ["我"]);
  assert.equal(parseWritingWords("我爱你").entries[0].sentence, true);
  assert.deepEqual(parseWritingWords("电话号码").entries, ["电话号码"]);
});

test("repeats the sentence heading on continuation pages while keeping seven as the page limit", () => {
  const { entries } = parseWritingWords("我喜欢学习汉语。");
  const pages = paginateWritingWords(entries);
  assert.deepEqual(pages.map((page) => page.map(({ char }) => char).join("")), ["我喜欢学习汉", "语"]);
  assert.equal(layoutWorksheetRows(pages[0])[0].sentenceY, WORKSHEET_ROW.top);
  assert.equal(layoutWorksheetRows(pages[0])[0].y, WORKSHEET_ROW.top + WORKSHEET_ROW.sentenceHeaderHeight);
  assert.equal(layoutWorksheetRows(pages[0])[1].sentenceY, null);
  assert.equal(layoutWorksheetRows(pages[1])[0].sentenceY, WORKSHEET_ROW.top);
  const mixed = paginateWritingWords([...entries, "好"]);
  assert.equal(mixed[1][1].char, "好");
  assert.equal(layoutWorksheetRows(mixed[1])[1].sentenceY, null);
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
