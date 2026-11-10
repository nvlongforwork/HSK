import test from "node:test";
import assert from "node:assert/strict";
import { getStrokeParts, strokeAnnotations } from "./writingStrokeGuide.js";

test("keeps stroke outlines and medians in the same writing order", () => {
  const data = { strokes: ["M 0 0 Z", "M 10 10 Z"], medians: [
    [[100, 800], [500, 800]], [[500, 800], [500, 200]],
  ] };
  assert.deepEqual(getStrokeParts(data), data);
  assert.deepEqual(getStrokeParts(data.strokes), { strokes: data.strokes, medians: [] });
  const [first, second] = strokeAnnotations(data.medians, 14, 40, 30);
  assert.equal(first.number, 1);
  assert.equal(second.number, 2);
  assert.ok(first.arrow[0].x > first.arrow[1].x, "first arrow points right");
  assert.ok(second.arrow[0].y > second.arrow[1].y, "second arrow points down");
  assert.ok(first.labelX >= 14 && first.labelY >= 40, "number stays inside the diagram");
});
