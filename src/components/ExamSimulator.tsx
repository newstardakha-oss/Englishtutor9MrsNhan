import React, { useState, useEffect } from 'react';
import { Award, Clock, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw, HelpCircle, FileText, Check, ShieldAlert } from 'lucide-react';
import { MOCK_GRADE_10_QUESTIONS } from '../data/examData';
import { ExamQuestion } from '../types';
import { updateStudentProgress } from '../utils/auth';

interface ExamSimulatorProps {
  onAskTutor: (q: string) => void;
}

export const ExamSimulator: React.FC<ExamSimulatorProps> = ({ onAskTutor }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [timerActive, setTimerActive] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});

  const toggleFlag = (qId: string) => {
    setFlaggedQuestions(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  useEffect(() => {
    let interval: any = null;
    if (timerActive && timeLeft > 0 && !submitted) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !submitted) {
      setSubmitted(true);
      setAnswers(currentAnswers => {
        let correctCount = 0;
        MOCK_GRADE_10_QUESTIONS.forEach((q) => {
          const userAns = currentAnswers[q.id];
          if (userAns && userAns.charAt(0).toUpperCase() === q.correctAnswer.charAt(0).toUpperCase()) {
            correctCount++;
          }
        });
        const score10 = Number(((correctCount / MOCK_GRADE_10_QUESTIONS.length) * 10).toFixed(1));
        updateStudentProgress({ examScore: score10, exerciseAdd: 1 });
        return currentAnswers;
      });
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft, submitted]);

  const handleSelectAnswer = (qId: string, option: string) => {
    if (submitted) return;
    if (!timerActive) setTimerActive(true);
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    MOCK_GRADE_10_QUESTIONS.forEach((q) => {
      const userAns = answers[q.id];
      if (userAns && userAns.charAt(0).toUpperCase() === q.correctAnswer.charAt(0).toUpperCase()) {
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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Exam Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="bg-rose-500/20 text-rose-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-rose-500/30 mb-2 inline-block">
              Luyện Đề Chuẩn Cấu Trúc BGD
            </span>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-400" /> Đề Thi Thử Tiếng Anh Vào Lớp 10 THPT
            </h1>
            <p className="text-slate-300 text-sm mt-1">
              Phát âm, Ngữ pháp, Từ vựng, Đọc hiểu, Sửa lỗi sai & Viết lại câu chuẩn ma trận đề thi tuyển sinh.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950 border border-slate-800 px-4 py-2 rounded-xl text-center">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Thời Gian LÀM BÀI</div>
              <div className="text-xl font-mono font-bold text-amber-400 flex items-center gap-1">
                <Clock className="w-4 h-4 text-amber-400" /> {formatTime(timeLeft)}
              </div>
            </div>

            {!submitted ? (
              <button
                onClick={() => {
                  setSubmitted(true);
                  updateStudentProgress({ examScore: Number(scoreResult.score10), exerciseAdd: 1 });
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-xl text-xs shadow-md transition-all active:scale-95 border border-emerald-400/30"
              >
                Nộp Bài Ngay
              </button>
            ) : (
              <button
                onClick={() => {
                  setAnswers({});
                  setFlaggedQuestions({});
                  setSubmitted(false);
                  setTimeLeft(3600);
                  setTimerActive(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-3 rounded-xl text-xs flex items-center gap-1.5 shadow-md border border-indigo-400/30"
              >
                <RefreshCw className="w-4 h-4" /> Làm Lại Đề
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Score Result Panel when Submitted */}
      {submitted && (
        <div className="bg-slate-900 p-6 rounded-2xl border-2 border-emerald-500/80 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center font-black text-2xl">
                {scoreResult.score10}
              </div>
              <div>
                <h2 className="text-lg font-black text-white">Kết Quả Bài Thi Tuyển Sinh Vào 10</h2>
                <p className="text-xs text-slate-300">
                  Đúng <strong className="text-emerald-400">{scoreResult.correct}</strong> / {scoreResult.total} câu (Thang điểm: <strong>{scoreResult.score10} / 10</strong>)
                </p>
              </div>
            </div>

            <button
              onClick={() => onAskTutor(`#LOHONG Dựa vào bài thi vừa rồi đạt ${scoreResult.score10}/10 điểm, nhờ thầy phân tích lỗ hổng kiến thức và lập kế hoạch ôn tập giúp em!`)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md border border-indigo-400/30"
            >
              Phân Tích Lỗ Hổng Kiến Thức #LOHONG <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation Palette */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md">
        <h3 className="text-xs font-bold text-slate-300 mb-3 uppercase tracking-wider">Bảng câu hỏi</h3>
        <div className="flex flex-wrap gap-2">
          {MOCK_GRADE_10_QUESTIONS.map((q, idx) => {
            const isAnswered = !!answers[q.id];
            const isFlagged = flaggedQuestions[q.id];
            
            let btnClass = 'bg-slate-800 text-slate-400 border-slate-700';
            if (submitted) {
              const isCorrect = answers[q.id] && answers[q.id].charAt(0).toUpperCase() === q.correctAnswer.charAt(0).toUpperCase();
              btnClass = isCorrect ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-rose-600 text-white border-rose-500';
            } else if (isFlagged) {
              btnClass = 'bg-amber-600 text-white border-amber-500';
            } else if (isAnswered) {
              btnClass = 'bg-indigo-600 text-white border-indigo-500';
            }

            return (
              <a
                key={q.id}
                href={`#question-${q.id}`}
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm border transition-colors ${btnClass}`}
              >
                {idx + 1}
              </a>
            );
          })}
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-4">
        {MOCK_GRADE_10_QUESTIONS.map((q, qIdx) => {
          const userSelectedOption = answers[q.id];
          const isCorrect = submitted && userSelectedOption && userSelectedOption.charAt(0).toUpperCase() === q.correctAnswer.charAt(0).toUpperCase();

          return (
            <div
              id={`question-${q.id}`}
              key={q.id}
              className={`scroll-mt-20 p-5 rounded-2xl border transition-all ${
                submitted
                  ? isCorrect
                    ? 'bg-emerald-950/20 border-emerald-500/50'
                    : 'bg-rose-950/20 border-rose-500/50'
                  : 'bg-slate-900 border-slate-800 shadow-md'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-slate-950 text-cyan-300 font-black px-2.5 py-1 rounded-xl text-xs border border-slate-800">
                    Câu {qIdx + 1}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-lg">
                    {q.section}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {q.level}
                  </span>
                  {!submitted && (
                    <button
                      onClick={() => toggleFlag(q.id)}
                      className={`text-xs px-2 py-1 rounded-lg font-bold border transition-colors ${
                        flaggedQuestions[q.id] 
                          ? 'bg-amber-600/20 text-amber-400 border-amber-500/30' 
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      🚩 {flaggedQuestions[q.id] ? 'Đã đánh dấu' : 'Đánh dấu'}
                    </button>
                  )}
                </div>
              </div>

              {q.passage && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-3 text-xs text-slate-300 leading-relaxed font-serif">
                  {q.passage}
                </div>
              )}

              <p className="font-bold text-white text-sm leading-relaxed mb-4">{q.question}</p>

              {q.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = userSelectedOption === opt;
                    const isRightOpt = opt.charAt(0).toUpperCase() === q.correctAnswer.charAt(0).toUpperCase();

                    let btnClass = 'bg-slate-950 hover:bg-slate-800 border-slate-800 text-slate-200';
                    if (submitted) {
                      if (isRightOpt) {
                        btnClass = 'bg-emerald-600 text-white border-emerald-400 font-bold';
                      } else if (isSelected) {
                        btnClass = 'bg-rose-600 text-white border-rose-400 font-bold';
                      } else {
                        btnClass = 'bg-slate-950 text-slate-500 border-slate-800 opacity-50';
                      }
                    } else if (isSelected) {
                      btnClass = 'bg-indigo-600 text-white border-indigo-400 font-bold shadow-md';
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectAnswer(q.id, opt)}
                        disabled={submitted}
                        className={`p-3 rounded-xl text-left text-xs font-medium transition-all border flex items-center justify-between ${btnClass}`}
                      >
                        <span>{opt}</span>
                        {submitted && isRightOpt && <Check className="w-4 h-4 text-white" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Submitted Explanation & Exam Traps */}
              {submitted && (
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                    <strong className="text-cyan-300 block">Giải thích đáp án chi tiết:</strong>
                    <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                  </div>

                  {q.trapWarning && (
                    <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-xl text-rose-200 flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-rose-300 block">Cảnh báo bẫy đề thi:</strong>
                        <p className="leading-relaxed">{q.trapWarning}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
