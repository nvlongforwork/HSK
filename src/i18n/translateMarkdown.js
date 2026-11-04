import { translateText } from "./translate.js";

const phonetic = /^[a-züāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ,\s→]+$/iu;

function tableCells(line) {
  return line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
}

export function translateMarkdown(content, language = "en") {
  if (language !== "vi" || !content) return content;
  const lines = content.split(/\r?\n/);
  let pinyinColumn = -1;
  return lines.map((line, index) => {
    if (!line.startsWith("|")) {
      pinyinColumn = -1;
      return translateText(line, language);
    }
    if (index + 1 < lines.length && /^\|[\s:|\-]+\|?$/.test(lines[index + 1])) {
      pinyinColumn = tableCells(line).findIndex((cell) => cell === "Pinyin" || cell === "拼音");
    }
    if (/^\|[\s:|\-]+\|?$/.test(line)) return line;
    const cells = tableCells(line).map((cell, column) => {
      if (column === pinyinColumn || (cell.includes("→") && phonetic.test(cell))) return cell;
      return translateText(cell, language);
    });
    return `| ${cells.join(" | ")} |`;
  }).join("\n");
}
