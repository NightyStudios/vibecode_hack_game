import { GameState, GameObjects, Enemy, Room, CELL_SIZE, COLS, ROWS } from './gameTypes';

// Procedural room generation
export function generateRoom(roomId: number): Room {
  const maze: number[][] = [];
  
  // Create border walls
  for (let y = 0; y < ROWS; y++) {
    maze[y] = [];
    for (let x = 0; x < COLS; x++) {
      if (x === 0 || x === COLS - 1 || y === 0 || y === ROWS - 1) {
        maze[y][x] = 1; // Wall
      } else {
        maze[y][x] = 0; // Empty
      }
    }
  }
  
  // Add random interior walls
  const wallDensity = 0.2 + (roomId * 0.05); // Increase complexity with room number
  for (let y = 2; y < ROWS - 2; y += 2) {
    for (let x = 2; x < COLS - 2; x += 2) {
      if (Math.random() < wallDensity) {
        maze[y][x] = 1;
        // Add connecting walls randomly
        if (Math.random() < 0.5) maze[y][x + 1] = 1;
        if (Math.random() < 0.5) maze[y + 1][x] = 1;
      }
    }
  }
  
  // Create exits
  const exits = [];
  if (roomId > 0) {
    // Previous room exit (left side)
    const exitY = Math.floor(ROWS / 2);
    maze[exitY][0] = 0;
    exits.push({ direction: 'left' as const, x: 0, y: exitY, toRoom: roomId - 1 });
  }
  
  // Next room exit (right side) - only for first 5 rooms
  if (roomId < 4) {
    const exitY = Math.floor(ROWS / 2);
    maze[exitY][COLS - 1] = 0;
    exits.push({ direction: 'right' as const, x: COLS - 1, y: exitY, toRoom: roomId + 1 });
  }
  
  // Dragons will be spawned dynamically when room is entered
  const enemies: Enemy[] = [];
  const dragon = spawnDragon(roomId, maze);
if (dragon) enemies.push(dragon);


  // Find valid positions for objects
  const validPositions = [];
  for (let y = 1; y < ROWS - 1; y++) {
    for (let x = 1; x < COLS - 1; x++) {
      if (maze[y][x] === 0 && !enemies.some(e => e.x === x && e.y === y)) {
        validPositions.push({ x, y });
      }
    }
  }
  
  // Place objects
  const gameObjects: GameObjects = {
    key: { x: 0, y: 0, collected: false },
    treasure: { x: 0, y: 0, collected: false },
    sword: { x: 0, y: 0, collected: false },
    start: { x: 1, y: Math.floor(ROWS / 2) },
    enemies
  };
  
  if (validPositions.length > 0) {
    // Place key in first room
    if (roomId === 0) {
      const keyPos = validPositions[Math.floor(Math.random() * validPositions.length)];
      gameObjects.key = { x: keyPos.x, y: keyPos.y, collected: false };
    }
    
    // Place sword in second room
    if (roomId === 1) {
      const swordPos = validPositions[Math.floor(Math.random() * validPositions.length)];
      gameObjects.sword = { x: swordPos.x, y: swordPos.y, collected: false };
    }
    
    // Place treasure in last room
    if (roomId === 4) {
      const treasurePos = validPositions[Math.floor(Math.random() * validPositions.length)];
      gameObjects.treasure = { x: treasurePos.x, y: treasurePos.y, collected: false };
    }
  }
  
  return {
    id: roomId,
    maze,
    gameObjects,
    exits
  };
}

// Generate all rooms
export const rooms: Room[] = [];
for (let i = 0; i < 5; i++) {
  rooms.push(generateRoom(i));
}

export function drawMaze(ctx: CanvasRenderingContext2D, room: Room) {
  const maze = room.maze;
  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[row].length; col++) {
      if (maze[row][col] === 1) {
        ctx.fillStyle = 'hsl(210, 22%, 49%)';
        ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        
        ctx.strokeStyle = 'hsl(198, 93%, 60%)';
        ctx.lineWidth = 2;
        ctx.strokeRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
  
  // Draw exits
  room.exits.forEach(exit => {
    ctx.fillStyle = 'hsl(160, 51%, 49%)';
    ctx.fillRect(exit.x * CELL_SIZE + 8, exit.y * CELL_SIZE + 8, 16, 16);
    
    ctx.strokeStyle = 'hsl(120, 100%, 80%)';
    ctx.lineWidth = 2;
    ctx.strokeRect(exit.x * CELL_SIZE + 8, exit.y * CELL_SIZE + 8, 16, 16);
  });
}

export function drawPlayer(ctx: CanvasRenderingContext2D, playerX: number, playerY: number, direction: string) {
  ctx.fillStyle = 'hsl(51, 100%, 50%)';
  ctx.fillRect(playerX + 4, playerY + 4, CELL_SIZE - 8, CELL_SIZE - 8);
  
  ctx.strokeStyle = 'hsl(0, 0%, 100%)';
  ctx.lineWidth = 2;
  ctx.strokeRect(playerX + 4, playerY + 4, CELL_SIZE - 8, CELL_SIZE - 8);
  
  // Draw direction indicator
  ctx.fillStyle = 'hsl(0, 0%, 100%)';
  const centerX = playerX + CELL_SIZE / 2;
  const centerY = playerY + CELL_SIZE / 2;
  
  switch (direction) {
    case 'up':
      ctx.fillRect(centerX - 2, playerY + 6, 4, 8);
      break;
    case 'down':
      ctx.fillRect(centerX - 2, playerY + CELL_SIZE - 14, 4, 8);
      break;
    case 'left':
      ctx.fillRect(playerX + 6, centerY - 2, 8, 4);
      break;
    case 'right':
      ctx.fillRect(playerX + CELL_SIZE - 14, centerY - 2, 8, 4);
      break;
  }
}

export function drawGameObjects(ctx: CanvasRenderingContext2D, gameObjects: GameObjects) {
  // Draw key with label box
  if (!gameObjects.key.collected && gameObjects.key.x > 0) {
    const keyX = gameObjects.key.x * CELL_SIZE + 4;
    const keyY = gameObjects.key.y * CELL_SIZE + 4;
    
    // Draw background box
    ctx.fillStyle = 'hsl(50, 100%, 80%)';
    ctx.fillRect(keyX, keyY, CELL_SIZE - 8, CELL_SIZE - 8);
    
    ctx.strokeStyle = 'hsl(51, 100%, 50%)';
    ctx.lineWidth = 2;
    ctx.strokeRect(keyX, keyY, CELL_SIZE - 8, CELL_SIZE - 8);
    
    // Draw letter K
    ctx.fillStyle = 'hsl(0, 0%, 0%)';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('K', keyX + 12, keyY + 16);
  }

  // Draw sword with label box
  if (!gameObjects.sword.collected && gameObjects.sword.x > 0) {
    const swordX = gameObjects.sword.x * CELL_SIZE + 4;
    const swordY = gameObjects.sword.y * CELL_SIZE + 4;
    
    // Draw background box
    ctx.fillStyle = 'hsl(200, 50%, 70%)';
    ctx.fillRect(swordX, swordY, CELL_SIZE - 8, CELL_SIZE - 8);
    
    ctx.strokeStyle = 'hsl(0, 0%, 90%)';
    ctx.lineWidth = 2;
    ctx.strokeRect(swordX, swordY, CELL_SIZE - 8, CELL_SIZE - 8);
    
    // Draw letter S
    ctx.fillStyle = 'hsl(0, 0%, 0%)';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('S', swordX + 12, swordY + 16);
  }

  // Draw treasure with label box
  if (!gameObjects.treasure.collected && gameObjects.treasure.x > 0) {
    const treasureX = gameObjects.treasure.x * CELL_SIZE + 4;
    const treasureY = gameObjects.treasure.y * CELL_SIZE + 4;
    
    // Draw background box
    ctx.fillStyle = 'hsl(51, 100%, 50%)';
    ctx.fillRect(treasureX, treasureY, CELL_SIZE - 8, CELL_SIZE - 8);
    
    ctx.strokeStyle = 'hsl(50, 100%, 80%)';
    ctx.lineWidth = 3;
    ctx.strokeRect(treasureX, treasureY, CELL_SIZE - 8, CELL_SIZE - 8);
    
    // Draw letter T
    ctx.fillStyle = 'hsl(0, 0%, 0%)';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('T', treasureX + 12, treasureY + 16);
  }

  // Draw enemies with label box
  gameObjects.enemies.forEach(enemy => {
    const enemyX = enemy.x * CELL_SIZE + 4;
    const enemyY = enemy.y * CELL_SIZE + 4;
    
    // Draw background box
    ctx.fillStyle = 'hsl(0, 79%, 63%)';
    ctx.fillRect(enemyX, enemyY, CELL_SIZE - 8, CELL_SIZE - 8);
    
    ctx.strokeStyle = 'hsl(0, 0%, 100%)';
    ctx.lineWidth = 2;
    ctx.strokeRect(enemyX, enemyY, CELL_SIZE - 8, CELL_SIZE - 8);
    
    // Draw letter D for Dragon
    ctx.fillStyle = 'hsl(0, 0%, 100%)';
    ctx.font = 'bold 16px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('D', enemyX + 12, enemyY + 16);
  });

  // Draw start position marker
  const startX = gameObjects.start.x * CELL_SIZE + 12;
  const startY = gameObjects.start.y * CELL_SIZE + 12;
  ctx.fillStyle = 'hsl(160, 51%, 49%)';
  ctx.fillRect(startX, startY, 8, 8);
}

// New dragon spawning function
export function spawnDragon(roomId: number, maze: number[][]): Enemy | null {
  // Find all valid open positions
  const validPositions = [];
  for (let y = 2; y < ROWS - 2; y++) {
    for (let x = 2; x < COLS - 2; x++) {
      if (maze[y][x] === 0) {
        validPositions.push({ x, y });
      }
    }
  }
  
  if (validPositions.length === 0) return null;
  
  // Pick random position
  const randomPos = validPositions[Math.floor(Math.random() * validPositions.length)];
  
  return {
    x: randomPos.x,
    y: randomPos.y,
    dx: 0,
    dy: 0,
    patrol: 0,
    lane: 'horizontal',
    startPos: 0,
    endPos: 0,
    frameCount: Math.floor(Math.random() * 15), // Random starting frame
    direction: ['up', 'down', 'left', 'right'][Math.floor(Math.random() * 4)] as 'up' | 'down' | 'left' | 'right',
    id: Math.random()
  };
}

// New simplified dragon movement
export function updateEnemies(enemies: Enemy[], maze: number[][]) {
  enemies.forEach(enemy => {
    enemy.frameCount = (enemy.frameCount || 0) + 1;
    
    // Move every 15 frames (fast movement)
    if (enemy.frameCount % 15 === 0) {
      // Get valid directions (never choose wall directions)
      const validDirections = [];
      if (enemy.y > 1 && maze[enemy.y - 1][enemy.x] === 0) validDirections.push('up');
      if (enemy.y < ROWS - 2 && maze[enemy.y + 1][enemy.x] === 0) validDirections.push('down');
      if (enemy.x > 1 && maze[enemy.y][enemy.x - 1] === 0) validDirections.push('left');
      if (enemy.x < COLS - 2 && maze[enemy.y][enemy.x + 1] === 0) validDirections.push('right');
      
      // If current direction is not valid or random chance, pick new direction
      const currentDirectionValid = validDirections.includes(enemy.direction || 'up');
      if (!currentDirectionValid || Math.random() < 0.1) { // 10% chance to change direction randomly
        if (validDirections.length > 0) {
          enemy.direction = validDirections[Math.floor(Math.random() * validDirections.length)] as 'up' | 'down' | 'left' | 'right';
        }
      }
      
      // Move in current direction if valid
      if (enemy.direction && validDirections.includes(enemy.direction)) {
        switch (enemy.direction) {
          case 'up': enemy.y -= 1; break;
          case 'down': enemy.y += 1; break;
          case 'left': enemy.x -= 1; break;
          case 'right': enemy.x += 1; break;
        }
      }
    }
  });
}

export function checkCollisions(
  gameState: GameState, 
  gameObjects: GameObjects
): { keyCollected: boolean; treasureCollected: boolean; swordCollected: boolean; enemyHit: boolean; victory: boolean; roomTransition: number | null; entryPosition: { x: number; y: number } | null } {
  const playerGridX = Math.floor(gameState.playerX / CELL_SIZE);
  const playerGridY = Math.floor(gameState.playerY / CELL_SIZE);

  let keyCollected = false;
  let treasureCollected = false;
  let swordCollected = false;
  let enemyHit = false;
  let victory = false;
  let roomTransition: number | null = null;
  let entryPosition: { x: number; y: number } | null = null;

  // Check key collection
  if (!gameObjects.key.collected && gameObjects.key.x > 0 &&
      playerGridX === gameObjects.key.x && 
      playerGridY === gameObjects.key.y) {
    gameObjects.key.collected = true;
    keyCollected = true;
  }

  // Check sword collection
  if (!gameObjects.sword.collected && gameObjects.sword.x > 0 &&
      playerGridX === gameObjects.sword.x && 
      playerGridY === gameObjects.sword.y) {
    gameObjects.sword.collected = true;
    swordCollected = true;
  }

  // Check treasure collection (only if has key)
  if (!gameObjects.treasure.collected && gameState.hasKey && gameObjects.treasure.x > 0 &&
      playerGridX === gameObjects.treasure.x && 
      playerGridY === gameObjects.treasure.y) {
    gameObjects.treasure.collected = true;
    treasureCollected = true;
  }

  // Check victory condition - treasure back to first room start
  if (gameState.hasTreasure && gameState.currentRoom === 0 &&
      playerGridX === gameObjects.start.x && 
      playerGridY === gameObjects.start.y) {
    victory = true;
  }

  // Check room transitions
  const currentRoom = rooms[gameState.currentRoom];
  currentRoom.exits.forEach(exit => {
    if (playerGridX === exit.x && playerGridY === exit.y) {
      roomTransition = exit.toRoom;
      // Calculate entry position based on exit direction
      const targetRoom = rooms[exit.toRoom];
      if (exit.direction === 'right') {
        // Going right, enter from left side of target room
        entryPosition = { x: 1, y: Math.floor(ROWS / 2) };
      } else if (exit.direction === 'left') {
        // Going left, enter from right side of target room
        entryPosition = { x: COLS - 2, y: Math.floor(ROWS / 2) };
      }
    }
  });

  // Check enemy collisions
  gameObjects.enemies.forEach(enemy => {
    if (playerGridX === enemy.x && playerGridY === enemy.y) {
      enemyHit = true;
    }
  });

  return { keyCollected, treasureCollected, swordCollected, enemyHit, victory, roomTransition, entryPosition };
}

export function canMoveTo(x: number, y: number, room: Room): boolean {
  const gridX = Math.floor(x / CELL_SIZE);
  const gridY = Math.floor(y / CELL_SIZE);
  
  return gridX >= 0 && gridX < COLS && gridY >= 0 && gridY < ROWS && 
         room.maze[gridY] && room.maze[gridY][gridX] === 0;
}

// Add sword attack function
export function attackEnemy(gameState: GameState, gameObjects: GameObjects): { enemyKilled: boolean; killedEnemyIndex: number | null } {
  const playerGridX = Math.floor(gameState.playerX / CELL_SIZE);
  const playerGridY = Math.floor(gameState.playerY / CELL_SIZE);
  
  // Calculate attack position based on player direction
  let attackX = playerGridX;
  let attackY = playerGridY;
  
  switch (gameState.playerDirection) {
    case 'up':
      attackY -= 1;
      break;
    case 'down':
      attackY += 1;
      break;
    case 'left':
      attackX -= 1;
      break;
    case 'right':
      attackX += 1;
      break;
  }
  
  // Check if any enemy is at the attack position
  const enemyIndex = gameObjects.enemies.findIndex(enemy => 
    enemy.x === attackX && enemy.y === attackY
  );
  
  if (enemyIndex !== -1) {
    gameObjects.enemies.splice(enemyIndex, 1); // Remove enemy
    return { enemyKilled: true, killedEnemyIndex: enemyIndex };
  }
  
  return { enemyKilled: false, killedEnemyIndex: null };
}
