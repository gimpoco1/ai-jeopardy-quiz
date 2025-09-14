export type Points = 100 | 200 | 300 | 400 | 500 | 600;

export interface QA {
  points: Points;
  question: string;
}

export interface Category {
  title: string;
  questions: QA[];
}

export interface BoardData {
  topic: string;
  categories: Category[];
}

export interface Player {
  id: string;
  name: string;
  score: number;
  emoji: string;
}
