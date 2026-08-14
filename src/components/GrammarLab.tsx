import React, { useState } from 'react';
import { Zap, AlertTriangle, CheckCircle2, XCircle, ArrowRight, HelpCircle, BookOpen, ShieldAlert } from 'lucide-react';
import { GRAMMAR_TOPICS } from '../data/sgkData';

interface GrammarLabProps {
  onAskTutor: (query: string) => void;
}

export const GrammarLab: React.FC<GrammarLabProps> = ({ onAskTutor }) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(GRAMMAR_TOPICS[0].id);

  const activeTopic = GRAMMAR_TOPICS.find(g => g.id === selectedTopicId) || GRAMMAR_TOPICS[0];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
              Trọng Tâm Ngữ Pháp Lớp 9 & Thi Vào 10 THPT
            </span>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-400" /> Phòng Ngữ Pháp Bẫy Đề & Bản Chất Cấu Trúc
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Nắm chắc bản chất cấu trúc, nhận diện bẫy đề thi tuyển sinh vào lớp 10 THPT.
            </p>
          </div>

          <button
            onClick={() => onAskTutor(`#NGUPHAP Hãy giải thích chi tiết chuyên đề "${activeTopic.title}" và đưa câu hỏi bẫy đề thi vào 10 cho em làm!`)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md shrink-0 transition-all border border-indigo-400/30 active:scale-95"
          >
            <span>Hỏi Gia Sư AI Về Ngữ Pháp này</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Topic Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 mt-6">
          {GRAMMAR_TOPICS.map((topic) => {
            const isSelected = topic.id === selectedTopicId;
            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopicId(topic.id)}
                className={`p-2.5 rounded-xl text-left text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-gradient-to-b from-indigo-600 to-blue-600 border-indigo-400 text-white shadow-md'
                    : 'bg-slate-950/60 hover:bg-slate-800 border-slate-800 text-slate-300'
                }`}
              >
                <div className="text-[10px] text-amber-400 font-normal">Unit {topic.unit || 1}</div>
                <div className="truncate font-extrabold">{topic.title.split('(')[0]}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grammar Topic Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Rules & Formula */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-xl font-black text-white">{activeTopic.title}</h2>
              <span className="bg-indigo-500/20 text-cyan-300 border border-indigo-500/40 text-xs font-bold px-3 py-1 rounded-full">
                Trọng tâm Thi Vào 10
              </span>
            </div>

            {/* Formula Box */}
            <div className="bg-slate-950 text-amber-300 p-4 rounded-2xl font-mono text-sm font-bold border border-slate-800 shadow-inner">
              <span className="text-slate-400 font-sans block text-xs mb-1 uppercase tracking-wider">
                📐 Công Thức Chuẩn:
              </span>
              <p className="text-base sm:text-lg leading-relaxed">{activeTopic.formula}</p>
            </div>

            {/* Usage */}
            <div className="space-y-2 text-xs sm:text-sm">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-cyan-400" /> Bản Chất Cách Dùng:
              </h3>
              <p className="text-slate-300 bg-slate-950 p-3.5 rounded-xl border border-slate-800 leading-relaxed font-medium">
                {activeTopic.usage}
              </p>
            </div>

            {/* Signs / Keywords */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-400 text-xs uppercase tracking-wider">
                Dấu hiệu nhận biết trong bài thi:
              </h3>
              <div className="flex flex-wrap gap-2">
                {activeTopic.signs.map((sign, idx) => (
                  <span key={idx} className="bg-indigo-950/80 text-cyan-300 border border-indigo-500/30 px-3 py-1 rounded-xl text-xs font-bold">
                    {sign}
                  </span>
                ))}
              </div>
            </div>

            {/* Examples */}
            <div className="space-y-2 text-xs">
              <h3 className="font-bold text-white text-sm">Ví Dụ Chuẩn SGK & Đề Thi:</h3>
              <div className="space-y-2">
                {activeTopic.examples.map((ex, idx) => (
                  <div key={idx} className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 rounded-xl font-medium leading-relaxed">
                    {ex}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Traps & Common Errors */}
        <div className="lg:col-span-4 space-y-6">
          {/* Exam Traps Warning Box */}
          <div className="bg-rose-950/40 border border-rose-500/30 p-5 rounded-2xl text-rose-200 space-y-3 shadow-md">
            <h3 className="font-black text-rose-300 text-sm flex items-center gap-2 border-b border-rose-500/30 pb-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" /> Cảnh Báo Bẫy Đề Thi Vào 10!
            </h3>
            <div className="space-y-2.5 text-xs">
              {activeTopic.examTraps.map((trap, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-rose-500/30 leading-relaxed font-medium">
                  {trap}
                </div>
              ))}
            </div>
          </div>

          {/* Common Errors */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md space-y-3">
            <h3 className="font-bold text-white text-sm flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <XCircle className="w-4 h-4 text-rose-400" /> Lỗi HS Lớp 9 Thường Mắc:
            </h3>
            <div className="space-y-2 text-xs">
              {activeTopic.commonErrors.map((err, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 font-medium leading-relaxed">
                  {err}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
