import type { CSSProperties } from 'react';
import type { RevealConfig } from '../types';
import { calculateAccuracy, resolveAssetPath } from '../lib/quiz';

interface FinalRevealProps {
  totalScore: number;
  totalCorrect: number;
  totalAnswered: number;
  totalQuestions: number;
  reveal: RevealConfig;
  onRestart: () => void;
}

export function FinalReveal({
  totalScore,
  totalCorrect,
  totalAnswered,
  totalQuestions,
  reveal,
  onRestart,
}: FinalRevealProps) {
  const accuracy = calculateAccuracy(totalCorrect, totalAnswered);
  const showEasterEgg = totalScore >= reveal.easterEgg.minScore;

  return (
    <section className="panel final-panel fade-in" aria-labelledby="final-title">
      <div className="confetti" aria-hidden="true">
        {Array.from({ length: 14 }).map((_, index) => (
          <span key={`confetti-${index}`} style={{ '--delay': `${index * 0.12}s` } as CSSProperties} />
        ))}
      </div>

      <p className="eyebrow">Фінальний розділ пройдено</p>
      <h2 id="final-title">{reveal.title}</h2>

      <div className="summary-grid">
        <article>
          <h3>Загальний рахунок</h3>
          <p>{totalScore}</p>
        </article>
        <article>
          <h3>Точність</h3>
          <p>{accuracy}%</p>
        </article>
        <article>
          <h3>Питань</h3>
          <p>
            {totalCorrect}/{totalQuestions}
          </p>
        </article>
      </div>

      <article className="reveal-card">
        <img src={resolveAssetPath(reveal.image)} alt="Зображення фінального подарунка" loading="lazy" />
        <p>{reveal.message}</p>
        {reveal.link ? (
          <a className="button link" href={reveal.link.url} target="_blank" rel="noreferrer">
            {reveal.link.label}
          </a>
        ) : null}
      </article>

      {showEasterEgg ? (
        <article className="easter-egg">
          <h3>{reveal.easterEgg.title}</h3>
          <p>{reveal.easterEgg.message}</p>
          {reveal.easterEgg.image ? (
            <img src={resolveAssetPath(reveal.easterEgg.image)} alt="Бонусне розкриття" loading="lazy" />
          ) : null}
        </article>
      ) : null}

      <button className="button primary" type="button" onClick={onRestart}>
        Грати ще раз
      </button>
    </section>
  );
}
