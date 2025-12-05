import { useState } from 'react';
import type { VerifyWinResponse } from '../types/clash-royale';
import '../style/ClashRoyaleCaptcha.css';

interface ClashRoyaleCaptchaProps {
  onSuccess: () => void;
  onError?: (error: string) => void;
}

export default function ClashRoyaleCaptcha({
  onSuccess,
  onError,
}: ClashRoyaleCaptchaProps) {
  const [playerTag, setPlayerTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async () => {
    if (!playerTag.trim()) {
      setError('Please enter your player tag');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/verify-win', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerTag: playerTag.trim(),
        }),
      });

      const data: VerifyWinResponse = await response.json();

      if (!response.ok) {
        setError(data.message || 'Failed to verify');
        onError?.(data.message || 'Failed to verify');
        return;
      }

      if (data.success) {
        setMessage(data.message);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setError(data.message);
        onError?.(data.message);
      }
    } catch (err) {
      const errorMessage = 'Failed to connect to the server';
      setError(errorMessage);
      onError?.(errorMessage);
      console.error('Error verifying win:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      handleVerify();
    }
  };

  return (
    <div className="clash-captcha-container">
      <div className="clash-captcha-card">
        <div className="clash-captcha-header">
          <h2>Clash Royale Captcha</h2>
          <p>Prove you're a champion by winning a battle!</p>
        </div>

        <div className="clash-captcha-instructions">
          <ol>
            <li>Open Clash Royale</li>
            <li>Win a battle (any game mode)</li>
            <li>Enter your Player Tag below</li>
            <li>Click verify within 15 minutes!</li>
          </ol>
        </div>

        <div className="clash-captcha-input-group">
          <label htmlFor="playerTag">
            Player Tag
            <span className="clash-captcha-hint">
              (Find it in your profile, e.g., #8L9Y2JQV)
            </span>
          </label>
          <input
            id="playerTag"
            type="text"
            value={playerTag}
            onChange={(e) => setPlayerTag(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="#YOUR_TAG"
            disabled={loading}
            className="clash-captcha-input"
          />
        </div>

        {error && (
          <div className="clash-captcha-message error">
            {error}
          </div>
        )}

        {message && (
          <div className="clash-captcha-message success">
            {message}
          </div>
        )}

        <button
          onClick={handleVerify}
          disabled={loading || !playerTag.trim()}
          className="clash-captcha-button"
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Verifying...
            </>
          ) : (
            'Verify Victory'
          )}
        </button>

        <div className="clash-captcha-footer">
          <p>
            Don't have Clash Royale?{' '}
            <a
              href="https://clashroyale.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Download it here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
