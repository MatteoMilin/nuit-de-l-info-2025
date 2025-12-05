interface DependencyGaugeProps {
  value: number;
  max?: number;
}

export const DependencyGauge = ({ value, max = 100 }: DependencyGaugeProps) => {
  const clampedValue = Math.max(0, Math.min(max, value));
  const percentage = Math.round((clampedValue / max) * 100);

  return (
    <section className='dependency-gauge' aria-live='polite'>
      <header>
        <h3>Dépendance au Goliath numérique</h3>
        <span>{percentage}%</span>
      </header>
      <div className='gauge-track'>
        <div
          className='gauge-progress'
          role='progressbar'
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p>
        Objectif : faire baisser la jauge grâce aux actions libres et durables du Village Résistant.
      </p>
    </section>
  );
};
