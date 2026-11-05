const imagesByLesson = {
  1: {
    "你": "ni.webp",
    "好": "hao.webp",
    "您": "nin.webp",
    "你们": "nimen.webp",
    "对不起": "duibuqi.webp",
    "没关系": "meiguanxi.webp",
    "我们": "women.webp",
  },
  2: {
    "谢谢": "xiexie.webp",
    "不": "bu.webp",
    "不客气": "bukeqi.webp",
    "再见": "zaijian.webp",
    "没": "mei.webp",
  },
};

export function getHsk1VocabularyImage(lessonNum, word) {
  const filename = imagesByLesson[lessonNum]?.[word];
  return filename ? `/images/hsk1/lesson-${lessonNum}/${filename}` : null;
}
