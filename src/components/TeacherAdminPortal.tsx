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

  // Password reset state for specific student
  const [resetModalStudent, setResetModalStudent] = useState<StudentProfile | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccessMsg, setResetSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    // Default teacher PIN / password
    if (passwordInput.trim() === 'cva86' || passwordInput.trim() === '123456' || passwordInput.trim() === 'hoangnhancva86') {
      setTeacherAdminState(true);
      setAdminStateState({ email: 'hoangnhancva86@gmail.com', isLoggedIn: true });
    } else {
      setLoginError('Mật khẩu quản trị không chính xác! Thử lại hoặc dùng mã PIN mặc định: cva86');
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

  // Filter students
  const filteredStudents = students.filter(s => {
    const matchSearch = s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        s.schoolName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchClass = classFilter === 'ALL' || s.className === classFilter;
    return matchSearch && matchClass;
  });

  const uniqueClasses = Array.from(new Set(students.map(s => s.className)));

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gradient-to-b from-[#fffbf2] via-white to-[#f2f7ff] rounded-3xl border-4 border-amber-300 shadow-[0_12px_0_#fcd34d] max-w-4xl w-full overflow-hidden relative">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-400 via-pink-400 to-indigo-600 p-4 text-slate-950 flex items-center justify-between border-b-2 border-amber-300">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-8 h-8 text-slate-950 shrink-0" />
            <div>
              <h3 className="font-black text-base leading-tight">CỔNG QUẢN TRỊ GIÁO VIÊN (TEACHER ADMIN)</h3>
              <p className="text-[11px] font-bold text-slate-900">Email Quản trị: hoangnhancva86@gmail.com</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white/80 hover:bg-white text-slate-800 rounded-xl font-bold border border-amber-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        {!adminState.isLoggedIn ? (
          /* Login Box for hoangnhancva86@gmail.com */
          <div className="p-8 max-w-md mx-auto space-y-4">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-amber-100 border-2 border-amber-300 rounded-3xl flex items-center justify-center mx-auto text-3xl shadow-xs">
                🔑
              </div>
              <h4 className="font-black text-lg text-slate-900">Đăng Nhập Quản Trị Giáo Viên</h4>
              <p className="text-xs text-slate-500 font-medium">Dành riêng cho cô Hoàng Nhân (`hoangnhancva86@gmail.com`)</p>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-100 border-2 border-rose-300 text-rose-900 rounded-2xl text-xs font-bold text-center">
                ⚠️ {loginError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-3">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Email Quản Trị:</label>
                <input
                  type="email"
                  disabled
                  value="hoangnhancva86@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-slate-100 border-2 border-slate-300 rounded-2xl text-xs font-bold text-slate-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Mật Khẩu / Mã PIN Quản Trị:</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Nhập mật khẩu (Mặc định: cva86)..."
                  className="w-full px-3.5 py-2.5 bg-white border-2 border-amber-300 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white font-black rounded-2xl text-xs shadow-[0_4px_0_#4338ca] hover:bg-indigo-500 active:translate-y-0.5 active:shadow-none transition-all"
              >
                🔐 ĐĂNG NHẬP VÀO DASHBOARD QUẢN TRỊ
              </button>
            </form>
          </div>
        ) : (
          /* Full Admin Dashboard */
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200 pb-4">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1 rounded-xl text-xs font-black">
                  ✅ Đã xác thực hoangnhancva86@gmail.com
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs shadow-xs flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" /> Xuất File CSV / Excel
                </button>
                <button
                  onClick={handleAdminLogout}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Đăng Xuất
                </button>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border-2 border-amber-200 shadow-xs text-center space-y-1">
                <p className="text-[11px] font-bold text-slate-500">Học Sinh Thực Học</p>
                <p className="text-2xl font-black text-indigo-600">{students.length} HS</p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border-2 border-amber-200 shadow-xs text-center space-y-1">
                <p className="text-[11px] font-bold text-slate-500">Tổng Giờ Học</p>
                <p className="text-2xl font-black text-emerald-600">
                  {Math.round(students.reduce((acc, curr) => acc + curr.totalStudyMinutes, 0) / 60)} Giờ
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border-2 border-amber-200 shadow-xs text-center space-y-1">
                <p className="text-[11px] font-bold text-slate-500">Từ Vựng Đã Thuộc</p>
                <p className="text-2xl font-black text-pink-600">
                  {students.reduce((acc, curr) => acc + curr.masteredVocabCount, 0)} Từ
                </p>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border-2 border-amber-200 shadow-xs text-center space-y-1">
                <p className="text-[11px] font-bold text-slate-500">Điểm Thi TB Vào 10</p>
                <p className="text-2xl font-black text-amber-600">
                  {(students.reduce((acc, curr) => acc + curr.examHighestScore, 0) / (students.length || 1)).toFixed(1)} đ
                </p>
              </div>
            </div>

            {/* Google Sheets Sync Setting Box */}
            <div className="bg-gradient-to-r from-amber-50 to-pink-50 p-4 rounded-2xl border-2 border-amber-300 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-black text-slate-900 text-xs flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Cấu Hình Tự Động Trả Dữ Liệu Về Google Sheet (Drive)
                </h4>
                <button
                  onClick={handleSyncAllToSheets}
                  className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-[11px] shadow-xs flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Đồng Bộ Tất Cả Ngay
                </button>
              </div>

              {syncStatusMsg && (
                <div className="p-2 bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold rounded-xl text-xs text-center">
                  ✨ {syncStatusMsg}
                </div>
              )}

              <form onSubmit={handleSaveSheetsUrl} className="flex gap-2">
                <input
                  type="text"
                  value={sheetsUrlInput}
                  onChange={(e) => setSheetsUrlInput(e.target.value)}
                  placeholder="Dán link Google Apps Script Web App URL tại đây..."
                  className="flex-1 px-3 py-2 bg-white border-2 border-amber-200 rounded-xl text-xs font-mono text-slate-800 outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white font-black rounded-xl text-xs shadow-xs hover:bg-indigo-500"
                >
                  Lưu Webhook URL
                </button>
              </form>
            </div>

            {/* Student Search & Table */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="font-black text-slate-900 text-sm">📋 Danh Sách Học Sinh Đã Đăng Ký ({filteredStudents.length})</h4>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Tìm Tên / Tên ĐN / Trường..."
                      className="pl-8 pr-3 py-1.5 bg-white border-2 border-amber-200 rounded-xl text-xs font-bold text-slate-800 outline-none w-48"
                    />
                  </div>

                  <select
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                    className="px-2 py-1.5 bg-white border-2 border-amber-200 rounded-xl text-xs font-bold text-slate-800 outline-none"
                  >
                    <option value="ALL">Tất cả các Lớp</option>
                    {uniqueClasses.map(c => <option key={c} value={c}>Lớp {c}</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-white rounded-2xl border-2 border-amber-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-amber-100 border-b border-amber-200 text-slate-900 font-black">
                    <tr>
                      <th className="p-3">HỌ VÀ TÊN</th>
                      <th className="p-3">LỚP</th>
                      <th className="p-3">TRƯỜNG & XÃ</th>
                      <th className="p-3">TÊN ĐĂNG NHẬP</th>
                      <th className="p-3 text-center">THỜI GIAN HỌC</th>
                      <th className="p-3 text-center">ĐIỂM THI</th>
                      <th className="p-3 text-center">THAO TÁC GIÁO VIÊN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold">
                    {filteredStudents.map((std) => (
                      <tr key={std.id} className="hover:bg-slate-50">
                        <td className="p-3 text-slate-900 font-black">{std.fullName}</td>
                        <td className="p-3 text-indigo-600 font-black">{std.className}</td>
                        <td className="p-3 text-slate-600 text-[11px]">
                          <div>{std.schoolName}</div>
                          <div className="text-slate-400">{std.wardCommune}</div>
                        </td>
                        <td className="p-3 font-mono text-slate-600">{std.username}</td>
                        <td className="p-3 text-center text-emerald-600 font-black">{std.totalStudyMinutes} phút</td>
                        <td className="p-3 text-center text-amber-600 font-black">{std.examHighestScore} đ</td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => { setResetModalStudent(std); setNewPassword(''); }}
                            className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-lg text-[11px] border border-amber-500 flex items-center gap-1 mx-auto"
                          >
                            <Key className="w-3 h-3" /> Reset Mật Khẩu
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Reset Password Sub-Modal */}
        {resetModalStudent && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 rounded-3xl border-4 border-amber-300 shadow-2xl max-w-sm w-full space-y-4">
              <h4 className="font-black text-slate-900 text-base flex items-center gap-2">
                🔑 Reset Mật Khẩu Học Sinh
              </h4>
              <p className="text-xs text-slate-600 font-medium">
                Cấp lại mật khẩu mới cho học sinh <strong>{resetModalStudent.fullName}</strong> ({resetModalStudent.username}):
              </p>

              {resetSuccessMsg && (
                <div className="p-2.5 bg-emerald-100 text-emerald-900 font-bold rounded-xl text-xs text-center">
                  ✨ {resetSuccessMsg}
                </div>
              )}

              <form onSubmit={handleExecuteResetPassword} className="space-y-3">
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới (Ví dụ: 123456)..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border-2 border-amber-300 rounded-2xl text-xs font-bold text-slate-800 outline-none"
                />

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setResetModalStudent(null)}
                    className="flex-1 py-2 bg-slate-200 font-bold rounded-xl text-xs text-slate-700"
                  >
                    Hủy Bỏ
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-emerald-600 text-white font-black rounded-xl text-xs shadow-xs hover:bg-emerald-500"
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
