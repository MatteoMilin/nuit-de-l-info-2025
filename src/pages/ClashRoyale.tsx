import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClashRoyaleDeckCaptcha from '../components/ClashRoyaleDeckCaptcha';
import { useCaptcha } from '../contexts/CaptchaContext';

export const ClashRoyalePage = () => {
  const navigate = useNavigate();
  const { isCaptchaVerified, verifyCaptcha } = useCaptcha();

  // Si déjà vérifié, rediriger vers le login
  useEffect(() => {
    if (isCaptchaVerified) {
      navigate('/login', { replace: true });
    }
  }, [isCaptchaVerified, navigate]);

  const handleSuccess = () => {
    verifyCaptcha();
    navigate('/login');
  };

  return (
    <ClashRoyaleDeckCaptcha
      onSuccess={handleSuccess}
      onError={(error) => console.error('Captcha error:', error)}
    />
  );
};
