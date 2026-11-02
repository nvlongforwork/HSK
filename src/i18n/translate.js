import vi from "./vi.js";

const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// Prefer complete phrases; Unicode boundaries protect pinyin and Chinese examples.
const matcher = new RegExp(`(?<![\\p{L}\\p{N}_])(?:${Object.keys(vi).sort((a, b) => b.length - a.length).map(escape).join("|")})(?![\\p{L}\\p{N}_])`, "gu");

export function translateText(text, language = "en") {
  if (language !== "vi" || typeof text !== "string") return text;
  return text.replace(matcher, (match) => vi[match]);
}
