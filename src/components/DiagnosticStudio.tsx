import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Sparkles, RefreshCw, ArrowRight, Zap, BookOpen } from 'lucide-react';
import { LearningGap } from '../types';

interface DiagnosticStudioProps {
  onAskTutor: (q: string) => void;
}

export const DiagnosticStudio: React.FC<DiagnosticStudioProps> = ({ onAskTutor }) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<{ gaps: LearningGap[]; summaryRoadmap: string } | null>(null);

  const sampleDiagnosticQuiz = [
    {
      id: 'd1',
      topic: 'Lùi thì trong câu gián tiếp & Reported Speech',
      question: 'She asked me if I _____ (know) how to get to the craft village.',
      options: ['A. know', 'B. knew', 'C. have known', 'D. will know'],
      correct: 'B. knew'
    },
    {
      id: 'd2',
      topic: 'Mệnh đề quan hệ không xác định (Non-defining relative clause)',
      question: 'Ha Long Bay, _____ is in Quang Ninh province, is a famous natural wonder.',
      options: ['A. that', 'B. which', 'C. where', 'D. who'],
      correct: 'B. which'
    },
    {
      id: 'd3',
      topic: 'Phrasal Verbs (Cụm động từ lớp 9)',
      question: 'We need to _____ on construction noise in our neighbourhood.',
      options: ['A. cut down', 'B. get on', 'C. hand down', 'D. come down'],
      correct: 'A. cut down'
    },
    {
      id: 'd4',
      topic: 'Cấu trúc Suggest + V-ing / Suggest that S V-bare',
      question: 'My teacher suggested that we _____ (not stay) up late before exams.',
      options: ['A. don’t stay', 'B. not stay', 'C. stayed not', 'D. aren’t staying'],
      correct: 'B. not stay'
    }
  ];

  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});

  const handleRunDiagnostic = async () => {
    setLoading(true);
    try {
      const quizResults = sampleDiagnosticQuiz.map(q => ({
        questionId: q.id,
        topic: q.topic,
        isCorrect: quizAnswers[q.id] === q.correct,
        userAns: quizAnswers[q.id] || 'Bỏ trống',
        correctAns: q.correct
      }));

      const res = await fetch('/api/tutor/diagnostic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizResults })
      });

      if (!res.ok) throw new Error('Không thể chạy chẩn đoán');
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error(err);
      // Fallback local diagnostic report if server fails
      setReport({
        gaps: [
          {
            topic: 'Nhầm lẫn lùi thì trong Câu Gián Tiếp (Reported Speech)',
            severity: 'Thường xuyên nhầm',
            description: 'Học sinh hay quên lùi động từ về quá khứ khi tường thuật lại câu hỏi gián tiếp.',
            remedyAction: 'Cần ghi nhớ công thức: Asked + If/Whether + S + V(lùi thì). Thực hành lại 10 câu biến đổi câu hỏi gián tiếp.',
            recommendedExercises: [
              'Chuyển câu: "Are you excited about Mui Ne?" -> She asked if they were excited about Mui Ne.',
              'Tránh nhầm dùng "is" hay "will" trong câu gián tiếp.'
            ]
          },
          {
            topic: 'Cấu trúc Giả Định với Suggest (Suggest that S V-bare)',
            severity: 'Cần luyện thêm',
            description: 'Dễ chia nhầm động từ sau THAT khi chủ ngữ là he/she/it.',
            remedyAction: 'Nhớ quy tắc: Sau "suggest that", động từ LUÔN LÀ V-nguyên thể (ẩn từ should).',
            recommendedExercises: [
              'I suggest that he (should) go home early.',
              'The doctor suggested that she (not stay) up late.'
            ]
          }
        ],
        summaryRoadmap: 'Ôn tập tập trung 2 tuần tới: Ưu tiên củng cố 1) Lùi thì câu gián tiếp, 2) Phrasal verbs Unit 1 & 2, 3) Luyện viết lại câu Mệnh đề quan hệ không dùng THAT khi có dấu phẩy.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-indigo-950 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-cyan-400 text-slate-950 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
              Lệnh Nhanh #LOHONG
            </span>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-cyan-400" /> Chẩn Đoán Lỗ Hổng Kiến Thức Tiếng Anh 9
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Bài test chẩn đoán giúp phát hiện chính xác lỗ hổng ngữ pháp/từ vựng và lập lộ trình khắc phục hiệu quả cho thi vào 10.
            </p>
          </div>

          <button
            onClick={() => onAskTutor(`#LOHONG Hãy chạy bài test chẩn đoán lỗ hổng kiến thức toàn bộ 12 Unit SGK 9 giúp em!`)}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-sm shrink-0 transition-transform active:scale-95"
          >
            <span>Hỏi Gia Sư AI Chẩn Đoán Toàn Diện</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quiz Area */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="border-b pb-3 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-base">Bài Kiểm Tra Chẩn Đoán Nhanh (4 Câu Trọng Tâm)</h2>
          <span className="text-xs text-slate-500">Chọn đáp án rồi bấm "Phân Tích Lỗ Hổng"</span>
        </div>

        <div className="space-y-4">
          {sampleDiagnosticQuiz.map((q, idx) => (
            <div key={q.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-sm">Câu {idx + 1}: {q.topic}</span>
              </div>
              <p className="font-semibold text-slate-800 text-sm">{q.question}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => setQuizAnswers(prev => ({ ...prev, [q.id]: opt }))}
                    className={`p-2.5 rounded-lg border text-left font-medium transition-all ${
                      quizAnswers[q.id] === opt
                        ? 'bg-blue-600 border-blue-600 text-white font-bold'
                        : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleRunDiagnostic}
          disabled={loading}
          className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2"
        >
          {loading ? (
            <span>Đang Phân Tích Lỗ Hổng Kiến Thức...</span>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Chạy Phân Tích Lỗ Hổng Kiến Thức (#LOHONG)</span>
            </>
          )}
        </button>
      </div>

      {/* Diagnostic Report Result */}
      {report && (
        <div className="bg-white p-6 rounded-2xl border-2 border-cyan-500 shadow-md space-y-6">
          <div className="border-b pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Báo Cáo Chẩn Đoán Lỗ Hổng Kiến Thức (#LOHONG)
            </h2>
            <p className="text-xs text-slate-500 mt-1">Đã phân tích dựa trên kết quả câu trả lời của em.</p>
          </div>

          {/* Gaps List */}
          <div className="space-y-4">
            {report.gaps?.map((gap, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">{gap.topic}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                    gap.severity === 'Hoàn toàn mất gốc'
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : gap.severity === 'Thường xuyên nhầm'
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}>
                    {gap.severity}
                  </span>
                </div>

                <p className="text-slate-700 font-medium"><strong>Nguyên nhân mắc lỗi:</strong> {gap.description}</p>
                <div className="p-3 bg-cyan-50 border border-cyan-200 text-cyan-950 rounded-lg font-medium">
                  <strong>Hướng khắc phục:</strong> {gap.remedyAction}
                </div>

                {gap.recommendedExercises && (
                  <div className="space-y-1">
                    <span className="font-bold text-slate-600 block">Bài tập củng cố khuyến nghị:</span>
                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                      {gap.recommendedExercises.map((ex, eIdx) => (
                        <li key={eIdx}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Summary Roadmap */}
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-indigo-950 text-xs space-y-2">
            <h3 className="font-bold text-indigo-900 text-sm flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" /> Lộ Trình Ôn Tập Khắc Phục (2-3 Tuần):
            </h3>
            <p className="leading-relaxed font-medium">{report.summaryRoadmap}</p>
          </div>

          <button
            onClick={() => onAskTutor(`Dựa vào báo cáo lỗ hổng kiến thức này: "${report.summaryRoadmap}". Nhờ thầy thiết kế bài tập luyện chuyên biệt khắc phục từng lỗi giúp em nhé!`)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
          >
            Yêu Cầu Gia Sư AI Gửi Bài Tập Khắc Phục Lỗ Hổng <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
