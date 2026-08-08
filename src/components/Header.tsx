import React from 'react';
import { Plus, BookOpen, Maximize, Volume2, VolumeX, Settings, HelpCircle } from 'lucide-react';
import { Timer } from './Timer';

interface HeaderProps {
  title?: string;
  timeLeft: number;
  totalTime: number;
  isTimerRunning: boolean;
  soundEnabled: boolean;
  sentenceCount: number;
  onOpenAddModal: () => void;
  onOpenBankDrawer: () => void;
  onOpenSettings: () => void;
  onOpenHelp: () => void;
  onToggleSound: () => void;
  onToggleFullscreen: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title = 'SENTENCE SCRAMBLE',
  timeLeft,
  totalTime,
  isTimerRunning,
  soundEnabled,
  sentenceCount,
  onOpenAddModal,
  onOpenBankDrawer,
  onOpenSettings,
  onOpenHelp,
  onToggleSound,
  onToggleFullscreen,
}) => {
  return (
    <header className="w-full bg-white border-b-2 border-slate-200 px-6 sm:px-10 py-4 flex flex-wrap items-center justify-between gap-4 shadow-sm sticky top-0 z-30">
      {/* Title & Badge */}
      <div className="flex flex-col">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-indigo-600 font-['Fredoka',sans-serif]">
          {title}
        </h1>
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Teacher Console • Projector Mode
        </p>
      </div>

      {/* Prominent Digital Timer */}
      <div className="mx-auto sm:mx-0">
        <Timer
          timeLeft={timeLeft}
          totalTime={totalTime}
          isRunning={isTimerRunning}
          soundEnabled={soundEnabled}
        />
      </div>

      {/* Quick Access Utility Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm flex items-center gap-1.5 shadow-md shadow-indigo-200 transition-all active:scale-95 cursor-pointer font-['Fredoka',sans-serif]"
          title="Add a new sentence"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ ADD</span>
        </button>

        <button
          onClick={onOpenBankDrawer}
          className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm flex items-center gap-1.5 border border-slate-200 transition-all active:scale-95 cursor-pointer font-['Fredoka',sans-serif] relative"
          title="Sentence Bank"
        >
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span className="hidden md:inline">BANK</span>
          <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-md font-bold ml-0.5">
            {sentenceCount}
          </span>
        </button>

        <button
          onClick={onToggleSound}
          className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
            soundEnabled
              ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
              : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
          }`}
          title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>

        <button
          onClick={onToggleFullscreen}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-all cursor-pointer hidden sm:flex"
          title="Toggle Classroom Fullscreen Mode"
        >
          <Maximize className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-all cursor-pointer"
          title="Game Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenHelp}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-all cursor-pointer"
          title="How to Play Instructions"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
