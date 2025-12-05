import { useMemo, useState } from 'react';

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  feedback: string;
}

interface MiniQuizProps {
  onComplete?: (score: number, total: number) => void;
}

export const MiniQuiz = ({ onComplete }: MiniQuizProps) => {
  const questions = useMemo<QuizQuestion[]>(
    () => [
      {
        question: "Quel est l'objectif principal du NIRD ?",
        options: [
          'Réduire la dépendance aux Big Tech',
          "Augmenter l'usage de Windows",
          'Encourager les abonnements payants',
        ],
        answer: 'Réduire la dépendance aux Big Tech',
        feedback: 'Bravo ! Un Village Résistant favorise les communs numériques.',
      },
      {
        question: 'Quelle action favorise un numérique durable ?',
        options: [
          'Jeter les ordinateurs anciens',
          'Réemploi du matériel',
          'Acheter des licences propriétaires',
        ],
        answer: 'Réemploi du matériel',
        feedback: 'Réparer et mutualiser, c’est la base du plan NIRD.',
      },
      {
        question: "Quel service libre remplace avantageusement Google Drive ?",
        options: ['Nextcloud', 'iCloud', 'Dropbox'],
        answer: 'Nextcloud',
        feedback: "Nextcloud permet d'héberger ses données au lycée ou dans la collectivité.",
      },
    ],
    []
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAnswer = (option: string) => {
    const currentQuestion = questions[currentIndex];
    const isCorrect = option === currentQuestion.answer;

    const nextScore = isCorrect ? score + 1 : score;
    setScore(nextScore);
    setFeedback(isCorrect ? currentQuestion.feedback : "Aïe… Le Village Résistant privilégie toujours la solution libre.");

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setShowResult(true);
      if (onComplete) {
        onComplete(nextScore, questions.length);
      }
    }
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setShowResult(false);
    setFeedback(null);
  };

  if (showResult) {
    return (
      <section className='mini-quiz quiz-result'>
        <h2>
          Résultat : {score}/{questions.length}
        </h2>
        <p>
          {score === questions.length
            ? 'Magnifique : le Village Résistant te décerne le casque ailé !'
            : 'On sent le potentiel : retente ta chance et construis tes réflexes libres.'}
        </p>
        <button type='button' onClick={restartQuiz}>
          Rejouer
        </button>
      </section>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <section className='mini-quiz'>
      <header>
        <h2>Mini Quiz NIRD</h2>
        <span>
          Question {currentIndex + 1} / {questions.length}
        </span>
      </header>
      <p className='quiz-question'>{currentQuestion.question}</p>
      <div className='quiz-options'>
        {currentQuestion.options.map((option) => (
          <button type='button' key={option} onClick={() => handleAnswer(option)}>
            {option}
          </button>
        ))}
      </div>
      {feedback && <p className='quiz-feedback'>{feedback}</p>}
    </section>
  );
};
