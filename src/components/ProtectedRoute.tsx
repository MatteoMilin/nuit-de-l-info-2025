import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useCaptcha } from '../contexts/CaptchaContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isCaptchaVerified } = useCaptcha();

  if (!isCaptchaVerified) {
    // Rediriger vers le captcha si pas vérifié
    return <Navigate to='/' replace />;
  }

  return <>{children}</>;
}
