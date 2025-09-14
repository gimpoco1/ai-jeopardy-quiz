export type Points = 100 | 200 | 300 | 400 | 500 | 600;

export interface QA {
  points: Points;
  question: string;
}

export interface Category {
  title: string;
  questions: QA[]; // must include exactly one for each point value
}

export interface BoardData {
  topic: string;
  categories: Category[]; // 5 categories
}
