export interface Position {
  x: number;
  y: number;
}

export interface GridPosition {
  x: number;
  y: number;
}

export interface Enemy {
  x: number;
  y: number;
  dx: number;
  dy: number;
  patrol: number;
  lane: 'horizontal' | 'vertical';
  startPos: number;
  endPos: number;
  frameCount?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  id?: number; // Unique identifier for fresh dragon generation
}

export interface GameObject {
  x: number;
  y: number;
  collected: boolean;
}

export interface GameState {
  isRunning: boolean;
  isPaused: boolean;
  score: number;
  health: number;
  hasKey: boolean;
  hasTreasure: boolean;
  hasSword: boolean;
  playerX: number;
  playerY: number;
  playerDirection: 'up' | 'down' | 'left' | 'right';
  currentRoom: number;
  gameStartTime: number | null;
  isGameOver: boolean;
  isVictory: boolean;
}

export interface Room {
  id: number;
  maze: number[][];
  gameObjects: GameObjects;
  exits: { direction: 'up' | 'down' | 'left' | 'right'; x: number; y: number; toRoom: number }[];
}

export interface GameObjects {
  key: GameObject;
  treasure: GameObject;
  sword: GameObject;
  start: GridPosition;
  enemies: Enemy[];
}

export type GameStatus = 'menu' | 'playing' | 'paused' | 'gameOver' | 'victory';

export const CELL_SIZE = 24; // Reduced from 32 for mobile
export const CANVAS_WIDTH = 480; // Reduced from 640
export const CANVAS_HEIGHT = 360; // Reduced from 480
export const COLS = CANVAS_WIDTH / CELL_SIZE;
export const ROWS = CANVAS_HEIGHT / CELL_SIZE;
