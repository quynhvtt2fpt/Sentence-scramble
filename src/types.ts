export type GameState = 'IDLE' | 'READY' | 'PLAYING' | 'PAUSED' | 'TIME_UP' | 'ANSWER_REVEALED';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type TimerOption = 30 | 60 | 120 | number;

export type CardSize = 'NORMAL' | 'LARGE' | 'HUGE';

export interface SentenceItem {
  id: string;
  originalSentence: string;
  tokens: string[];
  category?: string;
  createdAt: number;
}

export interface WordCardData {
  id: string;
  text: string;
  x: number; // percentage 0 to 100 or relative pixel
  y: number; // percentage 0 to 100 or relative pixel
  vx: number; // velocity x (percentage per frame)
  vy: number; // velocity y (percentage per frame)
  colorIndex: number;
  rotation: number;
  width?: number; // estimated width for collision
  height?: number; // estimated height for collision
}

export interface GameSettings {
  soundEnabled: boolean;
  timerDuration: number; // in seconds
  difficulty: Difficulty;
  cardSize: CardSize;
  showWordCount: boolean;
  autoPlayNext: boolean;
}
