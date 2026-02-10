import { describe, expect, it } from 'vitest';
import {
  calculatePoints,
  deterministicOptions,
  nextScreenAfterQuestion,
  nextScreenAfterSummary,
} from './quiz';
import type { QuizSettings } from '../types';

const baseSettings: QuizSettings = {
  chapterQuestionCount: 10,
  basePointsPerCorrect: 1,
  timerEnabled: false,
  questionTimeLimitSeconds: 20,
  timerBonusMaxPoints: 1,
  shuffleOptions: true,
};

describe('calculatePoints', () => {
  it('returns base points for a correct answer when timer is disabled', () => {
    const points = calculatePoints(true, 12, baseSettings);
    expect(points).toBe(1);
  });

  it('returns zero points for an incorrect answer', () => {
    const points = calculatePoints(false, 20, baseSettings);
    expect(points).toBe(0);
  });

  it('adds timer bonus points when timer mode is enabled', () => {
    const timedSettings: QuizSettings = {
      ...baseSettings,
      timerEnabled: true,
      timerBonusMaxPoints: 1,
    };

    const points = calculatePoints(true, 19, timedSettings);
    expect(points).toBe(2);
  });
});

describe('nextScreenAfterQuestion', () => {
  it('keeps user on question screen for non-final question', () => {
    const nextScreen = nextScreenAfterQuestion(3, 10);
    expect(nextScreen).toBe('question');
  });

  it('moves to chapter summary on final chapter question', () => {
    const nextScreen = nextScreenAfterQuestion(9, 10);
    expect(nextScreen).toBe('chapterSummary');
  });
});

describe('nextScreenAfterSummary', () => {
  it('returns chapterSelect when more chapters remain', () => {
    expect(nextScreenAfterSummary(1, 5)).toBe('chapterSelect');
  });

  it('returns final on the last chapter summary', () => {
    expect(nextScreenAfterSummary(4, 5)).toBe('final');
  });
});

describe('deterministicOptions', () => {
  it('always returns the same order for the same input', () => {
    const first = deterministicOptions('c1-q1', ['A', 'B', 'C', 'D'], true).map(
      (option) => option.originalIndex,
    );
    const second = deterministicOptions('c1-q1', ['A', 'B', 'C', 'D'], true).map(
      (option) => option.originalIndex,
    );

    expect(first).toEqual(second);
  });
});
