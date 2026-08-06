import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles, Volume2, RotateCw, CheckCircle2, Award, ArrowRight, Zap, RefreshCw,
  Search, Star, Check, HelpCircle, Filter, BookOpen, ChevronLeft, ChevronRight,
  Trophy, Flame, CheckCircle, AlertCircle
} from 'lucide-react';
import { CORE_VOCABULARY, UNITS_DATA } from '../data/sgkData';
import { VocabularyItem } from '../types';

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
      // Search text match
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || 
        v.word.toLowerCase().includes(query) || 
        v.meaning.toLowerCase().includes(query) ||
        (v.ipa && v.ipa.toLowerCase().includes(query));

      if (!matchesSearch) return false;

      // Category filter
      const state = vocabStateMap[v.id] || {};
      if (filterCategory === 'mastered') return state.status === 'mastered';
      if (filterCategory === 'review') return state.status === 'review';
      if (filterCategory === 'favorite') return !!state.isFavorite;
      return true;
    });
  }, [unitVocab, searchQuery, filterCategory, vocabStateMap]);

  // Current Card
  const currentCard: VocabularyItem | undefined = filteredVocabList[cardIndex % Math.max(1, filteredVocabList.length)];
  const currentCardState = currentCard ? (vocabStateMap[currentCard.id] || {}) : {};

  // Reset index when filter/unit changes
  useEffect(() => {
    setCardIndex(0);
    setIsFlipped(false);
  }, [selectedUnit, filterCategory, searchQuery]);

  // TTS audio pronuncation
  const speakWord = (word: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // State update helpers
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

  // Unit Progress Stats
  const masteredCount = unitVocab.filter(v => vocabStateMap[v.id]?.status === 'mastered').length;
  const reviewCount = unitVocab.filter(v => vocabStateMap[v.id]?.status === 'review').length;
  const favoriteCount = unitVocab.filter(v => vocabStateMap[v.id]?.isFavorite).length;
  const progressPercent = Math.round((masteredCount / Math.max(1, unitVocab.length)) * 100);

  // --------------------------------------------------------------------------
  // MATCHING GAME STATE & LOGIC
  // --------------------------------------------------------------------------
  const [matchingRound, setMatchingRound] = useState(0);
  const [selectedWordId, setSelectedWordId] = useState<string | null>(null);
  const [selectedMeaningId, setSelectedMeaningId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<boolean>(false);
  const [matchScore, setMatchScore] = useState(0);

  // 6 items for matching round
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
  }, [roundVocab]);

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
      // Match success!
      setMatchedIds(prev => [...prev, wId]);
      setMatchScore(prev => prev + 10);
      setSelectedWordId(null);
      setSelectedMeaningId(null);
      // Mark as mastered in local state
      setStatus(wId, 'mastered');
    } else {
      // Match failed!
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
  };

  // --------------------------------------------------------------------------
  // WORD FORMATION CHALLENGE STATE & LOGIC
  // --------------------------------------------------------------------------
  const [userWordFormInputs, setUserWordFormInputs] = useState<Record<string, string>>({});
  const [wordFormRevealed, setWordFormRevealed] = useState<Record<string, boolean>>({});

  // --------------------------------------------------------------------------
  // CONTEXTUAL QUIZ STATE & LOGIC
  // --------------------------------------------------------------------------
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizSelectedOption, setQuizSelectedOption] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const quizQuestions = useMemo(() => {
    return unitVocab.slice(0, 10).map((v, i) => {
      // Generate 3 wrong distractors from unitVocab
      const distractors = unitVocab
        .filter(x => x.id !== v.id)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(x => x.meaning);
      
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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Header Panel */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Kho 430 Từ Vựng SGK Tiếng Anh 9
              </span>
              <span className="bg-blue-900/80 text-blue-200 text-xs font-semibold px-3 py-1 rounded-full border border-blue-700/50">
                Unit {selectedUnit}: {UNITS_DATA.find(u => u.id === selectedUnit)?.title} ({unitVocab.length} từ)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2 tracking-tight">
              TRẠM HỌC TỪ VỰNG <span className="text-amber-400">VOCAB MASTER 9</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Luyện phát âm chuẩn IPA, thuộc 100% từ vựng trọng tâm, collocations & dạng bài Word Form thi vào Lớp 10 THPT.
            </p>
          </div>

          {/* Unit Selector & Progress Badge */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-slate-900/90 border border-slate-700/80 p-3 rounded-2xl flex items-center justify-between gap-3 min-w-[220px]">
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Tiến độ thuộc Unit {selectedUnit}</p>
                <p className="text-lg font-black text-emerald-400">{masteredCount} / {unitVocab.length} từ ({progressPercent}%)</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-xs">
                {progressPercent}%
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 p-2 rounded-2xl">
              <span className="text-xs font-bold text-slate-300 ml-2">Unit:</span>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(Number(e.target.value))}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3 py-2 rounded-xl border border-blue-400/30 outline-none cursor-pointer transition-colors"
              >
                {UNITS_DATA.map(u => (
                  <option key={u.id} value={u.id}>Unit {u.id}: {u.title}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6 border-t border-slate-800/80 pt-4 relative z-10">
          <button
            onClick={() => setActiveGameTab('flashcards')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeGameTab === 'flashcards'
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/50'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            🎴 Thẻ Lật Flashcards ({filteredVocabList.length})
          </button>

          <button
            onClick={() => setActiveGameTab('matching')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeGameTab === 'matching'
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/50'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            🧩 Game Nối Từ & Nghĩa
          </button>

          <button
            onClick={() => setActiveGameTab('wordform')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeGameTab === 'wordform'
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/50'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            ✍️ Thử Thách Word Form (Thi vào 10)
          </button>

          <button
            onClick={() => setActiveGameTab('quiz')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeGameTab === 'quiz'
                ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/50'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            📝 Quiz Trắc Nghiệm Ngữ Cảnh (10 Câu)
          </button>
        </div>
      </div>

      {/* Control Toolbar: Search & Category Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm từ tiếng Anh, phát âm IPA hoặc nghĩa tiếng Việt..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 text-xs">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
              filterCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tất cả ({unitVocab.length})
          </button>

          <button
            onClick={() => setFilterCategory('mastered')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
              filterCategory === 'mastered'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" /> Đã thuộc ({masteredCount})
          </button>

          <button
            onClick={() => setFilterCategory('review')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
              filterCategory === 'review'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" /> Cần ôn lại ({reviewCount})
          </button>

          <button
            onClick={() => setFilterCategory('favorite')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
              filterCategory === 'favorite'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" /> Yêu thích ({favoriteCount})
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MODE 1: FLASHCARDS 3D MODE */}
      {/* ==================================================================== */}
      {activeGameTab === 'flashcards' && (
        <div className="max-w-xl mx-auto space-y-4">
          {filteredVocabList.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">Không tìm thấy từ vựng phù hợp</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Hãy thử thay đổi từ khóa tìm kiếm hoặc bộ lọc trạng thái "Đã thuộc / Cần ôn lại / Yêu thích".
              </p>
              <button
                onClick={() => { setSearchQuery(''); setFilterCategory('all'); }}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          ) : (
            <>
              {/* Top Card Info Bar */}
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-2">
                <span>Thẻ {cardIndex + 1} / {filteredVocabList.length}</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <RotateCw className="w-3.5 h-3.5" /> Chạm vào thẻ để lật xem nghĩa & ví dụ
                </span>
              </div>

              {/* Main Flashcard Container */}
              {currentCard && (
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className={`w-full min-h-[340px] bg-white rounded-3xl border-2 p-6 shadow-md hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between items-center text-center relative overflow-hidden group ${
                    currentCardState.status === 'mastered'
                      ? 'border-emerald-300 bg-emerald-50/20'
                      : currentCardState.status === 'review'
                      ? 'border-amber-300 bg-amber-50/20'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Card Header Toolbar */}
                  <div className="w-full flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                        Unit {currentCard.unit}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full capitalize">
                        {currentCard.partOfSpeech}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => toggleFavorite(currentCard.id, e)}
                        className={`p-2 rounded-full transition-colors ${
                          currentCardState.isFavorite
                            ? 'bg-rose-100 text-rose-600'
                            : 'bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-500'
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
                        className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors border border-blue-200"
                        title="Nghe phát âm chuẩn IPA"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Front Side */}
                  {!isFlipped ? (
                    <div className="my-auto space-y-3 py-6">
                      <h2 className="text-3xl sm:text-4xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">
                        {currentCard.word}
                      </h2>
                      
                      {currentCard.ipa && (
                        <div className="inline-block bg-slate-100 text-slate-700 font-mono text-sm font-bold px-3 py-1 rounded-xl border border-slate-200">
                          {currentCard.ipa}
                        </div>
                      )}

                      <p className="text-xs text-slate-400 pt-3 font-medium flex items-center justify-center gap-1">
                        <RotateCw className="w-3.5 h-3.5 text-blue-500 animate-spin-slow" /> Nhấp để xem nghĩa tiếng Việt & ví dụ
                      </p>
                    </div>
                  ) : (
                    /* Back Side */
                    <div className="my-auto space-y-4 animate-fade-in w-full text-left py-2">
                      <div className="text-center border-b border-slate-100 pb-3">
                        <h3 className="text-2xl font-black text-indigo-900">{currentCard.meaning}</h3>
                      </div>

                      <div className="text-xs space-y-2.5 text-slate-700">
                        {currentCard.example && (
                          <div className="bg-blue-50/70 p-3 rounded-2xl border border-blue-100 text-slate-800 leading-relaxed font-medium">
                            <span className="font-bold text-blue-900 block mb-0.5">💬 Ví dụ & Dịch nghĩa:</span>
                            "{currentCard.example}"
                          </div>
                        )}

                        {currentCard.collocations && currentCard.collocations.length > 0 && (
                          <div>
                            <span className="font-bold text-slate-600 block mb-1">Cụm từ hay gặp (Collocations):</span>
                            <div className="flex flex-wrap gap-1">
                              {currentCard.collocations.map((c, idx) => (
                                <span key={idx} className="bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded text-[11px]">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {currentCard.examNote && (
                          <div className="bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-rose-900 font-medium text-[11px]">
                            {currentCard.examNote}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Rating Controls & Card Footer */}
                  <div className="w-full pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
                    <span className="text-[11px] text-slate-400 font-medium">
                      {isFlipped ? 'Chạm để lật về mặt trước' : 'Chạm để lật về mặt sau'}
                    </span>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => setStatus(currentCard.id, 'review', e)}
                        className={`px-3 py-1 rounded-xl font-bold transition-all text-xs flex items-center gap-1 ${
                          currentCardState.status === 'review'
                            ? 'bg-amber-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-amber-50 text-slate-600 hover:text-amber-700'
                        }`}
                      >
                        <AlertCircle className="w-3.5 h-3.5" /> Cần ôn lại
                      </button>

                      <button
                        onClick={(e) => setStatus(currentCard.id, 'mastered', e)}
                        className={`px-3 py-1 rounded-xl font-bold transition-all text-xs flex items-center gap-1 ${
                          currentCardState.status === 'mastered'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700'
                        }`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Đã thuộc
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Prev / Next Controls */}
              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  onClick={handlePrevCard}
                  className="flex-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold py-3 rounded-2xl text-xs transition-colors shadow-xs flex items-center justify-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Từ Trước
                </button>
                <button
                  onClick={handleNextCard}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl text-xs transition-colors shadow-xs flex items-center justify-center gap-1"
                >
                  Từ Tiếp Theo <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODE 2: MATCHING GAME */}
      {/* ==================================================================== */}
      {activeGameTab === 'matching' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-3">
            <div>
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                🧩 Game Nối Từ Tiếng Anh & Nghĩa Tiếng Việt (Unit {selectedUnit})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Chọn 1 từ Tiếng Anh ở cột trái và 1 nghĩa Tiếng Việt tương ứng ở cột phải để nối cặp.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
                🏆 Điểm: {matchScore}
              </span>
              <button
                onClick={resetMatchingGame}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-1 font-bold transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Chơi Lại Hiệp Này
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: English Words */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider flex items-center justify-between">
                <span>Từ Tiếng Anh</span>
                <span className="text-[11px] text-slate-400 font-normal">Bấm để nghe phát âm</span>
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
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60 pointer-events-none'
                        : isSelected
                        ? wrongPair
                          ? 'bg-rose-100 border-rose-400 text-rose-900 animate-pulse ring-2 ring-rose-400/50'
                          : 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-400/50 shadow-md'
                        : 'bg-slate-50 hover:bg-blue-50/60 border-slate-200 text-slate-800 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{item.word}</span>
                      {item.ipa && <span className="font-mono text-[11px] opacity-75 font-normal">{item.ipa}</span>}
                    </div>

                    {isMatched ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); speakWord(item.word); }}
                        className="p-1 hover:bg-white/20 rounded-full transition-colors"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Column: Vietnamese Meanings */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Nghĩa Tiếng Việt</h4>

              {shuffledMeanings.map((item) => {
                const isMatched = matchedIds.includes(item.id);
                const isSelected = selectedMeaningId === item.id;

                return (
                  <div
                    key={'meaning-' + item.id}
                    onClick={() => !isMatched && handleSelectMeaning(item.id)}
                    className={`p-3.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between border ${
                      isMatched
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 opacity-60 pointer-events-none'
                        : isSelected
                        ? wrongPair
                          ? 'bg-rose-100 border-rose-400 text-rose-900 animate-pulse ring-2 ring-rose-400/50'
                          : 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-400/50 shadow-md'
                        : 'bg-slate-50 hover:bg-blue-50/60 border-slate-200 text-slate-800 hover:border-blue-300'
                    }`}
                  >
                    <span>{item.meaning}</span>
                    <span className="text-[10px] opacity-70 uppercase font-semibold ml-2">{item.partOfSpeech}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Round Complete Modal / Footer Banner */}
          {matchedIds.length === roundVocab.length && roundVocab.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-300 p-6 rounded-2xl text-center space-y-3 animate-fade-in">
              <Trophy className="w-10 h-10 text-amber-500 mx-auto" />
              <h4 className="text-lg font-black text-emerald-950">Xuất sắc! Bạn đã nối chính xác toàn bộ cặp từ trong hiệp này!</h4>
              <p className="text-xs text-emerald-800 font-semibold">Tất cả các từ vựng này đã được cập nhật vào trạng thái "Đã thuộc".</p>
              <button
                onClick={() => {
                  setMatchingRound(prev => prev + 1);
                  resetMatchingGame();
                }}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
              >
                Chơi Hiệp Tiếp Theo →
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODE 3: WORD FORMATION CHALLENGE */}
      {/* ==================================================================== */}
      {activeGameTab === 'wordform' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b pb-4">
            <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> Thử Thách Cấu Tạo Từ (Word Form) Thi Vào Lớp 10
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Điền dạng đúng của từ (Danh/Động/Tính/Trạng từ) phù hợp với ngữ cảnh câu văn SGK.
            </p>
          </div>

          <div className="space-y-4">
            {unitVocab.slice(0, 8).map((item, idx) => {
              const inputVal = userWordFormInputs[item.id] || '';
              const isRevealed = wordFormRevealed[item.id];
              const isCorrect = inputVal.trim().toLowerCase() === item.word.toLowerCase();

              return (
                <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900 text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                        {idx + 1}
                      </span>
                      Từ gốc cần biến đổi: <span className="text-blue-700 font-mono underline">{item.word}</span>
                    </span>
                    <span className="text-[11px] bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full font-semibold">
                      Loại từ: {item.partOfSpeech}
                    </span>
                  </div>

                  <p className="text-slate-800 leading-relaxed font-medium bg-white p-3 rounded-xl border border-slate-200">
                    {item.example ? item.example : `Biến đổi từ "${item.word}" theo đúng ngữ cảnh.`}
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="text"
                      value={inputVal}
                      onChange={(e) => setUserWordFormInputs(prev => ({ ...prev, [item.id]: e.target.value }))}
                      placeholder={`Nhập từ loại đúng của "${item.word}"...`}
                      className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />

                    <button
                      onClick={() => setWordFormRevealed(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-colors"
                    >
                      {isRevealed ? 'Ẩn đáp án' : 'Xem đáp án'}
                    </button>

                    <button
                      onClick={() => onAskTutor(`Dạy em cách biến đổi Word Form của từ "${item.word}" (${item.partOfSpeech}) và các từ họ hàng của nó nhé!`)}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-colors"
                    >
                      Hỏi AI <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {isRevealed && (
                    <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl text-indigo-900 space-y-1 animate-fade-in">
                      <p className="font-bold">
                        ✅ Đáp án từ đúng: <span className="text-blue-700 font-mono text-sm">{item.word}</span> ({item.ipa})
                      </p>
                      <p className="text-[11px] text-indigo-800">
                        Nghĩa Tiếng Việt: <span className="font-semibold">{item.meaning}</span>
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODE 4: CONTEXTUAL QUIZ MODE */}
      {/* ==================================================================== */}
      {activeGameTab === 'quiz' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 max-w-2xl mx-auto">
          {!quizFinished ? (
            currentQuizQ && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-3">
                  <span className="text-xs font-bold text-slate-500">
                    Câu {quizIndex + 1} / {quizQuestions.length} (Unit {selectedUnit})
                  </span>
                  <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
                    ⭐ Điểm XP: {quizScore}
                  </span>
                </div>

                <div className="space-y-3 text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                    Chọn nghĩa đúng của từ từ vựng
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{currentQuizQ.word}</h3>
                  {currentQuizQ.ipa && (
                    <p className="font-mono text-sm text-slate-500">{currentQuizQ.ipa} ({currentQuizQ.partOfSpeech})</p>
                  )}
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 gap-3 pt-2">
                  {currentQuizQ.options.map((option, idx) => {
                    const isSelected = quizSelectedOption === option;
                    const isCorrect = option === currentQuizQ.correctAnswer;

                    let btnClass = 'bg-slate-50 hover:bg-blue-50 border-slate-200 text-slate-800';
                    if (quizSelectedOption !== null) {
                      if (isCorrect) {
                        btnClass = 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-400/50';
                      } else if (isSelected) {
                        btnClass = 'bg-rose-600 text-white border-rose-600 ring-2 ring-rose-400/50';
                      } else {
                        btnClass = 'bg-slate-50 text-slate-400 border-slate-200 opacity-60';
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
                          <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          {option}
                        </span>

                        {quizSelectedOption !== null && isCorrect && <Check className="w-5 h-5 text-white" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Banner */}
                {quizSelectedOption !== null && (
                  <div className={`p-4 rounded-2xl border text-xs space-y-2 animate-fade-in ${
                    quizSelectedOption === currentQuizQ.correctAnswer
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-rose-50 border-rose-300 text-rose-950'
                  }`}>
                    <p className="font-bold flex items-center gap-2 text-sm">
                      {quizSelectedOption === currentQuizQ.correctAnswer ? '🎉 Chính xác! (+10 XP)' : '❌ Chưa chính xác!'}
                    </p>
                    <p className="leading-relaxed">
                      Nghĩa đúng của <strong className="font-mono">{currentQuizQ.word}</strong> là: <strong>"{currentQuizQ.correctAnswer}"</strong>.
                    </p>
                    {currentQuizQ.example && (
                      <p className="italic text-slate-700 pt-1">Ví dụ: "{currentQuizQ.example}"</p>
                    )}
                  </div>
                )}

                {/* Next Question Button */}
                {quizSelectedOption !== null && (
                  <button
                    onClick={handleQuizNext}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs shadow-md transition-colors flex items-center justify-center gap-1"
                  >
                    {quizIndex + 1 < quizQuestions.length ? 'Câu Tiếp Theo →' : 'Xem Kết Quả Quiz →'}
                  </button>
                )}
              </div>
            )
          ) : (
            /* Quiz Completed View */
            <div className="text-center space-y-4 py-4 animate-fade-in">
              <Trophy className="w-16 h-16 text-amber-500 mx-auto" />
              <h3 className="text-2xl font-black text-slate-900">Hoàn Thành Bài Quiz Unit {selectedUnit}!</h3>
              <p className="text-sm font-bold text-blue-600 bg-blue-50 py-2 px-4 rounded-2xl inline-block border border-blue-200">
                Tổng điểm XP đạt được: {quizScore} / 100 XP
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Các từ vựng bạn trả lời đúng đã được lưu vào danh sách "Đã thuộc" để theo dõi tiến độ.
              </p>
              <button
                onClick={restartQuiz}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs shadow-md transition-colors"
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
