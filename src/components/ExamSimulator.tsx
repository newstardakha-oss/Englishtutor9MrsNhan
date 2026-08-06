import React, { useState, useEffect } from 'react';
import { Award, Clock, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, HelpCircle } from 'lucide-react';
import { MOCK_GRADE_10_QUESTIONS } from '../data/examData';
import { ExamQuestion } from '../types';

interface ExamSimulatorProps {
  onAskTutor: (q: string) => void;
}

export const ExamSimulator: React.FC<ExamSimulatorProps> = ({ onAskTutor }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerActive && timeLeft > 0 && !submitted) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !submitted) {
      setSubmitted(true);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, submitted]);

  const handleSelectAnswer = (qId: string, option: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    MOCK_GRADE_10_QUESTIONS.forEach((q) => {
      const userAns = answers[q.id];
      if (userAns && userAns.startsWith(q.correctAnswer.charAt(0))) {
        correctCount++;
      }
    });
    return {
      correct: correctCount,
      total: MOCK_GRADE_10_QUESTIONS.length,
      score10: ((correctCount / MOCK_GRADE_10_QUESTIONS.length) * 10).toFixed(1)
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const scoreResult = calculateScore();

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Exam Header */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-purple-950 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-rose-500 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 inline-block">
              Luyện Đề Chuẩn Cấu Trúc
            </span>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-400" /> Đề Thi Thử Tiếng Anh Vào Lớp 10 THPT
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Phát âm, Ngữ pháp, Từ vựng, Đọc hiểu, Sửa lỗi sai & Viết lại câu chuẩn ma trận đề thi tuyển sinh.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/90 border border-slate-700 px-4 py-2 rounded-xl text-center">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Thời Gian LÀM BÀI</div>
              <div className="text-xl font-mono font-bold text-amber-400 flex items-center gap-1">
                <Clock className="w-4 h-4 text-amber-400" /> {formatTime(timeLeft)}
              </div>
            </div>

            {!submitted ? (
              <button
                onClick={() => setSubmitted(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-xl text-xs shadow-md transition-all active:scale-95"
              >
                Nộp Bài Ngay
              </button>
            ) : (
              <button
                onClick={() => {
                  setAnswers({});
                  setSubmitted(false);
                  setTimeLeft(3600);
                  setTimerActive(true);
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-3 rounded-xl text-xs flex items-center gap-1.5 shadow-md"
              >
                <RefreshCw className="w-4 h-4" /> Làm Lại Đề
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Score Result Panel when Submitted */}
      {submitted && (
        <div className="bg-white p-6 rounded-2xl border-2 border-emerald-500 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl">
                {scoreResult.score10}
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Kết Quả Bài Thi Tuyển Sinh Vào 10</h2>
                <p className="text-xs text-slate-500">
                  Đúng {scoreResult.correct} / {scoreResult.total} câu ({scoreResult.score10} / 10 điểm)
                </p>
              </div>
            </div>

            <button
              onClick={() => onAskTutor(`#LOHONG Dựa vào bài thi vừa rồi đạt ${scoreResult.score10}/10 điểm, nhờ thầy phân tích lỗ hổng kiến thức và lập kế hoạch ôn tập giúp em!`)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-xs"
            >
              Phân Tích Lỗ Hổng Kiến Thức #LOHONG <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Question List */}
      <div className="space-y-6">
        {MOCK_GRADE_10_QUESTIONS.map((q, qIdx) => {
          const userSelectedOption = answers[q.id];
          const isCorrect = submitted && userSelectedOption && userSelectedOption.startsWith(q.correctAnswer.charAt(0));

          return (
            <div
              key={q.id}
              className={`bg-white p-6 rounded-2xl border transition-all ${
                submitted
                  ? isCorrect
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : 'border-rose-300 bg-rose-50/20'
                  : 'border-slate-200 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-900 text-amber-300 font-bold px-2.5 py-0.5 rounded text-xs">
                    Câu {qIdx + 1}
                  </span>
                  <span className="bg-indigo-100 text-indigo-800 text-[11px] font-bold px-2 py-0.5 rounded uppercase">
                    {q.section}
                  </span>
                  <span className="bg-slate-100 text-slate-700 text-[11px] font-semibold px-2 py-0.5 rounded">
                    {q.level}
                  </span>
                </div>

                {submitted && (
                  <span
                    className={`font-bold text-xs px-2.5 py-1 rounded-full ${
                      isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {isCorrect ? '✓ Đúng' : '✗ Chưa chính xác'}
                  </span>
                )}
              </div>

              {q.passage && (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs text-slate-800 mb-3 italic leading-relaxed">
                  {q.passage}
                </div>
              )}

              <p className="font-bold text-slate-900 text-sm mb-4 leading-relaxed">{q.question}</p>

              {/* Options */}
              {q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                  {q.options.map((opt, oIdx) => {
                    const optLetter = opt.charAt(0);
                    const isSelected = userSelectedOption === opt;
                    const isRightOption = submitted && opt.startsWith(q.correctAnswer.charAt(0));

                    let btnStyle = 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800';
                    if (isSelected) {
                      btnStyle = 'bg-blue-600 border-blue-600 text-white font-bold';
                    }
                    if (submitted) {
                      if (isRightOption) {
                        btnStyle = 'bg-emerald-600 border-emerald-600 text-white font-bold';
                      } else if (isSelected && !isRightOption) {
                        btnStyle = 'bg-rose-600 border-rose-600 text-white font-bold';
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        disabled={submitted}
                        onClick={() => handleSelectAnswer(q.id, opt)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {submitted && isRightOption && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Submitted Explanation & Trap Warning */}
              {submitted && (
                <div className="mt-4 pt-4 border-t border-slate-200 space-y-2 text-xs">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-950 font-medium">
                    <span className="font-bold text-blue-900 block mb-1">Đáp án đúng & Giải thích:</span>
                    <p>{q.explanation}</p>
                  </div>

                  {q.trapWarning && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 font-medium flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-900 block">Cảnh báo Bẫy Đề Thi Vào 10:</span>
                        <p>{q.trapWarning}</p>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={() => onAskTutor(`Thầy ơi, nhờ thầy giải thích kĩ hơn cho em Câu ${qIdx + 1}: "${q.question}" trong đề thi thử vào 10 ạ!`)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors mt-2"
                  >
                    <HelpCircle className="w-3.5 h-3.5" /> Hỏi Thầy Giải Thích Thêm
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
