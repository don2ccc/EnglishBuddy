export interface GrammarPoint {
  rule: string;
  explanation: string;
  example: string;
}

export interface Phrase {
  original: string;
  translation: string;
  explanation: string;
}

export interface AnalysisResult {
  chineseTranslation: string;
  difficultyLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  grammarAnalysis: GrammarPoint[];
  keyPhrases: Phrase[];
  encouragement: string;
}

export enum AppState {
  IDLE,
  LOADING,
  SUCCESS,
  ERROR
}