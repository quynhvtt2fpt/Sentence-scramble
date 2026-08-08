import React, { useState } from 'react';
import { X, PlusCircle, Sparkles } from 'lucide-react';
import { tokenizeSentence } from '../utils/tokenization';

interface AddSentenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSentence?: (sentenceText: string, category?: string) => void;
  onAddSentences?: (sentences: string[], category?: string) => void;
}

const PRESET_IDEAS = [
  "She goes to school by bus every day.",
  "Where did you buy those beautiful shoes?",
  "They have been playing tennis for two hours.",
  "If it rains tomorrow, we will stay at home.",
  "I am really excited to learn English with you!",
];

export const AddSentenceModal: React.FC<AddSentenceModalProps> = ({
  isOpen,
  onClose,
  onAddSentence,
  onAddSentences,
}) => {
  const [inputText, setInputText] = useState('');
  const [category, setCategory] = useState('Custom');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Calculate valid lines dynamically
  const rawLines = inputText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  const validLines = rawLines.filter((l) => tokenizeSentence(l).length >= 2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (rawLines.length === 0) {
      setErrorMsg('Please enter at least one sentence.');
      return;
    }

    if (validLines.length === 0) {
      setErrorMsg('Each sentence should contain at least 2 words.');
      return;
    }

    if (onAddSentences) {
      onAddSentences(validLines, category);
    } else if (onAddSentence) {
      validLines.forEach((sent) => onAddSentence(sent, category));
    }

    setInputText('');
    setErrorMsg('');
    onClose();
  };

  const handleSelectPreset = (preset: string) => {
    setInputText((prev) => {
      const trimmed = prev.trim();
      return trimmed ? `${trimmed}\n${preset}` : preset;
    });
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center font-bold text-xl">
              ✍️
            </div>
            <div>
              <h2 className="text-2xl font-black font-['Fredoka',sans-serif] text-slate-800">
                Add Sentences
              </h2>
              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                💡 Mỗi dòng là 1 câu tách biệt (One sentence per line)
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500">
                English Sentences
              </label>
              {validLines.length > 0 && (
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                  {validLines.length} {validLines.length === 1 ? 'sentence' : 'sentences'} detected
                </span>
              )}
            </div>

            <textarea
              rows={5}
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Nhập hoặc dán các câu vào đây (mỗi câu một dòng)...&#10;&#10;Ví dụ:&#10;She goes to school by bus every day.&#10;Where did you buy those beautiful shoes?&#10;They have been playing tennis for two hours."
              className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 focus:border-indigo-600 focus:bg-white rounded-2xl text-slate-800 text-base placeholder-slate-400 transition-all resize-none font-medium outline-none leading-relaxed"
              autoFocus
            />

            {errorMsg && (
              <p className="mt-2 text-sm text-rose-600 font-bold flex items-center gap-1">
                ⚠️ {errorMsg}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              Category / Grammar Tag (Optional)
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Present Continuous, Vocabulary, Unit 3"
              className="w-full px-4 py-2.5 bg-slate-50 border-2 border-slate-200 focus:border-indigo-600 focus:bg-white rounded-xl text-slate-800 text-sm font-medium outline-none"
            />
          </div>

          {/* Quick Ideas */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 mb-2 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Quick Inspiration Ideas:
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_IDEAS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 text-xs border border-slate-200 transition-all text-left cursor-pointer font-medium"
                >
                  "{preset}"
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 font-['Fredoka',sans-serif]">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-sm transition-all cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm flex items-center gap-2 shadow-md border-b-4 border-indigo-800 active:translate-y-0.5 active:border-b-0 transition-all cursor-pointer"
            >
              <PlusCircle className="w-5 h-5" />
              ADD SENTENCE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
