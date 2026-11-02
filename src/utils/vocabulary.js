function cells(line) {
  return line.trim().replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim());
}

// Read the existing media table before display translation; keep empty cells aligned.
export function parseVocabulary(markdown = "") {
  const lines = markdown.split(/\r?\n/);
  for (let index = 0; index < lines.length - 1; index++) {
    if (!lines[index].trim().startsWith("|")) continue;
    const headers = cells(lines[index]);
    const word = headers.indexOf("汉字");
    const pinyin = headers.indexOf("拼音");
    const meaning = headers.indexOf("English");
    const example = headers.indexOf("Example");
    if ([word, pinyin, meaning, example].some((column) => column < 0)) continue;
    if (!cells(lines[index + 1]).every((cell) => /^:?-+:?$/.test(cell))) continue;

    const entries = [];
    for (let row = index + 2; row < lines.length && lines[row].trim().startsWith("|"); row++) {
      const values = cells(lines[row]);
      if (!values[word] || !values[meaning]) continue;
      entries.push({
        word: values[word], pinyin: values[pinyin] || "",
        meaning: values[meaning], example: values[example] || "",
      });
    }
    return entries;
  }
  return [];
}
