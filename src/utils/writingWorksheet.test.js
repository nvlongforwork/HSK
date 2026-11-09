import test from "node:test";
import assert from "node:assert/strict";
import { MAX_CHARACTERS, parseWritingWords, pdfFromJpegs } from "./writingWorksheet.js";

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
