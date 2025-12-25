
export interface Keyword {
  word: string;
  mean: string;
}

export interface Sentence {
  en: string;
  zh: string;
  keywords?: Keyword[];
  analysis?: string;
  difficulty?: string;
}

export interface Question extends Sentence {
  id: number;
  zh_parts: string[];
}

export interface Article {
  title: string;
  sentences: Sentence[];
}

export interface WordDefinition {
  ipa: string;
  def: string;
  trans: string;
}

export interface AiFeedback {
  score: number;
  comment: string;
}

export type InputMode = 'puzzle' | 'typing';
export type AppTab = 'drill' | 'article';
