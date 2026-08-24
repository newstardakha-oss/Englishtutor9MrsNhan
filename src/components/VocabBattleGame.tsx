import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
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
type PlayType = 'solo' | 'pvp';

interface QuestionChallenge {
  vocab: VocabularyItem;
  prompt: string;
  type: 'meaning' | 'word' | 'ipa';
  correctAnswer: string;
  options: string[];
}

export const VocabBattleGame: React.FC<VocabBattleGameProps> = ({ onAskTutor }) => {
  const timeoutRefs = useRef<number[]>([]);

  useEffect(() => {
    return () => timeoutRefs.current.forEach(id => clearTimeout(id));
  }, []);

  const setSafeTimeout = (callback: () => void, ms: number) => {
    const id = window.setTimeout(callback, ms);
    timeoutRefs.current.push(id);
    return id;
  };
  const [selectedUnit, setSelectedUnit] = useState<number>(0);
  const [gameMode, setGameMode] = useState<GameMode>('castle');
  const [playType, setPlayType] = useState<PlayType>('solo');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const activeVocabPool = useMemo(() => {
    if (selectedUnit === 0) return FULL_VOCABULARY_UNIT_1_TO_6;
    return FULL_VOCABULARY_UNIT_1_TO_6.filter(v => v.unit === selectedUnit);
  }, [selectedUnit]);

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

  const speakWord = (word: string) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // CASTLE CONQUEST STATE
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

  const nextCastleTurn = (nextTurn: 1 | 2) => {
    setSelectedOption(null);
    setCurrentTurn(nextTurn);
    setCurrentQuestion(generateQuestion());
  };

  useEffect(() => {
    if (gameMode === 'castle' && playType === 'solo' && currentTurn === 2 && !castleGameOver && !selectedOption) {
      setSafeTimeout(() => {
        const isAiCorrect = Math.random() < 0.8;
        const aiAnswer = isAiCorrect
          ? currentQuestion.correctAnswer
          : currentQuestion.options.find(o => o !== currentQuestion.correctAnswer) || currentQuestion.options[0];

        handleAnswerSelect(aiAnswer, 2);
      }, 1500);
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
      setSafeTimeout(() => setAttackAnimation(null), 800);

      const baseDamage = 20;
      if (turn === 1) {
        setStreakP1(prev => prev + 1);
        if (streakP1 + 1 >= 3) setP1Shield(true);

        if (p2Shield) {
          setP2Shield(false);
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
          setP1Shield(false);
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
      if (turn === 1) {
        setStreakP1(0);
        setP1Hp(prev => Math.max(0, prev - 5));
      } else {
        setStreakP2(0);
        setP2Hp(prev => Math.max(0, prev - 5));
      }
    }

    setSafeTimeout(() => {
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

  // CARO VOCAB QUIZ 5x5 STATE
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

      if (checkCaroWin(newBoard, caroTurn)) {
        setCaroWinner(caroTurn);
        if (soundEnabled) playSound('victory');
      } else if (newBoard.every(c => c !== null)) {
        setCaroWinner('draw');
      } else {
        setCaroTurn(caroTurn === 'X' ? 'O' : 'X');
      }
    } else {
      if (soundEnabled) playSound('wrong');
      setCaroTurn(caroTurn === 'X' ? 'O' : 'X');
    }

    setSafeTimeout(() => {
      setActiveCellIdx(null);
      setCaroQuestion(null);
      setCaroSelectedOpt(null);
    }, 1800);
  };

  const checkCaroWin = (b: Array<string | null>, symbol: 'X' | 'O') => {
    const size = 5;
    for (let r = 0; r < size; r++) {
      let rowWin = true;
      let colWin = true;
      for (let c = 0; c < size; c++) {
        if (b[r * size + c] !== symbol) rowWin = false;
        if (b[c * size + r] !== symbol) colWin = false;
      }
      if (rowWin || colWin) return true;
    }

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

  useEffect(() => {
    if (gameMode === 'caro' && playType === 'solo' && caroTurn === 'O' && !caroWinner) {
      if (activeCellIdx === null) {
        setSafeTimeout(() => {
          const emptyCells = board.map((c, i) => c === null ? i : null).filter(i => i !== null) as number[];
          if (emptyCells.length === 0) return;

          let selectedMove = -1;
          for (const idx of emptyCells) {
            const testBoard = [...board];
            testBoard[idx] = 'O';
            if (checkCaroWin(testBoard, 'O')) { selectedMove = idx; break; }
          }
          if (selectedMove === -1) {
            for (const idx of emptyCells) {
              const testBoard = [...board];
              testBoard[idx] = 'X';
              if (checkCaroWin(testBoard, 'X')) { selectedMove = idx; break; }
            }
          }
          if (selectedMove === -1) {
            selectedMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
          }
          handleCellClick(selectedMove);
        }, 500);
      } else if (caroQuestion && caroSelectedOpt === null) {
        setSafeTimeout(() => {
          const isAiCorrect = Math.random() < 0.8;
          const aiAnswer = isAiCorrect
            ? caroQuestion.correctAnswer
            : caroQuestion.options.find(o => o !== caroQuestion.correctAnswer) || caroQuestion.options[0];
          handleCaroAnswer(aiAnswer);
        }, 1500);
      }
    }
  }, [caroTurn, gameMode, playType, caroWinner, activeCellIdx, board, caroQuestion, caroSelectedOpt]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Arcade */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="bg-amber-500/20 text-amber-300 font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider border border-amber-500/30 flex items-center gap-1">
                <Swords className="w-3.5 h-3.5 text-amber-400" /> Đấu Trường Game Từ Vựng
              </span>
              <span className="bg-indigo-950 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/40">
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

          <div className="flex flex-wrap items-center gap-2 bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 font-semibold ml-1">Bộ từ:</span>
              <select
                value={selectedUnit}
                onChange={(e) => {
                  setSelectedUnit(Number(e.target.value));
                  resetCastleGame();
                  resetCaroGame();
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-2.5 py-1.5 rounded-xl border border-indigo-400/30 outline-none cursor-pointer"
              >
                <option value={0}>Tất cả Unit 1-6 ({FULL_VOCABULARY_UNIT_1_TO_6.length} từ)</option>
                {UNITS_DATA.slice(0, 6).map(u => (
                  <option key={u.id} value={u.id}>Unit {u.id}: {u.title}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 border-l border-slate-800 pl-2 text-xs">
              <button
                onClick={() => setPlayType('solo')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 border ${
                  playType === 'solo' ? 'bg-indigo-600 text-white border-indigo-400' : 'text-slate-400 border-transparent hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" /> Đấu AI
              </button>
              <button
                onClick={() => setPlayType('pvp')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 border ${
                  playType === 'pvp' ? 'bg-indigo-600 text-white border-indigo-400' : 'text-slate-400 border-transparent hover:text-white'
                }`}
              >
                <Users className="w-3.5 h-3.5" /> 2 Người
              </button>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors ml-1"
              title="Âm thanh"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex gap-2 mt-4 border-t border-slate-800 pt-4">
          <button
            onClick={() => setGameMode('castle')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
              gameMode === 'castle'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
            }`}
          >
            🏰 Trận Chiến Lâu Đài (HP Battle)
          </button>
          <button
            onClick={() => setGameMode('caro')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
              gameMode === 'caro'
                ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
            }`}
          >
            ❌⭕ Đấu Cờ Caro Vocab 5x5
          </button>
        </div>
      </div>

      {/* GAME MODE 1: CASTLE CONQUEST */}
      {gameMode === 'castle' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md space-y-6">
          {/* Health Bars & Mascot Arena Header */}
          <div className="grid grid-cols-2 gap-4">
            {/* Player 1 */}
            <div className={`p-4 rounded-2xl border space-y-2 transition-all ${
              currentTurn === 1 ? 'bg-indigo-950/80 border-indigo-500 shadow-md' : 'bg-slate-950 border-slate-800 opacity-80'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-cyan-300 flex items-center gap-1.5">
                  <User className="w-4 h-4" /> Người Chơi 1 (Bạn)
                </span>
                {p1Shield && <span className="bg-indigo-500/20 text-indigo-300 font-bold text-[10px] px-2 py-0.5 rounded border border-indigo-500/40">Khiên Chắn</span>}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-300">
                  <span>HP Lâu Đài</span>
                  <span>{p1Hp} / 100</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${p1Hp}%` }}></div>
                </div>
              </div>
            </div>

            {/* Player 2 / AI */}
            <div className={`p-4 rounded-2xl border space-y-2 transition-all ${
              currentTurn === 2 ? 'bg-rose-950/80 border-rose-500 shadow-md' : 'bg-slate-950 border-slate-800 opacity-80'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-rose-300 flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> {playType === 'solo' ? 'Đối Thủ AI' : 'Người Chơi 2'}
                </span>
                {p2Shield && <span className="bg-rose-500/20 text-rose-300 font-bold text-[10px] px-2 py-0.5 rounded border border-rose-500/40">Khiên Chắn</span>}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-300">
                  <span>HP Lâu Đài</span>
                  <span>{p2Hp} / 100</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                  <div className="h-full bg-rose-500 rounded-full transition-all" style={{ width: `${p2Hp}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Question Challenge Box */}
          {!castleGameOver ? (
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" /> Lượt đánh của: {currentTurn === 1 ? 'Người Chơi 1' : playType === 'solo' ? 'AI' : 'Người Chơi 2'}
                </span>
                <span className="text-xs font-bold text-slate-400">Trả lời đúng để tấn công lâu dài đối thủ</span>
              </div>

              <div className="text-center space-y-2 py-2">
                <h3 className="text-xl sm:text-2xl font-black text-white">{currentQuestion.prompt}</h3>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedOption === opt;
                  const isCorrect = opt === currentQuestion.correctAnswer;

                  let btnClass = 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-200';
                  if (selectedOption !== null) {
                    if (isCorrect) {
                      btnClass = 'bg-emerald-600 text-white border-emerald-400 shadow-md';
                    } else if (isSelected) {
                      btnClass = 'bg-rose-600 text-white border-rose-400 shadow-md';
                    } else {
                      btnClass = 'bg-slate-900 text-slate-500 border-slate-800 opacity-40';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleAnswerSelect(opt)}
                      disabled={selectedOption !== null || (playType === 'solo' && currentTurn === 2)}
                      className={`p-4 rounded-2xl text-left text-xs font-bold transition-all border flex items-center justify-between ${btnClass}`}
                    >
                      <span>{opt}</span>
                      {selectedOption !== null && isCorrect && <Check className="w-5 h-5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 text-center space-y-4">
              <Trophy className="w-16 h-16 text-amber-400 mx-auto" />
              <h2 className="text-2xl font-black text-white">
                🎉 Người Chơi {winner} Đã Chiếm Lĩnh Lâu Đài Chiến Thắng!
              </h2>
              <button
                onClick={resetCastleGame}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-xs shadow-md transition-colors"
              >
                Chơi Trận Mới
              </button>
            </div>
          )}
        </div>
      )}

      {/* GAME MODE 2: CARO 5x5 */}
      {gameMode === 'caro' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md space-y-6 max-w-xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              Lượt đánh cờ: <strong className="text-cyan-300 text-sm">Quân {caroTurn}</strong>
            </span>
            <button
              onClick={resetCaroGame}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-xl font-bold transition-colors"
            >
              Đặt Lại Bàn Cờ
            </button>
          </div>

          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 bg-slate-950 p-2.5 sm:p-4 rounded-2xl border border-slate-800">
            {board.map((cell, idx) => (
              <button
                key={idx}
                onClick={() => handleCellClick(idx)}
                className={`h-10 sm:h-14 md:h-16 rounded-xl font-black text-base sm:text-xl flex items-center justify-center transition-all border ${
                  cell === 'X'
                    ? 'bg-indigo-600 text-white border-indigo-400'
                    : cell === 'O'
                    ? 'bg-rose-600 text-white border-rose-400'
                    : 'bg-slate-900 border-slate-800 text-slate-600 hover:bg-slate-800 hover:border-slate-700'
                }`}
              >
                {cell}
              </button>
            ))}
          </div>

          {/* Caro Question Modal */}
          {caroQuestion && (
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <h4 className="font-bold text-white text-xs text-center">{caroQuestion.prompt}</h4>
              <div className="grid grid-cols-2 gap-2">
                {caroQuestion.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleCaroAnswer(opt)}
                    disabled={caroSelectedOpt !== null}
                    className="p-2.5 bg-slate-900 hover:bg-indigo-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 text-left transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {caroWinner && (
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-3">
              <Trophy className="w-12 h-12 text-amber-400 mx-auto" />
              <h3 className="text-xl font-black text-white">Quân {caroWinner} Chiến Thắng 5 Hàng Ngang/Dọc!</h3>
              <button
                onClick={resetCaroGame}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md"
              >
                Bắt Đầu Ván Mới
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
