import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import svgpath from "svgpath";
import { getWorksheetPinyin, layoutWorksheetRows, PAGE_HEIGHT_MM, PAGE_WIDTH_MM, paginateWritingWords, WORKSHEET_HEADER_FIELDS, WORKSHEET_ROW } from "./writingWorksheet.js";

const pt = (mm) => mm * 72 / 25.4;
const color = (hex) => rgb(...[1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255));
const INK = color("#343236");
const TRACE = color("#d2d2d2");
const GRID = color("#c9c9c9");
const GUIDE = color("#dedede");
const SOFT_INK = color("#555052");
const STROKE_ACCENT = color("#ae655b");
const pageY = (y) => pt(PAGE_HEIGHT_MM - y);

function rule(page, x1, y1, x2, y2, strokeColor, width) {
  page.drawLine({ start: { x: pt(x1), y: pageY(y1) }, end: { x: pt(x2), y: pageY(y2) }, color: strokeColor, thickness: pt(width) });
}

function label(page, value, x, baselineY, size, font, ink, maxWidth) {
  const text = String(value);
  let fontSize = pt(size);
  if (maxWidth) fontSize = Math.min(fontSize, fontSize * pt(maxWidth) / font.widthOfTextAtSize(text, fontSize));
  page.drawText(text, { x: pt(x), y: pageY(baselineY), size: fontSize, font, color: ink });
}

function grid(page, x, y, size) {
  page.drawRectangle({ x: pt(x), y: pageY(y + size), width: pt(size), height: pt(size), borderColor: GRID, borderWidth: pt(0.22) });
  rule(page, x, y, x + size, y + size, GUIDE, 0.14);
  rule(page, x + size, y, x, y + size, GUIDE, 0.14);
  rule(page, x + size / 2, y, x + size / 2, y + size, GUIDE, 0.14);
  rule(page, x, y + size / 2, x + size, y + size / 2, GUIDE, 0.14);
}

const pathCache = new Map();
function strokePath(stroke) {
  if (!pathCache.has(stroke)) {
    // Hanzi Writer coordinates run upward. PDF SVG coordinates run downward.
    pathCache.set(stroke, svgpath(stroke).scale(1, -1).translate(0, 900).toString());
  }
  return pathCache.get(stroke);
}

function strokeGuide(page, strokes, x, y, size, step) {
  for (let i = 0; i <= step; i++) {
    page.drawSvgPath(strokePath(strokes[i]), {
      x: pt(x), y: pageY(y), scale: pt(size) / 1024,
      color: i === step ? STROKE_ACCENT : SOFT_INK,
    });
  }
}

function gridModel(page, strokes, x, y, size, ink) {
  const glyphSize = size * 0.97;
  const glyphX = x + (size - glyphSize) / 2;
  const glyphY = y + 0.7;
  strokes.forEach((stroke) => page.drawSvgPath(strokePath(stroke), {
    x: pt(glyphX), y: pageY(glyphY), scale: pt(glyphSize) / 1024, color: ink,
  }));
}

function characterRow(page, row, y, strokes, brushFont, latinFont) {
  const { char } = row;
  if (strokes?.length) {
    const stepSize = Math.min(WORKSHEET_ROW.strokesMaxSize, 174 / strokes.length - 0.7);
    strokes.forEach((_, i) => strokeGuide(page, strokes, 14 + i * (stepSize + 0.7), y + WORKSHEET_ROW.strokesTop, stepSize, i));
  } else {
    label(page, "Stroke guide unavailable", 14, y + 13, 3.2, latinFont, color("#979797"));
  }
  const gridY = y + WORKSHEET_ROW.gridTop;
  for (let i = 0; i < 11; i++) {
    const x = 14 + i * WORKSHEET_ROW.gridSize;
    grid(page, x, gridY, WORKSHEET_ROW.gridSize);
    if (i < 5) {
      if (strokes?.length) {
        gridModel(page, strokes, x, gridY, WORKSHEET_ROW.gridSize, i === 0 ? INK : TRACE);
      } else {
        const fontSize = pt(12.3);
        const glyphWidth = brushFont.widthOfTextAtSize(char, fontSize);
        page.drawText(char, {
          x: pt(x + 8.25) - glyphWidth / 2, y: pageY(gridY + 12.7),
          size: fontSize, font: brushFont, color: i === 0 ? INK : TRACE,
        });
      }
    }
  }
}

/** Return a genuine vector A4 PDF: outlines/text/grid paths, no JPEG page images. */
export async function createWritingWorksheetPdf(words, strokesByCharacter, { title = "", fontBytes, fontUrl, pinyinFontBytes, pinyinFontUrl, fallbackPinyinFontBytes, fallbackPinyinFontUrl } = {}) {
  if (!words?.length) throw new Error("Enter at least one Chinese word");
  const fetchFont = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Writing font unavailable");
    return response.arrayBuffer();
  };
  const [bytes, latinBytes] = await Promise.all([
    fontBytes || fetchFont(fontUrl), pinyinFontBytes || fetchFont(pinyinFontUrl),
  ]);
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  // fontkit's TrueType subset drops CJK and accented pinyin outlines in PDF viewers.
  const brushFont = await doc.embedFont(bytes);
  const pinyinFont = await doc.embedFont(latinBytes);
  const latinFont = await doc.embedFont(StandardFonts.Helvetica);
  const fontFile = fontkit.create(new Uint8Array(latinBytes));
  const needsFallback = (value) => [...value].some((char) => !fontFile.hasGlyphForCodePoint(char.codePointAt(0)));
  const pages = paginateWritingWords(words);
  const fallbackFont = pages.some((rows) => rows.some(({ word, sentencePinyin, reading }) =>
    needsFallback(sentencePinyin || getWorksheetPinyin(word)) || (reading && needsFallback(reading))))
    ? await doc.embedFont(fallbackPinyinFontBytes || await fetchFont(fallbackPinyinFontUrl))
    : null;

  pages.forEach((rows, pageIndex) => {
    const page = doc.addPage([pt(PAGE_WIDTH_MM), pt(PAGE_HEIGHT_MM)]);
    label(page, title || "汉字书写练习", 14, 20, 6, /\p{Script=Han}/u.test(title || "汉字书写练习") ? brushFont : pinyinFont, color("#24212a"), 135);
    WORKSHEET_HEADER_FIELDS.forEach(({ label: field, x, lineStart, lineEnd }) => {
      label(page, `${field}:`, x, 27, 3.1, pinyinFont, color("#777777"));
      rule(page, lineStart, 27.6, lineEnd, 27.6, color("#999999"), 0.18);
    });
    rule(page, 14, 31, 196, 31, color("#e5e5e5"), 0.24);
    label(page, String(pageIndex + 1), 195, 288, 3, latinFont, color("#777777"));

    layoutWorksheetRows(rows).forEach((row, rowIndex) => {
      const { word, wordIndex, char, charIndex, sentence, sentencePinyin, reading, y, sentenceY } = row;
      if (sentenceY !== null) {
        label(page, `${wordIndex + 1}.`, 14, sentenceY + WORKSHEET_ROW.headerBaseline, 4.2, latinFont, color("#666666"));
        label(page, sentence, 23, sentenceY + WORKSHEET_ROW.headerBaseline, WORKSHEET_ROW.headerFont, brushFont, color("#252329"), 90);
        label(page, sentencePinyin, 117, sentenceY + WORKSHEET_ROW.headerBaseline, WORKSHEET_ROW.pinyinFont,
          needsFallback(sentencePinyin) ? fallbackFont : pinyinFont, color("#74747c"), 78);
      }
      const firstOnPage = rowIndex === 0 || charIndex === 0;
      label(page, sentence ? "-" : firstOnPage ? `${wordIndex + 1}.` : "-", 14, y + WORKSHEET_ROW.headerBaseline, 4.2, latinFont, color("#666666"));
      label(page, sentence ? char : firstOnPage ? word : char, 23, y + WORKSHEET_ROW.headerBaseline, WORKSHEET_ROW.headerFont, brushFont, color("#252329"), 90);
      if (sentence || firstOnPage) {
        const rowReading = sentence ? reading : getWorksheetPinyin(word);
        label(page, rowReading, 117, y + WORKSHEET_ROW.headerBaseline, WORKSHEET_ROW.pinyinFont,
          needsFallback(rowReading) ? fallbackFont : pinyinFont, color("#74747c"), 78);
      }
      characterRow(page, row, y, strokesByCharacter[char], brushFont, latinFont);
    });
  });
  return doc.save({ useObjectStreams: false });
}
