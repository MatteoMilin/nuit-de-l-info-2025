import { useState } from 'react';

const Flashcard = ({ question, answer }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className='flashcard' onClick={() => setShowAnswer(!showAnswer)}>
      {showAnswer ? <p className='answer'>{answer}</p> : <p className='question'>{question}</p>}
    </div>
  );
};

export const Flashcards = () => {
  const cards = [
    { question: "Qu'est-ce que le NIRD ?", answer: "Numérique Inclusif, Responsable et Durable, démarche pour un numérique éthique et autonome dans les écoles." },
    { question: "Pourquoi utiliser Linux ?", answer: "Pour lutter contre l'obsolescence programmée et promouvoir le logiciel libre." },
    { question: "Comment réduire la dépendance aux Big Tech ?", answer: "Réemploi du matériel, logiciels libres, mutualisation des ressources." },
  ];

  return (
    <div className='flashcards-container'>
      <h2>Flashcards NIRD</h2>
      {cards.map((card, index) => (
        <Flashcard key={index} question={card.question} answer={card.answer} />
      ))}
    </div>
  );
};
