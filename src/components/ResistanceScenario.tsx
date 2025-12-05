import { useEffect, useMemo, useState } from 'react';

interface ScenarioChoice {
  text: string;
  impact: {
    budget: number;
    ecology: number;
    morale: number;
    progress?: number;
  };
  next: number;
  flavor?: string;
}

interface ScenarioStep {
  id: number;
  text: string;
  choices: ScenarioChoice[];
  end?: string;
  endingType?: 'victory' | 'defeat' | 'neutral';
}

interface ResistanceScenarioProps {
  onProgress?: (progressChange: number, context: string) => void;
  onEnding?: (ending: 'victory' | 'defeat' | 'neutral') => void;
}

interface ScenarioStats {
  budget: number;
  ecology: number;
  morale: number;
}

const INITIAL_STATS: ScenarioStats = {
  budget: 1000,
  ecology: 50,
  morale: 40,
};

export const ResistanceScenario = ({ onProgress, onEnding }: ResistanceScenarioProps) => {
  const [stats, setStats] = useState<ScenarioStats>(INITIAL_STATS);
  const [step, setStep] = useState<number>(0);
  const [history, setHistory] = useState<Array<{ id: string; text: string }>>([]);

  const scenarios = useMemo<ScenarioStep[]>(
    () => [
      {
        id: 0,
        text: "Le support de Windows 10 s'arrête et ton lycée fait face à l'obsolescence programmée. Que fais-tu ?",
        choices: [
          {
            text: 'Tout racheter au prix fort',
            impact: { budget: -800, ecology: -40, morale: -10, progress: 0 },
            next: 1,
            flavor: 'Les cartons de nouveaux PC arrivent, mais la trésorerie souffre…',
          },
          {
            text: 'Réinstaller une distribution GNU/Linux légère',
            impact: { budget: -80, ecology: 20, morale: 5, progress: 20 },
            next: 2,
            flavor: 'Quelques soirées de bidouille plus tard, les machines repartent au quart de tour.',
          },
        ],
      },
      {
        id: 1,
        text: "Tu disposes de PC flambants neufs, mais le budget annuel est à sec. Les clubs numériques ferment leurs portes…",
        choices: [],
        end: 'Défaite : la dépendance au Goliath numérique a vidé les caisses.',
        endingType: 'defeat',
      },
      {
        id: 2,
        text: "Les PC redémarrent, mais le corps enseignant réclame la suite Microsoft Office.",
        choices: [
          {
            text: 'Payer des licences Microsoft 365',
            impact: { budget: -200, ecology: 0, morale: 10, progress: 5 },
            next: 3,
            flavor: 'Le cloud propriétaire revient par la fenêtre.',
          },
          {
            text: 'Former tout le monde à LibreOffice et aux outils NIRD',
            impact: { budget: -20, ecology: 10, morale: 15, progress: 25 },
            next: 4,
            flavor: 'Les ateliers collaboratifs transforment les profs en ambassadeurs du libre.',
          },
        ],
      },
      {
        id: 3,
        text: 'Les élèves disposent de services modernes, mais la dépendance au SaaS verrouille la stratégie numérique.',
        choices: [],
        end: 'Victoire mitigée : autonomie limitée, mais les usages avancent malgré tout.',
        endingType: 'neutral',
      },
      {
        id: 4,
        text: "Les enseignants utilisent LibreOffice, mais le réseau de la salle info est capricieux.",
        choices: [
          {
            text: 'Signer un contrat de maintenance propriétaire',
            impact: { budget: -150, ecology: -10, morale: -5, progress: 0 },
            next: 5,
            flavor: 'Un technicien intervient vite, mais la facture pique et la dépendance poursuit son chemin.',
          },
          {
            text: 'Créer un club de maintenance numérique avec les élèves',
            impact: { budget: -20, ecology: 15, morale: 20, progress: 30 },
            next: 6,
            flavor: "Le club 'Village Résistant' apprend en réparant, l'autonomie devient contagieuse.",
          },
        ],
      },
      {
        id: 5,
        text: 'Le réseau tient bon, mais les factures grimpent et le rectorat s’interroge.',
        choices: [],
        end: 'Défaite : les coûts récurrents ont étouffé la démarche solidaire.',
        endingType: 'defeat',
      },
      {
        id: 6,
        text: 'Le lycée fonctionne désormais avec une équipe autonome, des PC optimisés et une démarche partagée.',
        choices: [],
        end: 'Victoire totale : le Village Résistant devient un modèle NIRD !',
        endingType: 'victory',
      },
    ],
    []
  );

  const currentScenario = scenarios.find((scenario) => scenario.id === step);

  useEffect(() => {
    if (currentScenario?.end && onEnding) {
      onEnding(currentScenario.endingType ?? 'neutral');
    }
  }, [currentScenario, onEnding]);

  const resetScenario = () => {
    setStep(0);
    setStats(INITIAL_STATS);
    setHistory([]);
  };

  const handleChoice = (choice: ScenarioChoice) => {
    setStats((prev) => ({
      budget: prev.budget + choice.impact.budget,
      ecology: prev.ecology + choice.impact.ecology,
      morale: prev.morale + choice.impact.morale,
    }));
    setStep(choice.next);

    if (choice.flavor) {
      const entry = {
        id:
          typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
        text: choice.flavor,
      };
      setHistory((prev) => [entry, ...prev].slice(0, 4));
    }

    if (choice.impact.progress && choice.impact.progress > 0 && onProgress) {
      onProgress(choice.impact.progress, choice.text);
    }
  };

  if (!currentScenario) {
    return null;
  }

  if (currentScenario.end) {
    return (
      <section className='resistance-outcome'>
        <header>
          <h3>{currentScenario.end}</h3>
          <p>
            Budget : {stats.budget} • Écologie : {stats.ecology} • Morale : {stats.morale}
          </p>
        </header>
        {history.length > 0 && (
          <ul>
            {history.map((entry) => (
              <li key={entry.id}>{entry.text}</li>
            ))}
          </ul>
        )}
        <button type='button' onClick={resetScenario}>
          Reprendre la résistance
        </button>
      </section>
    );
  }

  return (
    <section className='resistance-scenario'>
      <header className='scenario-header'>
        <h3>Simulateur de Résistance</h3>
        <div className='scenario-stats'>
          <span>💰 Budget : {stats.budget}</span>
          <span>🌱 Écologie : {stats.ecology}</span>
          <span>🔥 Morale : {stats.morale}</span>
        </div>
      </header>
      <p className='scenario-text'>{currentScenario.text}</p>
      <div className='scenario-choices'>
        {currentScenario.choices.map((choice) => (
          <button type='button' key={choice.text} onClick={() => handleChoice(choice)}>
            {choice.text}
          </button>
        ))}
      </div>
      {history.length > 0 && (
        <aside className='scenario-history'>
          <h4>Journal de mission</h4>
          <ul>
            {history.map((entry) => (
              <li key={entry.id}>{entry.text}</li>
            ))}
          </ul>
        </aside>
      )}
    </section>
  );
};
