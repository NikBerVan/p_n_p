import { useEffect, useMemo, useState } from 'react';
import { ChapterSelection } from './components/ChapterSelection';
import { ChapterSummary } from './components/ChapterSummary';
import { FinalReveal } from './components/FinalReveal';
import { IntroScreen } from './components/IntroScreen';
import { QuestionCard } from './components/QuestionCard';
import chaptersData from './data/chapters.json';
import questionsData from './data/questions.json';
import revealData from './data/reveal.json';
import settingsData from './data/settings.json';
import {
  calculatePoints,
  chapterQuestionMap,
  clampQuestionIndex,
  createChapterStats,
  createInitialState,
  deterministicOptions,
  getChapterStats,
  nextScreenAfterQuestion,
  nextScreenAfterSummary,
} from './lib/quiz';
import { clearSavedState, loadSavedState, saveState } from './lib/storage';
import type { Chapter, DisplayOption, Question, QuizSettings, QuizState, RevealConfig } from './types';

const chapters = chaptersData as Chapter[];
const questions = questionsData as Question[];
const reveal = revealData as RevealConfig;
const settings = settingsData as QuizSettings;
const THEME_STORAGE_KEY = 'our-moments-theme-v1';
type ThemeId = 'valentine' | 'soft-peach' | 'green-valentine';

const themeOptions: Array<{ id: ThemeId; label: string }> = [
  { id: 'valentine', label: 'Темна романтика' },
  { id: 'soft-peach', label: 'Темний персик' },
  { id: 'green-valentine', label: 'Смарагдова ніч' },
];

function loadTheme(): ThemeId {
  if (typeof window === 'undefined') {
    return 'valentine';
  }

  const value = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (value === 'soft-peach' || value === 'green-valentine' || value === 'valentine') {
    return value;
  }

  return 'valentine';
}

function loadInitialState(): QuizState {
  const savedState = loadSavedState();
  const fallbackState = createInitialState(settings);

  if (!savedState) {
    return fallbackState;
  }

  const currentChapterIndex = Math.min(
    Math.max(savedState.currentChapterIndex ?? 0, 0),
    Math.max(chapters.length - 1, 0),
  );
  const validScreens = new Set(['intro', 'chapterSelect', 'question', 'chapterSummary', 'final']);
  const screen = validScreens.has(savedState.screen) ? savedState.screen : fallbackState.screen;

  return {
    ...fallbackState,
    ...savedState,
    screen,
    currentChapterIndex,
    currentQuestionIndex: Math.max(savedState.currentQuestionIndex ?? 0, 0),
    timerRemaining:
      savedState.timerRemaining && savedState.timerRemaining > 0
        ? savedState.timerRemaining
        : settings.questionTimeLimitSeconds,
  };
}

function resetPerQuestionFields(state: QuizState): QuizState {
  return {
    ...state,
    questionLocked: false,
    selectedOriginalOptionIndex: null,
    lastAnswerCorrect: null,
    lastAwardedPoints: 0,
    timerRemaining: settings.questionTimeLimitSeconds,
  };
}

function App() {
  const [state, setState] = useState<QuizState>(() => loadInitialState());
  const [theme, setTheme] = useState<ThemeId>(() => loadTheme());

  const questionsByChapter = useMemo(() => chapterQuestionMap(chapters, questions), []);
  const totalQuestionCount = questions.length;

  const currentChapter = chapters[state.currentChapterIndex] ?? chapters[0];
  const currentChapterQuestions = currentChapter
    ? (questionsByChapter.get(currentChapter.id) ?? [])
    : [];

  const safeQuestionIndex = clampQuestionIndex(state.currentQuestionIndex, currentChapterQuestions.length);
  const currentQuestion = currentChapterQuestions[safeQuestionIndex];
  const displayOptions = currentQuestion
    ? deterministicOptions(currentQuestion.id, currentQuestion.options, settings.shuffleOptions)
    : [];

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    if (safeQuestionIndex !== state.currentQuestionIndex) {
      setState((previousState) => ({
        ...previousState,
        currentQuestionIndex: safeQuestionIndex,
      }));
    }
  }, [safeQuestionIndex, state.currentQuestionIndex]);

  useEffect(() => {
    if (!settings.timerEnabled) {
      return;
    }

    if (state.screen !== 'question' || state.questionLocked || !currentQuestion) {
      return;
    }

    if (state.timerRemaining <= 0) {
      submitAnswer(null);
      return;
    }

    const intervalId = window.setInterval(() => {
      setState((previousState) => ({
        ...previousState,
        timerRemaining: Math.max(previousState.timerRemaining - 1, 0),
      }));
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.screen, state.questionLocked, state.timerRemaining, currentQuestion?.id]);

  function handleStartQuiz() {
    setState((previousState) => ({
      ...previousState,
      screen: 'chapterSelect',
      timerRemaining: settings.questionTimeLimitSeconds,
    }));
  }

  function handleStartChapter() {
    setState((previousState) =>
      resetPerQuestionFields({
        ...previousState,
        screen: 'question',
      }),
    );
  }

  function handleRestartQuiz() {
    clearSavedState();
    setState(createInitialState(settings));
  }

  function submitAnswer(selectedOption: DisplayOption | null) {
    if (!currentQuestion || !currentChapter) {
      return;
    }

    const selectedOriginalIndex = selectedOption?.originalIndex ?? null;
    const isCorrect = selectedOriginalIndex === currentQuestion.correctOptionIndex;
    const awardedPoints = calculatePoints(isCorrect, state.timerRemaining, settings);

    setState((previousState) => {
      if (
        previousState.questionLocked ||
        previousState.answeredQuestionIds.includes(currentQuestion.id) ||
        previousState.screen !== 'question'
      ) {
        return previousState;
      }

      const existingChapterStats = previousState.chapterStats[currentChapter.id] ?? createChapterStats();

      return {
        ...previousState,
        questionLocked: true,
        selectedOriginalOptionIndex: selectedOriginalIndex,
        lastAnswerCorrect: isCorrect,
        lastAwardedPoints: awardedPoints,
        totalScore: previousState.totalScore + awardedPoints,
        totalCorrect: previousState.totalCorrect + (isCorrect ? 1 : 0),
        totalAnswered: previousState.totalAnswered + 1,
        chapterStats: {
          ...previousState.chapterStats,
          [currentChapter.id]: {
            score: existingChapterStats.score + awardedPoints,
            correct: existingChapterStats.correct + (isCorrect ? 1 : 0),
            answered: existingChapterStats.answered + 1,
          },
        },
        answeredQuestionIds: previousState.answeredQuestionIds.includes(currentQuestion.id)
          ? previousState.answeredQuestionIds
          : [...previousState.answeredQuestionIds, currentQuestion.id],
      };
    });
  }

  function handleNextQuestion() {
    if (!currentQuestion) {
      return;
    }

    if (!state.questionLocked) {
      return;
    }

    const nextScreen = nextScreenAfterQuestion(safeQuestionIndex, currentChapterQuestions.length);

    if (nextScreen === 'question') {
      setState((previousState) =>
        resetPerQuestionFields({
          ...previousState,
          currentQuestionIndex: previousState.currentQuestionIndex + 1,
        }),
      );
      return;
    }

    setState((previousState) => ({
      ...previousState,
      screen: 'chapterSummary',
    }));
  }

  function handleContinueAfterSummary() {
    const nextScreen = nextScreenAfterSummary(state.currentChapterIndex, chapters.length);

    if (nextScreen === 'final') {
      setState((previousState) => ({
        ...previousState,
        screen: 'final',
      }));
      return;
    }

    setState((previousState) =>
      resetPerQuestionFields({
        ...previousState,
        screen: nextScreen,
        currentChapterIndex: previousState.currentChapterIndex + 1,
        currentQuestionIndex: 0,
      }),
    );
  }

  const currentChapterStats = currentChapter ? getChapterStats(currentChapter.id, state) : createChapterStats();

  return (
    <main className="app-shell">
      <div className="background-orb orb-1" aria-hidden="true" />
      <div className="background-orb orb-2" aria-hidden="true" />

      <div className="top-actions">
        <div className="theme-switcher" role="group" aria-label="Вибір теми оформлення">
          {themeOptions.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`theme-chip ${theme === option.id ? 'active' : ''}`}
              aria-pressed={theme === option.id}
              onClick={() => setTheme(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {state.screen !== 'intro' ? (
          <button className="button ghost" type="button" onClick={handleRestartQuiz}>
            Перезапустити квіз
          </button>
        ) : null}
      </div>

      {state.screen === 'intro' ? <IntroScreen onStart={handleStartQuiz} /> : null}

      {state.screen === 'chapterSelect' ? (
        <ChapterSelection
          chapters={chapters}
          chapterStats={state.chapterStats}
          currentChapterIndex={state.currentChapterIndex}
          totalScore={state.totalScore}
          onStartChapter={handleStartChapter}
          onRestart={handleRestartQuiz}
        />
      ) : null}

      {state.screen === 'question' && currentQuestion && currentChapter ? (
        <QuestionCard
          chapterTitle={currentChapter.title}
          question={currentQuestion}
          displayOptions={displayOptions}
          questionNumber={safeQuestionIndex + 1}
          chapterQuestionCount={currentChapterQuestions.length}
          totalAnswered={state.totalAnswered}
          totalQuestionCount={totalQuestionCount}
          selectedOriginalOptionIndex={state.selectedOriginalOptionIndex}
          questionLocked={state.questionLocked}
          lastAnswerCorrect={state.lastAnswerCorrect}
          lastAwardedPoints={state.lastAwardedPoints}
          timerEnabled={settings.timerEnabled}
          timerRemaining={state.timerRemaining}
          onSelectOption={submitAnswer}
          onNext={handleNextQuestion}
        />
      ) : null}

      {state.screen === 'chapterSummary' && currentChapter ? (
        <ChapterSummary
          chapter={currentChapter}
          score={currentChapterStats.score}
          correct={currentChapterStats.correct}
          answered={currentChapterStats.answered}
          chapterQuestionCount={currentChapterQuestions.length}
          onContinue={handleContinueAfterSummary}
          onRestart={handleRestartQuiz}
        />
      ) : null}

      {state.screen === 'final' ? (
        <FinalReveal
          totalScore={state.totalScore}
          totalCorrect={state.totalCorrect}
          totalAnswered={state.totalAnswered}
          totalQuestions={totalQuestionCount}
          reveal={reveal}
          onRestart={handleRestartQuiz}
        />
      ) : null}
    </main>
  );
}

export default App;
