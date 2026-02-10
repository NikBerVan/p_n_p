interface ProgressProps {
  label: string;
  current: number;
  total: number;
}

export function Progress({ label, current, total }: ProgressProps) {
  const percentage = total <= 0 ? 0 : Math.round((current / total) * 100);

  return (
    <section className="progress-card" aria-label={`${label} прогрес`}>
      <div className="progress-head">
        <span>{label}</span>
        <span>
          {current}/{total}
        </span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
      >
        <div className="progress-fill" style={{ width: `${percentage}%` }} />
      </div>
    </section>
  );
}
