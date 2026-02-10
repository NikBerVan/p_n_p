import type {
  Chapter,
  ChapterStats,
  DisplayOption,
  Question,
  QuizSettings,
  QuizState,
  Screen,
} from '../types';

export function createInitialState(settings: QuizSettings): QuizState {
  return {
    screen: 'intro',
    currentChapterIndex: 0,
    currentQuestionIndex: 0,
    totalScore: 0,
    totalCorrect: 0,
    totalAnswered: 0,
    chapterStats: {},
    answeredQuestionIds: [],
    questionLocked: false,
    selectedOriginalOptionIndex: null,
    lastAnswerCorrect: null,
    lastAwardedPoints: 0,
    timerRemaining: settings.questionTimeLimitSeconds,
  };
}

export function createChapterStats(): ChapterStats {
  return {
    score: 0,
    correct: 0,
    answered: 0,
  };
}

export function calculateAccuracy(correct: number, answered: number): number {
  if (answered <= 0) {
    return 0;
  }

  return Math.round((correct / answered) * 100);
}

export function calculatePoints(
  isCorrect: boolean,
  timeLeft: number,
  settings: QuizSettings,
): number {
  if (!isCorrect) {
    return 0;
  }

  if (!settings.timerEnabled) {
    return settings.basePointsPerCorrect;
  }

  const safeTimeLimit = Math.max(settings.questionTimeLimitSeconds, 1);
  const normalizedTime = Math.max(0, Math.min(1, timeLeft / safeTimeLimit));
  const timerBonus = Math.floor(normalizedTime * settings.timerBonusMaxPoints);

  return settings.basePointsPerCorrect + timerBonus;
}

export function deterministicOptions(
  questionId: string,
  options: string[],
  shouldShuffle: boolean,
): DisplayOption[] {
  const indexedOptions = options.map((text, index) => ({
    text,
    originalIndex: index,
  }));

  if (!shouldShuffle) {
    return indexedOptions;
  }

  return indexedOptions
    .map((option) => {
      const rank = seededRank(`${questionId}-${option.originalIndex}`);
      return {
        ...option,
        rank,
      };
    })
    .sort((left, right) => left.rank - right.rank)
    .map(({ text, originalIndex }) => ({ text, originalIndex }));
}

function seededRank(input: string): number {
  let hash = 2166136261;

  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash +=
      (hash << 1) +
      (hash << 4) +
      (hash << 7) +
      (hash << 8) +
      (hash << 24);
  }

  return hash >>> 0;
}

export function resolveAssetPath(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.replace(/^\/+/, '');
  return `${import.meta.env.BASE_URL}${normalizedPath}`;
}

export function chapterQuestionMap(chapters: Chapter[], questions: Question[]): Map<string, Question[]> {
  return new Map(chapters.map((chapter) => [chapter.id, questions.filter((q) => q.chapterId === chapter.id)]));
}

export function clampQuestionIndex(index: number, chapterQuestionsLength: number): number {
  if (chapterQuestionsLength <= 0) {
    return 0;
  }

  return Math.min(Math.max(index, 0), chapterQuestionsLength - 1);
}

export function getChapterStats(chapterId: string, state: QuizState): ChapterStats {
  return state.chapterStats[chapterId] ?? createChapterStats();
}

export function isFinalChapter(currentChapterIndex: number, chaptersLength: number): boolean {
  return currentChapterIndex >= chaptersLength - 1;
}

export function nextScreenAfterQuestion(
  currentQuestionIndex: number,
  chapterQuestionCount: number,
): Screen {
  if (currentQuestionIndex < chapterQuestionCount - 1) {
    return 'question';
  }

  return 'chapterSummary';
}

export function nextScreenAfterSummary(currentChapterIndex: number, chaptersLength: number): Screen {
  return isFinalChapter(currentChapterIndex, chaptersLength) ? 'final' : 'chapterSelect';
}
