import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const CLASH_ROYALE_API_KEY = process.env.CLASH_ROYALE_API_KEY || '';
const BASE_URL = 'https://api.clashroyale.com/v1';

app.post('/api/verify-win', async (req, res) => {
  try {
    const { playerTag, requiredDeck } = req.body;

    if (!playerTag) {
      return res.status(400).json({ error: 'Player tag is required' });
    }

    if (!CLASH_ROYALE_API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    const cleanTag = playerTag.replace('#', '');

    const response = await fetch(
      `${BASE_URL}/players/%23${cleanTag}/battlelog`,
      {
        headers: {
          Authorization: `Bearer ${CLASH_ROYALE_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'Player not found' });
      }
      return res.status(response.status).json({ error: 'Failed to fetch battle log' });
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return res.json({
        success: false,
        message: 'No recent battles found',
      });
    }

    const lastBattle = data[0];

    const battleTime = new Date(lastBattle.battleTime);
    const now = new Date();
    const diffMinutes = (now.getTime() - battleTime.getTime()) / (1000 * 60);

    if (diffMinutes > 15) {
      return res.json({
        success: false,
        message: 'Your last battle is too old. Please play a new game!',
        minutesAgo: Math.floor(diffMinutes),
      });
    }

    const team = lastBattle.team;
    const opponent = lastBattle.opponent;

    const player = team.find((p) => p.tag === `#${cleanTag}`);

    if (!player) {
      return res.json({
        success: false,
        message: 'Could not find your player in the battle',
      });
    }

    const teamCrowns = team.reduce((sum, p) => sum + (p.crowns || 0), 0);
    const opponentCrowns = opponent.reduce((sum, p) => sum + (p.crowns || 0), 0);

    const isWin = teamCrowns > opponentCrowns;

    if (requiredDeck && requiredDeck.length > 0) {
      const usedDeck = player.cards || [];
      const usedCardIds = usedDeck.map(card => card.id);
      const requiredCardIds = requiredDeck.map(card => card.id);

      const hasAllRequiredCards = requiredCardIds.every(id => usedCardIds.includes(id));

      if (!hasAllRequiredCards) {
        return res.json({
          success: false,
          message: 'You must use the challenge deck! Check the required cards.',
          battleInfo: {
            type: lastBattle.type,
            time: lastBattle.battleTime,
            teamCrowns,
            opponentCrowns,
            minutesAgo: Math.floor(diffMinutes),
            usedDeck: usedDeck.map(c => c.name),
            requiredDeck: requiredDeck.map(c => c.name),
          },
        });
      }
    }

    return res.json({
      success: isWin,
      message: isWin
        ? requiredDeck
          ? 'Victory with challenge deck verified! You are a true champion!'
          : 'Victory verified! Welcome, champion!'
        : 'You lost your last battle. Try again!',
      battleInfo: {
        type: lastBattle.type,
        time: lastBattle.battleTime,
        teamCrowns,
        opponentCrowns,
        minutesAgo: Math.floor(diffMinutes),
        deckVerified: !!requiredDeck,
      },
    });
  } catch (error) {
    console.error('Error verifying win:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

app.get('/api/player/:tag/cards', async (req, res) => {
  try {
    const { tag } = req.params;
    const cleanTag = tag.replace('#', '');

    const response = await fetch(
      `${BASE_URL}/players/%23${cleanTag}`,
      {
        headers: {
          Authorization: `Bearer ${CLASH_ROYALE_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'Player not found' });
      }
      return res.status(response.status).json({ error: 'Failed to fetch player data' });
    }

    const data = await response.json();

    const allCards = data.cards || [];

    if (allCards.length < 8) {
      return res.status(400).json({
        error: 'Not enough cards',
        message: 'You need at least 8 cards'
      });
    }

    const shuffled = [...allCards].sort(() => Math.random() - 0.5);
    const challengeDeck = shuffled.slice(0, 8).map(card => ({
      name: card.name,
      id: card.id,
      level: card.level,
      rarity: card.rarity,
      iconUrl: card.iconUrls?.medium || null
    }));

    return res.json({
      playerName: data.name,
      playerTag: data.tag,
      challengeDeck,
      totalCards: allCards.length,
      message: '🎲 Random deck from your cards!'
    });
  } catch (error) {
    console.error('Error generating random deck:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/player/:tag', async (req, res) => {
  try {
    const { tag } = req.params;
    const cleanTag = tag.replace('#', '');

    const response = await fetch(
      `${BASE_URL}/players/%23${cleanTag}`,
      {
        headers: {
          Authorization: `Bearer ${CLASH_ROYALE_API_KEY}`,
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch player data' });
    }

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error('Error fetching player:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Clash Royale Proxy Server running on http://localhost:${PORT}`);
  console.log(`API Key configured: ${CLASH_ROYALE_API_KEY ? 'Y' : 'N'}`);
});
