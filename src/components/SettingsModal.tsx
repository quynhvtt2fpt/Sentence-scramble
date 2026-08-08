import React from 'react';
import { X, Volume2, VolumeX, Gauge, Type } from 'lucide-react';
import { CardSize, Difficulty, GameSettings } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center font-bold text-xl">
              ⚙️
            </div>
            <div>
              <h2 className="text-2xl font-black font-['Fredoka',sans-serif] text-slate-800">
                Game Settings
              </h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Customize movement speed, card sizes, and sound effects.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Options */}
        <div className="mt-6 space-y-5 font-['Fredoka',sans-serif]">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? (
                <Volume2 className="w-6 h-6 text-emerald-600" />
              ) : (
                <VolumeX className="w-6 h-6 text-slate-400" />
              )}
              <div>
                <p className="font-extrabold text-slate-800">Sound Effects</p>
                <p className="text-xs font-semibold text-slate-400">Play clicks, countdown ticks, and reveal chimes</p>
              </div>
            </div>

            <button
              onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                settings.soundEnabled
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {settings.soundEnabled ? '🔊 ON' : '🔇 OFF'}
            </button>
          </div>

          {/* Difficulty / Movement Speed */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 font-black text-slate-800">
              <Gauge className="w-5 h-5 text-indigo-600" /> Movement Speed
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['EASY', 'MEDIUM', 'HARD'] as Difficulty[]).map((level) => {
                const isActive = settings.difficulty === level;
                return (
                  <button
                    key={level}
                    onClick={() => onUpdateSettings({ difficulty: level })}
                    className={`py-2.5 px-3 rounded-xl font-extrabold text-xs uppercase transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {level === 'EASY' && '🐢 EASY'}
                    {level === 'MEDIUM' && '🚶 MEDIUM'}
                    {level === 'HARD' && '🚀 HARD'}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card Size Selector */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 font-black text-slate-800">
              <Type className="w-5 h-5 text-indigo-600" /> Word Card Size
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(['NORMAL', 'LARGE', 'HUGE'] as CardSize[]).map((size) => {
                const isActive = settings.cardSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => onUpdateSettings({ cardSize: size })}
                    className={`py-2.5 px-3 rounded-xl font-extrabold text-xs uppercase transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-right font-['Fredoka',sans-serif]">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-xl shadow-md border-b-4 border-indigo-800 active:translate-y-0.5 active:border-b-0 transition-all cursor-pointer"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};
