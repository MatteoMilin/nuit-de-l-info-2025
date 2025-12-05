import { useState } from 'react';
import ClashRoyaleDeckCaptcha from '../components/ClashRoyaleDeckCaptcha';

export const HomePage = () => {
  const [isVerified, setIsVerified] = useState(false);

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
        <p>Tu as prouvé ta valeur sur le terrain de bataille.</p>
        <p>Accès autorisé</p>
        <button type='button' onClick={() => setIsVerified(false)} className='retry-button'>
          Recommencer
        </button>
      </div>
    </div>
  );
};
