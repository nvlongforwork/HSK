import test from "node:test";
import assert from "node:assert/strict";
import { getReadingLesson, readingSections } from "../data/hsk1Reading.js";
import pinyinMap from "../data/pinyin.js";

test("all 15 lessons provide four short reading drills with valid answer banks", () => {
  assert.equal(getReadingLesson(16), null);
  assert.equal(readingSections.length, 4);
  for (let n = 1; n <= 15; n++) {
    const lesson = getReadingLesson(n);
    assert.ok(lesson, `lesson ${n}`);
    assert.equal(lesson.bank.length, 3);
    assert.equal(new Set(lesson.bank).size, 3);
    for (const section of readingSections) {
      const items = lesson[section.id];
      assert.equal(items.length, 2, `lesson ${n}: ${section.id}`);
      for (const item of items) {
        assert.ok(item[0].trim());
        if (section.id === "judge") assert.equal(typeof item[2], "boolean");
        if (section.id === "fill") {
          assert.ok(Number.isInteger(item[1]) && item[1] >= 0 && item[1] < lesson.bank.length);
          assert.ok(item[0].includes("___"));
        }
      }
    }
    for (const section of ["match", "reply"]) {
      const items = lesson[section];
      const sharedBank = [items[0][1][0], items[1][1][0], items[0][1][2]];
      assert.equal(new Set(sharedBank).size, 3, `lesson ${n}: ${section} bank`);
    }
  }
});

test("all Hanzi used in the reading drills have a visible pinyin reading", () => {
  for (let n = 1; n <= 15; n++) {
    const source = JSON.stringify(getReadingLesson(n));
    for (const char of source) if (/[一-鿿]/.test(char)) {
      assert.ok(pinyinMap[char], `lesson ${n}: ${char}`);
    }
  }
});
