import test from "node:test";
import assert from "node:assert/strict";
import { parseVocabulary } from "./vocabulary.js";
import { getUnit1Visual } from "../data/unit1VocabularyVisuals.js";

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

test("illustrations use bundled assets and unknown future words can fall back", () => {
  assert.equal(getUnit1Visual("你").src, "/images/vocabulary/unit-1/1FAF5.svg");
  assert.equal(getUnit1Visual("很").accentSrc, "/images/vocabulary/unit-1/2728.svg");
  assert.equal(getUnit1Visual("未知"), null);
});
