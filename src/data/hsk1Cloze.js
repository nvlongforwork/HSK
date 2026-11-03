// An extended reading drill. The old HSK 1 exam uses word selection in single
// sentences; connected passages here are for consolidation after lesson 6.
const passages = {
  7: {
    text: "今天是三月五号，星期一。明天是三月{1}号，星期二。王明问妈妈：‘明天星期{2}？’妈妈说：‘星期二。’王明说：‘我明天去学校看{3}。’",
    questions: [
      [["六", "五", "四", "三"], 0, "Tomorrow is the sixth, one day after the fifth.", "Ngày mai là ngày 6, sau ngày 5 một ngày."],
      [["几", "号", "月", "年"], 0, "星期几 asks which day of the week.", "星期几 dùng để hỏi thứ trong tuần."],
      [["书", "号", "月", "星期"], 0, "看书 means to read a book.", "看书 nghĩa là đọc sách."],
    ],
  },
  8: {
    text: "今天我和妈妈去饭馆。妈妈想{1}茶，我想喝水。我们想{2}米饭和中国菜。妈妈问：‘这个杯子多{3}钱？’",
    questions: [
      [["喝", "吃", "写", "看"], 0, "喝 is used for drinking tea.", "喝 dùng khi uống trà."],
      [["吃", "喝", "说", "写"], 0, "吃米饭 means to eat rice.", "吃米饭 nghĩa là ăn cơm."],
      [["少", "大", "好", "小"], 0, "多少钱 asks the price.", "多少钱 dùng để hỏi giá tiền."],
    ],
  },
  9: {
    text: "王明的爸爸是医生，在{1}工作。妈妈在商店{2}。王明的小猫不在家，它{3}学校。王明问：‘小猫在{4}？’爸爸说：‘在学校。’王明说：‘我去学校{5}小猫。’",
    questions: [
      [["医院", "医生", "椅子", "书"], 0, "A doctor works at a hospital: 在医院工作.", "Bác sĩ làm việc ở bệnh viện: 在医院工作."],
      [["工作", "医院", "哪儿", "学校"], 0, "在商店工作 means to work at a shop.", "在商店工作 nghĩa là làm việc ở cửa hàng."],
      [["在", "有", "是", "吗"], 0, "在学校 means to be at school.", "在学校 nghĩa là ở trường."],
      [["哪儿", "什么", "谁", "几号"], 0, "哪儿 asks for the cat's location.", "哪儿 dùng để hỏi con mèo ở đâu."],
      [["看", "喝", "坐", "说"], 0, "看小猫 means to go see the cat.", "看小猫 nghĩa là đến xem con mèo."],
    ],
  },
  10: {
    text: "李月在学校。她问老师：‘我{1}坐这儿吗？’老师说：‘可以，请{2}。’桌子上{3}一本书和一个杯子。李月说：‘这{4}书是{5}的吗？’",
    questions: [
      [["能", "在", "是", "有"], 0, "能……吗 asks for permission to sit.", "能……吗 dùng để xin phép ngồi."],
      [["坐", "说", "看", "喝"], 0, "请坐 means please sit down.", "请坐 nghĩa là mời ngồi."],
      [["有", "在", "能", "吗"], 0, "有 introduces things present on the table.", "有 chỉ những thứ đang có trên bàn."],
      [["本", "杯", "个", "岁"], 0, "本 is the measure word for books.", "本 là lượng từ dùng cho sách."],
      [["你", "我", "他", "她"], 0, "你的吗 asks whether the book belongs to the teacher being addressed.", "你的吗 hỏi quyển sách có phải của người đang được hỏi hay không."],
    ],
  },
  11: {
    text: "明天是星期二，今天是星期{1}。现在上午九{2}，李月去学校看书。妈妈问：‘你{3}时候回家？’李月说：‘下午三点{4}回家。’妈妈说：‘好，我下午三点半也{5}家。’",
    questions: [
      [["一", "二", "三", "四"], 0, "The day before Tuesday is Monday (星期一).", "Trước thứ Ba là thứ Hai (星期一)."],
      [["点", "号", "岁", "月"], 0, "九点 means nine o'clock.", "九点 nghĩa là chín giờ."],
      [["什么", "哪儿", "多少", "谁"], 0, "什么时候 asks when someone will come home.", "什么时候 hỏi khi nào một người về nhà."],
      [["半", "号", "月", "岁"], 0, "三点半 means half past three.", "三点半 nghĩa là ba giờ rưỡi."],
      [["回", "看", "读", "说"], 0, "回家 means to return home.", "回家 nghĩa là về nhà."],
    ],
  },
  12: {
    text: "今天很热。王明问妈妈：‘明天天气{1}？’妈妈说：‘明天{2}雨，很冷。’王明说：‘我不想{3}学校，我想在家看书。’妈妈说：‘明天我们{4}在家看书。’王明说：‘太{5}了！’",
    questions: [
      [["怎么样", "哪儿", "几号", "什么"], 0, "天气怎么样 asks what the weather is like.", "天气怎么样 hỏi thời tiết như thế nào."],
      [["下", "上", "做", "说"], 0, "下雨 means to rain.", "下雨 nghĩa là trời mưa."],
      [["去", "有", "是", "会"], 0, "去学校 means to go to school.", "去学校 nghĩa là đi đến trường."],
      [["都", "很", "太", "吗"], 0, "我们都 means all of us.", "我们都 nghĩa là tất cả chúng ta."],
      [["好", "冷", "热", "少"], 0, "太好了 expresses happiness about the plan.", "太好了 diễn tả sự vui mừng với kế hoạch ấy."],
    ],
  },
  13: {
    text: "王明给李老师打电话：‘{1}，李老师，你现在在做{2}？’李老师说：‘我{3}看电视呢。’王明说：‘我妈妈在{4}中国菜。下午我想给你打{5}。’",
    questions: [
      [["喂", "喝", "吃", "看"], 0, "喂 (wéi) opens a phone call; 喝 means to drink.", "喂 (wéi) dùng khi gọi điện; 喝 nghĩa là uống."],
      [["什么", "哪儿", "谁", "几"], 0, "做什么 asks what someone is doing.", "做什么 hỏi một người đang làm gì."],
      [["在", "有", "是", "吗"], 0, "在看电视呢 describes an ongoing action.", "在看电视呢 diễn tả hành động đang diễn ra."],
      [["做", "坐", "喝", "读"], 0, "做中国菜 means to cook Chinese food.", "做中国菜 nghĩa là nấu món Trung Quốc."],
      [["电话", "电视", "电影", "学校"], 0, "打电话 means to make a phone call.", "打电话 nghĩa là gọi điện thoại."],
    ],
  },
  14: {
    text: "今天李月去商店{1}衣服。她看见一件衣服，很{2}。她问：‘这件衣服多{3}钱？’商店的人说：‘五十{4}钱。’李月买了不{5}衣服，回家给妈妈看。",
    questions: [
      [["买", "坐", "说", "读"], 0, "买衣服 means to buy clothes.", "买衣服 nghĩa là mua quần áo."],
      [["漂亮", "医院", "学校", "星期"], 0, "漂亮 describes the clothes as beautiful.", "漂亮 miêu tả quần áo đẹp."],
      [["少", "好", "大", "小"], 0, "多少钱 asks for a price.", "多少钱 dùng để hỏi giá."],
      [["块", "本", "杯", "岁"], 0, "块钱 is a spoken way to say yuan.", "块钱 là cách nói tiền nhân dân tệ trong hội thoại."],
      [["少", "多", "是", "在"], 0, "不少 means quite a few.", "不少 nghĩa là khá nhiều."],
    ],
  },
  15: {
    text: "今天王明要去北京。他先坐出租车去{1}，再坐{2}去北京。到了北京，李月问：‘你是怎么{3}的？’王明说：‘我是坐飞机{4}的。’李月问：‘你今天住在饭店{5}？’王明说：‘是，我住在饭店。’",
    questions: [
      [["机场", "医院", "学校", "商店"], 0, "The taxi takes him to the airport before his flight.", "Taxi đưa anh ấy đến sân bay trước chuyến bay."],
      [["飞机", "出租车", "椅子", "桌子"], 0, "He takes a plane after arriving at the airport.", "Sau khi đến sân bay, anh ấy đi máy bay."],
      [["来", "住", "看", "买"], 0, "怎么来的 asks how someone arrived.", "怎么来的 hỏi một người đã đến bằng cách nào."],
      [["来", "住", "吃", "说"], 0, "坐飞机来的 describes how he arrived.", "坐飞机来的 nói về cách anh ấy đã đến."],
      [["吗", "的", "都", "什么"], 0, "吗 turns the statement into a yes/no question.", "吗 biến câu kể thành câu hỏi có/không."],
    ],
  },
};

export const CLOZE_START_LESSON = 7;

export function getClozePassage(lessonNum) {
  const passage = passages[lessonNum];
  if (!passage) return null;
  return {
    text: passage.text,
    questions: passage.questions.map(([rawOptions, rawAnswer, en, vi], index) => {
      const correct = (lessonNum + index * 3) % rawOptions.length;
      const options = [...rawOptions.slice(-correct || rawOptions.length), ...rawOptions.slice(0, -correct || rawOptions.length)];
      return { options, correct: (rawAnswer + correct) % rawOptions.length, explanation: { en, vi } };
    }),
  };
}
