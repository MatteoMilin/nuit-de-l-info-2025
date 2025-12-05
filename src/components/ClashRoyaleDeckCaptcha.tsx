import { useState } from 'react';
import type { VerifyWinResponse } from '../types/clash-royale';
import '../style/ClashRoyaleDeckCaptcha.css';

interface Card {
  name: string;
  id: number;
  level?: number;
  rarity?: string;
  iconUrl: string | null;
}

interface ChallengeDeckResponse {
  playerName: string;
  playerTag: string;
  challengeDeck: Card[];
  message?: string;
}

interface ClashRoyaleDeckCaptchaProps {
  onSuccess: () => void;
  onError?: (error: string) => void;
}

export default function ClashRoyaleDeckCaptcha({
  onSuccess,
  onError,
}: ClashRoyaleDeckCaptchaProps) {
  const [playerTag, setPlayerTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingDeck, setLoadingDeck] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [challengeDeck, setChallengeDeck] = useState<Card[] | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [step, setStep] = useState<'enter-tag' | 'show-deck' | 'verify'>('enter-tag');

  const handleLoadDeck = async () => {
    if (!playerTag.trim()) {
      setError('Please enter your player tag');
      return;
    }

    setLoadingDeck(true);
    setError('');

    try {
      const cleanTag = playerTag.trim().replace('#', '');
      const response = await fetch(`/api/player/${cleanTag}/cards`);
      const data: ChallengeDeckResponse = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to load cards');
        onError?.(data.error || 'Failed to load cards');
        return;
      }

      setChallengeDeck(data.challengeDeck);
      setPlayerName(data.playerName);
      setStep('show-deck');
      setMessage(`Welcome ${data.playerName}! Here's your challenge deck`);
    } catch (err) {
      const errorMessage = 'Failed to connect to the server';
      setError(errorMessage);
      onError?.(errorMessage);
      console.error('Error loading deck:', err);
    } finally {
      setLoadingDeck(false);
    }
  };

  const handleVerify = async () => {
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
          requiredDeck: challengeDeck,
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
        }, 2000);
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
    if (e.key === 'Enter' && !loadingDeck && step === 'enter-tag') {
      handleLoadDeck();
    }
  };

  return (
    <div className="clash-deck-captcha-container">
      <div className="clash-deck-captcha-card">
        <div className="clash-deck-captcha-header">
          <h2>Clash Royale Deck Challenge</h2>
          <p>Prove you're a champion by winning with our special deck!</p>
        </div>

        {step === 'enter-tag' && (
          <>
            <div className="clash-deck-captcha-instructions">
              <ol>
                <li>Enter your Player Tag</li>
                <li>We'll generate a custom deck from your cards</li>
                <li>Win a battle using ONLY this deck</li>
                <li>Come back and verify!</li>
              </ol>
            </div>

            <div className="clash-deck-captcha-input-group">
              <label htmlFor="playerTag">
                Player Tag
                <span className="clash-deck-captcha-hint">
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
                disabled={loadingDeck}
                className="clash-deck-captcha-input"
              />
            </div>

            {error && (
              <div className="clash-deck-captcha-message error">
                {error}
              </div>
            )}

            <button
              onClick={handleLoadDeck}
              disabled={loadingDeck || !playerTag.trim()}
              className="clash-deck-captcha-button"
            >
              {loadingDeck ? (
                <>
                  <span className="spinner"></span>
                  Loading your cards...
                </>
              ) : (
                'Generate Challenge Deck'
              )}
            </button>
          </>
        )}

        {step === 'show-deck' && challengeDeck && (
          <>
            <div className="clash-deck-player-info">
              <h3>👤 {playerName}</h3>
              <p>Your Challenge Deck (8 cards):</p>
            </div>

            <div className="clash-deck-cards-grid">
              {challengeDeck.map((card, index) => (
                <div key={index} className={`clash-deck-card rarity-${card.rarity?.toLowerCase() || 'common'}`}>
                  {card.iconUrl && (
                    <img src={card.iconUrl} alt={card.name} />
                  )}
                  <div className="clash-deck-card-info">
                    <span className="card-name">{card.name}</span>
                    <div className="card-details">
                      {card.level && (
                        <span className="card-level">Lvl {card.level}</span>
                      )}
                      {card.rarity && (
                        <span className="card-rarity">{card.rarity}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="clash-deck-captcha-instructions challenge">
              <p><strong>⚔️ Your Mission:</strong></p>
              <ol>
                <li>Copy this EXACT deck in Clash Royale</li>
                <li>Play a battle (any mode)</li>
                <li>WIN the battle!</li>
                <li>Come back within 15 minutes and verify</li>
              </ol>
            </div>

            {error && (
              <div className="clash-deck-captcha-message error">
                {error}
              </div>
            )}

            {message && (
              <div className="clash-deck-captcha-message success">
                {message}
              </div>
            )}

            <div className="clash-deck-button-group">
              <button
                onClick={() => setStep('enter-tag')}
                className="clash-deck-captcha-button secondary"
                disabled={loading}
              >
                Change Deck
              </button>
              <button
                onClick={handleVerify}
                disabled={loading}
                className="clash-deck-captcha-button"
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
            </div>
          </>
        )}

        <div className="clash-deck-captcha-footer">
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
