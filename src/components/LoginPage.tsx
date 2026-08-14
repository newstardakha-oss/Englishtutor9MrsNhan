import React, { useState, useEffect } from 'react';
import { User, Lock, BookOpen, School, MapPin, UserCheck, GraduationCap, ShieldCheck, Eye, EyeOff, Clock, Sparkles, ArrowLeft } from 'lucide-react';
import { loginStudent, registerStudent, loginTeacher } from '../utils/auth';
import { StudentProfile } from '../types';

interface LoginPageProps {
  onStudentLogin: (student: StudentProfile) => void;
  onTeacherLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onStudentLogin, onTeacherLogin }) => {
  // Role selection: null = choosing, 'student', 'teacher'
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Student form states
  const [fullName, setFullName] = useState('');
  const [className, setClassName] = useState('9A1');
  const [schoolName, setSchoolName] = useState('THCS Chu Văn An');
  const [wardCommune, setWardCommune] = useState('Thị trấn Đắk Hà');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Teacher PIN
  const [teacherPin, setTeacherPin] = useState('');

  // Messages
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Animation state
  const [isVisible, setIsVisible] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    setTimeout(() => setCardVisible(true), 200);
  }, []);

  // Re-trigger card animation when role changes
  useEffect(() => {
    setCardVisible(false);
    setTimeout(() => setCardVisible(true), 100);
    setErrorMsg('');
    setSuccessMsg('');
  }, [selectedRole, activeTab]);

  const resetForm = () => {
    setFullName('');
    setClassName('9A1');
    setSchoolName('THCS Chu Văn An');
    setWardCommune('Thị trấn Đắk Hà');
    setUsername('');
    setPassword('');
    setTeacherPin('');
    setShowPassword(false);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleBack = () => {
    setSelectedRole(null);
    resetForm();
  };

  // ── Student Login ──
  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ Tên đăng nhập và Mật khẩu!');
      return;
    }

    const res = await loginStudent(username, password);
    if (res.success && res.student) {
      setSuccessMsg(res.message);
      setTimeout(() => onStudentLogin(res.student!), 800);
    } else {
      setErrorMsg(res.message);
    }
  };

  // ── Student Register ──
  const handleStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim() || !className.trim() || !schoolName.trim() || !wardCommune.trim() || !username.trim() || !password.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ cả 6 trường thông tin yêu cầu!');
      return;
    }

    if (password.trim().length < 4) {
      setErrorMsg('Mật khẩu phải có ít nhất 4 ký tự!');
      return;
    }

    const res = await registerStudent({ fullName, className, schoolName, wardCommune, username, password });
    if (res.success && res.student) {
      setSuccessMsg(res.message);
      setTimeout(() => onStudentLogin(res.student!), 800);
    } else {
      setErrorMsg(res.message);
    }
  };

  // ── Teacher Login ──
  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!teacherPin.trim()) {
      setErrorMsg('Vui lòng nhập mã PIN quản trị!');
      return;
    }

    const res = await loginTeacher(teacherPin);
    if (res.success) {
      setSuccessMsg(res.message);
      setTimeout(() => onTeacherLogin(), 800);
    } else {
      setErrorMsg(res.message);
    }
  };

  // ── Input component ──
  const InputField = ({ icon: Icon, label, value, onChange, type = 'text', placeholder }: {
    icon: React.ElementType; label: string; value: string;
    onChange: (v: string) => void; type?: string; placeholder: string;
  }) => (
    <div className="space-y-1.5">
      <label className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-cyan-400" /> {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm font-semibold text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-indigo-500 selection:text-white">

      {/* ═══ Background Effects ═══ */}
      <div className={`fixed -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[160px] pointer-events-none transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`fixed top-1/3 -right-40 w-[500px] h-[500px] bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none transition-opacity duration-1000 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`fixed -bottom-40 left-1/3 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none transition-opacity duration-1000 delay-400 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />

      {/* ═══ Floating particles ═══ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-indigo-400/30 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
              animation: `float ${4 + i}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* ═══ Branding Header ═══ */}
      <div className={`text-center mb-8 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}>
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-cyan-500 to-purple-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/30 font-black text-xl">
            E9
          </div>
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              ENGLISH MASTER <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">9</span>
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-400">
              Gia Sư Tiếng Anh Lớp 9 • SGK Global Success
            </p>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 font-medium flex items-center justify-center gap-1.5">
          <Sparkles className="w-3 h-3 text-cyan-500" />
          Created by Mrs Nhân — THCS Chu Văn An, Đắk Hà
        </p>
      </div>

      {/* ═══ Main Login Card ═══ */}
      <div className={`w-full max-w-md transition-all duration-500 ${cardVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95'}`}>
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-800/80 shadow-2xl shadow-indigo-500/5 overflow-hidden">

          {/* ─── Role Selection Screen ─── */}
          {selectedRole === null && (
            <div className="p-6 sm:p-8">
              <h2 className="text-center text-lg font-black text-white mb-2">Chào mừng bạn đến lớp học!</h2>
              <p className="text-center text-xs text-slate-400 mb-8 font-medium">Vui lòng chọn vai trò của bạn để bắt đầu</p>

              <div className="grid grid-cols-2 gap-4">
                {/* Student Role Card */}
                <button
                  onClick={() => { setSelectedRole('student'); resetForm(); }}
                  className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 hover:from-indigo-600/20 hover:to-cyan-600/10 border border-slate-700/60 hover:border-indigo-500/50 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-indigo-500/10 active:scale-[0.98]"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-black text-white text-sm mb-1">HỌC SINH</h3>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Đăng nhập hoặc đăng ký tài khoản học tập mới</p>
                </button>

                {/* Teacher Role Card */}
                <button
                  onClick={() => { setSelectedRole('teacher'); resetForm(); }}
                  className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 hover:from-emerald-600/20 hover:to-teal-600/10 border border-slate-700/60 hover:border-emerald-500/50 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-emerald-500/10 active:scale-[0.98]"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                    <ShieldCheck className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-black text-white text-sm mb-1">GIÁO VIÊN</h3>
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Đăng nhập quản trị bằng mã PIN giáo viên</p>
                </button>
              </div>
            </div>
          )}

          {/* ─── Student Login / Register ─── */}
          {selectedRole === 'student' && (
            <>
              {/* Header with back button */}
              <div className="bg-slate-950/60 p-4 border-b border-slate-800/80 flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors"
                  aria-label="Quay lại chọn vai trò"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-md">
                    <GraduationCap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-white leading-tight">ĐĂNG NHẬP HỌC SINH</h3>
                    <p className="text-[10px] font-semibold text-cyan-400">English Master 9 • Mrs Nhân Đắk Hà</p>
                  </div>
                </div>
              </div>

              {/* Tab Switcher */}
              <div className="px-4 pt-4 pb-2 flex gap-2">
                <button
                  onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all border ${
                    activeTab === 'login'
                      ? 'bg-indigo-600 text-white border-indigo-400/60 shadow-md shadow-indigo-500/20'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  🔑 Đăng Nhập
                </button>
                <button
                  onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
                  className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all border ${
                    activeTab === 'register'
                      ? 'bg-indigo-600 text-white border-indigo-400/60 shadow-md shadow-indigo-500/20'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  📝 Đăng Ký Mới
                </button>
              </div>

              {/* Notifications */}
              {errorMsg && (
                <div className="mx-4 mt-2 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold rounded-xl flex items-center gap-2">
                  ⚠️ {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="mx-4 mt-2 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-2">
                  ✅ {successMsg}
                </div>
              )}

              {/* Login Form */}
              {activeTab === 'login' ? (
                <form onSubmit={handleStudentLogin} className="p-5 space-y-4">
                  <InputField icon={User} label="Tên đăng nhập:" value={username} onChange={setUsername} placeholder="Ví dụ: vanminh9a1" />

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-cyan-400" /> Mật khẩu:
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu..."
                        className="w-full p-3 pr-11 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm font-semibold text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                        aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-black rounded-xl text-sm shadow-lg shadow-indigo-500/20 transition-all border border-indigo-400/30 active:scale-[0.98]"
                  >
                    VÀO HỌC NGAY 🚀
                  </button>

                  <p className="text-center text-[10px] text-slate-500 font-medium">
                    Chưa có tài khoản?{' '}
                    <button
                      type="button"
                      onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
                      className="text-cyan-400 hover:text-cyan-300 font-bold underline underline-offset-2"
                    >
                      Đăng ký ngay
                    </button>
                  </p>
                </form>
              ) : (
                /* Register Form */
                <form onSubmit={handleStudentRegister} className="p-5 space-y-3 max-h-[60vh] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
                  <InputField icon={UserCheck} label="Họ và tên học sinh:" value={fullName} onChange={setFullName} placeholder="Ví dụ: Nguyễn Văn Minh" />

                  <div className="grid grid-cols-2 gap-3">
                    <InputField icon={BookOpen} label="Lớp:" value={className} onChange={setClassName} placeholder="9A1" />
                    <InputField icon={School} label="Trường THCS:" value={schoolName} onChange={setSchoolName} placeholder="THCS Chu Văn An" />
                  </div>

                  <InputField icon={MapPin} label="Xã / Thị trấn:" value={wardCommune} onChange={setWardCommune} placeholder="Thị trấn Đắk Hà" />

                  <div className="grid grid-cols-2 gap-3">
                    <InputField icon={User} label="Tên đăng nhập:" value={username} onChange={setUsername} placeholder="vanminh9a1" />
                    <div className="space-y-1.5">
                      <label className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-cyan-400" /> Mật khẩu:
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Tối thiểu 4 ký tự"
                          className="w-full p-3 pr-10 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm font-semibold text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                          aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-black rounded-xl text-sm shadow-lg shadow-indigo-500/20 transition-all border border-indigo-400/30 active:scale-[0.98] mt-1"
                  >
                    HOÀN TẤT ĐĂNG KÝ ✨
                  </button>

                  <p className="text-center text-[10px] text-slate-500 font-medium">
                    Đã có tài khoản?{' '}
                    <button
                      type="button"
                      onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
                      className="text-cyan-400 hover:text-cyan-300 font-bold underline underline-offset-2"
                    >
                      Đăng nhập
                    </button>
                  </p>
                </form>
              )}
            </>
          )}

          {/* ─── Teacher Login ─── */}
          {selectedRole === 'teacher' && (
            <>
              {/* Header with back button */}
              <div className="bg-slate-950/60 p-4 border-b border-slate-800/80 flex items-center gap-3">
                <button
                  onClick={handleBack}
                  className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-colors"
                  aria-label="Quay lại chọn vai trò"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-white leading-tight">ĐĂNG NHẬP GIÁO VIÊN</h3>
                    <p className="text-[10px] font-semibold text-emerald-400">Cổng quản trị dành cho Giáo viên</p>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              {errorMsg && (
                <div className="mx-4 mt-4 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold rounded-xl flex items-center gap-2">
                  ⚠️ {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="mx-4 mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold rounded-xl flex items-center gap-2">
                  ✅ {successMsg}
                </div>
              )}

              {/* Teacher PIN Form */}
              <form onSubmit={handleTeacherLogin} className="p-6 space-y-5">
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 text-center">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <ShieldCheck className="w-7 h-7 text-white" />
                  </div>
                  <p className="text-xs text-emerald-300/80 font-semibold leading-relaxed">
                    Cổng quản trị dành riêng cho Giáo viên.<br />
                    Vui lòng nhập mã PIN được cấp để đăng nhập.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" /> Mã PIN quản trị:
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={teacherPin}
                      onChange={(e) => setTeacherPin(e.target.value)}
                      placeholder="Nhập mã PIN..."
                      className="w-full p-3.5 pr-11 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm font-bold text-white text-center tracking-widest placeholder:text-slate-600 placeholder:tracking-normal focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                      autoComplete="off"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      aria-label={showPassword ? 'Ẩn mã PIN' : 'Hiện mã PIN'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black rounded-xl text-sm shadow-lg shadow-emerald-500/20 transition-all border border-emerald-400/30 active:scale-[0.98]"
                >
                  ĐĂNG NHẬP QUẢN TRỊ 🛡️
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer branding */}
        <p className="text-center text-[10px] text-slate-600 font-medium mt-6">
          🦉 English Master 9 • Bám sát 12 Unit SGK Global Success • Powered by Gemini AI
        </p>
      </div>

      {/* ═══ CSS Keyframes ═══ */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) scale(1); opacity: 0.3; }
          100% { transform: translateY(-30px) scale(1.5); opacity: 0.1; }
        }
      `}</style>
    </div>
  );
};
