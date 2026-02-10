import { Progress } from './Progress';
import type { DisplayOption, Question } from '../types';
import { resolveAssetPath } from '../lib/quiz';

interface QuestionCardProps {
  chapterTitle: string;
  question: Question;
  displayOptions: DisplayOption[];
  questionNumber: number;
  chapterQuestionCount: number;
  totalAnswered: number;
  totalQuestionCount: number;
  selectedOriginalOptionIndex: number | null;
  questionLocked: boolean;
  lastAnswerCorrect: boolean | null;
  lastAwardedPoints: number;
  timerEnabled: boolean;
  timerRemaining: number;
  onSelectOption: (option: DisplayOption) => void;
  onNext: () => void;
}

export function QuestionCard({
  chapterTitle,
  question,
  displayOptions,
  questionNumber,
  chapterQuestionCount,
  totalAnswered,
  totalQuestionCount,
  selectedOriginalOptionIndex,
  questionLocked,
  lastAnswerCorrect,
  lastAwardedPoints,
  timerEnabled,
  timerRemaining,
  onSelectOption,
  onNext,
}: QuestionCardProps) {
  const progressLabel = `Питання ${questionNumber}/${chapterQuestionCount}`;
  const chapterProgress = questionNumber;
  const pointsLabel = (points: number) => {
    const mod10 = points % 10;
    const mod100 = points % 100;

    if (mod10 === 1 && mod100 !== 11) {
      return 'бал';
    }

    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
      return 'бали';
    }

    return 'балів';
  };

  return (
    <section className="panel question-panel fade-in" aria-labelledby="question-title">
      <div className="question-header">
        <p className="eyebrow">{chapterTitle}</p>
        <Progress label={progressLabel} current={chapterProgress} total={chapterQuestionCount} />
        <Progress label="Загалом" current={totalAnswered} total={totalQuestionCount} />
      </div>

      {timerEnabled ? (
        <div className="timer" role="status" aria-live="polite">
          Залишилось часу: {timerRemaining} с
        </div>
      ) : null}

      <h2 id="question-title">{question.text}</h2>

      <div className="option-grid">
        {displayOptions.map((option, index) => {
          const isSelected = selectedOriginalOptionIndex === option.originalIndex;
          const isCorrect = option.originalIndex === question.correctOptionIndex;

          let buttonClass = 'option';
          if (questionLocked && isCorrect) {
            buttonClass += ' option-correct';
          } else if (questionLocked && isSelected && !isCorrect) {
            buttonClass += ' option-wrong';
          } else if (isSelected) {
            buttonClass += ' option-selected';
          }

          return (
            <button
              key={`${question.id}-${option.originalIndex}`}
              type="button"
              className={buttonClass}
              onClick={() => onSelectOption(option)}
              disabled={questionLocked}
              aria-pressed={isSelected}
            >
              <span className="option-index">{String.fromCharCode(65 + index)}</span>
              <span>{option.text}</span>
            </button>
          );
        })}
      </div>

      {questionLocked ? (
        <section className={`feedback ${lastAnswerCorrect ? 'good' : 'bad'}`} aria-live="polite">
          <p className="feedback-title">{lastAnswerCorrect ? 'Правильно!' : 'Цього разу ні.'}</p>
          <p>{lastAnswerCorrect ? `+${lastAwardedPoints} ${pointsLabel(lastAwardedPoints)}` : '+0 балів'}</p>
          {question.explanation ? <p>{question.explanation}</p> : null}
          {question.momentCard ? (
            <figure className="moment-card">
              <img
                src={resolveAssetPath(question.momentCard.image)}
                alt={question.momentCard.caption}
                loading="lazy"
              />
              <figcaption>{question.momentCard.caption}</figcaption>
              {question.momentCard.audio ? (
                <audio controls preload="none" src={resolveAssetPath(question.momentCard.audio)}>
                  Ваш браузер не підтримує відтворення аудіо.
                </audio>
              ) : null}
            </figure>
          ) : null}
          <button className="button primary" type="button" onClick={onNext}>
            Далі
          </button>
        </section>
      ) : null}
    </section>
  );
}
