
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

// Dictionary / Photo Tool Types
export interface DictionaryResult {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaning: string;
  translation: string;
  exampleSentence: string;
  exampleTranslation: string;
}

export interface VocabItem extends DictionaryResult {
  id: string;
  dateAdded: number;
}

// Reading Challenge Types
export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
}

export interface ReadingChallengeResult {
  title: string;
  topic: string;
  content: string; // The ~100 word story
  chineseTranslation: string;
  questions: QuizQuestion[];
}

// Phonics Types
export interface TongueTwisterResult {
  phonetic: string;
  tongueTwister: string;
  chineseTranslation: string;
  challengeLevel: 'Easy' | 'Medium' | 'Hard';
  funFact: string; // A tip about how to pronounce it
}

// App Configuration Types
export type AIProvider = 'gemini' | 'deepseek' | 'doubao' | 'openai';
export type AppTheme = 'classic' | 'candy' | 'dark';
export type AppLanguage = 'en' | 'zh';

export interface UserSettings {
  provider: AIProvider;
  apiKey: string;
  baseUrl?: string;
  modelName?: string;
  theme: AppTheme;
  language: AppLanguage;
}

export interface User {
  name: string;
  avatar: string;
  settings: UserSettings;
}

export enum AppView {
  LOGIN,
  DASHBOARD,
  TOOL_GRAMMAR,
  TOOL_DICTIONARY,
  TOOL_VOCAB,
  TOOL_READING,
  TOOL_PHONICS
}

export enum AppState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
