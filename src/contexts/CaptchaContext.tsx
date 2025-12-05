import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface CaptchaContextType {
  isCaptchaVerified: boolean;
  verifyCaptcha: () => void;
  resetCaptcha: () => void;
}

const CaptchaContext = createContext<CaptchaContextType | undefined>(undefined);

export function CaptchaProvider({ children }: { children: ReactNode }) {
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const verifyCaptcha = () => {
    setIsCaptchaVerified(true);
    // Stocker dans le sessionStorage pour persister pendant la session
    sessionStorage.setItem('captchaVerified', 'true');
  };

  const resetCaptcha = () => {
    setIsCaptchaVerified(false);
    sessionStorage.removeItem('captchaVerified');
  };

  // Vérifier au montage si le captcha était déjà vérifié dans cette session
  useState(() => {
    const verified = sessionStorage.getItem('captchaVerified') === 'true';
    if (verified) {
      setIsCaptchaVerified(true);
    }
  });

  return (
    <CaptchaContext.Provider
      value={{ isCaptchaVerified, verifyCaptcha, resetCaptcha }}
    >
      {children}
    </CaptchaContext.Provider>
  );
}

export function useCaptcha() {
  const context = useContext(CaptchaContext);
  if (context === undefined) {
    throw new Error('useCaptcha must be used within a CaptchaProvider');
  }
  return context;
}
