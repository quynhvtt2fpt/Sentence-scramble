import React from 'react';
import { Play, Pause, Eye, RotateCcw, ChevronLeft, ChevronRight, Clock, Gauge } from 'lucide-react';
import { Difficulty, GameState, TimerOption } from '../types';

interface ToolbarProps {
  gameState: GameState;
  selectedTimer: TimerOption;
  selectedDifficulty: Difficulty;
  currentIndex: number;
  totalSentences: number;
  onSelectTimer: (time: TimerOption) => void;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onStart: () => void;
  onPause: () => void;
  onAnswer: () => void;
  onReset: () => void;
  onReplay: () => void;
  onPrevSentence: () => void;
  onNextSentence: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  gameState,
  selectedTimer,
  selectedDifficulty,
  currentIndex,
  totalSentences,
  onSelectTimer,
  onSelectDifficulty,
  onStart,
  onPause,
  onAnswer,
  onReset,
  onReplay,
  onPrevSentence,
  onNextSentence,
}) => {
  const isPlaying = gameState === 'PLAYING';
  const isPaused = gameState === 'PAUSED';
  const isAnswerRevealed = gameState === 'ANSWER_REVEALED';

  return (
    <div className="w-full bg-white border-2 border-slate-200 p-4 sm:p-5 rounded-3xl shadow-lg flex flex-wrap items-center justify-between gap-4 font-['Fredoka',sans-serif]">
      {/* Left Group: Timer & Speed Selectors */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Timer Selector */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Clock className="w-3 h-3 text-indigo-600" /> Time Limit
          </span>
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            {[30, 60, 120].map((seconds) => (
              <button
                key={seconds}
                onClick={() => onSelectTimer(seconds)}
                disabled={isPlaying}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  selectedTimer === seconds
                    ? 'bg-white text-slate-800 shadow-sm font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {seconds}s
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Gauge className="w-3 h-3 text-indigo-600" /> Speed
          </span>
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(['EASY', 'MEDIUM', 'HARD'] as Difficulty[]).map((level) => (
              <button
                key={level}
                onClick={() => onSelectDifficulty(level)}
                disabled={isPlaying}
                className={`px-3 py-1 text-xs font-bold uppercase rounded-lg transition-all cursor-pointer ${
                  selectedDifficulty === level
                    ? 'bg-white text-slate-800 shadow-sm font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                } ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {level === 'EASY' && 'SLOW'}
                {level === 'MEDIUM' && 'MED'}
                {level === 'HARD' && 'FAST'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Middle Group: Primary Game Control Actions (3D Blocky Tactile Buttons) */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* START / RESUME */}
        {!isPlaying ? (
          <button
            onClick={onStart}
            disabled={isAnswerRevealed}
            className={`px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-base sm:text-lg flex items-center gap-2 shadow-lg border-b-4 border-indigo-800 active:translate-y-1 active:border-b-0 transition-all cursor-pointer uppercase tracking-tight ${
              isAnswerRevealed ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            <Play className="w-5 h-5 fill-current" />
            {isPaused ? 'RESUME GAME' : 'START GAME'}
          </button>
        ) : (
          /* PAUSE */
          <button
            onClick={onPause}
            className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-black text-base sm:text-lg flex items-center gap-2 shadow-lg border-b-4 border-amber-700 active:translate-y-1 active:border-b-0 transition-all cursor-pointer uppercase tracking-tight"
          >
            <Pause className="w-5 h-5 fill-current" />
            PAUSE GAME
          </button>
        )}

        {/* ANSWER REVEAL */}
        <button
          onClick={onAnswer}
          className="px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-black text-base sm:text-lg flex items-center gap-2 shadow-lg border-b-4 border-slate-950 active:translate-y-1 active:border-b-0 transition-all cursor-pointer uppercase tracking-tight"
          title="Reveal the correct English sentence answer"
        >
          <Eye className="w-5 h-5" />
          SHOW ANSWER
        </button>

        {/* REPLAY / RESET */}
        <button
          onClick={isAnswerRevealed ? onReplay : onReset}
          className="px-5 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-base flex items-center gap-2 shadow-lg border-b-4 border-rose-800 active:translate-y-1 active:border-b-0 transition-all cursor-pointer uppercase tracking-tight"
          title={isAnswerRevealed ? 'Replay same sentence' : 'Reset current round'}
        >
          <RotateCcw className="w-4 h-4" />
          {isAnswerRevealed ? 'REPLAY' : 'RESET'}
        </button>
      </div>

      {/* Right Group: Sentence Navigation */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        <button
          onClick={onPrevSentence}
          disabled={totalSentences <= 1}
          className="p-2 rounded-xl bg-white hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 shadow-sm transition-all cursor-pointer"
          title="Previous Sentence"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="px-3 text-xs font-black text-slate-700 font-mono">
          {totalSentences > 0 ? `${currentIndex + 1} / ${totalSentences}` : '0 / 0'}
        </span>

        <button
          onClick={onNextSentence}
          disabled={totalSentences <= 1}
          className="p-2 rounded-xl bg-white hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 shadow-sm transition-all cursor-pointer"
          title="Next Sentence"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
