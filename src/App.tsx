import { useState, useEffect, useRef } from 'react';
import {
  SentenceItem,
  GameState,
  Difficulty,
  TimerOption,
  GameSettings,
} from './types';
import { INITIAL_SENTENCES } from './utils/sampleData';
import { tokenizeSentence, shuffleTokens } from './utils/tokenization';
import { audioManager } from './utils/audio';

import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { GameArea } from './components/GameArea';
import { AnswerDisplay } from './components/AnswerDisplay';
import { AddSentenceModal } from './components/AddSentenceModal';
import { SentenceBankDrawer } from './components/SentenceBankDrawer';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SettingsModal } from './components/SettingsModal';

const STORAGE_KEY = 'sentence_scramble_bank_v1';

export default function App() {
  // Sentence Bank state
  const [sentences, setSentences] = useState<SentenceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_SENTENCES;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const activeSentence = sentences[currentIndex] || sentences[0];

  // Game state
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [shuffledTokens, setShuffledTokens] = useState<string[]>([]);

  // Settings
  const [settings, setSettings] = useState<GameSettings>({
    soundEnabled: false,
    timerDuration: 60,
    difficulty: 'MEDIUM',
    cardSize: 'LARGE',
    showWordCount: true,
    autoPlayNext: false,
  });

  // Timer
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBankDrawerOpen, setIsBankDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Save sentences to localStorage whenever modified
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sentences));
    } catch {
      // ignore
    }
  }, [sentences]);

  // Whenever current sentence changes, shuffle tokens and prepare READY state
  useEffect(() => {
    if (activeSentence) {
      const tokens = activeSentence.tokens || tokenizeSentence(activeSentence.originalSentence);
      setShuffledTokens(shuffleTokens(tokens));
      setTimeLeft(settings.timerDuration);
      if (gameState !== 'IDLE') {
        setGameState('READY');
      }
    } else {
      setShuffledTokens([]);
    }
  }, [currentIndex, activeSentence, settings.timerDuration]);

  // Countdown timer effect
  useEffect(() => {
    if (gameState === 'PLAYING') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            setGameState('TIME_UP');
            audioManager.playTimeUp(settings.soundEnabled);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState, settings.soundEnabled]);

  // Control Handlers
  const handleStart = () => {
    if (!activeSentence) return;

    if (gameState === 'READY' || gameState === 'IDLE') {
      // Shuffle again on fresh start
      const tokens = activeSentence.tokens || tokenizeSentence(activeSentence.originalSentence);
      setShuffledTokens(shuffleTokens(tokens));
      setTimeLeft(settings.timerDuration);
    }

    audioManager.playStart(settings.soundEnabled);
    setGameState('PLAYING');
  };

  const handlePause = () => {
    setGameState('PAUSED');
  };

  const handleAnswer = () => {
    setGameState('ANSWER_REVEALED');
  };

  const handleReset = () => {
    if (!activeSentence) return;
    const tokens = activeSentence.tokens || tokenizeSentence(activeSentence.originalSentence);
    setShuffledTokens(shuffleTokens(tokens));
    setTimeLeft(settings.timerDuration);
    setGameState('READY');
  };

  const handleReplay = () => {
    handleReset();
  };

  const handleNextSentence = () => {
    if (sentences.length === 0) return;
    const nextIdx = (currentIndex + 1) % sentences.length;
    setCurrentIndex(nextIdx);
  };

  const handlePrevSentence = () => {
    if (sentences.length === 0) return;
    const prevIdx = (currentIndex - 1 + sentences.length) % sentences.length;
    setCurrentIndex(prevIdx);
  };

  const handleSelectTimer = (time: TimerOption) => {
    setSettings((prev) => ({ ...prev, timerDuration: Number(time) }));
    setTimeLeft(Number(time));
  };

  const handleSelectDifficulty = (difficulty: Difficulty) => {
    setSettings((prev) => ({ ...prev, difficulty }));
  };

  const handleAddSentences = (texts: string[], category?: string) => {
    if (!texts || texts.length === 0) return;

    const baseTime = Date.now();
    const newItems: SentenceItem[] = texts.map((text, idx) => ({
      id: `sent-${baseTime}-${idx}`,
      originalSentence: text,
      tokens: tokenizeSentence(text),
      category: category || 'Custom',
      createdAt: baseTime + idx,
    }));

    const updated = [...newItems, ...sentences];
    setSentences(updated);
    setCurrentIndex(0); // Select the first newly created sentence immediately
  };

  const handleAddSentence = (text: string, category?: string) => {
    handleAddSentences([text], category);
  };

  const handleDeleteSentence = (id: string) => {
    const updated = sentences.filter((s) => s.id !== id);
    setSentences(updated);
    if (currentIndex >= updated.length) {
      setCurrentIndex(Math.max(0, updated.length - 1));
    }
  };

  const handleResetToDefaults = () => {
    setSentences(INITIAL_SENTENCES);
    setCurrentIndex(0);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-amber-400 selection:text-slate-950 overflow-x-hidden">
      {/* Header Bar */}
      <Header
        timeLeft={timeLeft}
        totalTime={settings.timerDuration}
        isTimerRunning={gameState === 'PLAYING'}
        soundEnabled={settings.soundEnabled}
        sentenceCount={sentences.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenBankDrawer={() => setIsBankDrawerOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onToggleSound={() =>
          setSettings((prev) => ({ ...prev, soundEnabled: !prev.soundEnabled }))
        }
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Active Sentence Metadata Banner */}
        {activeSentence && (
          <div className="bg-white border border-slate-200 rounded-2xl px-5 py-3 flex flex-wrap items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 font-['Fredoka',sans-serif]">
                CURRENT SENTENCE #{currentIndex + 1}
              </span>
              {activeSentence.category && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-['Fredoka',sans-serif]">
                  {activeSentence.category}
                </span>
              )}
            </div>

            <div className="text-xs text-slate-500 font-bold flex items-center gap-3">
              <span>{shuffledTokens.length} Words</span>
              <span>•</span>
              <span className="text-slate-600">
                Difficulty: <strong className="text-indigo-600">{settings.difficulty}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Primary Stage Area */}
        <div className="flex-1 flex flex-col relative min-h-[420px]">
          {gameState === 'ANSWER_REVEALED' && activeSentence ? (
            <AnswerDisplay
              originalSentence={activeSentence.originalSentence}
              soundEnabled={settings.soundEnabled}
              onNext={handleNextSentence}
              onReplay={handleReplay}
              onReset={handleReset}
            />
          ) : (
            <GameArea
              tokens={shuffledTokens}
              gameState={gameState}
              difficulty={settings.difficulty}
              cardSize={settings.cardSize}
              soundEnabled={settings.soundEnabled}
            />
          )}

          {/* Time's Up Banner */}
          {gameState === 'TIME_UP' && (
            <div className="absolute inset-0 z-30 bg-slate-900/40 backdrop-blur-sm flex flex-col items-center justify-center p-6 rounded-3xl animate-fadeIn text-center">
              <div className="bg-white border-2 border-rose-200 p-8 rounded-3xl shadow-2xl max-w-md w-full flex flex-col items-center">
                <div className="px-6 py-2 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-2xl font-black mb-4 font-['Fredoka',sans-serif] animate-bounce shadow-sm">
                  ⏰ TIME'S UP!
                </div>
                <p className="text-xl text-slate-800 font-extrabold mb-6 font-['Fredoka',sans-serif]">
                  Pens down! Did everyone write their sentence?
                </p>
                <button
                  onClick={handleAnswer}
                  className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xl flex items-center gap-3 shadow-lg border-b-4 border-indigo-800 active:translate-y-1 active:border-b-0 transition-all cursor-pointer font-['Fredoka',sans-serif]"
                >
                  <span>👁️</span> REVEAL ANSWER
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main Control Toolbar */}
        <Toolbar
          gameState={gameState}
          selectedTimer={settings.timerDuration}
          selectedDifficulty={settings.difficulty}
          currentIndex={currentIndex}
          totalSentences={sentences.length}
          onSelectTimer={handleSelectTimer}
          onSelectDifficulty={handleSelectDifficulty}
          onStart={handleStart}
          onPause={handlePause}
          onAnswer={handleAnswer}
          onReset={handleReset}
          onReplay={handleReplay}
          onPrevSentence={handlePrevSentence}
          onNextSentence={handleNextSentence}
        />
      </main>

      {/* Welcome / How-to-Play Overlay */}
      {(gameState === 'IDLE' || isHelpOpen) && (
        <WelcomeScreen
          onStartGame={() => {
            setIsHelpOpen(false);
            if (gameState === 'IDLE') {
              setGameState('READY');
            }
          }}
        />
      )}

      {/* Add Sentence Modal */}
      <AddSentenceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSentences={handleAddSentences}
        onAddSentence={handleAddSentence}
      />

      {/* Sentence Bank Drawer */}
      <SentenceBankDrawer
        isOpen={isBankDrawerOpen}
        onClose={() => setIsBankDrawerOpen(false)}
        sentences={sentences}
        activeSentenceId={activeSentence?.id || null}
        onSelectSentence={(item) => {
          const idx = sentences.findIndex((s) => s.id === item.id);
          if (idx !== -1) setCurrentIndex(idx);
        }}
        onDeleteSentence={handleDeleteSentence}
        onResetToDefaults={handleResetToDefaults}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newPartial) =>
          setSettings((prev) => ({ ...prev, ...newPartial }))
        }
      />
    </div>
  );
}
