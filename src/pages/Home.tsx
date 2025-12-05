import { useState } from 'react';
import ClashRoyaleDeckCaptcha from '../components/ClashRoyaleDeckCaptcha';
import { Flashcards } from '../components/Flashcard';
import { MiniQuiz } from '../components/MiniQuiz';

export const HomePage = () => {
  const [isVerified, setIsVerified] = useState(true);

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
      <div className='success-screen'>
        <h1>Bienvenue, Champion !</h1>
        <p>Tu as prouvé ta valeur sur le terrain de bataille numérique.</p>
        <br></br>
        <Flashcards />
        <br></br>
        <br></br>
        <MiniQuiz />
        <br></br>
        <button type='button' onClick={() => setIsVerified(false)} className='retry-button'>
          Recommencer
        </button>
      </div>
    </div>
  );
};
