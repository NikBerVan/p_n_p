interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <section className="panel intro-panel fade-in" aria-labelledby="intro-title">
      <p className="eyebrow">Мініквіз</p>
      <h1 id="intro-title">Наші моменти</h1>
      <p className="lead">
        Декілька розділів, аби згадати наші основні та не дуже моменти та один фінальний сюрприз. Готова знову
        прожити наші запам'ятовані миті?
      </p>
      <button className="button primary" type="button" onClick={onStart}>
        Почати квіз
      </button>
    </section>
  );
}
