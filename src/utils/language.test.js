import test from "node:test";
import assert from "node:assert/strict";
import { translateText } from "../i18n/translate.js";
import { translateMarkdown } from "../i18n/translateMarkdown.js";

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

test("Vietnamese lesson prose translates as complete sentences", () => {
  const phone = '喂 (wéi) is used as a greeting when answering or making a phone call. It is similar to "Hello?" on the phone in English.';
  assert.equal(translateText(phone, "vi"), "喂 (wéi) là lời chào khi nghe hoặc gọi điện, tương tự “a lô” trong tiếng Việt.");
  const note = "When two syllables are combined, the tone of each syllable may sound slightly different from when said alone. Here we practice 3rd tone combined with all four tones:";
  assert.equal(translateText(note, "vi"), "Khi hai âm tiết ghép với nhau, thanh điệu có thể nghe hơi khác lúc đọc riêng. Ở đây luyện thanh 3 kết hợp với cả bốn thanh:");
  assert.equal(translateText("not; have not", "vi"), "không; chưa có");
  assert.equal(translateText("I came **by plane**. (emphasis on manner)", "vi"), "Tôi đến **bằng máy bay**. (nhấn mạnh cách thức)");
});

test("Markdown translations preserve pinyin table cells and phonetic spelling", () => {
  const source = "| 汉字 | Pinyin | Meaning |\n|---|---|---|\n| 元 | yuan | yuan (currency) |\n\n| Written | Spoken |\n|---|---|\n| ü, üe, üan, ün → yu, yue, yuan, yun | 你好 |";
  const result = translateMarkdown(source, "vi");
  assert.match(result, /\| 元 \| yuan \|/);
  assert.match(result, /ü, üe, üan, ün → yu, yue, yuan, yun/);
  assert.equal(translateMarkdown(source, "en"), source);
});
