import { useEffect, useRef, useCallback, useState } from 'react';
import { useGameState } from './useGameState';
import { 
  drawMaze, 
  drawPlayer, 
  drawGameObjects, 
  updateEnemies, 
  checkCollisions,
  canMoveTo,
  attackEnemy,
  rooms
} from '@/lib/gameEngine';
import { CELL_SIZE } from '@/lib/gameTypes';

export function useGameLoop() {
  const gameStateHook = useGameState();
  const { gameState, gameObjects, setGameObjects } = gameStateHook;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const currentRoom = rooms[gameState.currentRoom] || rooms[0];

  const gameLoop = useCallback(() => {
    if (!gameState.isRunning || gameState.isPaused || !canvasRef.current || !currentRoom) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Disable anti-aliasing for pixel-perfect rendering
    ctx.imageSmoothingEnabled = false;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update enemies
    const updatedEnemies = [...gameObjects.enemies];
    updateEnemies(updatedEnemies, currentRoom.maze);

    // Check collisions
    const collisionResults = checkCollisions(gameState, {
      ...gameObjects,
      enemies: updatedEnemies
    });

    // Handle collision results
    if (collisionResults.keyCollected) {
      gameStateHook.collectKey();
    }
    if (collisionResults.swordCollected) {
      gameStateHook.collectSword();
    }
    if (collisionResults.treasureCollected) {
      gameStateHook.collectTreasure();
    }
    if (collisionResults.enemyHit) {
      gameStateHook.takeDamage();
    }
    if (collisionResults.victory) {
      gameStateHook.setVictory();
    }
    if (collisionResults.roomTransition !== null) {
      gameStateHook.changeRoom(collisionResults.roomTransition, collisionResults.entryPosition || undefined);
    }

    // Update game objects
    setGameObjects(prev => ({
      ...prev,
      enemies: updatedEnemies
    }));

    // Render game
    drawMaze(ctx, currentRoom);
    drawGameObjects(ctx, gameObjects);
    drawPlayer(ctx, gameState.playerX, gameState.playerY, gameState.playerDirection);

    // Continue loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, gameObjects, gameStateHook, setGameObjects, currentRoom]);

  // Handle input
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keysRef.current[e.code] = true;
    
    if (!gameState.isRunning || gameState.isPaused) return;
    
    let newX = gameState.playerX;
    let newY = gameState.playerY;
    let direction = gameState.playerDirection;
    
    if (keysRef.current['ArrowUp'] || keysRef.current['KeyW']) {
      newY -= CELL_SIZE;
      direction = 'up';
    }
    if (keysRef.current['ArrowDown'] || keysRef.current['KeyS']) {
      newY += CELL_SIZE;
      direction = 'down';
    }
    if (keysRef.current['ArrowLeft'] || keysRef.current['KeyA']) {
      newX -= CELL_SIZE;
      direction = 'left';
    }
    if (keysRef.current['ArrowRight'] || keysRef.current['KeyD']) {
      newX += CELL_SIZE;
      direction = 'right';
    }
    
    // Handle attack with F key
    if (keysRef.current['KeyF'] && gameState.hasSword) {
      const attackResult = attackEnemy(gameState, gameObjects);
      if (attackResult.enemyKilled) {
        gameStateHook.killEnemy(30); // 30 points for killing enemy
        setGameObjects(prev => ({
          ...prev,
          enemies: prev.enemies.filter((_, index) => index !== attackResult.killedEnemyIndex)
        }));
      }
    }
    
    if (canMoveTo(newX, newY, currentRoom)) {
      gameStateHook.movePlayer(newX, newY, direction);
    }
  }, [gameState, gameStateHook, gameObjects, setGameObjects, currentRoom]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysRef.current[e.code] = false;
  }, []);

  // Start game loop when running
  useEffect(() => {
    if (gameState.isRunning && !gameState.isPaused) {
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.isRunning, gameState.isPaused, gameLoop]);

  // Input event listeners
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Initial render
  useEffect(() => {
    if (!canvasRef.current || !currentRoom) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze(ctx, currentRoom);
    drawGameObjects(ctx, gameObjects);
    drawPlayer(ctx, gameState.playerX, gameState.playerY, gameState.playerDirection);
  }, [gameObjects, gameState.playerX, gameState.playerY, gameState.playerDirection, currentRoom]);

  const [lastMobileInput, setLastMobileInput] = useState<number>(0);
  
  const handleMobileInput = useCallback((action: string) => {
    if (!gameState.isRunning || gameState.isPaused) return;
    
    // Throttle mobile input to prevent multiple moves per tap
    const now = Date.now();
    if (now - lastMobileInput < 200) return; // 200ms delay between moves
    setLastMobileInput(now);
    
    let newX = gameState.playerX;
    let newY = gameState.playerY;
    let direction = gameState.playerDirection;
    
    switch (action) {
      case 'up':
        newY -= CELL_SIZE;
        direction = 'up';
        break;
      case 'down':
        newY += CELL_SIZE;
        direction = 'down';
        break;
      case 'left':
        newX -= CELL_SIZE;
        direction = 'left';
        break;
      case 'right':
        newX += CELL_SIZE;
        direction = 'right';
        break;
      case 'attack':
        if (gameState.hasSword) {
          const attackResult = attackEnemy(gameState, gameObjects);
          if (attackResult.enemyKilled) {
            gameStateHook.killEnemy(30);
            setGameObjects(prev => ({
              ...prev,
              enemies: prev.enemies.filter((_, index) => index !== attackResult.killedEnemyIndex)
            }));
          }
        }
        return;
    }
    
    if (canMoveTo(newX, newY, currentRoom)) {
      gameStateHook.movePlayer(newX, newY, direction);
    }
  }, [gameState, gameStateHook, gameObjects, setGameObjects, currentRoom, lastMobileInput]);

  return {
    ...gameStateHook,
    canvasRef,
    handleMobileInput,
  };
}
