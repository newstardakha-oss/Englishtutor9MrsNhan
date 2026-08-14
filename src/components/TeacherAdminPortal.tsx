import React, { useState } from 'react';
import { X, Key, ShieldCheck, Users, Download, ExternalLink, RefreshCw, Lock, Search, CheckCircle2, FileSpreadsheet, Settings } from 'lucide-react';
import { getAllStudents, getTeacherAdminState, setTeacherAdminState, resetStudentPasswordByTeacher } from '../utils/auth';
import { getGoogleSheetsUrl, setGoogleSheetsUrl, syncStudentToGoogleSheets } from '../utils/googleSheetsSync';
import { StudentProfile } from '../types';

interface TeacherAdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherAdminPortal: React.FC<TeacherAdminPortalProps> = ({ isOpen, onClose }) => {
  const [adminState, setAdminStateState] = useState(getTeacherAdminState());
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard states
  const [students, setStudents] = useState<StudentProfile[]>(() => getAllStudents());
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [sheetsUrlInput, setSheetsUrlInput] = useState(() => getGoogleSheetsUrl());
  const [syncStatusMsg, setSyncStatusMsg] = useState('');

  // Password reset state
  const [resetModalStudent, setResetModalStudent] = useState<StudentProfile | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (passwordInput.trim() === 'cva86' || passwordInput.trim() === '123456' || passwordInput.trim() === 'hoangnhancva86') {
      setTeacherAdminState(true);
      setAdminStateState({ email: 'hoangnhancva86@gmail.com', isLoggedIn: true });
    } else {
      setLoginError('Mật khẩu quản trị không chính xác! Thử lại mã PIN: cva86');
    }
  };

  const handleAdminLogout = () => {
    setTeacherAdminState(false);
    setAdminStateState({ email: 'hoangnhancva86@gmail.com', isLoggedIn: false });
  };

  const handleSaveSheetsUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setGoogleSheetsUrl(sheetsUrlInput.trim());
    setSyncStatusMsg('Đã lưu URL Google Apps Script thành công!');
    setTimeout(() => setSyncStatusMsg(''), 3000);
  };

  const handleSyncAllToSheets = async () => {
    setSyncStatusMsg('Đang đồng bộ danh sách học sinh về Google Sheets...');
    for (const std of students) {
      await syncStudentToGoogleSheets(std);
    }
    setSyncStatusMsg('Đã tự động gửi dữ liệu học sinh về Google Sheet thành công!');
    setTimeout(() => setSyncStatusMsg(''), 4000);
  };

  const handleExecuteResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalStudent || !newPassword.trim()) return;

    const ok = resetStudentPasswordByTeacher(resetModalStudent.username, newPassword.trim());
    if (ok) {
      setResetSuccessMsg(`Đã đổi mật khẩu học sinh ${resetModalStudent.fullName} thành "${newPassword.trim()}"!`);
      setStudents(getAllStudents());
      setTimeout(() => {
        setResetSuccessMsg('');
        setResetModalStudent(null);
        setNewPassword('');
      }, 1800);
    }
  };

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,MA_HS,HO_VA_TEN,LOP,TRUONG,XA,TEN_DANG_NHAP,TONG_PHUT_HOC,TU_VUNG_THUOC,BAI_TAP_DA_LAM,DIEM_THI_CAO_NHAT,LAN_CUOI_HOAT_DONG\n';
    students.forEach(s => {
      csvContent += `"${s.id}","${s.fullName}","${s.className}","${s.schoolName}","${s.wardCommune}","${s.username}",${s.totalStudyMinutes},${s.masteredVocabCount},${s.completedExercisesCount},${s.examHighestScore},"${s.lastActiveAt}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Bao_Cao_Hoc_Sinh_Mrs_Nhan_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredStudents = students.filter(s => {
    const matchSearch = s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.schoolName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchClass = classFilter === 'ALL' || s.className.toUpperCase() === classFilter.toUpperCase();
    return matchSearch && matchClass;
  });

  const uniqueClasses = Array.from(new Set(students.map(s => s.className.toUpperCase())));

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl max-w-4xl w-full overflow-hidden relative text-white">
        {/* Header Bar */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-cyan-400 shrink-0" />
            <div>
              <h3 className="font-black text-base leading-tight text-white">CỔNG QUẢN TRỊ GIÁO VIÊN</h3>
              <p className="text-[11px] font-semibold text-cyan-400">Mrs Nhan DakHa (hoangnhancva86@gmail.com)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors font-bold"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!adminState.isLoggedIn ? (
          /* Login View for Teacher */
          <form onSubmit={handleAdminLogin} className="p-6 space-y-4 max-w-md mx-auto text-xs">
            <div className="text-center space-y-2">
              <Lock className="w-12 h-12 text-cyan-400 mx-auto" />
              <h4 className="text-base font-black text-white">Nhập Mã PIN Quản Trị Giáo Viên</h4>
              <p className="text-slate-400">Dành riêng cho Cô Hoàng Nhàn quản lý học sinh và xuất điểm.</p>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold rounded-xl">
                {loginError}
              </div>
            )}

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Mã PIN / Mật khẩu Giáo Viên:</label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Nhập mã PIN (Mặc định: cva86)"
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition-all border border-indigo-400/30"
            >
              XÁC NHẬN ĐĂNG NHẬP QUẢN TRỊ
            </button>
          </form>
        ) : (
          /* Logged In Dashboard View */
          <div className="p-5 space-y-5 max-h-[80vh] overflow-y-auto no-scrollbar text-xs">
            {/* Top Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div>
                <h4 className="font-black text-sm text-white">Quản Lý {students.length} Học Sinh Học Thực</h4>
                <p className="text-slate-400 text-[11px]">Tự động sao lưu tiến độ học tập & điểm thi vào 10</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-md flex items-center gap-1.5 border border-emerald-400/30"
                >
                  <Download className="w-4 h-4" /> Xuất File CSV / Excel
                </button>
                <button
                  onClick={handleSyncAllToSheets}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-md flex items-center gap-1.5 border border-indigo-400/30"
                >
                  <RefreshCw className="w-4 h-4" /> Đồng Bộ Drive
                </button>
                <button
                  onClick={handleAdminLogout}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3 py-2 rounded-xl text-xs"
                >
                  Đăng Xuất GV
                </button>
              </div>
            </div>

            {syncStatusMsg && (
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 text-cyan-300 font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>{syncStatusMsg}</span>
              </div>
            )}

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm học sinh theo tên, lớp hoặc trường..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-400">Lớp:</span>
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="bg-slate-950 text-cyan-300 font-bold text-xs px-3 py-2 rounded-xl border border-slate-800 outline-none"
                >
                  <option value="ALL">Tất Cả Các Lớp</option>
                  {uniqueClasses.map(c => (
                    <option key={c} value={c}>Lớp {c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Student List Table */}
            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-md">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 border-b border-slate-800 text-cyan-300 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3">HỌ VÀ TÊN</th>
                    <th className="p-3">TÊN ĐN</th>
                    <th className="p-3">LỚP / TRƯỜNG</th>
                    <th className="p-3 text-center">THỜI GIAN</th>
                    <th className="p-3 text-center">TỪ VỰNG</th>
                    <th className="p-3 text-center">ĐIỂM 10</th>
                    <th className="p-3 text-center">THAO TÁC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  {filteredStudents.map((std) => (
                    <tr key={std.id} className="hover:bg-slate-900/60">
                      <td className="p-3 font-bold text-white">{std.fullName}</td>
                      <td className="p-3 font-mono text-cyan-400">{std.username}</td>
                      <td className="p-3 text-slate-400 text-[11px]">
                        <div className="text-slate-200">{std.className} • {std.schoolName}</div>
                      </td>
                      <td className="p-3 text-center text-cyan-300 font-bold">{std.totalStudyMinutes} phút</td>
                      <td className="p-3 text-center text-purple-400 font-bold">{std.masteredVocabCount} từ</td>
                      <td className="p-3 text-center text-emerald-400 font-bold">
                        {std.examHighestScore > 0 ? `${std.examHighestScore} đ` : 'Chưa thi'}
                      </td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => { setResetModalStudent(std); setNewPassword('123456'); }}
                          className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 font-bold rounded-lg text-[11px] transition-colors"
                        >
                          Reset Mật Khẩu
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Google Apps Script Web App URL Setting */}
            <form onSubmit={handleSaveSheetsUrl} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <label className="font-bold text-slate-300 block flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> URL Google Apps Script (Đồng bộ Drive trực tiếp):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={sheetsUrlInput}
                  onChange={(e) => setSheetsUrlInput(e.target.value)}
                  placeholder="https://script.google.com/macros/s/..."
                  className="flex-1 p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md border border-indigo-400/30"
                >
                  Lưu URL
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reset Password Sub-Modal */}
        {resetModalStudent && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 max-w-sm w-full space-y-4 text-xs">
              <h4 className="font-black text-white text-sm">Cấp Lại Mật Khẩu Cho {resetModalStudent.fullName}</h4>

              {resetSuccessMsg && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold rounded-xl">
                  {resetSuccessMsg}
                </div>
              )}

              <form onSubmit={handleExecuteResetPassword} className="space-y-3">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Mật khẩu mới:</label>
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setResetModalStudent(null)}
                    className="px-3 py-2 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs shadow-md border border-indigo-400/30"
                  >
                    Xác Nhận Đổi
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
