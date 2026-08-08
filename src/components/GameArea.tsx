import React, { useEffect, useRef, useState } from 'react';
import { CardSize, Difficulty, GameState, WordCardData } from '../types';
import { WordCard } from './WordCard';
import { audioManager } from '../utils/audio';

interface GameAreaProps {
  tokens: string[];
  gameState: GameState;
  difficulty: Difficulty;
  cardSize: CardSize;
  soundEnabled: boolean;
  onPopCard?: (word: string) => void;
}

export const GameArea: React.FC<GameAreaProps> = ({
  tokens,
  gameState,
  difficulty,
  cardSize,
  soundEnabled,
  onPopCard,
}) => {
  const [cards, setCards] = useState<WordCardData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const cardsRef = useRef<WordCardData[]>([]);

  // Difficulty speed multiplier
  const speedMultiplier = {
    EASY: 0.08,
    MEDIUM: 0.16,
    HARD: 0.28,
  }[difficulty];

  // Initialize word card positions whenever tokens change or game is reset
  useEffect(() => {
    if (!tokens || tokens.length === 0) {
      setCards([]);
      cardsRef.current = [];
      return;
    }

    const newCards: WordCardData[] = tokens.map((token, index) => {
      // Calculate spread positions so initial layout doesn't overlap completely
      const cols = Math.ceil(Math.sqrt(tokens.length));
      const rows = Math.ceil(tokens.length / cols);
      const row = Math.floor(index / cols);
      const col = index % cols;

      const baseX = 15 + (col / Math.max(1, cols - 1)) * 70 + (Math.random() * 8 - 4);
      const baseY = 20 + (row / Math.max(1, rows - 1)) * 60 + (Math.random() * 8 - 4);

      // Random angle direction
      const angle = Math.random() * Math.PI * 2;
      const speed = (0.8 + Math.random() * 0.4) * speedMultiplier;

      return {
        id: `card-${index}-${token}`,
        text: token,
        x: Math.max(12, Math.min(88, baseX)),
        y: Math.max(15, Math.min(85, baseY)),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        colorIndex: index % 8,
        rotation: (Math.random() - 0.5) * 16,
      };
    });

    setCards(newCards);
    cardsRef.current = newCards;
  }, [tokens, speedMultiplier]);

  // Main animation loop
  useEffect(() => {
    if (gameState !== 'PLAYING') {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    let lastTime = performance.now();

    const updatePhysics = (time: number) => {
      const dt = Math.min((time - lastTime) / 16.6, 2.0); // normalize dt to ~60fps
      lastTime = time;

      const currentCards = cardsRef.current;
      if (currentCards.length === 0) return;

      const updated = currentCards.map((card) => {
        let newX = card.x + card.vx * dt;
        let newY = card.y + card.vy * dt;
        let newVx = card.vx;
        let newVy = card.vy;

        // Bounce bounds (percent)
        const minX = 10;
        const maxX = 90;
        const minY = 12;
        const maxY = 88;

        if (newX <= minX) {
          newX = minX;
          newVx = Math.abs(card.vx) + (Math.random() * 0.02 - 0.01);
        } else if (newX >= maxX) {
          newX = maxX;
          newVx = -Math.abs(card.vx) + (Math.random() * 0.02 - 0.01);
        }

        if (newY <= minY) {
          newY = minY;
          newVy = Math.abs(card.vy) + (Math.random() * 0.02 - 0.01);
        } else if (newY >= maxY) {
          newY = maxY;
          newVy = -Math.abs(card.vy) + (Math.random() * 0.02 - 0.01);
        }

        // Slight rotation wobble
        const newRotation = card.rotation + Math.sin(time * 0.002 + card.x) * 0.1;

        return {
          ...card,
          x: newX,
          y: newY,
          vx: newVx,
          vy: newVy,
          rotation: newRotation,
        };
      });

      // Simple repulsion between close cards to prevent stacking
      for (let i = 0; i < updated.length; i++) {
        for (let j = i + 1; j < updated.length; j++) {
          const dx = updated[j].x - updated[i].x;
          const dy = updated[j].y - updated[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = 14; // minimum distance percentage

          if (dist < minDist && dist > 0) {
            const overlap = minDist - dist;
            const nx = dx / dist;
            const ny = dy / dist;

            // Nudge positions apart
            updated[i].x -= nx * overlap * 0.2;
            updated[i].y -= ny * overlap * 0.2;
            updated[j].x += nx * overlap * 0.2;
            updated[j].y += ny * overlap * 0.2;

            // Adjust velocities
            updated[i].vx -= nx * 0.02;
            updated[i].vy -= ny * 0.02;
            updated[j].vx += nx * 0.02;
            updated[j].vy += ny * 0.02;
          }
        }
      }

      cardsRef.current = updated;
      setCards(updated);

      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [gameState, speedMultiplier]);

  const handleCardClick = (card: WordCardData) => {
    audioManager.playPop(soundEnabled);
    if (onPopCard) {
      onPopCard(card.text);
    }

    // Give card an impulse push
    const updated = cardsRef.current.map((c) => {
      if (c.id === card.id) {
        return {
          ...c,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          rotation: (Math.random() - 0.5) * 25,
        };
      }
      return c;
    });

    cardsRef.current = updated;
    setCards(updated);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full flex-1 min-h-[380px] md:min-h-[460px] lg:min-h-[520px] bg-slate-50 rounded-3xl border-2 border-slate-200 overflow-hidden shadow-sm flex flex-col justify-center items-center p-6 select-none group"
    >
      {/* Background Decorative Mesh & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute inset-0 border-[16px] border-white/60 pointer-events-none rounded-3xl" />

      {/* Empty State / Prompt */}
      {(!tokens || tokens.length === 0) && (
        <div className="text-center text-slate-500 z-10 max-w-md px-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white flex items-center justify-center border-2 border-slate-200 text-indigo-600 text-2xl font-bold shadow-sm">
            ✍️
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2 font-['Fredoka',sans-serif]">
            No Sentence Selected
          </h3>
          <p className="text-slate-500 text-base font-medium">
            Choose a sentence from the Sentence Bank or click <strong className="text-indigo-600">+ ADD</strong> to type your own!
          </p>
        </div>
      )}

      {/* Floating Word Cards */}
      {tokens && tokens.length > 0 && gameState !== 'ANSWER_REVEALED' && (
        <div className="absolute inset-0">
          {cards.map((card) => (
            <WordCard
              key={card.id}
              text={card.text}
              x={card.x}
              y={card.y}
              colorIndex={card.colorIndex}
              rotation={card.rotation}
              cardSize={card.cardSize || cardSize}
              isMoving={gameState === 'PLAYING'}
              onPop={() => handleCardClick(card)}
            />
          ))}
        </div>
      )}

      {/* Floating Instructions Tag during READY state */}
      {gameState === 'READY' && tokens.length > 0 && (
        <div className="absolute bottom-6 bg-white/95 text-indigo-600 border-2 border-indigo-200 px-6 py-3 rounded-2xl text-lg font-black shadow-xl animate-pulse z-20 flex items-center gap-2 font-['Fredoka',sans-serif]">
          <span>🚀 Click <strong className="text-indigo-600 underline">START</strong> to float the words!</span>
        </div>
      )}
    </div>
  );
};
