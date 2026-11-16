import React, { useState } from 'react';
import { SentenceItem } from '../types';
import { X, Play, Trash2, Search, RotateCcw, Copy, Check, Pencil } from 'lucide-react';
import { tokenizeSentence } from '../utils/tokenization';

interface SentenceBankDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sentences: SentenceItem[];
  activeSentenceId: string | null;
  onSelectSentence: (sentence: SentenceItem) => void;
  onEditSentence: (id: string, newText: string, newCategory?: string) => void;
  onDeleteSentence: (id: string) => void;
  onResetToDefaults: () => void;
}

export const SentenceBankDrawer: React.FC<SentenceBankDrawerProps> = ({
  isOpen,
  onClose,
  sentences,
  activeSentenceId,
  onSelectSentence,
  onEditSentence,
  onDeleteSentence,
  onResetToDefaults,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editError, setEditError] = useState('');

  if (!isOpen) return null;

  const filteredSentences = sentences.filter((s) =>
    s.originalSentence.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.category && s.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCopyWorksheet = () => {
    const textList = sentences
      .map((s, idx) => `${idx + 1}. ${s.originalSentence}`)
      .join('\n');
    navigator.clipboard.writeText(textList);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartEdit = (item: SentenceItem) => {
    setEditingId(item.id);
    setEditText(item.originalSentence);
    setEditCategory(item.category || '');
    setEditError('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
    setEditCategory('');
    setEditError('');
  };

  const handleSaveEdit = (id: string) => {
    const trimmedText = editText.trim();
    if (!trimmedText) {
      setEditError('Please enter a sentence.');
      return;
    }

    const tokens = tokenizeSentence(trimmedText);
    if (tokens.length < 2) {
      setEditError('Sentence should contain at least 2 words.');
      return;
    }

    onEditSentence(id, trimmedText, editCategory.trim() || undefined);
    handleCancelEdit();
  };

  const handleDrawerClose = () => {
    handleCancelEdit();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border-l-2 border-slate-200 h-full flex flex-col p-6 shadow-2xl text-slate-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center font-bold text-xl">
              📚
            </div>
            <div>
              <h2 className="text-2xl font-black font-['Fredoka',sans-serif] text-slate-800">
                Sentence Bank
              </h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {sentences.length} {sentences.length === 1 ? 'sentence' : 'sentences'} available
              </p>
            </div>
          </div>
          <button
            onClick={handleDrawerClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="my-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search sentence or category..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:border-indigo-600 focus:bg-white placeholder-slate-400 font-medium outline-none"
            />
          </div>

          <div className="flex items-center justify-between gap-2 font-['Fredoka',sans-serif]">
            <button
              onClick={handleCopyWorksheet}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 font-bold flex items-center gap-1.5 border border-slate-200 cursor-pointer transition-all"
              title="Copy all sentences as a text worksheet"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-indigo-600" />}
              {copied ? 'Copied Worksheet!' : 'Copy List'}
            </button>

            <button
              onClick={onResetToDefaults}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-600 hover:text-indigo-600 font-bold flex items-center gap-1.5 border border-slate-200 cursor-pointer transition-all"
              title="Restore sample sentences"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restore Samples
            </button>
          </div>
        </div>

        {/* Sentence List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filteredSentences.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-base font-bold">No sentences found.</p>
              <p className="text-xs mt-1">Add a new sentence to populate your bank!</p>
            </div>
          ) : (
            filteredSentences.map((item, idx) => {
              const isActive = item.id === activeSentenceId;
              const isEditing = editingId === item.id;

              if (isEditing) {
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border-2 border-indigo-400 bg-indigo-50/40 shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 font-['Fredoka',sans-serif]">
                        ✏️ Editing Sentence #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-white transition-colors cursor-pointer"
                        title="Cancel edit"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <textarea
                        rows={2}
                        value={editText}
                        onChange={(e) => {
                          setEditText(e.target.value);
                          if (editError) setEditError('');
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSaveEdit(item.id);
                          } else if (e.key === 'Escape') {
                            e.preventDefault();
                            handleCancelEdit();
                          }
                        }}
                        placeholder="Enter English sentence..."
                        className="w-full px-3 py-2 bg-white border-2 border-slate-200 focus:border-indigo-600 rounded-xl text-sm text-slate-800 font-semibold outline-none resize-none leading-relaxed"
                        autoFocus
                      />

                      <input
                        type="text"
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSaveEdit(item.id);
                          } else if (e.key === 'Escape') {
                            e.preventDefault();
                            handleCancelEdit();
                          }
                        }}
                        placeholder="Category / Tag (optional)"
                        className="w-full px-3 py-1.5 bg-white border-2 border-slate-200 focus:border-indigo-600 rounded-xl text-xs text-slate-700 font-medium outline-none"
                      />

                      {editError && (
                        <p className="text-xs text-rose-600 font-bold">
                          ⚠️ {editError}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1 font-['Fredoka',sans-serif]">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold transition-all cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(item.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center gap-1 shadow-sm border-b-2 border-indigo-800 active:translate-y-0.5 active:border-b-0 transition-all cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Save
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                    isActive
                      ? 'bg-indigo-50/70 border-indigo-300 shadow-sm'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200">
                        #{idx + 1}
                      </span>
                      {item.category && (
                        <span className="text-xs font-bold text-indigo-700 px-2 py-0.5 rounded-md bg-indigo-100 border border-indigo-200">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <p className="text-base font-bold text-slate-800 font-['Fredoka',sans-serif] break-words">
                      "{item.originalSentence}"
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-medium">
                      {item.tokens.length} words: {item.tokens.join(' / ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 font-['Fredoka',sans-serif] shrink-0">
                    <button
                      onClick={() => {
                        onSelectSentence(item);
                        handleDrawerClose();
                      }}
                      className={`p-2 rounded-xl font-black flex items-center gap-1 text-xs cursor-pointer transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                      }`}
                      title="Play this sentence"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      {isActive ? 'ACTIVE' : 'PLAY'}
                    </button>

                    <button
                      onClick={() => handleStartEdit(item)}
                      className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                      title="Edit sentence"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteSentence(item.id)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete sentence"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
