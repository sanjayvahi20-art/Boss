export type ActiveTab = 'home' | 'contests' | 'wallet' | 'leaderboard' | 'profile';

export interface Contest {
  id: string;
  title: string;
  subject: string;
  category: 'SSC' | 'UPSC' | 'Railway' | 'UP Police' | 'Other';
  status: 'live' | 'upcoming' | 'free' | 'completed';
  entryFee: number;
  totalPrize: number;
  totalSlots: number;
  registeredSlots: number;
  durationMinutes: number;
  totalQuestions: number;
  hasRegistered: boolean;
  isTaken: boolean;
  score?: number;
  rewards?: string;
  startTime?: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'contest_entry' | 'winnings' | 'bonus' | 'referral';
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface LeaderboardPlayer {
  rank: number;
  name: string;
  avatarText: string;
  score: number;
  winnings: string;
  badge?: string;
  isCurrentUser?: boolean;
  correctAnswers?: number;
  timeSpentSeconds?: number;
}

export interface UserProfile {
  name: string;
  level: number;
  avatarText: string;
  xp: number;
  maxXp: number;
  quizzesPlayed: number;
  contestsWon: number;
  totalWinnings: number;
  upiId: string;
  referralCode: string;
  avatarUrl?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}
