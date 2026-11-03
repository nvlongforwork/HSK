const MEDIA_BASE = "https://raw.githubusercontent.com/nvlongforwork/HSK-MEDIA/main";
const HSK1_VOCABULARY_BASE = "https://raw.githubusercontent.com/nvlongforwork/HSK-MEDIA/feat/tinh-nang-moi";

export function getContentUrl(level, lessonNum, file) {
  const base = level === 1 && file === "vocabulary.md" ? HSK1_VOCABULARY_BASE : MEDIA_BASE;
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
