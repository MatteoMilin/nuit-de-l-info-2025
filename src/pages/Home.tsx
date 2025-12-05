import { useState } from 'react';
import { AlternativeFinder } from '../components/AlternativeFinder';
import ClashRoyaleDeckCaptcha from '../components/ClashRoyaleDeckCaptcha';
import { DependencyGauge } from '../components/DependencyGauge';
import { Flashcards } from '../components/Flashcard';
import { MiniQuiz } from '../components/MiniQuiz';
import { ResistanceScenario } from '../components/ResistanceScenario';

export const HomePage = () => {
  const [isVerified, setIsVerified] = useState(true);
  const [dependence, setDependence] = useState(100);
  const [eventLog, setEventLog] = useState<Array<{ id: string; text: string }>>([]);

  const registerProgress = (amount: number, source: string) => {
    if (amount <= 0) {
      return;
    }

    setDependence((prev) => Math.max(0, prev - amount));
    const logEntry = {
      id:
        typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      text: `-${amount}% : ${source}`,
    };
    setEventLog((prev) => [logEntry, ...prev].slice(0, 6));
  };

  const handleQuizCompletion = (score: number, total: number) => {
    const reduction = Math.round((score / total) * 25);
    registerProgress(reduction, 'Réussite du quiz NIRD');
  };

  const handleScenarioProgress = (progressChange: number, context: string) => {
    registerProgress(Math.round(progressChange / 2), context);
  };

  const handleScenarioEnding = (ending: 'victory' | 'defeat' | 'neutral') => {
    if (ending === 'victory') {
      registerProgress(15, 'Victoire du Village Résistant');
    }
  };

  const handleAlternativeAdoption = (tool: { proprietary: string; open: string }) => {
    registerProgress(8, `Adoption de ${tool.open}`);
  };

  if (!isVerified) {
    return (
      <ClashRoyaleDeckCaptcha
        onSuccess={() => setIsVerified(true)}
        onError={(error) => console.error('Captcha error:', error)}
      />
    );
  }

  return (
    <div className='app-container'>
      <div className='success-screen village-layout'>
        <header className='village-header'>
          <h1>Bienvenue au Village Résistant !</h1>
          <p>Chaque adoption de logiciel libre fait reculer la dépendance aux écosystèmes fermés.</p>
        </header>

        <DependencyGauge value={dependence} />

        <div className='village-content'>
          <aside className='village-aside'>
            <Flashcards />
            <section className='event-log'>
              <h3>Chroniques du Village</h3>
              {eventLog.length === 0 ? (
                <p>Aucune action résistante pour le moment. Lances-toi !</p>
              ) : (
                <ul>
                  {eventLog.map((entry) => (
                    <li key={entry.id}>{entry.text}</li>
                  ))}
                </ul>
              )}
            </section>
          </aside>

          <div className='village-main'>
            <ResistanceScenario
              onProgress={handleScenarioProgress}
              onEnding={handleScenarioEnding}
            />
            <MiniQuiz onComplete={handleQuizCompletion} />
            <AlternativeFinder onAdopt={handleAlternativeAdoption} />
          </div>
        </div>

        <footer className='village-footer'>
          <button type='button' onClick={() => setIsVerified(false)} className='retry-button'>
            Refaire le parcours de résistance
          </button>
        </footer>
      </div>
    </div>
  );
};
