import { useState } from 'react';

export const MiniQuiz = () => {
  const questions = [
    {
      question: "Quel est l'objectif principal du NIRD ?",
      options: ["Réduire la dépendance aux Big Tech", "Augmenter l'usage de Windows", "Encourager les abonnements payants"],
      answer: "Réduire la dépendance aux Big Tech"
    },
    {
      question: "Quelle action favorise un numérique durable ?",
      options: ["Jeter les ordinateurs anciens", "Réemploi du matériel", "Acheter des licences propriétaires"],
      answer: "Réemploi du matériel"
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (option: string) => {
    if (option === questions[currentIndex].answer) setScore(score + 1);
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <div className='quiz-result'>
        <h2>Résultat : {score}/{questions.length}</h2>
        <button onClick={() => { setCurrentIndex(0); setScore(0); setShowResult(false); }}>Rejouer</button>
      </div>
    );
  }

  return (
    <div className='mini-quiz'>
      <h2>Mini Quiz NIRD</h2>
      <p>{questions[currentIndex].question}</p>
      {questions[currentIndex].options.map((opt, i) => (
        <button key={i} onClick={() => handleAnswer(opt)} className='quiz-option'>{opt}</button>
      ))}
    </div>
  );
};
