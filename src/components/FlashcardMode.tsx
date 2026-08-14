import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles, Volume2, RotateCw, CheckCircle2, Award, ArrowRight, Zap, RefreshCw,
  Search, Star, Check, HelpCircle, Filter, BookOpen, ChevronLeft, ChevronRight,
  Trophy, Flame, CheckCircle, AlertCircle
} from 'lucide-react';
import { CORE_VOCABULARY, UNITS_DATA } from '../data/sgkData';
import { VocabularyItem } from '../types';
import { updateStudentProgress } from '../utils/auth';

interface FlashcardModeProps {
  selectedUnit: number;
  setSelectedUnit: (u: number) => void;
  onAskTutor: (q: string) => void;
}

type TabType = 'flashcards' | 'matching' | 'wordform' | 'quiz';
type FilterType = 'all' | 'mastered' | 'review' | 'favorite';

interface UserVocabState {
  status?: 'mastered' | 'review';
  isFavorite?: boolean;
}

export const FlashcardMode: React.FC<FlashcardModeProps> = ({ selectedUnit, setSelectedUnit, onAskTutor }) => {
  const [activeGameTab, setActiveGameTab] = useState<TabType>('flashcards');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<FilterType>('all');

  // Card Flip state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // LocalStorage persistence for user learning status
  const [vocabStateMap, setVocabStateMap] = useState<Record<string, UserVocabState>>(() => {
    try {
      const saved = localStorage.getItem('english_mrs_nhan_vocab_status');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('english_mrs_nhan_vocab_status', JSON.stringify(vocabStateMap));
    } catch (e) {
      console.error('Failed to save vocab status to localStorage:', e);
    }
  }, [vocabStateMap]);

  // Filtered vocabulary list
  const unitVocab = useMemo(() => {
    return CORE_VOCABULARY.filter(v => v.unit === selectedUnit);
  }, [selectedUnit]);

  const filteredVocabList = useMemo(() => {
    return unitVocab.filter(v => {
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query ||
        v.word.toLowerCase().includes(query) ||
        v.meaning.toLowerCase().includes(query) ||
        (v.ipa && v.ipa.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      const state = vocabStateMap[v.id] || {};
      if (filterCategory === 'mastered') return state.status === 'mastered';
      if (filterCategory === 'review') return state.status === 'review';
      if (filterCategory === 'favorite') return !!state.isFavorite;
      return true;
    });
  }, [unitVocab, searchQuery, filterCategory, vocabStateMap]);

  const currentCard: VocabularyItem | undefined = filteredVocabList[cardIndex % Math.max(1, filteredVocabList.length)];
  const currentCardState = currentCard ? (vocabStateMap[currentCard.id] || {}) : {};

  useEffect(() => {
    setCardIndex(0);
    setIsFlipped(false);
  }, [selectedUnit, filterCategory, searchQuery]);

  const speakWord = (word: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setVocabStateMap(prev => {
      const current = prev[id] || {};
      return {
        ...prev,
        [id]: { ...current, isFavorite: !current.isFavorite }
      };
    });
  };

  const setStatus = (id: string, status: 'mastered' | 'review', e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setVocabStateMap(prev => {
      const current = prev[id] || {};
      const newStatus = current.status === status ? undefined : status;
      
      if (newStatus === 'mastered' && current.status !== 'mastered') {
        updateStudentProgress({ vocabAdd: 1 });
      }

      return {
        ...prev,
        [id]: { ...current, status: newStatus }
      };
    });
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    if (filteredVocabList.length > 0) {
      setCardIndex(prev => (prev + 1) % filteredVocabList.length);
    }
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    if (filteredVocabList.length > 0) {
      setCardIndex(prev => (prev - 1 + filteredVocabList.length) % filteredVocabList.length);
    }
  };

  const masteredCount = unitVocab.filter(v => vocabStateMap[v.id]?.status === 'mastered').length;
  const reviewCount = unitVocab.filter(v => vocabStateMap[v.id]?.status === 'review').length;
  const favoriteCount = unitVocab.filter(v => vocabStateMap[v.id]?.isFavorite).length;
  const progressPercent = Math.round((masteredCount / Math.max(1, unitVocab.length)) * 100);

  // MATCHING GAME STATE
  const [matchingRound, setMatchingRound] = useState(0);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [selectedMeaningId, setSelectedMeaningId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<boolean>(false);
  const [matchScore, setMatchScore] = useState(0);

  const roundVocab = useMemo(() => {
    const start = (matchingRound * 6) % Math.max(1, unitVocab.length);
    let items = unitVocab.slice(start, start + 6);
    if (items.length < 6) {
      items = [...items, ...unitVocab.slice(0, 6 - items.length)];
    }
    return items;
  }, [unitVocab, matchingRound]);

  const shuffledMeanings = useMemo(() => {
    return [...roundVocab].sort(() => Math.random() - 0.5);
  }, [roundVocab, shuffleKey]);

  const handleSelectWord = (id: string) => {
    setSelectedWordId(id);
    const item = unitVocab.find(v => v.id === id);
    if (item) speakWord(item.word);

    if (selectedMeaningId) {
      checkMatch(id, selectedMeaningId);
    }
  };

  const handleSelectMeaning = (id: string) => {
    setSelectedMeaningId(id);
    if (selectedWordId) {
      checkMatch(selectedWordId, id);
    }
  };

  const checkMatch = (wId: string, mId: string) => {
    if (wId === mId) {
      setMatchedIds(prev => [...prev, wId]);
      setMatchScore(prev => prev + 10);
      setSelectedWordId(null);
      setSelectedMeaningId(null);
      setStatus(wId, 'mastered');
    } else {
      setWrongPair(true);
      setTimeout(() => {
        setWrongPair(false);
        setSelectedWordId(null);
        setSelectedMeaningId(null);
      }, 700);
    }
  };

  const resetMatchingGame = () => {
    setMatchedIds([]);
    setSelectedWordId(null);
    setSelectedMeaningId(null);
    setWrongPair(false);
    setShuffleKey(prev => prev + 1);
  };

  // WORD FORMATION
  const [userWordFormInputs, setUserWordFormInputs] = useState<Record<string, string>>({});
  const [wordFormRevealed, setWordFormRevealed] = useState<Record<string, boolean>>({});
  const [wordFormChecked, setWordFormChecked] = useState<Record<string, boolean>>({});
  const [wordFormCorrect, setWordFormCorrect] = useState<Record<string, boolean>>({});

  const handleCheckWordForm = (item: any) => {
    const userInput = (userWordFormInputs[item.id] || '').trim().toLowerCase();
    
    const possibleAnswers = [item.word.toLowerCase()];
    if (item.wordFamily && Array.isArray(item.wordFamily)) {
      item.wordFamily.forEach((w: any) => {
        if (typeof w === 'string') possibleAnswers.push(w.toLowerCase());
        else if (w && w.word) possibleAnswers.push(w.word.toLowerCase());
      });
    }
    
    const isCorrect = possibleAnswers.includes(userInput);
    setWordFormChecked(prev => ({ ...prev, [item.id]: true }));
    setWordFormCorrect(prev => ({ ...prev, [item.id]: isCorrect }));
  };

  // CONTEXTUAL QUIZ
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const quizQuestions = useMemo(() => {
    if (unitVocab.length === 0) return [];
    
    return unitVocab.slice(0, 10).map((v) => {
      let distractors = unitVocab
        .filter(x => x.id !== v.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(x => x.meaning);

      if (distractors.length < 3) {
         const extra = CORE_VOCABULARY
           .filter(x => x.id !== v.id && !distractors.includes(x.meaning) && x.meaning !== v.meaning)
           .sort(() => Math.random() - 0.5)
           .slice(0, 3 - distractors.length)
           .map(x => x.meaning);
         distractors = [...distractors, ...extra];
      }

      const options = [...distractors, v.meaning].sort(() => Math.random() - 0.5);

      return {
        id: v.id,
        word: v.word,
        ipa: v.ipa,
        partOfSpeech: v.partOfSpeech,
        correctAnswer: v.meaning,
        options,
        example: v.example
      };
    });
  }, [unitVocab]);

  const currentQuizQ = quizQuestions[quizIndex];

  const handleQuizAnswer = (option: string) => {
    if (quizSelectedOption !== null) return;
    setQuizSelectedOption(option);
    if (option === currentQuizQ.correctAnswer) {
      setQuizScore(prev => prev + 10);
      setStatus(currentQuizQ.id, 'mastered');
    } else {
      setStatus(currentQuizQ.id, 'review');
    }
  };

  const handleQuizNext = () => {
    setQuizSelectedOption(null);
    if (quizIndex + 1 < quizQuestions.length) {
      setQuizIndex(prev => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = () => {
    setQuizIndex(0);
    setQuizSelectedOption(null);
    setQuizScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header Panel */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-500/20 text-amber-300 font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider border border-amber-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" /> Kho 430 Từ Vựng SGK 9
              </span>
              <span className="bg-indigo-950 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/40">
                Unit {selectedUnit}: {UNITS_DATA.find(u => u.id === selectedUnit)?.title} ({unitVocab.length} từ)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2 tracking-tight">
              VOCAB MASTER 9 <span className="text-cyan-400 font-bold text-lg">• 4 Chế Độ Học</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Luyện phát âm chuẩn IPA, thuộc 100% từ vựng trọng tâm, collocations & dạng bài Word Form thi vào Lớp 10 THPT.
            </p>
          </div>

          {/* Unit Selector & Progress Badge */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-2xl flex items-center justify-between gap-3 min-w-[220px]">
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Tiến độ thuộc Unit {selectedUnit}</p>
                <p className="text-lg font-black text-emerald-400">{masteredCount} / {unitVocab.length} từ ({progressPercent}%)</p>
              </div>
              <div className="w-11 h-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-300 text-xs">
                {progressPercent}%
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 p-2 rounded-2xl">
              <span className="text-xs font-bold text-slate-300 ml-2">Unit:</span>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(Number(e.target.value))}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3 py-2 rounded-xl border border-indigo-400/30 outline-none cursor-pointer transition-colors"
              >
                {UNITS_DATA.map(u => (
                  <option key={u.id} value={u.id}>Unit {u.id}: {u.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 border-t border-slate-800 pt-4">
          <button
            onClick={() => setActiveGameTab('flashcards')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
              activeGameTab === 'flashcards'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
            }`}
          >
            🎴 Thẻ Lật Flashcards ({filteredVocabList.length})
          </button>

          <button
            onClick={() => setActiveGameTab('matching')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
              activeGameTab === 'matching'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
            }`}
          >
            🧩 Game Nối Từ & Nghĩa
          </button>

          <button
            onClick={() => setActiveGameTab('wordform')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
              activeGameTab === 'wordform'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
            }`}
          >
            ✍️ Thử Thách Word Form (Thi vào 10)
          </button>

          <button
            onClick={() => setActiveGameTab('quiz')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
              activeGameTab === 'quiz'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
            }`}
          >
            📝 Quiz Trắc Nghiệm Ngữ Cảnh
          </button>
        </div>
      </div>

      {/* Control Toolbar: Search & Category Filters */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm từ tiếng Anh, phát âm IPA hoặc nghĩa tiếng Việt..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs no-scrollbar">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap border ${
              filterCategory === 'all'
                ? 'bg-indigo-600 text-white border-indigo-400'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
            }`}
          >
            Tất cả ({unitVocab.length})
          </button>

          <button
            onClick={() => setFilterCategory('mastered')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1 border ${
              filterCategory === 'mastered'
                ? 'bg-emerald-600 text-white border-emerald-400'
                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" /> Đã thuộc ({masteredCount})
          </button>

          <button
            onClick={() => setFilterCategory('review')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1 border ${
              filterCategory === 'review'
                ? 'bg-amber-600 text-white border-amber-400'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" /> Cần ôn lại ({reviewCount})
          </button>

          <button
            onClick={() => setFilterCategory('favorite')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1 border ${
              filterCategory === 'favorite'
                ? 'bg-rose-600 text-white border-rose-400'
                : 'bg-rose-500/10 text-rose-300 border-rose-500/30 hover:bg-rose-500/20'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" /> Yêu thích ({favoriteCount})
          </button>
        </div>
      </div>

      {/* MODE 1: FLASHCARDS 3D MODE */}
      {activeGameTab === 'flashcards' && (
        <div className="max-w-xl mx-auto space-y-4">
          {filteredVocabList.length === 0 ? (
            <div className="bg-slate-900 p-12 rounded-2xl border border-slate-800 text-center space-y-3">
              <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">Không tìm thấy từ vựng phù hợp</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc trạng thái "Đã thuộc / Cần ôn lại / Yêu thích".
              </p>
              <button
                onClick={() => { setSearchQuery(''); setFilterCategory('all'); }}
                className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-500"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 px-2">
                <span>Thẻ {cardIndex + 1} / {filteredVocabList.length}</span>
                <span className="flex items-center gap-1 text-cyan-400">
                  <RotateCw className="w-3.5 h-3.5" /> Chạm vào thẻ để lật xem nghĩa & ví dụ
                </span>
              </div>

              {currentCard && (
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className={`w-full min-h-[340px] bg-slate-900 rounded-3xl border-2 p-6 shadow-xl transition-all cursor-pointer flex flex-col justify-between items-center text-center relative overflow-hidden group ${
                    currentCardState.status === 'mastered'
                      ? 'border-emerald-500/60 bg-emerald-950/20'
                      : currentCardState.status === 'review'
                      ? 'border-amber-500/60 bg-amber-950/20'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="w-full flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-cyan-300 bg-indigo-950 px-3 py-1 rounded-full border border-indigo-500/40">
                        Unit {currentCard.unit}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full capitalize">
                        {currentCard.partOfSpeech}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => toggleFavorite(currentCard.id, e)}
                        className={`p-2 rounded-full transition-colors ${
                          currentCardState.isFavorite
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400'
                        }`}
                        title="Đánh dấu từ yêu thích"
                      >
                        <Star className={`w-4 h-4 ${currentCardState.isFavorite ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakWord(currentCard.word);
                        }}
                        className="p-2 bg-indigo-950 hover:bg-indigo-900 text-cyan-300 rounded-full transition-colors border border-indigo-500/40"
                        title="Nghe phát âm chuẩn IPA"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {!isFlipped ? (
                    <div className="my-auto space-y-3 py-6">
                      <h2 className="text-3xl sm:text-4xl font-black text-white group-hover:text-cyan-300 transition-colors tracking-tight">
                        {currentCard.word}
                      </h2>

                      {currentCard.ipa && (
                        <div className="inline-block bg-slate-950 text-cyan-300 font-mono text-sm font-bold px-3 py-1 rounded-xl border border-slate-800">
                          {currentCard.ipa}
                        </div>
                      )}

                      <p className="text-xs text-slate-400 pt-3 font-medium flex items-center justify-center gap-1">
                        <RotateCw className="w-3.5 h-3.5 text-cyan-400" /> Nhấp để xem nghĩa tiếng Việt & ví dụ
                      </p>
                    </div>
                  ) : (
                    <div className="my-auto space-y-4 w-full text-left py-2">
                      <div className="text-center border-b border-slate-800 pb-3">
                        <h3 className="text-2xl font-black text-emerald-400">{currentCard.meaning}</h3>
                      </div>

                      <div className="text-xs space-y-2.5 text-slate-300">
                        {currentCard.example && (
                          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-slate-200 leading-relaxed font-medium">
                            <span className="font-bold text-cyan-300 block mb-0.5">💬 Ví dụ SGK:</span>
                            "{currentCard.example}"
                          </div>
                        )}

                        {currentCard.collocations && currentCard.collocations.length > 0 && (
                          <div>
                            <span className="font-bold text-slate-400 block mb-1">Collocations:</span>
                            <div className="flex flex-wrap gap-1">
                              {currentCard.collocations.map((c, idx) => (
                                <span key={idx} className="bg-indigo-950 text-cyan-300 font-semibold px-2 py-0.5 rounded text-[11px] border border-indigo-500/30">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {currentCard.examNote && (
                          <div className="bg-rose-950/40 border border-rose-500/30 p-2.5 rounded-xl text-rose-300 font-medium text-[11px]">
                            {currentCard.examNote}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="w-full pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {isFlipped ? 'Chạm để lật về mặt trước' : 'Chạm để lật về mặt sau'}
                    </span>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => setStatus(currentCard.id, 'review', e)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1 border ${
                          currentCardState.status === 'review'
                            ? 'bg-amber-600 text-white border-amber-400 shadow-md'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-amber-300'
                        }`}
                      >
                        <AlertCircle className="w-3.5 h-3.5" /> Cần ôn lại
                      </button>

                      <button
                        onClick={(e) => setStatus(currentCard.id, 'mastered', e)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs flex items-center gap-1 border ${
                          currentCardState.status === 'mastered'
                            ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-emerald-300'
                        }`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Đã thuộc
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  onClick={handlePrevCard}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-bold py-3 rounded-2xl text-xs transition-colors shadow-md flex items-center justify-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Từ Trước
                </button>
                <button
                  onClick={handleNextCard}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-2xl text-xs transition-colors shadow-md flex items-center justify-center gap-1 border border-indigo-400/30"
                >
                  Từ Tiếp Theo <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* MODE 2: MATCHING GAME */}
      {activeGameTab === 'matching' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
            <div>
              <h3 className="font-black text-white text-lg flex items-center gap-2">
                🧩 Game Nối Từ Tiếng Anh & Nghĩa Tiếng Việt (Unit {selectedUnit})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Chọn 1 từ Tiếng Anh ở cột trái và 1 nghĩa Tiếng Việt tương ứng ở cột phải để nối cặp.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
                🏆 Điểm: {matchScore}
              </span>
              <button
                onClick={resetMatchingGame}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl flex items-center gap-1 font-bold transition-colors border border-slate-700"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Chơi Lại Hiệp Này
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider flex items-center justify-between">
                <span>Từ Tiếng Anh</span>
                <span className="text-[11px] text-cyan-400 font-normal">Bấm để nghe phát âm</span>
              </h4>

              {roundVocab.map((item) => {
                const isMatched = matchedIds.includes(item.id);
                const isSelected = selectedWordId === item.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => !isMatched && handleSelectWord(item.id)}
                    className={`p-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between border ${
                      isMatched
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 opacity-60 pointer-events-none'
                        : isSelected
                        ? wrongPair
                          ? 'bg-rose-950 border-rose-500 text-rose-200 animate-pulse ring-2 ring-rose-500/50'
                          : 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                        : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{item.word}</span>
                      {item.ipa && <span className="font-mono text-[11px] text-cyan-400 font-normal">{item.ipa}</span>}
                    </div>

                    {isMatched ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); speakWord(item.word); }}
                        className="p-1 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-cyan-400"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-400 text-xs uppercase tracking-wider">Nghĩa Tiếng Việt</h4>

              {shuffledMeanings.map((item) => {
                const isMatched = matchedIds.includes(item.id);
                const isSelected = selectedMeaningId === item.id;

                return (
                  <div
                    key={'meaning-' + item.id}
                    onClick={() => !isMatched && handleSelectMeaning(item.id)}
                    className={`p-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between border ${
                      isMatched
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 opacity-60 pointer-events-none'
                        : isSelected
                        ? wrongPair
                          ? 'bg-rose-950 border-rose-500 text-rose-200 animate-pulse ring-2 ring-rose-500/50'
                          : 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                        : 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200'
                    }`}
                  >
                    <span>{item.meaning}</span>
                    <span className="text-[10px] text-amber-400 font-mono uppercase ml-2">{item.partOfSpeech}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {matchedIds.length === roundVocab.length && roundVocab.length > 0 && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl text-center space-y-3">
              <Trophy className="w-10 h-10 text-amber-400 mx-auto" />
              <h4 className="text-lg font-black text-emerald-300">Xuất sắc! Bạn đã nối chính xác toàn bộ cặp từ!</h4>
              <button
                onClick={() => {
                  setMatchingRound(prev => prev + 1);
                  resetMatchingGame();
                }}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
              >
                Chơi Hiệp Tiếp Theo →
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: WORD FORMATION CHALLENGE */}
      {activeGameTab === 'wordform' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="font-black text-white text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" /> Thử Thách Cấu Tạo Từ (Word Form) Thi Vào Lớp 10
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Điền dạng đúng của từ (Danh/Động/Tính/Trạng từ) phù hợp với ngữ cảnh câu văn SGK.
            </p>
          </div>

          <div className="space-y-4">
            {unitVocab.slice(0, 8).map((item, idx) => {
              const inputVal = userWordFormInputs[item.id] || '';
              const isRevealed = wordFormRevealed[item.id];

              return (
                <div key={item.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 text-xs">
                  <div className="flex items-center justify-between font-bold text-white text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                        {idx + 1}
                      </span>
                      Từ gốc: <span className="text-cyan-400 font-mono">{item.word}</span>
                    </span>
                    <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-full font-semibold">
                      {item.partOfSpeech}
                    </span>
                  </div>

                  <p className="text-slate-300 leading-relaxed font-medium bg-slate-900 p-3 rounded-xl border border-slate-800">
                    {item.example ? item.example : `Biến đổi từ "${item.word}" theo đúng ngữ cảnh.`}
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="text"
                      value={inputVal}
                      onChange={(e) => {
                        setUserWordFormInputs(prev => ({ ...prev, [item.id]: e.target.value }));
                        setWordFormChecked(prev => ({ ...prev, [item.id]: false }));
                      }}
                      placeholder={`Nhập từ loại đúng của "${item.word}"...`}
                      className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                    />

                    <button
                      onClick={() => handleCheckWordForm(item)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors border border-emerald-500"
                    >
                      Kiểm tra
                    </button>

                    <button
                      onClick={() => setWordFormRevealed(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors border border-slate-700"
                    >
                      {isRevealed ? 'Ẩn đáp án' : 'Xem đáp án'}
                    </button>

                    <button
                      onClick={() => onAskTutor(`Dạy em cách biến đổi Word Form của từ "${item.word}" (${item.partOfSpeech}) nhé!`)}
                      className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-colors"
                    >
                      Hỏi AI <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {wordFormChecked[item.id] && (
                    <div className={`p-3 rounded-xl border ${wordFormCorrect[item.id] ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-200' : 'bg-rose-950/80 border-rose-500/30 text-rose-200'}`}>
                      <p className="font-bold flex items-center gap-1">
                        {wordFormCorrect[item.id] ? '🎉 Chính xác!' : '❌ Chưa chính xác. Thử lại nhé!'}
                      </p>
                    </div>
                  )}

                  {isRevealed && (
                    <div className="bg-indigo-950/80 border border-indigo-500/30 p-3 rounded-xl text-cyan-200 space-y-1">
                      <p className="font-bold">
                        ✅ Đáp án từ đúng: <span className="text-cyan-300 font-mono text-sm">{item.word}</span> ({item.ipa})
                      </p>
                      <p className="text-[11px] text-slate-300">
                        Nghĩa Tiếng Việt: <span className="font-semibold text-emerald-400">{item.meaning}</span>
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 4: CONTEXTUAL QUIZ MODE */}
      {activeGameTab === 'quiz' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md space-y-6 max-w-2xl mx-auto">
          {!quizFinished ? (
            currentQuizQ && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold text-slate-400">
                    Câu {quizIndex + 1} / {quizQuestions.length} (Unit {selectedUnit})
                  </span>
                  <span className="text-xs font-bold bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full border border-amber-500/30">
                    ⭐ Điểm XP: {quizScore}
                  </span>
                </div>

                <div className="space-y-2 text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-indigo-950 px-3 py-1 rounded-full border border-indigo-500/30">
                    Chọn nghĩa tiếng Việt đúng
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">{currentQuizQ.word}</h3>
                  {currentQuizQ.ipa && (
                    <p className="font-mono text-sm text-cyan-300">{currentQuizQ.ipa} ({currentQuizQ.partOfSpeech})</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3 pt-2">
                  {currentQuizQ.options.map((option, idx) => {
                    const isSelected = quizSelectedOption === option;
                    const isCorrect = option === currentQuizQ.correctAnswer;

                    let btnClass = 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200';
                    if (quizSelectedOption !== null) {
                      if (isCorrect) {
                        btnClass = 'bg-emerald-600 text-white border-emerald-400 shadow-md';
                      } else if (isSelected) {
                        btnClass = 'bg-rose-600 text-white border-rose-400 shadow-md';
                      } else {
                        btnClass = 'bg-slate-950 text-slate-500 border-slate-800 opacity-50';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleQuizAnswer(option)}
                        disabled={quizSelectedOption !== null}
                        className={`p-4 rounded-2xl text-left text-xs font-bold transition-all border flex items-center justify-between ${btnClass}`}
                      >
                        <span className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-slate-800 text-cyan-300 flex items-center justify-center font-bold text-xs">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          {option}
                        </span>

                        {quizSelectedOption !== null && isCorrect && <Check className="w-5 h-5 text-white" />}
                      </button>
                    );
                  })}
                </div>

                {quizSelectedOption !== null && (
                  <div className={`p-4 rounded-2xl border text-xs space-y-2 ${
                    quizSelectedOption === currentQuizQ.correctAnswer
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                  }`}>
                    <p className="font-bold text-sm">
                      {quizSelectedOption === currentQuizQ.correctAnswer ? '🎉 Chính xác! (+10 XP)' : '❌ Chưa chính xác!'}
                    </p>
                    <p className="leading-relaxed">
                      Nghĩa đúng của <strong className="font-mono">{currentQuizQ.word}</strong> là: <strong>"{currentQuizQ.correctAnswer}"</strong>.
                    </p>
                  </div>
                )}

                {quizSelectedOption !== null && (
                  <button
                    onClick={handleQuizNext}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xs shadow-md transition-colors flex items-center justify-center gap-1 border border-indigo-400/30"
                  >
                    {quizIndex + 1 < quizQuestions.length ? 'Câu Tiếp Theo →' : 'Xem Kết Quả Quiz →'}
                  </button>
                )}
              </div>
            )
          ) : (
            <div className="text-center space-y-4 py-4">
              <Trophy className="w-16 h-16 text-amber-400 mx-auto" />
              <h3 className="text-2xl font-black text-white">Hoàn Thành Bài Quiz Unit {selectedUnit}!</h3>
              <p className="text-sm font-bold text-cyan-300 bg-indigo-950 py-2 px-4 rounded-2xl inline-block border border-indigo-500/30">
                Tổng điểm XP đạt được: {quizScore} / 100 XP
              </p>
              <button
                onClick={restartQuiz}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xs shadow-md transition-colors"
              >
                Làm Lại Bài Quiz
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
