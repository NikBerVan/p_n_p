import type { Chapter, ChapterStats } from '../types';

interface ChapterSelectionProps {
  chapters: Chapter[];
  chapterStats: Record<string, ChapterStats>;
  currentChapterIndex: number;
  totalScore: number;
  onStartChapter: () => void;
  onRestart: () => void;
}

export function ChapterSelection({
  chapters,
  chapterStats,
  currentChapterIndex,
  totalScore,
  onStartChapter,
  onRestart,
}: ChapterSelectionProps) {
  return (
    <section className="panel fade-in" aria-labelledby="chapter-select-title">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Вибір розділу</p>
          <h2 id="chapter-select-title">Обери наступний розділ</h2>
        </div>
        <div className="score-pill">Рахунок: {totalScore}</div>
      </div>
      <div className="chapter-grid" role="list">
        {chapters.map((chapter, index) => {
          const stats = chapterStats[chapter.id];
          const isCompleted = index < currentChapterIndex;
          const isCurrent = index === currentChapterIndex;
          const statusLabel = isCompleted ? 'Завершено' : isCurrent ? 'Поточний' : 'Заблоковано';

          return (
            <article
              key={chapter.id}
              role="listitem"
              className={`chapter-card ${isCurrent ? 'current' : ''} ${isCompleted ? 'done' : ''}`}
            >
              <p className="chapter-order">Розділ {index + 1}</p>
              <h3>{chapter.title}</h3>
              <p>{chapter.description}</p>
              <div className="chapter-meta">
                <span>{statusLabel}</span>
                {stats ? <span>{stats.correct} правильно</span> : <span>0 правильно</span>}
              </div>
            </article>
          );
        })}
      </div>
      <div className="actions">
        <button className="button primary" type="button" onClick={onStartChapter}>
          Почати розділ {currentChapterIndex + 1}
        </button>
        <button className="button ghost" type="button" onClick={onRestart}>
          Перезапустити квіз
        </button>
      </div>
    </section>
  );
}
