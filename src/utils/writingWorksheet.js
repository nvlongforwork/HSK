import { pinyin } from "pinyin-pro";
import hsk1Pinyin from "../data/hsk1WorksheetPinyin.js";
import { getStrokeParts, strokeAnnotations } from "./writingStrokeGuide.js";

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
  diagramX: 14, diagramTop: 2, diagramSize: 31, strokesX: 49,
  strokesTop: 8, strokesMaxSize: 6.5, gridX: 49, gridTop: 16.5, gridSize: 16.3,
});

export function getWorksheetPinyin(word) {
  return hsk1Pinyin[word] || pinyin(word, { toneType: "symbol" });
}

export function paginateWritingWords(words) {
  const rows = words.flatMap((word, wordIndex) => [...word].map((char, charIndex) => ({
    word, wordIndex, char, charIndex,
  })));
  const pages = [];
  for (let i = 0; i < rows.length; i += MAX_CHARACTERS_PER_PAGE) {
    pages.push(rows.slice(i, i + MAX_CHARACTERS_PER_PAGE));
  }
  return pages;
}

export function parseWritingWords(input) {
  const words = input.split(/[\n,，、;；]+/).map((part) => [...part.matchAll(/\p{Script=Han}/gu)].map(([char]) => char).join(""))
    .filter(Boolean);
  const characters = words.reduce((total, word) => total + [...word].length, 0);
  return { words, characters, valid: characters > 0 && characters <= MAX_CHARACTERS };
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
        .then((data) => Array.isArray(data.strokes) ? { strokes: data.strokes, medians: data.medians } : null)
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

function drawStrokeDiagram(ctx, data, x, y, size) {
  const { strokes, medians } = getStrokeParts(data);
  if (medians.length !== strokes.length) return;
  ctx.save();
  ctx.save();
  ctx.translate(x, y + size * 900 / 1024);
  ctx.scale(size / 1024, -size / 1024);
  ctx.fillStyle = "#d2d2d2";
  strokes.forEach((stroke) => ctx.fill(new Path2D(stroke)));
  ctx.restore();

  for (const { number, points, arrow, labelX, labelY } of strokeAnnotations(medians, x, y, size)) {
    ctx.strokeStyle = "#343236";
    ctx.lineWidth = 0.22;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    points.forEach((point, index) => index ? ctx.lineTo(point.x, point.y) : ctx.moveTo(point.x, point.y));
    ctx.stroke();
    line(ctx, arrow[0].x, arrow[0].y, arrow[1].x, arrow[1].y);
    line(ctx, arrow[0].x, arrow[0].y, arrow[2].x, arrow[2].y);
    ctx.fillStyle = "#fff";
    ctx.fillRect(labelX, labelY, 2.2, 1.9);
    ctx.strokeStyle = "#c2c2c2";
    ctx.lineWidth = 0.12;
    ctx.strokeRect(labelX, labelY, 2.2, 1.9);
    ctx.fillStyle = "#343236";
    ctx.font = "1.45px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(number), labelX + 1.1, labelY + 0.97);
  }
  ctx.restore();
}

function drawCharacterRow(ctx, char, y, data) {
  const startX = WORKSHEET_ROW.gridX;
  const size = WORKSHEET_ROW.gridSize;
  const { strokes, medians } = getStrokeParts(data);

  if (strokes.length) {
    if (medians.length === strokes.length) {
      drawStrokeDiagram(ctx, data, WORKSHEET_ROW.diagramX, y + WORKSHEET_ROW.diagramTop, WORKSHEET_ROW.diagramSize);
    }
    const stepSize = Math.min(WORKSHEET_ROW.strokesMaxSize, 145 / strokes.length - 0.7);
    for (let i = 0; i < strokes.length; i++) {
      drawStrokeStep(ctx, strokes, i, WORKSHEET_ROW.strokesX + i * (stepSize + 0.7), y + WORKSHEET_ROW.strokesTop, stepSize);
    }
  } else {
    ctx.fillStyle = "#979797";
    ctx.font = '3.2px "Noto Serif SC", "SimSun", serif';
    ctx.textAlign = "left";
    ctx.fillText("笔顺暂不可用 / Stroke guide unavailable", WORKSHEET_ROW.strokesX, y + 13);
  }

  const gridY = y + WORKSHEET_ROW.gridTop;
  for (let i = 0; i < 9; i++) {
    const x = startX + i * size;
    drawGrid(ctx, x, gridY, size);
    if (i < 4) {
      ctx.fillStyle = i === 0 ? "#343236" : "#d2d2d2";
      ctx.font = `12.3px "Worksheet Brush", "KaiTi", "Noto Serif SC", serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(char, x + size / 2, gridY + size / 2 + 0.4, size - 1);
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
    rows.forEach(({ word, wordIndex, char, charIndex }, rowIndex) => {
      const y = WORKSHEET_ROW.top + rowIndex * WORKSHEET_ROW.pitch;
      const firstOnPage = rowIndex === 0 || charIndex === 0;
      ctx.textAlign = "left";
      ctx.fillStyle = "#666";
      ctx.font = "4.2px Arial, sans-serif";
      ctx.fillText(firstOnPage ? `${wordIndex + 1}.` : "–", 49, y + WORKSHEET_ROW.headerBaseline);
      ctx.fillStyle = "#252329";
      ctx.font = `${WORKSHEET_ROW.headerFont}px "Worksheet Brush", "KaiTi", serif`;
      ctx.fillText(firstOnPage ? word : char, 58, y + WORKSHEET_ROW.headerBaseline, 60);
      if (firstOnPage) {
        ctx.fillStyle = "#74747c";
        ctx.font = `${WORKSHEET_ROW.pinyinFont}px "Worksheet Pinyin", "Noto Sans", sans-serif`;
        ctx.fillText(getWorksheetPinyin(word), 123, y + WORKSHEET_ROW.headerBaseline, 72);
      }
      drawCharacterRow(ctx, char, y, strokesByCharacter[char]);
    });
    return canvas;
  });
}
