import pinyinMap from "../data/pinyin.js";

export const PAGE_WIDTH_MM = 210;
export const PAGE_HEIGHT_MM = 297;
export const MAX_CHARACTERS = 60;

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
  ctx.strokeStyle = "#d2d2d2";
  ctx.lineWidth = 0.22;
  ctx.setLineDash([]);
  ctx.strokeRect(x, y, size, size);
  ctx.strokeStyle = "#d8d8d8";
  ctx.lineWidth = 0.16;
  ctx.setLineDash([0.8, 0.8]);
  line(ctx, x, y, x + size, y + size);
  line(ctx, x + size, y, x, y + size);
  line(ctx, x + size / 2, y, x + size / 2, y + size);
  line(ctx, x, y + size / 2, x + size, y + size / 2);
  ctx.setLineDash([]);
}

function drawStrokeStep(ctx, strokes, step, x, y, size) {
  ctx.save();
  // Hanzi Writer paths have a Y-up 1024-unit coordinate system and a 900-unit baseline.
  ctx.translate(x, y + size * 0.879);
  ctx.scale(size / 1024, -size / 1024);
  for (let i = 0; i <= step; i++) {
    ctx.fillStyle = i === step ? "#c41e3a" : "#252329";
    ctx.fill(new Path2D(strokes[i]));
  }
  ctx.restore();
}

function drawCharacterRow(ctx, char, y, strokes) {
  const startX = 14;
  const size = 16.5;

  if (strokes?.length) {
    const stepSize = Math.min(8.2, 174 / strokes.length - 0.7);
    for (let i = 0; i < strokes.length; i++) {
      drawStrokeStep(ctx, strokes, i, startX + i * (stepSize + 0.7), y + 1, stepSize);
    }
  } else {
    ctx.fillStyle = "#979797";
    ctx.font = '3.2px "Noto Serif SC", "SimSun", serif';
    ctx.textAlign = "left";
    ctx.fillText("笔顺暂不可用 / Stroke guide unavailable", startX, y + 7);
  }

  const gridY = y + 12.8;
  for (let i = 0; i < 11; i++) {
    const x = startX + i * size;
    drawGrid(ctx, x, gridY, size);
    if (i < 5) {
      ctx.fillStyle = i === 0 ? "#27242b" : "#c9c9c9";
      ctx.font = `12.3px "Noto Serif SC", "KaiTi", "SimSun", serif`;
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
  ctx.font = 'bold 6px "Noto Serif SC", "SimSun", serif';
  ctx.fillText(title || "汉字书写练习", 14, 20, 135);
  ctx.font = "3.1px Arial, sans-serif";
  ctx.fillStyle = "#777";
  ctx.fillText("Name: ____________________       Date: __________", 14, 27);
  ctx.strokeStyle = "#e5e5e5";
  ctx.lineWidth = 0.24;
  line(ctx, 14, 31, 196, 31);
  ctx.textAlign = "right";
  ctx.font = "3px Arial, sans-serif";
  ctx.fillText(String(pageNumber), 196, 288);
  return { canvas, ctx, y: 39 };
}

export function renderWorksheetPages(words, strokesByCharacter, { dpi = 110, title = "" } = {}) {
  const pages = [];
  let page = makePage(dpi, 1, title);
  pages.push(page.canvas);
  words.forEach((word, index) => {
    const chars = [...word];
    const drawWordHeader = () => {
      const { ctx, y } = page;
      ctx.textAlign = "left";
      ctx.fillStyle = "#666";
      ctx.font = "4.2px Arial, sans-serif";
      ctx.fillText(`${index + 1}.`, 14, y + 6);
      ctx.fillStyle = "#252329";
      ctx.font = '8px "Noto Serif SC", "KaiTi", "SimSun", serif';
      ctx.fillText(word, 23, y + 7, 90);
      const pinyin = chars.map((char) => pinyinMap[char] || "").filter(Boolean).join("  ");
      ctx.fillStyle = "#74747c";
      ctx.font = '4px "Noto Serif SC", Georgia, serif';
      ctx.fillText(pinyin, 117, y + 6, 78);
      page.y += 12;
    };
    const nextPage = () => {
      page = makePage(dpi, pages.length + 1, title);
      pages.push(page.canvas);
    };
    if (page.y + 55 > 280) nextPage();
    drawWordHeader();
    chars.forEach((char) => {
      if (page.y + 35 > 280) { nextPage(); drawWordHeader(); }
      drawCharacterRow(page.ctx, char, page.y, strokesByCharacter[char]);
      page.y += 33;
    });
    page.y += 10;
    page.ctx.strokeStyle = "#e7e7e7";
    page.ctx.lineWidth = 0.2;
    line(page.ctx, 14, page.y - 5, 196, page.y - 5);
  });
  return pages;
}

const encoder = new TextEncoder();

export function pdfFromJpegs(images) {
  if (!images.length) throw new Error("A PDF needs at least one page");
  const chunks = [];
  const offsets = [0];
  let length = 0;
  function append(bytes) { chunks.push(bytes); length += bytes.length; }
  function write(value) { append(encoder.encode(value)); }
  function object(id, body) {
    offsets[id] = length;
    write(`${id} 0 obj\n${body}\nendobj\n`);
  }

  write("%PDF-1.4\n");
  const pageRefs = images.map((_, i) => `${3 + i * 3} 0 R`).join(" ");
  object(1, "<< /Type /Catalog /Pages 2 0 R >>");
  object(2, `<< /Type /Pages /Kids [ ${pageRefs} ] /Count ${images.length} >>`);
  images.forEach(({ dataUrl, width, height }, i) => {
    const pageId = 3 + i * 3;
    const imageId = pageId + 1;
    const contentId = pageId + 2;
    const binary = atob(dataUrl.split(",")[1]);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    object(pageId, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.276 841.89] /Resources << /XObject << /Im${i} ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`);
    offsets[imageId] = length;
    write(`${imageId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${bytes.length} >>\nstream\n`);
    append(bytes);
    write("\nendstream\nendobj\n");
    const content = `q 595.276 0 0 841.89 0 0 cm /Im${i} Do Q\n`;
    object(contentId, `<< /Length ${content.length} >>\nstream\n${content}endstream`);
  });
  const xref = length;
  write(`xref\n0 ${offsets.length}\n0000000000 65535 f \n`);
  for (let i = 1; i < offsets.length; i++) write(`${String(offsets[i]).padStart(10, "0")} 00000 n \n`);
  write(`trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
  const pdf = new Uint8Array(length);
  let position = 0;
  for (const chunk of chunks) { pdf.set(chunk, position); position += chunk.length; }
  return pdf;
}
