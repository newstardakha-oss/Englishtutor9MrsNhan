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
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gradient-to-b from-[#fffbf2] via-white to-[#f2f7ff] rounded-3xl border-4 border-amber-300 shadow-[0_12px_0_#fcd34d] max-w-2xl w-full overflow-hidden relative">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-500 p-4 text-slate-950 flex items-center justify-between border-b-2 border-amber-300">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-8 h-8 text-slate-950 shrink-0" />
            <div>
              <h3 className="font-black text-base leading-tight">🏆 BẢNG VÀNG THI ĐỦA THỰC HỌC CHIBI 9</h3>
              <p className="text-[11px] font-bold text-slate-900">Vinh Danh Học Sinh Tích Cực Ôn Thi Vào Lớp 10 THPT</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white/80 hover:bg-white text-slate-800 rounded-xl font-bold border border-amber-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="flex items-center justify-between bg-amber-100/80 p-3 rounded-2xl border border-amber-300/80 text-xs">
            <span className="font-bold text-amber-950 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-700" /> Tổng số học sinh thực học: <strong>{students.length} học sinh</strong>
            </span>

            {sheetsUrl ? (
              <a
                href={sheetsUrl}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-3 py-1.5 rounded-xl border border-emerald-400 shadow-xs flex items-center gap-1 text-[11px]"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Xem Google Sheet Báo Cáo
              </a>
            ) : (
              <span className="text-[11px] text-amber-800 italic">Đã bật tự động đồng bộ Drive</span>
            )}
          </div>

          {/* Student Leaderboard Table */}
          <div className="bg-white rounded-2xl border-2 border-amber-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-amber-100/80 border-b border-amber-200 text-amber-950 font-black">
                <tr>
                  <th className="p-3 text-center w-12">HẠNG</th>
                  <th className="p-3">HỌ VÀ TÊN</th>
                  <th className="p-3">LỚP / TRƯỜNG / XÃ</th>
                  <th className="p-3 text-center">THỜI GIAN HỌC</th>
                  <th className="p-3 text-center">TỪ VỰNG</th>
                  <th className="p-3 text-center">ĐIỂM CAO</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold">
                {students.map((std, idx) => {
                  let rankBadge = <span className="font-black text-slate-500">#{idx + 1}</span>;
                  if (idx === 0) rankBadge = <span className="text-xl">🥇</span>;
                  if (idx === 1) rankBadge = <span className="text-xl">🥈</span>;
                  if (idx === 2) rankBadge = <span className="text-xl">🥉</span>;

                  return (
                    <tr key={std.id} className={idx < 3 ? 'bg-amber-50/50' : 'hover:bg-slate-50'}>
                      <td className="p-3 text-center font-black">{rankBadge}</td>
                      <td className="p-3 text-slate-900 font-black flex items-center gap-1.5">
                        <span>{std.fullName}</span>
                      </td>
                      <td className="p-3 text-slate-600 text-[11px]">
                        <div>{std.className} • {std.schoolName}</div>
                        <div className="text-slate-400">{std.wardCommune}</div>
                      </td>
                      <td className="p-3 text-center text-indigo-600 font-black">
                        {std.totalStudyMinutes} phút
                      </td>
                      <td className="p-3 text-center text-pink-600 font-black">
                        {std.masteredVocabCount} từ
                      </td>
                      <td className="p-3 text-center text-emerald-600 font-black">
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
