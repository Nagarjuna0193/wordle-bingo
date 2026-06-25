export interface BingoCell {
  id: string;
  label: string;
  description: string;
  type: string;
  value?: string | number;
  stamped: boolean;
  row: number;
  col: number;
  isFree?: boolean;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  totalGuesses: number;
  bingosAchieved: number;
  boardsCleared: number;
  currentStreak: number;
  maxStreak: number;
  chips: number; // Gold Chips currency for power-ups
}

export type LetterState = 'correct' | 'present' | 'absent' | 'empty';

export interface GuessLetter {
  letter: string;
  state: LetterState;
}

export type WordleGuess = GuessLetter[];

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  count: number;
}
