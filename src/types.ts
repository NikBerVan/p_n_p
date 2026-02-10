export type Screen = 'intro' | 'chapterSelect' | 'question' | 'chapterSummary' | 'final';

export interface Chapter {
  id: string;
  title: string;
  description: string;
}

export interface MomentCard {
  image: string;
  caption: string;
  audio?: string;
}

export interface Question {
  id: string;
  chapterId: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
  momentCard?: MomentCard;
}

export interface RevealLink {
  label: string;
  url: string;
}

export interface RevealConfig {
  title: string;
  message: string;
  image: string;
  link?: RevealLink;
  easterEgg: {
    minScore: number;
    title: string;
    message: string;
    image?: string;
  };
}

export interface QuizSettings {
  chapterQuestionCount: number;
  basePointsPerCorrect: number;
  timerEnabled: boolean;
  questionTimeLimitSeconds: number;
  timerBonusMaxPoints: number;
  shuffleOptions: boolean;
}

export interface ChapterStats {
  score: number;
  correct: number;
  answered: number;
}

export interface QuizState {
  screen: Screen;
  currentChapterIndex: number;
  currentQuestionIndex: number;
  totalScore: number;
  totalCorrect: number;
  totalAnswered: number;
  chapterStats: Record<string, ChapterStats>;
  answeredQuestionIds: string[];
  questionLocked: boolean;
  selectedOriginalOptionIndex: number | null;
  lastAnswerCorrect: boolean | null;
  lastAwardedPoints: number;
  timerRemaining: number;
}

export interface DisplayOption {
  text: string;
  originalIndex: number;
}
