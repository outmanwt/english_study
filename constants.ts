
import { Question, Article } from './types';

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 1,
    zh: "教育在现代社会中扮演着至关重要的角色。",
    zh_parts: ["教育", "在现代社会中", "扮演着", "至关重要的", "角色。"],
    en: "Education plays a vital role in modern society.",
    analysis: "【主谓宾结构】plays a role in... 是考研写作万能短语。",
    difficulty: "基础"
  },
  {
    id: 2,
    zh: "许多学生发现很难集中精力学习。",
    zh_parts: ["许多学生", "发现", "很难", "集中精力", "学习。"],
    en: "Many students find it difficult to focus on their studies.",
    analysis: "【形式宾语】find it + adj + to do sth。",
    difficulty: "核心"
  }
];

export const INITIAL_ARTICLE: Article = {
  title: "The Importance of Habits (习惯的重要性)",
  sentences: [
    {
      en: "Good habits are the foundation of success.",
      zh: "好习惯是成功的基础。",
      keywords: [{ word: "foundation", mean: "基础" }]
    },
    {
      en: "For example, reading English every day can improve your vocabulary.",
      zh: "例如，每天读英语可以增加你的词汇量。",
      keywords: [{ word: "improve", mean: "提高" }, { word: "vocabulary", mean: "词汇" }]
    },
    {
      en: "Consistency is key when preparing for competitive exams like the Kaoyan.",
      zh: "在准备像考研这样具有竞争力的考试时，坚持是关键。",
      keywords: [{ word: "Consistency", mean: "一致性/坚持" }, { word: "competitive", mean: "竞争激烈的" }]
    }
  ]
};
