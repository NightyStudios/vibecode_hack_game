import { GameState } from '@/lib/gameTypes';

interface GameModalsProps {
  gameState: GameState;
  onPlayAgain: () => void;
}

export function GameModals({ gameState, onPlayAgain }: GameModalsProps) {
  const formatTime = (startTime: number | null) => {
    if (!startTime) return '00:00';
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {/* Game Over Modal */}
      {gameState.isGameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-atari-dark border-4 border-atari-red retro-shadow p-8 text-center max-w-md">
            <h2 className="text-4xl font-bold text-atari-red mb-4">GAME OVER</h2>
            <div className="mb-6">
              <p className="text-atari-yellow text-xl mb-2">FINAL SCORE</p>
              <p className="text-atari-gold text-3xl font-bold mb-4">{gameState.score}</p>
              <p className="text-atari-cyan">You were defeated by a dragon!</p>
            </div>
            <button
              onClick={onPlayAgain}
              className="bg-atari-green text-black px-6 py-3 font-bold border-3 border-white game-button retro-shadow"
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}

      {/* Victory Modal */}
      {gameState.isVictory && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-atari-dark border-4 border-atari-gold retro-shadow p-8 text-center max-w-md">
            <h2 className="text-4xl font-bold text-atari-gold mb-4 treasure-glow">VICTORY!</h2>
            <div className="mb-6">
              <p className="text-atari-yellow text-xl mb-2">🏆 QUEST COMPLETE! 🏆</p>
              <p className="text-atari-gold text-3xl font-bold mb-2">{gameState.score}</p>
              <p className="text-atari-cyan mb-2">Time: {formatTime(gameState.gameStartTime)}</p>
              <p className="text-atari-green">You are a true adventurer!</p>
            </div>
            <button
              onClick={onPlayAgain}
              className="bg-atari-cyan text-black px-6 py-3 font-bold border-3 border-white game-button retro-shadow"
            >
              NEW ADVENTURE
            </button>
          </div>
        </div>
      )}
    </>
  );
}
