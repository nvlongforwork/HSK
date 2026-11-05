const imageBase = "/images/hsk1/lesson-1";

const images = {
  "你": "ni.webp",
  "好": "hao.webp",
  "您": "nin.webp",
  "你们": "nimen.webp",
  "对不起": "duibuqi.webp",
  "没关系": "meiguanxi.webp",
  "我们": "women.webp",
};

export function getUnit1VocabularyImage(word) {
  return images[word] ? `${imageBase}/${images[word]}` : null;
}
