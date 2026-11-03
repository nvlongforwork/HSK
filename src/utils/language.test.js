import test from "node:test";
import assert from "node:assert/strict";
import { translateText } from "../i18n/translate.js";

test("English is the default and leaves source text unchanged", () => {
  const source = '你好！ How do you say "Hello" in Chinese?';
  assert.equal(translateText(source), source);
  assert.equal(translateText(source, "en"), source);
});

test("Vietnamese uses complete phrases and preserves Chinese and pinyin", () => {
  assert.equal(translateText('How do you say "Hello" in Chinese?', "vi"), '"Xin chào" trong tiếng Trung nói thế nào?');
  assert.equal(translateText("nǐ - you; xièxie - thank you; péngyou - friend", "vi"), "nǐ - bạn, anh, chị...; xièxie - cảm ơn; péngyou - bạn bè");
  assert.equal(translateText("你好吗？— 我___好。", "vi"), "你好吗？— 我___好。");
  assert.equal(translateText("Score: 3 / 4", "vi"), "Điểm: 3 / 4");
  assert.equal(translateText("Subject + Verb + 了 + Object", "vi"), "Chủ ngữ + Động từ + 了 + Tân ngữ");
});

test("translating display text never mutates non-text render values", () => {
  const value = { type: "button", children: "Next" };
  assert.equal(translateText(value, "vi"), value);
  assert.equal(translateText(null, "vi"), null);
  assert.equal(translateText(3, "vi"), 3);
});
