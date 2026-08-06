import React, { useState } from 'react';
import { X, User, Lock, BookOpen, School, MapPin, UserCheck, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { loginStudent, registerStudent } from '../utils/auth';
import { StudentProfile } from '../types';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (student: StudentProfile) => void;
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Form states
  const [fullName, setFullName] = useState('');
  const [className, setClassName] = useState('9A1');
  const [schoolName, setSchoolName] = useState('THCS Chu Văn An');
  const [wardCommune, setWardCommune] = useState('Thị trấn Đắk Hà');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ Tên đăng nhập và Mật khẩu!');
      return;
    }

    const res = loginStudent(username, password);
    if (res.success && res.student) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onSuccess(res.student!);
        onClose();
      }, 600);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim() || !className.trim() || !schoolName.trim() || !wardCommune.trim() || !username.trim() || !password.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ cả 6 trường thông tin yêu cầu!');
      return;
    }

    const res = registerStudent({
      fullName,
      className,
      schoolName,
      wardCommune,
      username,
      password
    });

    if (res.success && res.student) {
      setSuccessMsg(res.message);
      setTimeout(() => {
        onSuccess(res.student!);
        onClose();
      }, 800);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-gradient-to-b from-[#fffbf2] via-white to-[#f2f7ff] rounded-3xl border-4 border-amber-300 shadow-[0_12px_0_#fcd34d] max-w-md w-full overflow-hidden relative">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-amber-400 via-pink-400 to-indigo-500 p-4 text-slate-950 flex items-center justify-between border-b-2 border-amber-300">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-xl shadow-xs font-black">
              🦉
            </div>
            <div>
              <h3 className="font-black text-base leading-tight">ĐẮNG NHẬP / ĐẮNG KÝ HỌC SINH</h3>
              <p className="text-[11px] font-bold text-slate-900">Gia Sư Tiếng Anh 9 • Created by Mrs Nhan DakHa</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white/80 hover:bg-white text-slate-800 rounded-xl font-bold border border-amber-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-2 bg-amber-100/60 border-b border-amber-200 gap-2">
          <button
            onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2.5 rounded-2xl font-black text-xs transition-all border-2 ${
              activeTab === 'login'
                ? 'bg-blue-600 text-white border-blue-400 shadow-[0_3px_0_#1d4ed8]'
                : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            🔑 Đăng Nhập
          </button>
          <button
            onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2.5 rounded-2xl font-black text-xs transition-all border-2 ${
              activeTab === 'register'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_3px_0_#047857]'
                : 'bg-white text-slate-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            ✨ Đăng Ký Học Mới
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-rose-100 border-2 border-rose-300 text-rose-900 rounded-2xl text-xs font-bold text-center">
              ⚠️ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-100 border-2 border-emerald-300 text-emerald-900 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Tên Đăng Nhập:</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ví dụ: vanminh9a1"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-amber-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">Mật Khẩu:</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                    className="w-full pl-9 pr-3 py-2.5 bg-white border-2 border-amber-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white font-black rounded-2xl text-xs shadow-[0_4px_0_#1d4ed8] hover:bg-blue-500 active:translate-y-0.5 active:shadow-none transition-all mt-2"
              >
                🚀 ĐĂNG NHẬP VÀO HỌC NGAY
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <p className="text-[11px] text-slate-500 font-bold border-b pb-1">
                Điền đầy đủ 6 trường thông tin quản lý lớp học:
              </p>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">1. Họ Và Tên Học Sinh:</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Minh"
                  className="w-full px-3 py-2 bg-white border-2 border-amber-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">2. Lớp Học:</label>
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="Ví dụ: 9A1"
                    className="w-full px-3 py-2 bg-white border-2 border-amber-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">3. Xã / Thị Trấn:</label>
                  <input
                    type="text"
                    value={wardCommune}
                    onChange={(e) => setWardCommune(e.target.value)}
                    placeholder="Ví dụ: Thị trấn Đắk Hà"
                    className="w-full px-3 py-2 bg-white border-2 border-amber-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 mb-1">4. Trường THCS:</label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Ví dụ: THCS Chu Văn An"
                  className="w-full px-3 py-2 bg-white border-2 border-amber-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">5. Tên Đăng Nhập:</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="vanminh9a1"
                    className="w-full px-3 py-2 bg-white border-2 border-amber-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-700 mb-1">6. Mật Khẩu:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-white border-2 border-amber-200 rounded-2xl text-xs font-bold text-slate-800 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 text-white font-black rounded-2xl text-xs shadow-[0_4px_0_#047857] hover:bg-emerald-500 active:translate-y-0.5 active:shadow-none transition-all mt-2"
              >
                ✨ ĐẮNG KÝ VÀ TỰ ĐỘNG LƯU HỌC TẬP
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
