import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sparkles, Volume2, Shield, Zap, Heart, Trophy, RefreshCw, Users, User,
  Swords, RotateCw, CheckCircle2, AlertCircle, Award, Flame, Play, VolumeX, Check
} from 'lucide-react';
import { FULL_VOCABULARY_UNIT_1_TO_6 } from '../data/vocabUnit1to6Data';
import { UNITS_DATA } from '../data/sgkData';
import { VocabularyItem } from '../types';
import { playSound } from '../utils/audio';

interface VocabBattleGameProps {
  onAskTutor: (q: string) => void;
}

type GameMode = 'castle' | 'caro';
type PlayType = 'solo' | 'pvp'; // Solo vs AI vs 2 Players/Teams

interface QuestionChallenge {
  vocab: VocabularyItem;
  prompt: string;
  type: 'meaning' | 'word' | 'ipa';
  correctAnswer: string;
  options: string[];
}

export const VocabBattleGame: React.FC<VocabBattleGameProps> = ({ onAskTutor }) => {
  const [selectedUnit, setSelectedUnit] = useState<number>(0); // 0 = All Units 1-6
  const [gameMode, setGameMode] = useState<GameMode>('castle');
  const [playType, setPlayType] = useState<PlayType>('solo');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Filter vocabulary pool based on unit
  const activeVocabPool = useMemo(() => {
    if (selectedUnit === 0) return FULL_VOCABULARY_UNIT_1_TO_6;
    return FULL_VOCABULARY_UNIT_1_TO_6.filter(v => v.unit === selectedUnit);
  }, [selectedUnit]);

  // Helper to generate a random question challenge
  const generateQuestion = useCallback((): QuestionChallenge => {
    const vocab = activeVocabPool[Math.floor(Math.random() * activeVocabPool.length)];
    const qTypes: ('meaning' | 'word' | 'ipa')[] = ['meaning', 'word', 'ipa'];
    const type = qTypes[Math.floor(Math.random() * qTypes.length)];

    let prompt = '';
    let correctAnswer = '';

    if (type === 'meaning') {
      prompt = `Từ "${vocab.word}" (${vocab.partOfSpeech}) có nghĩa là gì?`;
      correctAnswer = vocab.meaning;
    } else if (type === 'word') {
      prompt = `Từ nào có nghĩa là: "${vocab.meaning}"?`;
      correctAnswer = vocab.word;
    } else {
      prompt = `Từ nào có phát âm IPA là: ${vocab.ipa}?`;
      correctAnswer = vocab.word;
    }

    // Generate 3 wrong options
    const distractors = activeVocabPool
      .filter(x => x.id !== vocab.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(x => (type === 'meaning' ? x.meaning : x.word));

    const options = [...distractors, correctAnswer].sort(() => Math.random() - 0.5);

    return {
      vocab,
      prompt,
      type,
      correctAnswer,
      options
    };
  }, [activeVocabPool]);

  // TTS pronounce
  const speakWord = (word: string) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // --------------------------------------------------------------------------
  // CASTLE CONQUEST STATE & LOGIC
  // --------------------------------------------------------------------------
  const [p1Hp, setP1Hp] = useState(100);
  const [p2Hp, setP2Hp] = useState(100);
  const [p1Shield, setP1Shield] = useState(false);
  const [p2Shield, setP2Shield] = useState(false);
  const [currentTurn, setCurrentTurn] = useState<1 | 2>(1);
  const [streakP1, setStreakP1] = useState(0);
  const [streakP2, setStreakP2] = useState(0);
  
  const [currentQuestion, setCurrentQuestion] = useState<QuestionChallenge>(() => generateQuestion());
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [attackAnimation, setAttackAnimation] = useState<'p1' | 'p2' | null>(null);
  const [castleGameOver, setCastleGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<1 | 2 | null>(null);

  // Switch question when turn changes or game reset
  const nextCastleTurn = (nextTurn: 1 | 2) => {
    setSelectedOption(null);
    setCurrentTurn(nextTurn);
    setCurrentQuestion(generateQuestion());
  };

  // Handle AI turn in Solo mode
  useEffect(() => {
    if (gameMode === 'castle' && playType === 'solo' && currentTurn === 2 && !castleGameOver && !selectedOption) {
      const timer = setTimeout(() => {
        // AI has 80% accuracy
        const isAiCorrect = Math.random() < 0.8;
        const aiAnswer = isAiCorrect
          ? currentQuestion.correctAnswer
          : currentQuestion.options.find(o => o !== currentQuestion.correctAnswer) || currentQuestion.options[0];

        handleAnswerSelect(aiAnswer, 2);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentTurn, gameMode, playType, castleGameOver, currentQuestion, selectedOption]);

  const handleAnswerSelect = (option: string, turn: 1 | 2 = currentTurn) => {
    if (selectedOption !== null || castleGameOver) return;
    setSelectedOption(option);

    const isCorrect = option === currentQuestion.correctAnswer;
    speakWord(currentQuestion.vocab.word);

    if (isCorrect) {
      if (soundEnabled) playSound('attack');
      setAttackAnimation(turn === 1 ? 'p1' : 'p2');
      setTimeout(() => setAttackAnimation(null), 800);

      // Damage opponent
      const baseDamage = 20;
      if (turn === 1) {
        setStreakP1(prev => prev + 1);
        if (streakP1 + 1 >= 3) setP1Shield(true);

        if (p2Shield) {
          setP2Shield(false); // Shield blocks attack
        } else {
          setP2Hp(prev => {
            const next = Math.max(0, prev - baseDamage);
            if (next === 0) {
              setCastleGameOver(true);
              setWinner(1);
              if (soundEnabled) playSound('victory');
            }
            return next;
          });
        }
      } else {
        setStreakP2(prev => prev + 1);
        if (streakP2 + 1 >= 3) setP2Shield(true);

        if (p1Shield) {
          setP1Shield(false); // Shield blocks attack
        } else {
          setP1Hp(prev => {
            const next = Math.max(0, prev - baseDamage);
            if (next === 0) {
              setCastleGameOver(true);
              setWinner(2);
              if (soundEnabled) playSound('victory');
            }
            return next;
          });
        }
      }
    } else {
      if (soundEnabled) playSound('wrong');
      // Misfire penalty
      if (turn === 1) {
        setStreakP1(0);
        setP1Hp(prev => Math.max(0, prev - 5));
      } else {
        setStreakP2(0);
        setP2Hp(prev => Math.max(0, prev - 5));
      }
    }

    // Delay before next turn
    setTimeout(() => {
      if (!castleGameOver) {
        nextCastleTurn(turn === 1 ? 2 : 1);
      }
    }, 2000);
  };

  const resetCastleGame = () => {
    setP1Hp(100);
    setP2Hp(100);
    setP1Shield(false);
    setP2Shield(false);
    setStreakP1(0);
    setStreakP2(0);
    setCurrentTurn(1);
    setSelectedOption(null);
    setCastleGameOver(false);
    setWinner(null);
    setCurrentQuestion(generateQuestion());
  };

  // --------------------------------------------------------------------------
  // CARO VOCAB QUIZ 5x5 STATE & LOGIC
  // --------------------------------------------------------------------------
  const [board, setBoard] = useState<Array<string | null>>(Array(25).fill(null));
  const [caroTurn, setCaroTurn] = useState<'X' | 'O'>('X');
  const [activeCellIdx, setActiveCellIdx] = useState<number | null>(null);
  const [caroQuestion, setCaroQuestion] = useState<QuestionChallenge | null>(null);
  const [caroSelectedOpt, setCaroSelectedOpt] = useState<string | null>(null);
  const [caroWinner, setCaroWinner] = useState<'X' | 'O' | 'draw' | null>(null);

  const handleCellClick = (idx: number) => {
    if (board[idx] !== null || caroWinner !== null || activeCellIdx !== null) return;
    setActiveCellIdx(idx);
    setCaroSelectedOpt(null);
    setCaroQuestion(generateQuestion());
  };

  const handleCaroAnswer = (option: string) => {
    if (caroSelectedOpt !== null || activeCellIdx === null || !caroQuestion) return;
    setCaroSelectedOpt(option);

    const isCorrect = option === caroQuestion.correctAnswer;
    speakWord(caroQuestion.vocab.word);

    if (isCorrect) {
      if (soundEnabled) playSound('correct');
      const newBoard = [...board];
      newBoard[activeCellIdx] = caroTurn;
      setBoard(newBoard);

      // Check win condition for 5 in a row
      if (checkCaroWin(newBoard, caroTurn)) {
        setCaroWinner(caroTurn);
        if (soundEnabled) playSound('victory');
      } else if (newBoard.every(c => c !== null)) {
        setCaroWinner('draw');
      } else {
        // Switch turn
        setCaroTurn(caroTurn === 'X' ? 'O' : 'X');
      }
    } else {
      if (soundEnabled) playSound('wrong');
      // Switch turn without marking
      setCaroTurn(caroTurn === 'X' ? 'O' : 'X');
    }

    setTimeout(() => {
      setActiveCellIdx(null);
      setCaroQuestion(null);
      setCaroSelectedOpt(null);
    }, 1800);
  };

  // Check 5 in a row on 5x5 board
  const checkCaroWin = (b: Array<string | null>, symbol: 'X' | 'O') => {
    const size = 5;
    // Check rows & columns
    for (let r = 0; r < size; r++) {
      let rowWin = true;
      let colWin = true;
      for (let c = 0; c < size; c++) {
        if (b[r * size + c] !== symbol) rowWin = false;
        if (b[c * size + r] !== symbol) colWin = false;
      }
      if (rowWin || colWin) return true;
    }

    // Main diagonals
    let diag1 = true;
    let diag2 = true;
    for (let i = 0; i < size; i++) {
      if (b[i * size + i] !== symbol) diag1 = false;
      if (b[i * size + (size - 1 - i)] !== symbol) diag2 = false;
    }
    return diag1 || diag2;
  };

  const resetCaroGame = () => {
    setBoard(Array(25).fill(null));
    setCaroTurn('X');
    setActiveCellIdx(null);
    setCaroQuestion(null);
    setCaroSelectedOpt(null);
    setCaroWinner(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Game Arcade Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-xs">
                <Swords className="w-3.5 h-3.5" /> Đấu Trường Game Từ Vựng đối kháng
              </span>
              <span className="bg-blue-950 text-blue-200 text-xs font-bold px-3 py-1 rounded-full border border-blue-800">
                Kho {activeVocabPool.length} Từ vựng SGK 9
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              ĐẤU TRƯỜNG <span className="text-amber-400">VOCAB BATTLE 9</span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              Thách đấu trí tuệ từ vựng qua trận chiến Lâu Đài Phép Thuật & Đấu cờ Caro 5x5!
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800">
            {/* Unit Selector */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 font-semibold ml-1">Bộ từ:</span>
              <select
                value={selectedUnit}
                onChange={(e) => {
                  setSelectedUnit(Number(e.target.value));
                  resetCastleGame();
                  resetCaroGame();
                }}
                className="bg-slate-800 text-amber-300 font-bold text-xs px-2.5 py-1.5 rounded-xl border border-slate-700 outline-none"
              >
                <option value={0}>Tất cả Unit 1-6 ({FULL_VOCABULARY_UNIT_1_TO_6.length} từ)</option>
                {UNITS_DATA.slice(0, 6).map(u => (
                  <option key={u.id} value={u.id}>Unit {u.id}: {u.title}</option>
                ))}
              </select>
            </div>

            {/* Play Mode Selector */}
            <div className="flex items-center gap-1 border-l border-slate-700 pl-2 text-xs">
              <button
                onClick={() => setPlayType('solo')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                  playType === 'solo' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" /> Đấu AI
              </button>
              <button
                onClick={() => setPlayType('pvp')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 ${
                  playType === 'pvp' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" /> 2 Đội / 2 Người
              </button>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 ml-1"
              title="Bật/Tắt âm thanh"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </div>

        {/* Game Mode Tabs */}
        <div className="flex gap-2 mt-6 border-t border-slate-800 pt-4 relative z-10">
          <button
            onClick={() => setGameMode('castle')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              gameMode === 'castle'
                ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300/50'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            🏰 Chiếm Lâu Đài Từ Vựng (HP Battle)
          </button>
          <button
            onClick={() => setGameMode('caro')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              gameMode === 'caro'
                ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300/50'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            🎲 Đấu Cờ Caro Từ Vựng 5x5
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* GAME FORMAT 1: CASTLE CONQUEST (HP BATTLE) */}
      {/* ==================================================================== */}
      {gameMode === 'castle' && (
        <div className="space-y-6">
          {/* Castles Graphic Arena */}
          <div className="grid grid-cols-2 gap-4 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 p-6 rounded-3xl border border-slate-800 text-white relative overflow-hidden shadow-2xl">
            {/* Attack Animation Effects */}
            {attackAnimation === 'p1' && (
              <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-48 h-2 bg-gradient-to-r from-blue-400 to-amber-300 rounded-full animate-ping z-30" />
            )}
            {attackAnimation === 'p2' && (
              <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-48 h-2 bg-gradient-to-l from-rose-400 to-amber-300 rounded-full animate-ping z-30" />
            )}

            {/* Left Castle (Team 1 / Player 1) */}
            <div className={`p-4 rounded-2xl border transition-all text-center space-y-3 relative ${
              currentTurn === 1 ? 'border-blue-400 bg-blue-950/40 ring-4 ring-blue-500/30' : 'border-slate-800 bg-slate-900/60 opacity-80'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-blue-400 uppercase tracking-wider flex items-center gap-1">
                  🛡️ {playType === 'solo' ? 'Đội 1 (Bạn)' : 'Đội 1 (Xanh)'}
                </span>
                {streakP1 >= 3 && <span className="text-[11px] font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-500/50">🔥 Streak x{streakP1}</span>}
              </div>

              {/* Graphic Castle Icon */}
              <div className="relative inline-block my-2">
                <span className="text-6xl sm:text-7xl block transition-transform hover:scale-105">🏰</span>
                {p1Shield && (
                  <Shield className="w-8 h-8 text-cyan-300 fill-cyan-500/30 absolute top-0 right-0 animate-pulse" />
                )}
              </div>

              {/* HP Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>Máu Lâu Đài</span>
                  <span className="text-blue-300">{p1Hp} / 100 HP</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${p1Hp}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Right Castle (Team 2 / AI) */}
            <div className={`p-4 rounded-2xl border transition-all text-center space-y-3 relative ${
              currentTurn === 2 ? 'border-rose-400 bg-rose-950/40 ring-4 ring-rose-500/30' : 'border-slate-800 bg-slate-900/60 opacity-80'
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-rose-400 uppercase tracking-wider flex items-center gap-1">
                  🏰 {playType === 'solo' ? 'AI Gia Sư' : 'Đội 2 (Đỏ)'}
                </span>
                {streakP2 >= 3 && <span className="text-[11px] font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded-full border border-amber-500/50">🔥 Streak x{streakP2}</span>}
              </div>

              {/* Graphic Castle Icon */}
              <div className="relative inline-block my-2">
                <span className="text-6xl sm:text-7xl block transition-transform hover:scale-105">🏰</span>
                {p2Shield && (
                  <Shield className="w-8 h-8 text-cyan-300 fill-cyan-500/30 absolute top-0 right-0 animate-pulse" />
                )}
              </div>

              {/* HP Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold">
                  <span>Máu Lâu Đài</span>
                  <span className="text-rose-300">{p2Hp} / 100 HP</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div
                    className="h-full bg-gradient-to-r from-rose-500 to-amber-400 transition-all duration-500"
                    style={{ width: `${p2Hp}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Question & Turn Card */}
          {!castleGameOver ? (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-lg space-y-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-between border-b pb-3 text-xs">
                <span className="font-bold text-slate-500">
                  Lượt bắn: <strong className={currentTurn === 1 ? 'text-blue-600' : 'text-rose-600'}>
                    {currentTurn === 1 ? (playType === 'solo' ? 'Đội 1 (Bạn)' : 'Đội 1 (Xanh)') : (playType === 'solo' ? 'AI Gia Sư' : 'Đội 2 (Đỏ)')}
                  </strong>
                </span>
                <span className="text-[11px] bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded-full">
                  Unit {currentQuestion.vocab.unit}
                </span>
              </div>

              {/* Question Text */}
              <div className="text-center space-y-2 py-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {currentQuestion.prompt}
                </h3>
                <p className="text-xs text-slate-400 font-medium">Trả lời đúng để bắn chưởng gây 20 HP sát thương!</p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  const isCorrect = option === currentQuestion.correctAnswer;

                  let btnStyle = 'bg-slate-50 hover:bg-blue-50/80 border-slate-200 text-slate-800';
                  if (selectedOption !== null) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-400/50 shadow-md';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-600 text-white border-rose-600 ring-2 ring-rose-400/50';
                    } else {
                      btnStyle = 'bg-slate-50 text-slate-400 border-slate-200 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={selectedOption !== null || (playType === 'solo' && currentTurn === 2)}
                      className={`p-4 rounded-2xl text-left text-xs font-bold transition-all border flex items-center justify-between ${btnStyle}`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </span>
                      {selectedOption !== null && isCorrect && <Check className="w-4 h-4 text-white" />}
                    </button>
                  );
                })}
              </div>

              {/* Result Notice */}
              {selectedOption !== null && (
                <div className={`p-4 rounded-2xl border text-xs space-y-1 text-center animate-fade-in ${
                  selectedOption === currentQuestion.correctAnswer
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                    : 'bg-rose-50 border-rose-300 text-rose-950 font-bold'
                }`}>
                  <p>
                    {selectedOption === currentQuestion.correctAnswer
                      ? '⚡ BẮN CHƯỞNG THÀNH CÔNG! Gây 20 HP sát thương!'
                      : '❌ TRẢ LỜI SAI! Bắn hụt và bị phạt nổ -5 HP!'}
                  </p>
                  <p className="text-[11px] font-normal text-slate-600">
                    Từ vựng: <strong className="font-mono">{currentQuestion.vocab.word}</strong> ({currentQuestion.vocab.ipa}) = "{currentQuestion.vocab.meaning}"
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Game Victory Screen */
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl text-center space-y-4 max-w-md mx-auto animate-fade-in">
              <Trophy className="w-16 h-16 text-amber-500 mx-auto" />
              <h2 className="text-2xl font-black text-slate-900">
                {winner === 1 ? (playType === 'solo' ? '🎉 BẠN ĐÃ CHIẾN THẮNG AI GIA SƯ!' : '🎉 ĐỘI 1 (XANH) THẮNG CUỘC!') : '🎉 ĐỘI 2 (ĐỎ) THẮNG CUỘC!'}
              </h2>
              <p className="text-xs text-slate-500">
                Bạn đã phá hủy hoàn toàn Lâu đài của đối thủ nhờ vốn từ vựng xuất sắc!
              </p>
              <button
                onClick={resetCastleGame}
                className="px-6 py-3 bg-amber-400 text-slate-950 font-black rounded-2xl text-xs shadow-md hover:bg-amber-300 transition-colors"
              >
                Chơi Trận Mới
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==================================================================== */}
      {/* GAME FORMAT 2: CARO VOCAB QUIZ 5x5 */}
      {/* ==================================================================== */}
      {gameMode === 'caro' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 gap-3">
            <div>
              <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                🎲 Đấu Cờ Caro Từ Vựng 5x5
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Chọn 1 ô bất kỳ → Trả lời đúng từ vựng để cắm cờ <strong className="text-blue-600">X</strong> hoặc <strong className="text-rose-600">O</strong>. Đạt 5 ô liên tiếp để thắng!
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs font-black px-3 py-1 rounded-full border ${
                caroTurn === 'X' ? 'bg-blue-100 text-blue-900 border-blue-300' : 'bg-rose-100 text-rose-900 border-rose-300'
              }`}>
                Lượt của: Quân {caroTurn}
              </span>
              <button
                onClick={resetCaroGame}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Chơi Lại Bàn Cờ
              </button>
            </div>
          </div>

          {/* 5x5 Board Grid */}
          <div className="grid grid-cols-5 gap-2 max-w-md mx-auto aspect-square p-3 bg-slate-900 rounded-3xl shadow-inner border border-slate-800">
            {board.map((cell, idx) => (
              <button
                key={idx}
                onClick={() => handleCellClick(idx)}
                disabled={cell !== null || caroWinner !== null}
                className={`w-full h-full rounded-2xl font-black text-xl sm:text-2xl transition-all flex items-center justify-center border shadow-xs ${
                  cell === 'X'
                    ? 'bg-blue-600 text-white border-blue-400 ring-2 ring-blue-300/50'
                    : cell === 'O'
                    ? 'bg-rose-600 text-white border-rose-400 ring-2 ring-rose-300/50'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-500 border-slate-700 hover:border-amber-400'
                }`}
              >
                {cell}
              </button>
            ))}
          </div>

          {/* Caro Question Modal */}
          {activeCellIdx !== null && caroQuestion && (
            <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full space-y-4">
                <div className="flex items-center justify-between border-b pb-2 text-xs">
                  <span className="font-bold text-slate-500">
                    Câu hỏi đánh ô cờ {activeCellIdx + 1} (Quân {caroTurn})
                  </span>
                  <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full">
                    Unit {caroQuestion.vocab.unit}
                  </span>
                </div>

                <div className="text-center space-y-2 py-2">
                  <h4 className="text-lg font-black text-slate-900">{caroQuestion.prompt}</h4>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {caroQuestion.options.map((option, idx) => {
                    const isSelected = caroSelectedOpt === option;
                    const isCorrect = option === caroQuestion.correctAnswer;

                    let btnStyle = 'bg-slate-50 hover:bg-blue-50 border-slate-200 text-slate-800';
                    if (caroSelectedOpt !== null) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-600 text-white border-emerald-600';
                      } else if (isSelected) {
                        btnStyle = 'bg-rose-600 text-white border-rose-600';
                      } else {
                        btnStyle = 'bg-slate-50 text-slate-400 border-slate-200 opacity-50';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleCaroAnswer(option)}
                        disabled={caroSelectedOpt !== null}
                        className={`p-3 rounded-2xl text-left text-xs font-bold transition-all border ${btnStyle}`}
                      >
                        {String.fromCharCode(65 + idx)}. {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Caro Winner Modal */}
          {caroWinner !== null && (
            <div className="bg-amber-50 border border-amber-300 p-6 rounded-3xl text-center space-y-3 animate-fade-in">
              <Trophy className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="text-xl font-black text-slate-900">
                {caroWinner === 'draw' ? 'Trận đấu hòa nhau!' : `🎉 QUÂN ${caroWinner} ĐÃ THẮNG BÀN CỜ CARO 5x5!`}
              </h3>
              <button
                onClick={resetCaroGame}
                className="px-6 py-2.5 bg-amber-400 text-slate-950 font-black rounded-xl text-xs shadow-md hover:bg-amber-300"
              >
                Chơi Trận Mới
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
