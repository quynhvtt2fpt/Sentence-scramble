import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { audioManager } from '../utils/audio';

interface AnswerDisplayProps {
  originalSentence: string;
  soundEnabled: boolean;
  onNext?: () => void;
  onReplay?: () => void;
  onReset?: () => void;
}

export const AnswerDisplay: React.FC<AnswerDisplayProps> = ({
  originalSentence,
  soundEnabled,
  onNext,
  onReplay,
  onReset,
}) => {
  const words = originalSentence.split(' ');
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    setVisibleCount(0);

    // Play fanfare
    audioManager.playAnswerReveal(soundEnabled);

    // Fire confetti blast
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'],
      });
    } catch {
      // ignore
    }

    // Reveal words sequentially
    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev < words.length) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 120);

    return () => clearInterval(interval);
  }, [originalSentence, soundEnabled]);

  return (
    <div className="relative w-full flex-1 min-h-[380px] md:min-h-[460px] bg-white rounded-3xl border-2 border-emerald-500/80 p-8 shadow-lg flex flex-col justify-between items-center text-center z-20 overflow-hidden">
      {/* Decorative top badge */}
      <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-lg font-black font-['Fredoka',sans-serif] shadow-sm animate-pulse">
        <span>✨ CORRECT ANSWER REVEALED</span>
      </div>

      {/* Answer Sentence Words */}
      <div className="my-auto py-6 px-4 max-w-5xl flex flex-wrap justify-center items-center gap-3 sm:gap-4 font-['Fredoka',sans-serif] leading-relaxed">
        {words.map((word, idx) => {
          const isVisible = idx < visibleCount;
          return (
            <span
              key={idx}
              className={`inline-block px-5 py-3 sm:px-7 sm:py-4 rounded-2xl sm:rounded-3xl text-3xl sm:text-4xl md:text-5xl font-black transition-all duration-300 shadow-xl ${
                isVisible
                  ? 'opacity-100 scale-100 translate-y-0 bg-indigo-600 text-white border-b-8 border-indigo-800'
                  : 'opacity-0 scale-50 translate-y-4 bg-slate-100 text-slate-300'
              }`}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-slate-200 w-full font-['Fredoka',sans-serif]">
        {onReplay && (
          <button
            onClick={onReplay}
            className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-lg flex items-center gap-2 border border-slate-200 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <span>🔄</span> REPLAY
          </button>
        )}

        {onReset && (
          <button
            onClick={onReset}
            className="px-6 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-lg flex items-center gap-2 border border-rose-200 shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <span>⏹️</span> RESET
          </button>
        )}

        {onNext && (
          <button
            onClick={onNext}
            className="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xl flex items-center gap-2 shadow-lg border-b-4 border-emerald-800 active:translate-y-1 active:border-b-0 transition-all cursor-pointer"
          >
            <span>NEXT SENTENCE</span> ➔
          </button>
        )}
      </div>
    </div>
  );
};
