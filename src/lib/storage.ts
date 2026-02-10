import type { QuizState } from '../types';

const STORAGE_KEY = 'our-moments-quiz-state-v1';

export function loadSavedState(): QuizState | null {
  const rawValue = localStorage.getItem(STORAGE_KEY);
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as QuizState;
    return parsed;
  } catch {
    return null;
  }
}

export function saveState(state: QuizState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearSavedState(): void {
  localStorage.removeItem(STORAGE_KEY);
}
