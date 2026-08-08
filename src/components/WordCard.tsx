import React from 'react';
import { CardSize } from '../types';

interface WordCardProps {
  text: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  colorIndex: number;
  rotation: number;
  cardSize: CardSize;
  isMoving: boolean;
  onPop?: () => void;
}

const CARD_COLOR_STYLES = [
  'bg-sky-500 text-white border-b-8 border-sky-700 shadow-xl shadow-sky-500/20 font-bold',
  'bg-emerald-500 text-white border-b-8 border-emerald-700 shadow-xl shadow-emerald-500/20 font-bold',
  'bg-amber-500 text-white border-b-8 border-amber-700 shadow-xl shadow-amber-500/20 font-bold',
  'bg-rose-500 text-white border-b-8 border-rose-700 shadow-xl shadow-rose-500/20 font-bold',
  'bg-indigo-600 text-white border-b-8 border-indigo-800 shadow-xl shadow-indigo-600/20 font-bold',
  'bg-violet-500 text-white border-b-8 border-violet-700 shadow-xl shadow-violet-500/20 font-bold',
  'bg-orange-500 text-white border-b-8 border-orange-700 shadow-xl shadow-orange-500/20 font-bold',
  'bg-cyan-500 text-white border-b-8 border-cyan-700 shadow-xl shadow-cyan-500/20 font-bold',
];

export const WordCard: React.FC<WordCardProps> = ({
  text,
  x,
  y,
  colorIndex,
  rotation,
  cardSize,
  isMoving,
  onPop,
}) => {
  const colorStyle = CARD_COLOR_STYLES[colorIndex % CARD_COLOR_STYLES.length];

  // Map card size to font & padding classes
  const sizeClasses = {
    NORMAL: 'text-2xl sm:text-3xl md:text-4xl px-6 py-3 rounded-2xl sm:rounded-3xl',
    LARGE: 'text-3xl sm:text-4xl md:text-5xl px-8 py-4 rounded-3xl',
    HUGE: 'text-4xl sm:text-5xl md:text-6xl px-10 py-5 rounded-3xl',
  }[cardSize];

  return (
    <div
      onClick={onPop}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        transition: isMoving ? 'transform 0.05s linear' : 'all 0.3s ease-out',
      }}
      className={`absolute select-none cursor-pointer font-['Fredoka',sans-serif] tracking-tight hover:scale-110 active:scale-95 transition-all duration-150 ${sizeClasses} ${colorStyle} flex items-center justify-center whitespace-nowrap z-10 hover:z-20`}
    >
      <span>{text}</span>
    </div>
  );
};
