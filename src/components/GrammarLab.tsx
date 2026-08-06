import React, { useState } from 'react';
import { Zap, AlertTriangle, CheckCircle2, XCircle, ArrowRight, HelpCircle, BookOpen } from 'lucide-react';
import { GRAMMAR_TOPICS } from '../data/sgkData';

interface GrammarLabProps {
  onAskTutor: (query: string) => void;
}

export const GrammarLab: React.FC<GrammarLabProps> = ({ onAskTutor }) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(GRAMMAR_TOPICS[0].id);
  const [userPracticeAns, setUserPracticeAns] = useState<string>('');
  const [showPracticeFeedback, setShowPracticePracticeFeedback] = useState<boolean>(false);

  const activeTopic = GRAMMAR_TOPICS.find(g => g.id === selectedTopicId) || GRAMMAR_TOPICS[0];

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-amber-400 text-slate-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
              Trọng Tâm Ngữ Pháp Lớp 9 & Thi Vào 10
            </span>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Zap className="w-6 h-6 text-amber-400" /> Ngữ Pháp Nền Tảng & Phòng Tránh Bẫy Đề
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Nắm chắc bản chất cấu trúc, nhận diện bẫy đề thi tuyển sinh vào lớp 10 THPT.
            </p>
          </div>

          <button
            onClick={() => onAskTutor(`#NGUPHAP Tất cả cấu trúc trọng tâm thi vào 10`)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm shrink-0 transition-transform active:scale-95"
          >
            <span>Hỏi Gia Sư AI Về Ngữ Pháp</span>
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
                onClick={() => {
                  setSelectedTopicId(topic.id);
                  setShowPracticePracticeFeedback(false);
                  setUserPracticeAns('');
                }}
                className={`p-2.5 rounded-xl text-left text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <div className="text-[10px] text-amber-300 font-normal">Unit {topic.unit || 1}</div>
                <div className="truncate">{topic.title.split('(')[0]}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grammar Topic Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Rules & Formula */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-xl font-bold text-slate-900">{activeTopic.title}</h2>
              <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full">
                Trọng tâm Thi Vào 10
              </span>
            </div>

            {/* Formula Box */}
            <div className="bg-slate-900 text-amber-300 p-4 rounded-2xl font-mono text-sm font-bold shadow-inner">
              <span className="text-slate-400 font-sans block text-xs mb-1 uppercase tracking-wider">
                📐 Công Thức Chuẩn:
              </span>
              <p className="text-base sm:text-lg">{activeTopic.formula}</p>
            </div>

            {/* Usage */}
            <div className="space-y-2 text-xs sm:text-sm">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-600" /> Bản Chất Cách Dùng:
              </h3>
              <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                {activeTopic.usage}
              </p>
            </div>

            {/* Signs / Keywords */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                Dấu hiệu nhận biết trong bài thi:
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {activeTopic.signs.map((sign, idx) => (
                  <span key={idx} className="bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-1 rounded-lg text-xs font-semibold">
                    {sign}
                  </span>
                ))}
              </div>
            </div>

            {/* Examples */}
            <div className="space-y-2 text-xs">
              <h3 className="font-bold text-slate-900 text-sm">Ví Dụ Chuẩn SGK & Đề Thi:</h3>
              <div className="space-y-2">
                {activeTopic.examples.map((ex, idx) => (
                  <div key={idx} className="p-3 bg-emerald-50/60 border border-emerald-200 text-emerald-950 rounded-xl font-medium">
                    {ex}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Traps, Common Mistakes & Interactive Drill */}
        <div className="lg:col-span-4 space-y-6">
          {/* Exam Traps Warning Box */}
          <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl text-rose-950 space-y-3 shadow-xs">
            <h3 className="font-bold text-rose-900 text-sm flex items-center gap-2 border-b border-rose-200 pb-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" /> Cảnh Báo Bẫy Đề Thi Vào 10!
            </h3>
            <div className="space-y-2 text-xs">
              {activeTopic.examTraps.map((trap, idx) => (
                <div key={idx} className="bg-white/80 p-3 rounded-xl border border-rose-200 leading-relaxed font-medium">
                  {trap}
                </div>
              ))}
            </div>
          </div>

          {/* Common Errors */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5 border-b pb-2">
              <XCircle className="w-4 h-4 text-rose-500" /> Lỗi HS Lớp 9 Thường Mắc:
            </h3>
            <div className="space-y-2 text-xs">
              {activeTopic.commonErrors.map((err, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-medium">
                  {err}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Practice Drill */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-sm space-y-3">
            <h3 className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Luyện Tập Nhanh Tại Chỗ
            </h3>
            <p className="text-xs text-slate-300">
              Hãy viết 1 ví dụ áp dụng đúng cấu trúc <strong>{activeTopic.title.split('(')[0]}</strong> rồi bấm kiểm tra!
            </p>

            <textarea
              value={userPracticeAns}
              onChange={(e) => setUserPracticeAns(e.target.value)}
              placeholder="Nhập câu ví dụ của em ở đây..."
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-3 text-xs focus:outline-none focus:border-amber-400"
            />

            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (userPracticeAns.trim()) {
                    onAskTutor(`Nhờ thầy kiểm tra giúp em câu áp dụng ngữ pháp này: "${userPracticeAns}". Nhận xét ngữ pháp & sửa lỗi cho em nhé!`);
                  }
                }}
                disabled={!userPracticeAns.trim()}
                className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-slate-700 text-slate-950 font-bold py-2 rounded-xl text-xs transition-colors"
              >
                Gửi Cho Gia Sư AI Chấm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
