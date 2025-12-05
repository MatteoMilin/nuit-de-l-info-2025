// Types pour l'API Clash Royale
export interface BattleInfo {
  type: string;
  time: string;
  teamCrowns: number;
  opponentCrowns: number;
  minutesAgo: number;
}

export interface VerifyWinResponse {
  success: boolean;
  message: string;
  battleInfo?: BattleInfo;
  minutesAgo?: number;
}

export interface PlayerInfo {
  tag: string;
  name: string;
  trophies: number;
  bestTrophies: number;
  wins: number;
  losses: number;
  battleCount: number;
  threeCrownWins: number;
  challengeCardsWon: number;
  challengeMaxWins: number;
  tournamentCardsWon: number;
  tournamentBattleCount: number;
  role: string;
  donations: number;
  donationsReceived: number;
  totalDonations: number;
  warDayWins: number;
  clanCardsCollected: number;
  clan: {
    tag: string;
    name: string;
    badgeId: number;
  };
  arena: {
    id: number;
    name: string;
  };
  leagueStatistics?: {
    currentSeason: {
      rank: number;
      trophies: number;
      bestTrophies: number;
    };
    previousSeason?: {
      id: string;
      rank: number;
      trophies: number;
      bestTrophies: number;
    };
    bestSeason?: {
      id: string;
      rank: number;
      trophies: number;
    };
  };
}
