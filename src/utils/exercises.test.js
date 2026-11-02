import test from "node:test";
import assert from "node:assert/strict";
import { parseExercises, isCorrectAnswer } from "./exercises.js";

test("parses Markdown without exposing answer markers or table headers", () => {
  const data = parseExercises(`### Multiple Choice\r
1. Hello?\r
   - A) 谢谢\r
   - B) 你好 ✓\r
### Fill in the Blanks
1. ___好！ → 你
2. 我叫___。 → [student's name]
3. 她吃___饭了。 → 了 (reorder: 她吃饭了)
### Flashcards
| Front | Back |
|:---|---:|
| 你好 | nǐ hǎo - hello |
`);
  assert.equal(data.multipleChoice.length, 1);
  assert.deepEqual(data.multipleChoice[0].options[1], { label: "B", text: "你好", correct: true });
  assert.equal(data.fillIn.length, 3);
  assert.equal(data.fillIn[0].selfReview, false);
  assert.equal(data.fillIn[1].selfReview, true);
  assert.equal(data.fillIn[2].selfReview, true);
  assert.deepEqual(data.flashcards, [{ front: "你好", back: "nǐ hǎo - hello" }]);
});

test("rejects ambiguous and incomplete multiple-choice answer keys", () => {
  const data = parseExercises(`### Multiple Choice
1. No key
 - A) 你
 - B) 我
2. Two keys
 - A) 你 ✓
 - B) 我 ✓
3. Only one option
 - A) 你 ✓`);
  assert.equal(data.multipleChoice.length, 0);
  assert.deepEqual(parseExercises(), { multipleChoice: [], fillIn: [], flashcards: [] });
});

test("accepts punctuation and IME width variants but keeps distinct answers", () => {
  assert.equal(isCorrectAnswer(" 你！ ", "你"), true);
  assert.equal(isCorrectAnswer("ＡＢＣ", "abc"), true);
  assert.equal(isCorrectAnswer("你 好", "你好"), true);
  assert.equal(isCorrectAnswer("我", "你"), false);
  assert.equal(isCorrectAnswer("", "你"), false);
  assert.equal(isCorrectAnswer("！！！", "你"), false);
  assert.equal(isCorrectAnswer("ma", "mǎ"), false);
});
