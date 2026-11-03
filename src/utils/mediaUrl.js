const MEDIA_BASE = "https://raw.githubusercontent.com/nvlongforwork/HSK-MEDIA/main";
const HSK1_CONTENT_BASE = "https://raw.githubusercontent.com/nvlongforwork/HSK-MEDIA/feat/tinh-nang-moi";

export function getContentUrl(level, lessonNum, file) {
  const base = level === 1 && ["vocabulary.md", "grammar.md", "pronunciation.md", "writing.md", "exercises.md"].includes(file) ? HSK1_CONTENT_BASE : MEDIA_BASE;
  return `${base}/content/hsk${level}/lesson-${lessonNum}/${file}`;
}

export function getAudioUrl(level, lessonNum, file) {
  return `${MEDIA_BASE}/audio/hsk${level}/lesson-${lessonNum}/${file}`;
}

export function getAudioBaseUrl(level, lessonNum) {
  return `${MEDIA_BASE}/audio/hsk${level}/lesson-${lessonNum}`;
}

export function getImageUrl(level, lessonNum, file) {
  return `${MEDIA_BASE}/images/hsk${level}/lesson-${lessonNum}/${file}`;
}

export default MEDIA_BASE;
