import { forwardRef } from 'react';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/lib/gameTypes';

interface GameCanvasProps {
  className?: string;
}

export const GameCanvas = forwardRef<HTMLCanvasElement, GameCanvasProps>(
  ({ className = '' }, ref) => {
    return (
      <canvas
        ref={ref}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className={`border-2 border-atari-cyan bg-black retro-shadow max-w-full h-auto ${className}`}
        style={{
          imageRendering: 'pixelated'
        }}
      />
    );
  }
);

GameCanvas.displayName = 'GameCanvas';
