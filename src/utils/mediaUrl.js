const MEDIA_BASE = "https://raw.githubusercontent.com/nvlongforwork/HSK-MEDIA/feat/tinh-nang-moi";

export function getContentUrl(level, lessonNum, file) {
  return `${MEDIA_BASE}/content/hsk${level}/lesson-${lessonNum}/${file}`;
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
