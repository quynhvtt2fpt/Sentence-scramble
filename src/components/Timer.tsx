import React, { useEffect } from 'react';
import { audioManager } from '../utils/audio';

interface TimerProps {
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
  soundEnabled: boolean;
}

export const Timer: React.FC<TimerProps> = ({
  timeLeft,
  totalTime,
  isRunning,
  soundEnabled,
}) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isWarning = timeLeft <= 20 && timeLeft > 10;
  const isCritical = timeLeft <= 10 && timeLeft > 0;

  // Countdown ticking audio effect on every second tick
  useEffect(() => {
    if (isRunning && timeLeft >= 0) {
      audioManager.playTick(soundEnabled, timeLeft);
    }
  }, [timeLeft, isRunning, soundEnabled]);

  // Color classes
  let statusTextStyle = 'text-slate-800';
  let pulseAnimation = '';

  if (isWarning) {
    statusTextStyle = 'text-amber-600';
    pulseAnimation = 'animate-pulse';
  } else if (isCritical) {
    statusTextStyle = 'text-rose-600 scale-105';
    pulseAnimation = 'animate-bounce';
  }

  // Progress percentage
  const progressPercent = Math.max(0, Math.min(100, (timeLeft / totalTime) * 100));

  return (
    <div className="flex flex-col items-center justify-center">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
        Remaining Time
      </span>
      <div className={`text-3xl sm:text-4xl md:text-5xl font-mono font-black tabular-nums transition-all duration-300 ${statusTextStyle} ${pulseAnimation}`}>
        {formattedTime}
      </div>

      {/* Progress Bar */}
      <div className="w-28 sm:w-36 h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${
            isCritical
              ? 'bg-rose-500'
              : isWarning
              ? 'bg-amber-500'
              : 'bg-indigo-600'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
};
