import { pinyin } from "pinyin-pro";
import hsk1Pinyin from "../data/hsk1WorksheetPinyin.js";

export const PAGE_WIDTH_MM = 210;
export const PAGE_HEIGHT_MM = 297;
export const MAX_CHARACTERS = 60;
export const MAX_CHARACTERS_PER_PAGE = 7;
export const WORKSHEET_HEADER_FIELDS = Object.freeze([
  { label: "Name", x: 14, lineStart: 26, lineEnd: 101 },
  { label: "Date", x: 111, lineStart: 122, lineEnd: 150 },
  { label: "Score", x: 158, lineStart: 171, lineEnd: 196 },
]);
export const WORKSHEET_ROW = Object.freeze({
  top: 38, pitch: 35, headerBaseline: 5, headerFont: 5.5, pinyinFont: 3.8,
  sentenceHeaderHeight: 9, strokesTop: 8, strokesMaxSize: 6.5, gridTop: 16.5, gridSize: 16.5,
});

export function getWorksheetPinyin(word) {
  return hsk1Pinyin[word] || pinyin(word, { toneType: "symbol" });
}

export function paginateWritingWords(words) {
  const pages = [];
  let page = [];
  let usedHeight = 0;
  const pageHeight = MAX_CHARACTERS_PER_PAGE * WORKSHEET_ROW.pitch;

  words.forEach((entry, wordIndex) => {
    const word = typeof entry === "string" ? entry : entry.text;
    [...word].forEach((char, charIndex) => {
      const sentence = typeof entry !== "string" && entry.sentence;
      let header = sentence && (charIndex === 0 || page.length === 0);
      let required = WORKSHEET_ROW.pitch + (header ? WORKSHEET_ROW.sentenceHeaderHeight : 0);
      if (page.length && (page.length >= MAX_CHARACTERS_PER_PAGE || usedHeight + required > pageHeight)) {
        pages.push(page);
        page = [];
        usedHeight = 0;
        header = sentence;
        required = WORKSHEET_ROW.pitch + (header ? WORKSHEET_ROW.sentenceHeaderHeight : 0);
      }
      const row = { word, wordIndex, char, charIndex };
      if (sentence) {
        row.sentence = entry.display;
        row.sentencePinyin = entry.pinyin;
        row.reading = entry.readings[charIndex];
      }
      page.push(row);
      usedHeight += required;
    });
  });
  if (page.length) pages.push(page);
  return pages;
}

export function layoutWorksheetRows(rows) {
  let offset = 0;
  return rows.map((row, index) => {
    const showSentence = Boolean(row.sentence && (index === 0 || rows[index - 1].wordIndex !== row.wordIndex));
    const sentenceY = showSentence ? WORKSHEET_ROW.top + offset : null;
    if (showSentence) offset += WORKSHEET_ROW.sentenceHeaderHeight;
    const y = WORKSHEET_ROW.top + offset;
    offset += WORKSHEET_ROW.pitch;
    return { ...row, y, sentenceY };
  });
}

export function parseWritingWords(input) {
  const entries = input.split(/\r?\n/).flatMap((line) => {
    const hanzi = [...line.matchAll(/\p{Script=Han}/gu)].map(([char]) => char).join("");
    const hasWordSeparators = /[,，、;；]/u.test(line);
    const isSentence = hanzi.length > 1 && (/[。！？!?]/u.test(line)
      || (!hasWordSeparators && hanzi.length >= 5)
      || (!hasWordSeparators && hanzi.length >= 3 && /^[我你他她它]/u.test(hanzi))
      || (!hasWordSeparators && hanzi.length >= 3 && /[吗呢吧]$/u.test(hanzi)));
    if (isSentence && hanzi) {
      const display = line.replace(/[^\p{Script=Han}\s，。！？!?；;、]/gu, "").trim().replace(/\s+/g, " ");
      const syllables = pinyin(display, { type: "array", toneType: "symbol" });
      const readings = [...display].flatMap((char, index) => /\p{Script=Han}/u.test(char) ? [syllables[index]] : []);
      return [{ text: hanzi, display, sentence: true, pinyin: readings.join(" "), readings }];
    }
    return line.split(/[,，、;；]+/).map((part) => [...part.matchAll(/\p{Script=Han}/gu)].map(([char]) => char).join(""))
      .filter(Boolean);
  });
  const words = entries.map((entry) => typeof entry === "string" ? entry : entry.text);
  const characters = words.reduce((total, word) => total + [...word].length, 0);
  return { words, entries, characters, valid: characters > 0 && characters <= MAX_CHARACTERS };
}

const strokeCache = new Map();

export async function loadStrokeData(characters) {
  const unique = [...new Set(characters)];
  const entries = await Promise.all(unique.map(async (char) => {
    if (!strokeCache.has(char)) {
      strokeCache.set(char, fetch(`https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/${encodeURIComponent(char)}.json`, { signal: AbortSignal.timeout(6500) })
        .then((response) => {
          if (!response.ok) throw new Error("Stroke data unavailable");
          return response.json();
        })
        .then((data) => Array.isArray(data.strokes) ? data.strokes : null)
        .catch(() => null));
    }
    return [char, await strokeCache.get(char)];
  }));
  return Object.fromEntries(entries);
}

function line(ctx, x1, y1, x2, y2) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

function drawGrid(ctx, x, y, size) {
  ctx.strokeStyle = "#c9c9c9";
  ctx.lineWidth = 0.22;
  ctx.setLineDash([]);
  ctx.strokeRect(x, y, size, size);
  ctx.strokeStyle = "#dedede";
  ctx.lineWidth = 0.14;
  line(ctx, x, y, x + size, y + size);
  line(ctx, x + size, y, x, y + size);
  line(ctx, x + size / 2, y, x + size / 2, y + size);
  line(ctx, x, y + size / 2, x + size, y + size / 2);
}

function drawStrokeStep(ctx, strokes, step, x, y, size) {
  ctx.save();
  // Hanzi Writer paths have a Y-up 1024-unit coordinate system and a 900-unit baseline.
  ctx.translate(x, y + size * 0.879);
  ctx.scale(size / 1024, -size / 1024);
  for (let i = 0; i <= step; i++) {
    ctx.fillStyle = i === step ? "#ae655b" : "#555052";
    ctx.fill(new Path2D(strokes[i]));
  }
  ctx.restore();
}

function drawGridModel(ctx, strokes, x, y, size, fill) {
  ctx.save();
  const glyphSize = size * 0.97;
  ctx.translate(x + (size - glyphSize) / 2, y + 0.7 + glyphSize * 900 / 1024);
  ctx.scale(glyphSize / 1024, -glyphSize / 1024);
  ctx.fillStyle = fill;
  strokes.forEach((stroke) => ctx.fill(new Path2D(stroke)));
  ctx.restore();
}

function drawCharacterRow(ctx, char, y, strokes) {
  const startX = 14;
  const size = WORKSHEET_ROW.gridSize;

  if (strokes?.length) {
    const stepSize = Math.min(WORKSHEET_ROW.strokesMaxSize, 174 / strokes.length - 0.7);
    for (let i = 0; i < strokes.length; i++) {
      drawStrokeStep(ctx, strokes, i, startX + i * (stepSize + 0.7), y + WORKSHEET_ROW.strokesTop, stepSize);
    }
  } else {
    ctx.fillStyle = "#979797";
    ctx.font = '3.2px "Noto Serif SC", "SimSun", serif';
    ctx.textAlign = "left";
    ctx.fillText("笔顺暂不可用 / Stroke guide unavailable", startX, y + 13);
  }

  const gridY = y + WORKSHEET_ROW.gridTop;
  for (let i = 0; i < 11; i++) {
    const x = startX + i * size;
    drawGrid(ctx, x, gridY, size);
    if (i < 5) {
      const fill = i === 0 ? "#343236" : "#d2d2d2";
      if (strokes?.length) {
        drawGridModel(ctx, strokes, x, gridY, size, fill);
      } else {
        ctx.fillStyle = fill;
        ctx.font = `12.3px "Worksheet Brush", "KaiTi", "Noto Serif SC", serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(char, x + size / 2, gridY + size / 2 + 0.4, size - 1);
      }
    }
  }
  ctx.textBaseline = "alphabetic";
}

function makePage(dpi, pageNumber, title) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(PAGE_WIDTH_MM * dpi / 25.4);
  canvas.height = Math.round(PAGE_HEIGHT_MM * dpi / 25.4);
  const ctx = canvas.getContext("2d", { alpha: false });
  ctx.scale(canvas.width / PAGE_WIDTH_MM, canvas.height / PAGE_HEIGHT_MM);
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, PAGE_WIDTH_MM, PAGE_HEIGHT_MM);
  ctx.fillStyle = "#24212a";
  ctx.textAlign = "left";
  ctx.font = '6px "Worksheet Brush", "KaiTi", serif';
  ctx.fillText(title || "汉字书写练习", 14, 20, 135);
  ctx.font = '3.1px "Worksheet Pinyin", Georgia, serif';
  ctx.fillStyle = "#777";
  WORKSHEET_HEADER_FIELDS.forEach(({ label, x, lineStart, lineEnd }) => {
    ctx.fillText(`${label}:`, x, 27);
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 0.18;
    line(ctx, lineStart, 27.6, lineEnd, 27.6);
  });
  ctx.strokeStyle = "#e5e5e5";
  ctx.lineWidth = 0.24;
  line(ctx, 14, 31, 196, 31);
  ctx.textAlign = "right";
  ctx.font = "3px Arial, sans-serif";
  ctx.fillText(String(pageNumber), 196, 288);
  return { canvas, ctx };
}

export function renderWorksheetPages(words, strokesByCharacter, { dpi = 110, title = "" } = {}) {
  return paginateWritingWords(words).map((rows, pageIndex) => {
    const { canvas, ctx } = makePage(dpi, pageIndex + 1, title);
    layoutWorksheetRows(rows).forEach(({ word, wordIndex, char, charIndex, sentence, sentencePinyin, reading, y, sentenceY }, rowIndex) => {
      if (sentenceY !== null) {
        ctx.textAlign = "left";
        ctx.fillStyle = "#666";
        ctx.font = "4.2px Arial, sans-serif";
        ctx.fillText(`${wordIndex + 1}.`, 14, sentenceY + WORKSHEET_ROW.headerBaseline);
        ctx.fillStyle = "#252329";
        ctx.font = `${WORKSHEET_ROW.headerFont}px "Worksheet Brush", "KaiTi", serif`;
        ctx.fillText(sentence, 23, sentenceY + WORKSHEET_ROW.headerBaseline, 90);
        ctx.fillStyle = "#74747c";
        ctx.font = `${WORKSHEET_ROW.pinyinFont}px "Worksheet Pinyin", "Noto Sans", sans-serif`;
        ctx.fillText(sentencePinyin, 117, sentenceY + WORKSHEET_ROW.headerBaseline, 78);
      }
      const firstOnPage = rowIndex === 0 || charIndex === 0;
      ctx.textAlign = "left";
      ctx.fillStyle = "#666";
      ctx.font = "4.2px Arial, sans-serif";
      ctx.fillText(sentence ? "–" : firstOnPage ? `${wordIndex + 1}.` : "–", 14, y + WORKSHEET_ROW.headerBaseline);
      ctx.fillStyle = "#252329";
      ctx.font = `${WORKSHEET_ROW.headerFont}px "Worksheet Brush", "KaiTi", serif`;
      ctx.fillText(sentence ? char : firstOnPage ? word : char, 23, y + WORKSHEET_ROW.headerBaseline, 90);
      if (sentence || firstOnPage) {
        ctx.fillStyle = "#74747c";
        ctx.font = `${WORKSHEET_ROW.pinyinFont}px "Worksheet Pinyin", "Noto Sans", sans-serif`;
        ctx.fillText(sentence ? reading : getWorksheetPinyin(word), 117, y + WORKSHEET_ROW.headerBaseline, 78);
      }
      drawCharacterRow(ctx, char, y, strokesByCharacter[char]);
    });
    return canvas;
  });
}
