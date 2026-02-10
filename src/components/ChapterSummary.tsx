import { Progress } from './Progress';
import type { Chapter } from '../types';
import { calculateAccuracy } from '../lib/quiz';

interface ChapterSummaryProps {
  chapter: Chapter;
  score: number;
  correct: number;
  answered: number;
  chapterQuestionCount: number;
  onContinue: () => void;
  onRestart: () => void;
}

export function ChapterSummary({
  chapter,
  score,
  correct,
  answered,
  chapterQuestionCount,
  onContinue,
  onRestart,
}: ChapterSummaryProps) {
  const accuracy = calculateAccuracy(correct, answered);

  return (
    <section className="panel summary-panel fade-in" aria-labelledby="chapter-summary-title">
      <p className="eyebrow">Розділ завершено</p>
      <h2 id="chapter-summary-title">{chapter.title}</h2>
      <Progress label="Точність розділу" current={accuracy} total={100} />
      <div className="summary-grid">
        <article>
          <h3>Рахунок</h3>
          <p>{score}</p>
        </article>
        <article>
          <h3>Правильно</h3>
          <p>
            {correct}/{chapterQuestionCount}
          </p>
        </article>
        <article>
          <h3>Відповідей</h3>
          <p>{answered}</p>
        </article>
      </div>
      <div className="actions">
        <button className="button primary" type="button" onClick={onContinue}>
          Продовжити
        </button>
        <button className="button ghost" type="button" onClick={onRestart}>
          Перезапустити квіз
        </button>
      </div>
    </section>
  );
}
