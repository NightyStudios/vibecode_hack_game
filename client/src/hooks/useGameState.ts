import { useState, useCallback } from 'react';
import { GameState, GameObjects, CELL_SIZE } from '@/lib/gameTypes';
import { rooms, generateRoom, spawnDragon } from '@/lib/gameEngine';

const initialGameState: GameState = {
  isRunning: false,
  isPaused: false,
  score: 0,
  health: 3,
  hasKey: false,
  hasTreasure: false,
  hasSword: false,
  playerX: 1 * CELL_SIZE,
  playerY: 1 * CELL_SIZE,
  playerDirection: 'right',
  currentRoom: 0,
  gameStartTime: null,
  isGameOver: false,
  isVictory: false,
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [gameObjects, setGameObjects] = useState<GameObjects>(rooms[0].gameObjects);

  const startGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isRunning: true,
      gameStartTime: Date.now(),
      isGameOver: false,
      isVictory: false,
    }));
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  }, []);

  const resetGame = useCallback(() => {
    // Regenerate all rooms for a fresh experience
    for (let i = 0; i < 5; i++) {
      rooms[i] = rooms[i]; // Keep existing rooms, but could regenerate here
    }
    
    setGameState({
      ...initialGameState,
      playerX: 1 * CELL_SIZE,
      playerY: Math.floor(15/2) * CELL_SIZE,
    });
    setGameObjects(rooms[0].gameObjects);
  }, []);

  const updateScore = useCallback((points: number) => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + points,
    }));
  }, []);

  const collectKey = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      hasKey: true,
      score: prev.score + 10,
    }));
  }, []);

  const collectSword = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      hasSword: true,
      score: prev.score + 25,
    }));
  }, []);

  const collectTreasure = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      hasTreasure: true,
      score: prev.score + 50,
    }));
  }, []);

  const takeDamage = useCallback(() => {
    setGameState(prev => {
      const newHealth = prev.health - 1;
      return {
        ...prev,
        health: newHealth,
        isGameOver: newHealth <= 0,
        isRunning: newHealth > 0,
        playerX: 1 * CELL_SIZE, // Reset to start position
        playerY: 1 * CELL_SIZE,
      };
    });
  }, []);

  const setVictory = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isVictory: true,
      isRunning: false,
      score: prev.score + 100,
    }));
  }, []);

  const movePlayer = useCallback((newX: number, newY: number, direction: 'up' | 'down' | 'left' | 'right') => {
    setGameState(prev => ({
      ...prev,
      playerX: newX,
      playerY: newY,
      playerDirection: direction,
    }));
  }, []);

  const changeRoom = useCallback((roomId: number, entryPosition?: { x: number; y: number }) => {
    // Generate fresh room
    const newRoom = generateRoom(roomId);
    
    // Spawn a single dragon in the room
    const dragon = spawnDragon(roomId, newRoom.maze);
    if (dragon) {
      newRoom.gameObjects.enemies = [dragon];
    }
    
    rooms[roomId] = newRoom; // Update the rooms array
    
    const playerX = entryPosition ? entryPosition.x * CELL_SIZE : newRoom.gameObjects.start.x * CELL_SIZE;
    const playerY = entryPosition ? entryPosition.y * CELL_SIZE : newRoom.gameObjects.start.y * CELL_SIZE;
    
    setGameState(prev => ({
      ...prev,
      currentRoom: roomId,
      playerX,
      playerY,
    }));
    setGameObjects(newRoom.gameObjects);
  }, []);

  const killEnemy = useCallback((points: number) => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + points,
    }));
  }, []);

  return {
    gameState,
    gameObjects,
    setGameObjects,
    startGame,
    pauseGame,
    resetGame,
    updateScore,
    collectKey,
    collectSword,
    collectTreasure,
    takeDamage,
    setVictory,
    movePlayer,
    changeRoom,
    killEnemy,
  };
}
