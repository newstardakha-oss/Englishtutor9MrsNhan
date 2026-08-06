import React, { useState } from 'react';
import { BookOpen, Sparkles, Volume2, HelpCircle, CheckCircle2, ChevronRight, Zap, Award, ArrowRight } from 'lucide-react';
import { UNITS_DATA, CORE_VOCABULARY, GRAMMAR_TOPICS, PRONUNCIATION_GUIDES, SGK_SAMPLE_EXERCISES } from '../data/sgkData';

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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Unit Selector Grid Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-amber-400 text-slate-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                Global Success 9
              </span>
              <span className="text-slate-400 text-xs">{currentUnit.pageRange}</span>
            </div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              Unit {currentUnit.id}: {currentUnit.title}
            </h1>
            <p className="text-slate-300 text-sm mt-1">{currentUnit.theme} - {currentUnit.description}</p>
          </div>

          <button
            onClick={() => onAskTutor(`#HOCUNIT ${currentUnit.id}`)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm shrink-0 transition-transform active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Học Unit {currentUnit.id} cùng Gia Sư AI</span>
          </button>
        </div>

        {/* 12 Units Quick Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-1.5">
          {UNITS_DATA.map((u) => {
            const isSelected = u.id === selectedUnit;
            return (
              <button
                key={u.id}
                onClick={() => setSelectedUnit(u.id)}
                className={`p-2 rounded-xl text-center text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <div className="text-[10px] text-slate-400 font-normal">Unit</div>
                <div className="text-sm">{u.id}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto no-scrollbar">
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
                  ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b pb-2">
              <Zap className="w-5 h-5 text-amber-500" /> Trọng Tâm Kiến Thức Ngôn Ngữ
            </h3>

            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">1. Từ vựng chính (Vocabulary)</h4>
              <ul className="grid grid-cols-2 gap-2">
                {currentUnit.vocabularyOverview.map((item, idx) => (
                  <li key={idx} className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">2. Ngữ pháp chính (Grammar)</h4>
              <div className="space-y-2">
                {currentUnit.grammarFocus.map((g, idx) => (
                  <div key={idx} className="bg-indigo-50 border border-indigo-200 p-2.5 rounded-xl text-xs font-medium text-indigo-950 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                    <span>{g}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">3. Ngữ âm (Pronunciation)</h4>
              <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-medium">
                {currentUnit.pronunciationFocus}
              </p>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b pb-2">
              <Award className="w-5 h-5 text-blue-600" /> 4 Kỹ Năng Cần Đạt trong Unit {currentUnit.id}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-blue-700 uppercase block mb-0.5">📖 Reading (Đọc)</span>
                <p className="text-slate-700">{currentUnit.skillsFocus.reading}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-indigo-700 uppercase block mb-0.5">🗣️ Speaking (Nói)</span>
                <p className="text-slate-700">{currentUnit.skillsFocus.speaking}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-purple-700 uppercase block mb-0.5">🎧 Listening (Nghe)</span>
                <p className="text-slate-700">{currentUnit.skillsFocus.listening}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-emerald-700 uppercase block mb-0.5">✍️ Writing (Viết)</span>
                <p className="text-slate-700">{currentUnit.skillsFocus.writing}</p>
              </div>
            </div>

            <button
              onClick={() => onAskTutor(`Dạy em bài đọc và từ vựng Unit ${currentUnit.id}: ${currentUnit.title}`)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              Yêu Cầu Gia Sư Dạy Bài Học Này <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab Content 2: VOCABULARY */}
      {activeTab === 'vocab' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Từ Vựng Trọng Tâm Unit {selectedUnit}</h3>
            <span className="text-xs text-slate-500 font-medium">Bao gồm IPA, Collocations & Bẫy thi vào 10</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unitVocab.length > 0 ? (
              unitVocab.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-slate-900">{item.word}</span>
                        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {item.partOfSpeech}
                        </span>
                        <span className="text-xs font-mono text-slate-500">{item.ipa}</span>
                      </div>
                      <p className="text-sm font-bold text-indigo-900 mt-1">{item.meaning}</p>
                    </div>

                    <button
                      onClick={() => speakText(item.word)}
                      className="p-2 bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-600 rounded-xl transition-colors"
                      title="Nghe phát âm chuẩn"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 text-xs mt-3 pt-3 border-t border-slate-100">
                    <p className="text-slate-700 bg-slate-50 p-2 rounded-lg italic">
                      " {item.example} "
                    </p>

                    {item.collocations && item.collocations.length > 0 && (
                      <div>
                        <span className="font-bold text-slate-600 block mb-1">Cụm từ đi kèm (Collocations):</span>
                        <div className="flex flex-wrap gap-1">
                          {item.collocations.map((c, idx) => (
                            <span key={idx} className="bg-amber-50 text-amber-900 font-medium px-2 py-0.5 rounded border border-amber-200">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.examNote && (
                      <div className="bg-rose-50 border border-rose-200 p-2 rounded-lg text-rose-900 font-medium">
                        {item.examNote}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
                Đang cập nhật thêm từ vựng chi tiết cho Unit {selectedUnit}. Em hãy dùng lệnh <strong>#TUVUNG Unit {selectedUnit}</strong> trong tab Gia Sư Chat để hỏi thầy trực tiếp nhé!
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content 3: GRAMMAR */}
      {activeTab === 'grammar' && (
        <div className="space-y-6">
          {unitGrammar.map((topic) => (
            <div key={topic.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" /> {topic.title}
                </h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full">
                  Unit {selectedUnit}
                </span>
              </div>

              {/* Formula */}
              <div className="bg-slate-900 text-amber-300 p-4 rounded-xl font-mono text-xs sm:text-sm font-bold shadow-inner">
                <span className="text-slate-400 font-sans block text-xs mb-1">CÔNG THỨC CHUẨN:</span>
                {topic.formula}
              </div>

              {/* Usage & Examples */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900">Cách Dùng & Dấu Hiệu:</h4>
                  <p className="text-slate-700">{topic.usage}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {topic.signs.map((s, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-900 px-2 py-0.5 rounded font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900">Ví Dụ Minh Họa:</h4>
                  <ul className="space-y-1 text-slate-700 list-disc list-inside">
                    {topic.examples.map((ex, idx) => (
                      <li key={idx}>{ex}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Traps */}
              <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl text-xs text-rose-950 space-y-2">
                <h4 className="font-bold text-rose-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-rose-600" /> Bẫy Đề Thi Vào 10 Thường Gặp:
                </h4>
                {topic.examTraps.map((trap, idx) => (
                  <p key={idx} className="font-medium leading-relaxed">{trap}</p>
                ))}
              </div>

              {/* Memory Tip */}
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Mẹo nhớ nhanh: {topic.memoryTips}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content 4: PRONUNCIATION */}
      {activeTab === 'pronunciation' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b pb-3">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <Volume2 className="w-5 h-5 text-blue-600" /> {unitPronunciation.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Trọng tâm ngữ âm SGK Unit {selectedUnit}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-sm">Quy Tắc Phát Âm / Trọng Âm:</h4>
              <div className="space-y-2">
                {unitPronunciation.rules.map((r, idx) => (
                  <div key={idx} className="p-3 bg-blue-50 border border-blue-200 text-blue-950 rounded-xl text-xs font-medium">
                    {r}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-800 text-sm">Luyện Đọc Từ Mẫu:</h4>
              <div className="grid grid-cols-2 gap-2">
                {unitPronunciation.examples.map((ex, idx) => (
                  <button
                    key={idx}
                    onClick={() => speakText(ex.word)}
                    className="p-3 bg-slate-50 hover:bg-blue-100 border border-slate-200 rounded-xl flex items-center justify-between text-xs transition-colors"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{ex.word}</div>
                      <div className="text-slate-500 font-mono text-[11px]">{ex.ipa}</div>
                    </div>
                    <Volume2 className="w-4 h-4 text-blue-600" />
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
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">Bài Tập SGK Unit {selectedUnit}</h3>
            <span className="text-xs text-slate-500 font-medium">Kèm gợi ý 3 mức độ hỗ trợ tự học</span>
          </div>

          <div className="space-y-3">
            {unitExercises.map((ex) => (
              <div key={ex.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded text-xs">
                    {ex.section}
                  </span>
                  <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {ex.tag}
                  </span>
                </div>

                <p className="font-bold text-slate-900 text-sm leading-relaxed">{ex.question}</p>

                {ex.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ex.options.map((opt, oIdx) => (
                      <div key={oIdx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800">
                        {opt}
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-900 space-y-1">
                  <p className="font-bold text-amber-950 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" /> Gợi ý Mức 1:
                  </p>
                  <p>{ex.hints.level1}</p>
                </div>

                <button
                  onClick={() => onAskTutor(`Hướng dẫn em bài tập SGK này: "${ex.question}"`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-colors"
                >
                  Giải Chi Tiết Cùng Gia Sư AI <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
