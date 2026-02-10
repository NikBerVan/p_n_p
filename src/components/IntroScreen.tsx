interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <section className="panel intro-panel fade-in" aria-labelledby="intro-title">
      <p className="eyebrow">Мініквіз</p>
      <h1 id="intro-title">Наші моменти</h1>
      <p className="lead">
        П'ять розділів, п'ятдесят запитань і один фінальний сюрприз. Готова(-ий) знову
        прожити наші найкращі миті?
      </p>
      <button className="button primary" type="button" onClick={onStart}>
        Почати квіз
      </button>
    </section>
  );
}
