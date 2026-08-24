import React from 'react';
import { X, Trophy, Award, Star, ExternalLink, Flame, Users, BookOpen } from 'lucide-react';
import { getAllStudents } from '../utils/auth';
import { getGoogleSheetsUrl } from '../utils/googleSheetsSync';

interface StudentLeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentLeaderboardModal: React.FC<StudentLeaderboardModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const students = getAllStudents().sort((a, b) => (b.totalStudyMinutes * 2 + b.masteredVocabCount * 3 + b.examHighestScore * 10) - (a.totalStudyMinutes * 2 + a.masteredVocabCount * 3 + a.examHighestScore * 10));
  const sheetsUrl = getGoogleSheetsUrl();

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl max-w-2xl w-full overflow-hidden relative text-white">
        {/* Header Bar */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-7 h-7 text-amber-400 shrink-0" />
            <div>
              <h3 className="font-black text-base leading-tight text-white">🏆 BẢNG VÀNG THI ĐỦA HỌC SINH LỚP 9</h3>
              <p className="text-[11px] font-semibold text-cyan-400">Vinh Danh Học Sinh Tích Cực Ôn Thi Vào Lớp 10 THPT</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-cyan-400" /> Tổng số học sinh tham gia: <strong className="text-white">{students.length} học sinh</strong>
            </span>

            {sheetsUrl ? (
              <a
                href={sheetsUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl border border-emerald-400/30 shadow-md flex items-center gap-1 text-[11px]"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Xem Google Sheet Báo Cáo
              </a>
            ) : (
              <span className="text-[11px] text-slate-400 italic">Tự động đồng bộ Google Drive</span>
            )}
          </div>

          {/* Student Leaderboard Table */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto shadow-md">
            <table className="w-full text-left text-xs min-w-[540px]">
              <thead className="bg-slate-900 border-b border-slate-800 text-cyan-300 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3 text-center w-12">HẠNG</th>
                  <th className="p-3">HỌ VÀ TÊN</th>
                  <th className="p-3">LỚP / TRƯỜNG / XÃ</th>
                  <th className="p-3 text-center">THỜI GIAN HỌC</th>
                  <th className="p-3 text-center">TỪ VỰNG</th>
                  <th className="p-3 text-center">ĐIỂM CAO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-medium">
                {students.map((std, idx) => {
                  let rankBadge = <span className="font-bold text-slate-400">#{idx + 1}</span>;
                  if (idx === 0) rankBadge = <span className="text-xl">🥇</span>;
                  if (idx === 1) rankBadge = <span className="text-xl">🥈</span>;
                  if (idx === 2) rankBadge = <span className="text-xl">🥉</span>;

                  return (
                    <tr key={std.id} className={idx < 3 ? 'bg-indigo-950/40' : 'hover:bg-slate-900/60'}>
                      <td className="p-3 text-center font-bold">{rankBadge}</td>
                      <td className="p-3 text-white font-bold flex items-center gap-1.5">
                        <span>{std.fullName}</span>
                      </td>
                      <td className="p-3 text-slate-400 text-[11px]">
                        <div className="text-slate-200">{std.className} • {std.schoolName}</div>
                        <div className="text-slate-500">{std.wardCommune}</div>
                      </td>
                      <td className="p-3 text-center text-cyan-300 font-bold">
                        {std.totalStudyMinutes} phút
                      </td>
                      <td className="p-3 text-center text-purple-400 font-bold">
                        {std.masteredVocabCount} từ
                      </td>
                      <td className="p-3 text-center text-emerald-400 font-bold">
                        {std.examHighestScore > 0 ? `${std.examHighestScore} đ` : 'Chưa thi'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
