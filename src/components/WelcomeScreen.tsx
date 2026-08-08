import React from 'react';
import { Play } from 'lucide-react';

interface WelcomeScreenProps {
  onStartGame: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartGame }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border-2 border-slate-200 rounded-3xl p-8 sm:p-12 text-center shadow-2xl text-slate-800 overflow-hidden">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-xs mb-6 uppercase tracking-widest font-['Fredoka',sans-serif]">
          🎓 CLASSROOM WEB GAME
        </div>

        <h1 className="text-4xl sm:text-6xl font-black font-['Fredoka',sans-serif] text-indigo-600 mb-3 tracking-tighter">
          SENTENCE SCRAMBLE
        </h1>

        <p className="text-slate-500 text-lg sm:text-xl font-bold max-w-lg mx-auto mb-8">
          The interactive English word-order challenge for smart classrooms!
        </p>

        {/* Classroom Instructions Box */}
        <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6 mb-8 text-left space-y-4">
          <h3 className="text-indigo-600 font-black text-lg uppercase tracking-wider font-['Fredoka',sans-serif] flex items-center gap-2">
            ✏️ How To Play
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <span className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-black flex items-center justify-center text-sm shrink-0">
                1
              </span>
              <p className="text-sm font-semibold text-slate-700">
                <strong className="text-slate-900">Watch</strong> the words floating around the projected screen.
              </p>
            </div>

            <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <span className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 font-black flex items-center justify-center text-sm shrink-0">
                2
              </span>
              <p className="text-sm font-semibold text-slate-700">
                <strong className="text-slate-900">Think</strong> about grammar and correct English word order.
              </p>
            </div>

            <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-black flex items-center justify-center text-sm shrink-0">
                3
              </span>
              <p className="text-sm font-semibold text-slate-700">
                <strong className="text-slate-900">Write</strong> the full sentence down in your notebook.
              </p>
            </div>

            <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              <span className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 font-black flex items-center justify-center text-sm shrink-0">
                4
              </span>
              <p className="text-sm font-semibold text-slate-700">
                <strong className="text-slate-900">Check</strong> your notebook when teacher reveals the answer!
              </p>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStartGame}
          className="w-full sm:w-auto px-12 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-2xl flex items-center justify-center gap-3 shadow-lg border-b-4 border-indigo-800 active:translate-y-1 active:border-b-0 transition-all cursor-pointer font-['Fredoka',sans-serif]"
        >
          <Play className="w-7 h-7 fill-current" />
          START GAME
        </button>
      </div>
    </div>
  );
};
