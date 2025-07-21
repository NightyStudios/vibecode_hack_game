import { GameState } from '@/lib/gameTypes';

interface GameUIProps {
  gameState: GameState;
  onStart: () => void;
  onReset: () => void;
  onMobileInput?: (action: string) => void;
}

export function GameUI({ gameState, onStart, onReset, onMobileInput }: GameUIProps) {
  
  const handleMobileInput = (action: string) => {
    if (onMobileInput) {
      onMobileInput(action);
    }
  };
  const formatScore = (score: number) => score.toString().padStart(4, '0');
  
  const formatHealth = (health: number) => 
    '♥'.repeat(health) + '♡'.repeat(3 - health);

  const formatItems = (hasKey: boolean, hasSword: boolean, hasTreasure: boolean) => {
    const keyIcon = hasKey ? '🔑✓' : '🔑❌';
    const swordIcon = hasSword ? '⚔️✓' : '⚔️❌';
    const treasureIcon = hasTreasure ? '🏆✓' : '🏆❌';
    return `${keyIcon} ${swordIcon} ${treasureIcon}`;
  };

  return (
    <>
      {/* Game Info Bar */}
      <div className="flex flex-wrap justify-between items-center mb-4 bg-black p-2 md:p-3 border-2 border-atari-cyan text-xs md:text-base">
        <div className="text-atari-yellow">
          <span className="text-xs md:text-sm">SCORE:</span>
          <span className="text-sm md:text-xl font-bold ml-1 md:ml-2">{formatScore(gameState.score)}</span>
        </div>
        <div className="text-atari-red">
          <span className="text-xs md:text-sm">HEALTH:</span>
          <span className="text-sm md:text-xl font-bold ml-1 md:ml-2">{formatHealth(gameState.health)}</span>
        </div>
        <div className="text-atari-green">
          <span className="text-xs md:text-sm">ITEMS:</span>
          <span className="text-sm md:text-xl font-bold ml-1 md:ml-2">{formatItems(gameState.hasKey, gameState.hasSword, gameState.hasTreasure)}</span>
        </div>
        <div className="text-atari-purple">
          <span className="text-xs md:text-sm">ROOM:</span>
          <span className="text-sm md:text-xl font-bold ml-1 md:ml-2">{gameState.currentRoom + 1}/5</span>
        </div>
      </div>

      {/* Game Controls */}
      <div className="mt-4 text-center">
        <div className="bg-black p-4 border-2 border-atari-purple rounded">
          <p className="text-atari-yellow mb-2">CONTROLS:</p>
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-4">
            <div></div>
            <button 
              className="bg-atari-blue text-black px-3 py-2 border-2 border-white game-button retro-shadow text-lg font-bold"
              onMouseDown={() => handleMobileInput('up')}
              onTouchStart={(e) => { e.preventDefault(); handleMobileInput('up'); }}
            >
              ↑
            </button>
            <div></div>
            <button 
              className="bg-atari-blue text-black px-3 py-2 border-2 border-white game-button retro-shadow text-lg font-bold"
              onMouseDown={() => handleMobileInput('left')}
              onTouchStart={(e) => { e.preventDefault(); handleMobileInput('left'); }}
            >
              ←
            </button>
            <button 
              className="bg-atari-blue text-black px-3 py-2 border-2 border-white game-button retro-shadow text-lg font-bold"
              onMouseDown={() => handleMobileInput('down')}
              onTouchStart={(e) => { e.preventDefault(); handleMobileInput('down'); }}
            >
              ↓
            </button>
            <button 
              className="bg-atari-blue text-black px-3 py-2 border-2 border-white game-button retro-shadow text-lg font-bold"
              onMouseDown={() => handleMobileInput('right')}
              onTouchStart={(e) => { e.preventDefault(); handleMobileInput('right'); }}
            >
              →
            </button>
          </div>
          <div className="flex justify-center gap-2 mb-3">
            <button 
              className={`${gameState.hasSword ? 'bg-atari-red' : 'bg-gray-500'} text-white px-4 py-2 border-2 border-white game-button retro-shadow font-bold`}
              onMouseDown={() => gameState.hasSword && handleMobileInput('attack')}
              onTouchStart={(e) => { e.preventDefault(); gameState.hasSword && handleMobileInput('attack'); }}
              disabled={!gameState.hasSword}
            >
              ⚔️ ATTACK
            </button>
          </div>
          <p className="text-atari-cyan text-xs">WASD/ARROWS TO MOVE • F TO ATTACK</p>
        </div>
      </div>

      {/* Game Action Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={onStart}
          disabled={gameState.isRunning}
          className="bg-atari-green text-black px-8 py-3 text-xl font-bold border-4 border-white game-button retro-shadow disabled:opacity-50"
        >
          {gameState.isRunning ? 'RUNNING...' : 'START GAME'}
        </button>
        <button
          onClick={onReset}
          className="bg-atari-red text-white px-8 py-3 text-xl font-bold border-4 border-white game-button retro-shadow"
        >
          RESET
        </button>
      </div>
    </>
  );
}
