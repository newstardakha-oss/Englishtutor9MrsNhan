import React, { useState } from 'react';
import { BookOpen, Sparkles, Volume2, HelpCircle, CheckCircle2, ChevronRight, Zap, Award, ArrowRight, Star } from 'lucide-react';
import { UNITS_DATA, CORE_VOCABULARY, GRAMMAR_TOPICS, PRONUNCIATION_GUIDES, SGK_SAMPLE_EXERCISES } from '../data/sgkData';
import { apiPost, getErrorMessage } from '../utils/apiClient';

interface UnitExplorerProps {
  selectedUnit: number;
  setSelectedUnit: (unit: number) => void;
  onAskTutor: (query: string) => void;
  ttsEnabled: boolean;
}

export const UnitExplorer: React.FC<UnitExplorerProps> = ({
  selectedUnit,
  setSelectedUnit,
  onAskTutor,
  ttsEnabled
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'vocab' | 'grammar' | 'pronunciation' | 'exercises'>('overview');

  const [lessonMode, setLessonMode] = useState(false);
  const [lessonStep, setLessonStep] = useState<'warmup' | 'vocabulary' | 'grammar' | 'practice' | 'review'>('warmup');
  const [lessonContent, setLessonContent] = useState<string>('');
  const [lessonLoading, setLessonLoading] = useState(false);
  const [lessonHistory, setLessonHistory] = useState<{role: string, text: string}[]>([]);
  const [lessonUserInput, setLessonUserInput] = useState('');

  const LESSON_STEPS = [
    { key: 'warmup' as const, label: '🎯 Khởi Động', icon: '1' },
    { key: 'vocabulary' as const, label: '📚 Từ Vựng', icon: '2' },
    { key: 'grammar' as const, label: '📐 Ngữ Pháp', icon: '3' },
    { key: 'practice' as const, label: '✏️ Luyện Tập', icon: '4' },
    { key: 'review' as const, label: '🏆 Tổng Kết', icon: '5' },
  ];

  const fetchLessonStep = async (step: string, userMessage?: string) => {
    setLessonLoading(true);
    try {
      const unitInfo = UNITS_DATA.find(u => u.id === selectedUnit);
      const newHistory = [...lessonHistory];
      if (userMessage) {
        newHistory.push({ role: 'user', text: userMessage });
      }
      
      const data = await apiPost<{ reply?: string; error?: string }>('/api/tutor/lesson-teach', {
        unitId: selectedUnit,
        unitTitle: unitInfo?.title || `Unit ${selectedUnit}`,
        lessonStep: step,
        studentResponses: newHistory.slice(-10),
      });
      if (data.reply) {
        setLessonContent(data.reply);
        newHistory.push({ role: 'model', text: data.reply });
        setLessonHistory(newHistory);
      } else if (data.error) {
        setLessonContent(`⚠️ ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      const errorInfo = getErrorMessage(err);
      setLessonContent(errorInfo.message);
    } finally {
      setLessonLoading(false);
    }
  };

  const startLesson = () => {
    setLessonMode(true);
    setLessonStep('warmup');
    setLessonHistory([]);
    setLessonContent('');
    fetchLessonStep('warmup');
  };

  const goToNextStep = () => {
    const currentIdx = LESSON_STEPS.findIndex(s => s.key === lessonStep);
    if (currentIdx < LESSON_STEPS.length - 1) {
      const nextStep = LESSON_STEPS[currentIdx + 1].key;
      setLessonStep(nextStep);
      fetchLessonStep(nextStep);
    }
  };

  const goToPrevStep = () => {
    const currentIdx = LESSON_STEPS.findIndex(s => s.key === lessonStep);
    if (currentIdx > 0) {
      const prevStep = LESSON_STEPS[currentIdx - 1].key;
      setLessonStep(prevStep);
      fetchLessonStep(prevStep);
    }
  };

  const sendLessonMessage = () => {
    if (!lessonUserInput.trim()) return;
    const msg = lessonUserInput.trim();
    setLessonUserInput('');
    fetchLessonStep(lessonStep, msg);
  };

  const exitLesson = () => {
    setLessonMode(false);
    setLessonContent('');
    setLessonHistory([]);
    setLessonStep('warmup');
  };

  const currentUnit = UNITS_DATA.find(u => u.id === selectedUnit) || UNITS_DATA[0];
  const unitVocab = CORE_VOCABULARY.filter(v => v.unit === selectedUnit);
  const unitGrammar = GRAMMAR_TOPICS.filter(g => g.unit === selectedUnit || (!g.unit && selectedUnit === 1));
  const unitPronunciation = PRONUNCIATION_GUIDES.find(p => p.unit === selectedUnit) || PRONUNCIATION_GUIDES[0];
  const unitExercises = SGK_SAMPLE_EXERCISES.filter(e => e.unit === selectedUnit);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {lessonMode ? (
        <div className="flex flex-col min-h-[480px] lg:h-[75vh]">
          {/* Lesson Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 mb-4 shadow-lg shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                📖 Gia Sư Giảng Bài — Unit {selectedUnit}
              </h2>
              <button onClick={exitLesson} className="text-white/70 hover:text-white text-sm bg-white/10 px-3 py-1 rounded-lg hover:bg-white/20 transition-all">
                ✕ Thoát
              </button>
            </div>
            {/* Step Progress Bar */}
            <div className="flex gap-1">
              {LESSON_STEPS.map((step, idx) => {
                const currentIdx = LESSON_STEPS.findIndex(s => s.key === lessonStep);
                const isActive = step.key === lessonStep;
                const isDone = idx < currentIdx;
                return (
                  <button
                    key={step.key}
                    onClick={() => { setLessonStep(step.key); fetchLessonStep(step.key); }}
                    className={`flex-1 py-2 px-1 rounded-lg text-xs font-bold transition-all ${
                      isActive ? 'bg-white text-indigo-700 shadow-md scale-105' :
                      isDone ? 'bg-white/30 text-white' : 'bg-white/10 text-white/60'
                    }`}
                  >
                    <span className="block">{step.icon}</span>
                    <span className="hidden sm:block">{step.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Lesson Content */}
          <div className="flex-1 bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5 overflow-y-auto mb-4 backdrop-blur-sm min-h-[300px]">
            {lessonLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 py-10">
                <div className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-400 text-sm animate-pulse">Gia sư đang chuẩn bị bài giảng...</p>
              </div>
            ) : (
              <div className="prose prose-invert prose-sm max-w-none text-slate-200 leading-relaxed whitespace-pre-wrap">
                {lessonContent || 'Nhấn "Bắt đầu" để bắt đầu bài giảng.'}
              </div>
            )}
          </div>

          {/* Student Input */}
          <div className="flex gap-2 mb-3 shrink-0">
            <input
              type="text"
              value={lessonUserInput}
              onChange={(e) => setLessonUserInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendLessonMessage()}
              placeholder="Trả lời hoặc hỏi Gia Sư..."
              className="flex-1 bg-slate-800/80 border border-slate-600/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
            />
            <button
              onClick={sendLessonMessage}
              disabled={!lessonUserInput.trim() || lessonLoading}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all"
            >
              Gửi
            </button>
          </div>

          {/* Navigation */}
          <div className="flex justify-between shrink-0">
            <button
              onClick={goToPrevStep}
              disabled={lessonStep === 'warmup' || lessonLoading}
              className="bg-slate-700 hover:bg-slate-600 disabled:opacity-30 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
            >
              ← Bước trước
            </button>
            <button
              onClick={goToNextStep}
              disabled={lessonStep === 'review' || lessonLoading}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
            >
              Bước tiếp →
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Unit Selector Grid Header */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                Global Success 9
              </span>
              <span className="text-slate-400 text-xs font-mono">{currentUnit.pageRange}</span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              Unit {currentUnit.id}: {currentUnit.title}
            </h1>
            <p className="text-slate-300 text-sm mt-1">{currentUnit.theme} • {currentUnit.description}</p>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <button
              onClick={startLesson}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all border border-indigo-400/30 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>📖 Học Bài Với Gia Sư AI</span>
            </button>
            <button
              onClick={() => onAskTutor(`#HOCUNIT ${currentUnit.id}`)}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md transition-all border border-slate-600/30 active:scale-95"
            >
              <HelpCircle className="w-4 h-4 text-slate-300" />
              <span>Hỏi Nhanh AI Tutor</span>
            </button>
          </div>
        </div>

        {/* 12 Units Quick Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-1.5">
          {UNITS_DATA.map((u) => {
            const isSelected = u.id === selectedUnit;
            return (
              <button
                key={u.id}
                onClick={() => setSelectedUnit(u.id)}
                className={`p-2 rounded-xl text-center text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-gradient-to-b from-indigo-600 to-blue-600 border-indigo-400 text-white shadow-md'
                    : 'bg-slate-950/60 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
              >
                <div className="text-[10px] text-slate-400 font-normal">Unit</div>
                <div className="text-sm font-black">{u.id}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Tổng Quan Unit', icon: BookOpen },
          { id: 'vocab', label: `Từ Vựng Trọng Tâm (${unitVocab.length})`, icon: Sparkles },
          { id: 'grammar', label: 'Ngữ Pháp Trọng Tâm', icon: Zap },
          { id: 'pronunciation', label: 'Phát Âm SGK', icon: Volume2 },
          { id: 'exercises', label: `Bài Tập SGK (${unitExercises.length})`, icon: CheckCircle2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-indigo-500 text-cyan-300 bg-indigo-950/30'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4 text-indigo-400" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md space-y-4">
            <h3 className="font-black text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <Zap className="w-5 h-5 text-amber-400" /> Trọng Tâm Kiến Thức Ngôn Ngữ
            </h3>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">1. Từ vựng chính (Vocabulary)</h4>
              <ul className="grid grid-cols-2 gap-2">
                {currentUnit.vocabularyOverview.map((item, idx) => (
                  <li key={idx} className="bg-slate-950 border border-slate-800 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">2. Ngữ pháp chính (Grammar)</h4>
              <div className="space-y-2">
                {currentUnit.grammarFocus.map((g, idx) => (
                  <div key={idx} className="bg-indigo-950/60 border border-indigo-500/30 p-3 rounded-xl text-xs font-bold text-cyan-200 flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{g}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">3. Ngữ âm (Pronunciation)</h4>
              <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800 font-medium">
                {currentUnit.pronunciationFocus}
              </p>
            </div>
          </div>

          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md space-y-4">
            <h3 className="font-black text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
              <Award className="w-5 h-5 text-indigo-400" /> Mục Tiêu Kỹ Năng (4 Skills)
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="font-bold text-indigo-400 uppercase tracking-wider text-[10px]">📖 Kỹ Năng Đọc (Reading)</span>
                <p className="text-slate-300 font-medium">{currentUnit.skillsFocus.reading}</p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="font-bold text-cyan-400 uppercase tracking-wider text-[10px]">🗣️ Kỹ Năng Nói (Speaking)</span>
                <p className="text-slate-300 font-medium">{currentUnit.skillsFocus.speaking}</p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">🎧 Kỹ Năng Nghe (Listening)</span>
                <p className="text-slate-300 font-medium">{currentUnit.skillsFocus.listening}</p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">✍️ Kỹ Năng Viết (Writing)</span>
                <p className="text-slate-300 font-medium">{currentUnit.skillsFocus.writing}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: VOCABULARY */}
      {activeTab === 'vocab' && (
        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <h3 className="font-black text-white text-base">Từ Vựng Chìa Khóa Unit {selectedUnit} ({unitVocab.length} Từ)</h3>
            <button
              onClick={() => onAskTutor(`#TUVUNG Unit ${selectedUnit}`)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
            >
              Hỏi Thầy Từ Vựng Unit {selectedUnit}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unitVocab.map((item) => (
              <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 hover:border-indigo-500/50 transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-lg text-white">{item.word}</span>
                      <button
                        onClick={() => speakText(item.word)}
                        className="p-1 bg-slate-800 hover:bg-indigo-600 text-cyan-300 hover:text-white rounded-lg transition-colors"
                        title="Nghe phát âm"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs font-mono text-cyan-400 mt-0.5">
                      {item.ipa} • <span className="text-amber-400 font-semibold">{item.partOfSpeech}</span>
                    </div>
                  </div>
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-2.5 py-1 rounded-xl">
                    {item.meaning}
                  </span>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800 italic">
                  "{item.example}"
                </p>

                {item.collocations && item.collocations.length > 0 && (
                  <div className="text-[11px] text-slate-400 pt-1">
                    <strong className="text-indigo-400">Collocations:</strong> {item.collocations.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 3: GRAMMAR */}
      {activeTab === 'grammar' && (
        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <h3 className="font-black text-white text-base">Chủ Điểm Ngữ Pháp Unit {selectedUnit}</h3>
            <button
              onClick={() => onAskTutor(`#NGUPHAP Unit ${selectedUnit}`)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
            >
              Giải Thích Ngữ Pháp Chi Tiết
            </button>
          </div>

          <div className="space-y-4">
            {unitGrammar.map((g) => (
              <div key={g.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <h4 className="font-black text-lg text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" /> {g.title}
                </h4>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-cyan-300">
                  <strong className="text-slate-400 font-sans block mb-1">Công thức cốt lõi:</strong>
                  {g.formula}
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <strong className="text-white block">Cách dùng & Dấu hiệu:</strong>
                  <p>{g.usage}</p>
                </div>

                {g.examples && g.examples.length > 0 && (
                  <div className="space-y-1">
                    <strong className="text-xs text-white block">Ví dụ minh họa:</strong>
                    <ul className="list-disc list-inside text-xs text-slate-300 space-y-1 pl-2">
                      {g.examples.map((ex, idx) => (
                        <li key={idx}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 4: PRONUNCIATION */}
      {activeTab === 'pronunciation' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="font-black text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
            <Volume2 className="w-5 h-5 text-cyan-400" /> Ngữ Âm & Phát Âm SGK: {unitPronunciation.title}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <strong className="text-cyan-300 text-sm block">Quy tắc phát âm:</strong>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                {unitPronunciation.rules.map((rule, idx) => (
                  <li key={idx}>{rule}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
              <strong className="text-amber-400 text-sm block">Từ luyện tập phát âm:</strong>
              <div className="grid grid-cols-2 gap-2">
                {unitPronunciation.examples.map((ex, idx) => (
                  <button
                    key={idx}
                    onClick={() => speakText(ex.word)}
                    className="p-2 bg-slate-900 hover:bg-indigo-950 border border-slate-800 rounded-lg text-left flex items-center justify-between text-xs font-bold text-white transition-colors"
                  >
                    <span>{ex.word}</span>
                    <span className="font-mono text-cyan-400 text-[11px]">{ex.ipa}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 5: EXERCISES */}
      {activeTab === 'exercises' && (
        <div className="space-y-4">
          <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
            <h3 className="font-black text-white text-base">Bài Tập Thực Hành SGK Unit {selectedUnit}</h3>
            <span className="text-xs text-slate-400">Đáp án kèm giải thích chi tiết</span>
          </div>

          <div className="space-y-3">
            {unitExercises.map((ex, idx) => (
              <div key={ex.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="bg-indigo-500/20 text-indigo-300 font-bold px-2.5 py-0.5 rounded border border-indigo-500/30">
                    {ex.section}
                  </span>
                  <span className="text-cyan-400 font-bold">{ex.tag}</span>
                </div>
                <p className="font-bold text-white text-sm leading-relaxed">{ex.question}</p>

                {ex.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ex.options.map((opt, oIdx) => (
                      <div key={oIdx} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-slate-200">
                        {opt}
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-3 bg-indigo-950/60 border border-indigo-500/30 rounded-xl space-y-1">
                  <span className="font-bold text-emerald-400 block">Đáp án chính xác: {ex.correctAnswer}</span>
                  <p className="text-slate-300 leading-relaxed">{ex.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};
