import test from "node:test";
import assert from "node:assert/strict";
import { parseVocabulary } from "./vocabulary.js";

test("vocabulary tables keep empty pinyin/example cells in the right columns", () => {
  const entries = parseVocabulary(`# Vocabulary\r
| # | 汉字 | 拼音 | English | Example |\r
|---|---|---|---|---|\r
| 1 | 你 | nǐ | you | 你好！|\r
| 2 | 好 | | good | |\r
`);
  assert.deepEqual(entries, [
    { word: "你", pinyin: "nǐ", meaning: "you", example: "你好！" },
    { word: "好", pinyin: "", meaning: "good", example: "" },
  ]);
});

test("columns are identified by header rather than their position", () => {
  assert.deepEqual(parseVocabulary(`| English | Example | 汉字 | 拼音 |
|:---|---:|---|---|
| goodbye | 再见！ | 再见 | zàijiàn |`), [
    { word: "再见", pinyin: "zàijiàn", meaning: "goodbye", example: "再见！" },
  ]);
  assert.deepEqual(parseVocabulary("Not a vocabulary table"), []);
  assert.deepEqual(parseVocabulary(), []);
});

test("lesson 2 vocabulary uses Character, Pinyin, and Meaning headers", () => {
  assert.deepEqual(parseVocabulary(`| # | Character | Pinyin | Meaning | Example |
|---|---|---|---|---|
| 1 | 谢谢 | xièxie | thank you | 谢谢你！|
| 2 | 没 | méi | not; have not | 没关系！|`), [
    { word: "谢谢", pinyin: "xièxie", meaning: "thank you", example: "谢谢你！" },
    { word: "没", pinyin: "méi", meaning: "not; have not", example: "没关系！" },
  ]);
});
