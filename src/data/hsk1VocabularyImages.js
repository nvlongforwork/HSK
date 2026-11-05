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
  3: {
    "叫": "jiao.webp",
    "什么": "shenme.webp",
    "名字": "mingzi.webp",
    "我": "wo.webp",
    "是": "shi.webp",
    "老师": "laoshi.webp",
    "吗": "ma.webp",
    "学生": "xuesheng.webp",
    "人": "ren.webp",
    "他": "ta_he.webp",
    "她": "ta_she.webp",
  },
};

export function getHsk1VocabularyImage(lessonNum, word) {
  const filename = imagesByLesson[lessonNum]?.[word];
  return filename ? `/images/hsk1/lesson-${lessonNum}/${filename}` : null;
}
