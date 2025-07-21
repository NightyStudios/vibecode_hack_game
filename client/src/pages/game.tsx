import { GameCanvas } from '@/components/game/GameCanvas';
import { GameUI } from '@/components/game/GameUI';
import { GameModals } from '@/components/game/GameModals';
import { useGameLoop } from '@/hooks/useGameLoop';

export default function Game() {
  const {
    gameState,
    gameObjects,
    canvasRef,
    startGame,
    resetGame,
    handleMobileInput,
  } = useGameLoop();

  return (
    <div className="bg-black text-white font-retro min-h-screen flex flex-col items-center justify-center p-2 md:p-4 overflow-x-auto">
      {/* Game Title */}
      <div className="text-center mb-4 md:mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-atari-gold mb-2 retro-shadow">ADVENTURE</h1>
        <p className="text-atari-cyan text-base md:text-lg tracking-wider">ATARI STYLE QUEST</p>
      </div>

      {/* Game Container */}
      <div className="bg-atari-dark border-4 border-atari-gold retro-shadow p-3 md:p-6 rounded-lg w-full max-w-2xl mx-auto">
        {/* Game Info Bar */}
        <div className="flex flex-wrap justify-between items-center mb-4 bg-black p-2 border-2 border-atari-cyan text-xs">
          <div className="text-atari-yellow">
            <span className="text-xs">SCORE:</span>
            <span className="text-sm font-bold ml-1">{gameState.score.toString().padStart(4, '0')}</span>
          </div>
          <div className="text-atari-red">
            <span className="text-xs">HEALTH:</span>
            <span className="text-sm font-bold ml-1">{'♥'.repeat(gameState.health) + '♡'.repeat(3 - gameState.health)}</span>
          </div>
          <div className="text-atari-green">
            <span className="text-xs">ITEMS:</span>
            <span className="text-sm font-bold ml-1">
              {gameState.hasKey ? 'K✓' : 'K❌'} {gameState.hasSword ? 'S✓' : 'S❌'} {gameState.hasTreasure ? 'T✓' : 'T❌'}
            </span>
          </div>
          <div className="text-atari-purple">
            <span className="text-xs">ROOM:</span>
            <span className="text-sm font-bold ml-1">{gameState.currentRoom + 1}/5</span>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="flex justify-center mb-4">
          <GameCanvas ref={canvasRef} />
        </div>

        {/* Mobile Controls */}
        <div className="bg-black p-4 border-2 border-atari-purple rounded">
          <p className="text-atari-yellow mb-3 text-center text-sm">CONTROLS:</p>
          <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-4">
            <div></div>
            <button 
              className="bg-atari-blue text-black px-4 py-3 border-2 border-white game-button retro-shadow text-xl font-bold"
              onMouseDown={() => handleMobileInput('up')}
              onTouchStart={(e) => { e.preventDefault(); handleMobileInput('up'); }}
            >
              ↑
            </button>
            <div></div>
            <button 
              className="bg-atari-blue text-black px-4 py-3 border-2 border-white game-button retro-shadow text-xl font-bold"
              onMouseDown={() => handleMobileInput('left')}
              onTouchStart={(e) => { e.preventDefault(); handleMobileInput('left'); }}
            >
              ←
            </button>
            <button 
              className="bg-atari-blue text-black px-4 py-3 border-2 border-white game-button retro-shadow text-xl font-bold"
              onMouseDown={() => handleMobileInput('down')}
              onTouchStart={(e) => { e.preventDefault(); handleMobileInput('down'); }}
            >
              ↓
            </button>
            <button 
              className="bg-atari-blue text-black px-4 py-3 border-2 border-white game-button retro-shadow text-xl font-bold"
              onMouseDown={() => handleMobileInput('right')}
              onTouchStart={(e) => { e.preventDefault(); handleMobileInput('right'); }}
            >
              →
            </button>
          </div>
          <div className="flex justify-center gap-2 mb-3">
            <button 
              className={`${gameState.hasSword ? 'bg-atari-red' : 'bg-gray-500'} text-white px-6 py-3 border-2 border-white game-button retro-shadow font-bold text-sm`}
              onMouseDown={() => gameState.hasSword && handleMobileInput('attack')}
              onTouchStart={(e) => { e.preventDefault(); gameState.hasSword && handleMobileInput('attack'); }}
              disabled={!gameState.hasSword}
            >
              ⚔️ ATTACK
            </button>
            <button 
              className="bg-atari-green text-black px-4 py-3 border-2 border-white game-button retro-shadow font-bold text-sm"
              onClick={!gameState.isRunning ? startGame : resetGame}
            >
              {!gameState.isRunning ? '▶️ START' : '🔄 RESET'}
            </button>
          </div>
          <p className="text-atari-cyan text-xs text-center">WASD/ARROWS TO MOVE • F TO ATTACK</p>
        </div>
      </div>

      {/* Game Instructions */}
      <div className="mt-8 max-w-2xl bg-atari-dark border-2 border-atari-yellow p-6 rounded">
        <h2 className="text-atari-gold text-2xl font-bold mb-4 text-center">DUNGEON CRAWLER QUEST</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-atari-cyan font-bold mb-2">OBJECTIVES:</h3>
            <ul className="text-sm space-y-1 text-atari-yellow">
              <li>• Navigate through 5 procedurally generated rooms</li>
              <li>• Find the K KEY in Room 1</li>
              <li>• Get the S SWORD in Room 2</li>
              <li>• Collect the T TREASURE in Room 5</li>
              <li>• Return treasure to Room 1 start position</li>
              <li>• Use green exits to travel between rooms</li>
            </ul>
          </div>
          <div>
            <h3 className="text-atari-cyan font-bold mb-2">COMBAT & SCORING:</h3>
            <ul className="text-sm space-y-1 text-atari-yellow">
              <li>• Key: <span className="text-atari-green">+10 points</span></li>
              <li>• Sword: <span className="text-atari-green">+25 points</span></li>
              <li>• Treasure: <span className="text-atari-green">+50 points</span></li>
              <li>• Kill dragon (D): <span className="text-atari-green">+30 points</span></li>
              <li>• Quest complete: <span className="text-atari-green">+100 points</span></li>
              <li>• Dragon contact: <span className="text-atari-red">-1 Health</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Game Modals */}
      <GameModals
        gameState={gameState}
        onPlayAgain={resetGame}
      />
    </div>
  );
}
