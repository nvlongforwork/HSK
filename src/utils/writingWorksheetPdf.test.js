import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createWritingWorksheetPdf } from "./writingWorksheetPdf.js";

test("exports seven soft vector character models per A4 page without raster images", async () => {
  const fontBytes = readFileSync(new URL("../../node_modules/@expo-google-fonts/ma-shan-zheng/400Regular/MaShanZheng_400Regular.ttf", import.meta.url));
  const pinyinFontBytes = readFileSync(new URL("../../node_modules/@expo-google-fonts/noto-sans/400Regular/NotoSans_400Regular.ttf", import.meta.url));
  const pdf = await createWritingWorksheetPdf(["你".repeat(8)], {
    你: ["M 100 800 Q 400 600 700 800 L 750 700 Z"],
  }, { fontBytes, pinyinFontBytes });
  const content = Buffer.from(pdf).toString("latin1");
  assert.match(content, /^%PDF-1\./);
  assert.equal((content.match(/\/Type \/Page\b/g) || []).length, 2);
  assert.equal((content.match(/\/MediaBox \[ 0 0 595\.2755905511812 841\.8897637795276 \]/g) || []).length, 2);
  assert.doesNotMatch(content, /\/Subtype \/Image/);
});
