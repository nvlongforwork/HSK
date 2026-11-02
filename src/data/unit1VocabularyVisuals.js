const root = "/images/vocabulary/unit-1/";

const visuals = {
  "你": { image: "1FAF5", alt: { en: "A hand pointing towards you", vi: "Bàn tay chỉ về phía bạn" } },
  "好": { image: "1F44D", alt: { en: "A thumbs-up gesture for good", vi: "Ngón tay cái giơ lên biểu thị tốt" } },
  "您": { image: "1F647", alt: { en: "A person bowing respectfully", vi: "Một người cúi chào lịch sự" } },
  "我": { image: "1F64B", alt: { en: "A person raising a hand to introduce themselves", vi: "Một người giơ tay giới thiệu bản thân" } },
  "很": { image: "1F44D", accent: "2728", alt: { en: "A thumbs-up with sparkles for emphasis", vi: "Ngón tay cái và tia sáng nhấn mạnh mức độ" } },
  "呢": { image: "2753", hint: { en: "asking back", vi: "hỏi lại" }, alt: { en: "A question mark to remind you of asking back", vi: "Dấu hỏi gợi nhớ cách hỏi lại" } },
  "也": { image: "2795", hint: { en: "also", vi: "cũng" }, alt: { en: "A plus sign to suggest also or in addition", vi: "Dấu cộng gợi nhớ nghĩa cũng, thêm vào" } },
  "们": { image: "1F465", hint: { en: "more than one", vi: "số nhiều" }, alt: { en: "Two people to suggest a plural group", vi: "Hai người gợi nhớ cách diễn đạt số nhiều" } },
  "大家": { image: "1F46A", hint: { en: "everyone", vi: "mọi người" }, alt: { en: "A group of people greeted together", vi: "Một nhóm người cùng được chào hỏi" } },
  "再见": { image: "1F44B", alt: { en: "A hand waving goodbye", vi: "Bàn tay vẫy chào tạm biệt" } },
};

export function getUnit1Visual(word) {
  const visual = visuals[word];
  if (!visual) return null;
  return {
    ...visual,
    src: `${root}${visual.image}.svg`,
    accentSrc: visual.accent ? `${root}${visual.accent}.svg` : null,
  };
}

export const unit1ExampleMeanings = {
  "你好！": { en: "Hello!", vi: "Xin chào!" },
  "您好！": { en: "Hello! (polite)", vi: "Xin chào! (cách nói lịch sự)" },
  "我好。": { en: "I'm fine.", vi: "Tôi khỏe." },
  "我很好。": { en: "I'm very well.", vi: "Tôi rất khỏe." },
  "你呢？": { en: "And you?", vi: "Còn bạn thì sao?" },
  "我也很好。": { en: "I'm also very well.", vi: "Tôi cũng rất khỏe." },
  "你们好！": { en: "Hello, everyone!", vi: "Chào các bạn!" },
  "大家好！": { en: "Hello, everyone!", vi: "Xin chào mọi người!" },
  "再见！": { en: "Goodbye!", vi: "Tạm biệt!" },
};
