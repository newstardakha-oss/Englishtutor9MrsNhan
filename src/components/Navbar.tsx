import React, { useState } from 'react';
import {
  BookOpen, Bot, Award, Sparkles, AlertCircle, FileText, Zap, Volume2, VolumeX,
  Swords, Menu, X, ChevronRight, User, ShieldCheck, Trophy, LogOut, Flame, Star, Target, Settings
} from 'lucide-react';
import { StudentProfile } from '../types';
import { hasStoredApiKey } from '../utils/apiKeyManager';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedUnit: number;
  setSelectedUnit: (unit: number) => void;
  ttsEnabled: boolean;
  setTtsEnabled: (enabled: boolean) => void;
  currentStudent: StudentProfile | null;
  onOpenAuthModal: () => void;
  onOpenLeaderboardModal: () => void;
  onOpenTeacherAdminPortal: () => void;
  onOpenApiKeyModal: () => void;
  onLogoutStudent: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedUnit,
  setSelectedUnit,
  ttsEnabled,
  setTtsEnabled,
  currentStudent,
  onOpenAuthModal,
  onOpenLeaderboardModal,
  onOpenTeacherAdminPortal,
  onOpenApiKeyModal,
  onLogoutStudent,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    {
      id: 'chat',
      label: 'Gia Sư AI Chat',
      desc: 'Hỏi đáp Socratic 24/7',
      emoji: '🤖',
      icon: Bot,
      activeGradient: 'from-indigo-600 via-blue-600 to-cyan-500',
      activeShadow: 'shadow-[0_4px_16px_rgba(79,70,229,0.4)]',
      badge: 'Socratic AI',
      badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
    },
    {
      id: 'sgk',
      label: '12 Unit SGK 9',
      desc: 'Global Success BGD',
      emoji: '📘',
      icon: BookOpen,
      activeGradient: 'from-emerald-600 via-teal-600 to-cyan-600',
      activeShadow: 'shadow-[0_4px_16px_rgba(16,185,129,0.4)]',
      badge: 'Chủ Đề SGK',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'grammar',
      label: 'Ngữ Pháp Bẫy Đề',
      desc: 'Chuyên đề thi vào 10',
      emoji: '⚡',
      icon: Zap,
      activeGradient: 'from-amber-600 via-orange-600 to-red-500',
      activeShadow: 'shadow-[0_4px_16px_rgba(245,158,11,0.4)]',
      badge: 'Trọng Tâm',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    {
      id: 'flashcards',
      label: 'Từ Vựng Vocab Master',
      desc: '430 từ vựng & 4 chế độ',
      emoji: '🎴',
      icon: Sparkles,
      activeGradient: 'from-purple-600 via-pink-600 to-rose-500',
      activeShadow: 'shadow-[0_4px_16px_rgba(168,85,247,0.4)]',
      badge: '430 Từ',
      badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    },
    {
      id: 'vocab-game',
      label: 'Đấu Trường Game',
      desc: 'Speed Quiz & Đánh Boss',
      emoji: '⚔️',
      icon: Swords,
      activeGradient: 'from-violet-600 via-indigo-600 to-blue-600',
      activeShadow: 'shadow-[0_4px_16px_rgba(124,58,237,0.4)]',
      badge: 'HOT 🔥',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    },
    {
      id: 'exam',
      label: 'Thi Vào 10 THPT',
      desc: 'Đề chuẩn BGD 60 phút',
      emoji: '🏆',
      icon: Award,
      activeGradient: 'from-amber-500 via-yellow-500 to-orange-500',
      activeShadow: 'shadow-[0_4px_16px_rgba(245,158,11,0.4)]',
      badge: 'Đề Thi 10',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    {
      id: 'writing',
      label: 'Chấm Bài Viết & Nói AI',
      desc: '#SUAVIET & Phát Âm IPA',
      emoji: '✍️',
      icon: FileText,
      activeGradient: 'from-blue-600 via-cyan-600 to-teal-500',
      activeShadow: 'shadow-[0_4px_16px_rgba(6,182,212,0.4)]',
      badge: '#SUAVIET',
      badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    },
    {
      id: 'diagnostic',
      label: 'Chẩn Đoán Lỗ Hổng',
      desc: '#LOHONG kiến thức 9',
      emoji: '🔍',
      icon: AlertCircle,
      activeGradient: 'from-rose-600 via-red-600 to-orange-500',
      activeShadow: 'shadow-[0_4px_16px_rgba(244,63,94,0.4)]',
      badge: '#LOHONG',
      badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30'
    },
  ];

  return (
    <>
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setMobileMenuOpen(false)} 
        />
      )}
      {/* Mobile Top Header Bar */}
      <div className="lg:hidden bg-slate-900/95 backdrop-blur-md border-b border-slate-800 p-3 sticky top-0 z-50 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-cyan-400 to-emerald-400 p-0.5 shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-base font-black text-cyan-400">
              E9
            </div>
          </div>
          <div>
            <h1 className="font-black text-sm text-white flex items-center gap-1.5">
              ENGLISH MASTER 9
              <span className="text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold px-1.5 py-0.2 rounded-full">
                GS9
              </span>
            </h1>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-transform"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-rose-400" /> : <Menu className="w-5 h-5 text-cyan-400" />}
          <span>{mobileMenuOpen ? 'Đóng' : 'Menu'}</span>
        </button>
      </div>

      {/* Vertical Sleek EdTech Sidebar */}
      <aside
        className={`bg-slate-900 border-r border-slate-800/80 p-4 justify-between z-50 overflow-y-auto no-scrollbar shadow-xl ${
          mobileMenuOpen
            ? 'fixed inset-y-0 left-0 h-screen w-72 max-w-[85vw] flex flex-col transition-all duration-300 translate-x-0'
            : 'hidden lg:flex lg:flex-col lg:sticky top-0 left-0 h-screen w-72'
        }`}
      >
        <div className="space-y-4">
          {/* Brand Header */}
          <div className="bg-gradient-to-br from-slate-950 to-indigo-950/80 p-3.5 rounded-2xl border border-indigo-500/30 shadow-lg flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-500 via-cyan-400 to-emerald-400 p-0.5 shadow-md shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black text-lg text-cyan-400">
                E9
              </div>
            </div>
            <div>
              <h1 className="font-black text-base text-white tracking-tight flex items-center gap-1.5">
                ENGLISH MASTER 9
              </h1>
              <p className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1">
                <Target className="w-3 h-3" /> Ôn Thi Vào 10 THPT
              </p>
            </div>
          </div>

          {/* Student Profile Card */}
          <div className="space-y-2">
            {currentStudent ? (
              <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white p-3 rounded-2xl border border-indigo-500/40 shadow-md space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-black text-cyan-300 text-sm">
                      👤
                    </div>
                    <div>
                      <p className="font-black text-xs text-white">{currentStudent.fullName}</p>
                      <p className="text-[10px] text-slate-400">{currentStudent.className} • {currentStudent.schoolName}</p>
                    </div>
                  </div>
                  <button
                    onClick={onLogoutStudent}
                    title="Đăng xuất tài khoản"
                    className="p-1.5 bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 rounded-lg text-slate-400 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-slate-950/60 p-2 rounded-xl border border-slate-800 font-mono">
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Flame className="w-3.5 h-3.5 text-orange-500" />
                    <span>{currentStudent.totalStudyMinutes} phút học</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400 font-bold justify-end">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span>{currentStudent.examHighestScore}đ Thi 10</span>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black rounded-2xl text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 border border-indigo-400/30"
              >
                <User className="w-4 h-4 text-cyan-300" />
                <span>ĐĂNG NHẬP / ĐĂNG KÝ HỌC SINH</span>
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onOpenLeaderboardModal}
                className="py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold rounded-xl text-xs border border-amber-500/30 flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trophy className="w-3.5 h-3.5" /> Bảng Vàng
              </button>
              <button
                onClick={onOpenTeacherAdminPortal}
                className="py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold rounded-xl text-xs border border-cyan-500/30 flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Quản Trị GV
              </button>
            </div>
          </div>

          {/* Unit Selector & Audio Toggle */}
          <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300">Bài học SGK:</span>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(Number(e.target.value))}
                className="bg-indigo-950 text-cyan-300 font-black text-xs px-2.5 py-1 rounded-xl border border-indigo-500/50 outline-none cursor-pointer"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((u) => (
                  <option key={u} value={u}>
                    Unit {u}: SGK 9
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-1.5 border-t border-slate-800">
              <span className="font-medium text-slate-400">Giọng đọc AI:</span>
              <button
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all border ${
                  ttsEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {ttsEnabled ? '🔊 Bật âm thanh' : '🔇 Tắt âm thanh'}
              </button>
            </div>

            <button
              onClick={() => { onOpenApiKeyModal(); setMobileMenuOpen(false); }}
              className={`w-full flex items-center justify-between pt-1.5 border-t border-slate-800 px-0.5 py-1.5 rounded-lg transition-colors hover:bg-slate-800/50 ${
                hasStoredApiKey() ? 'text-emerald-300' : 'text-rose-300'
              }`}
            >
              <span className="font-medium text-slate-400 flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5" /> Cài đặt API:
              </span>
              <span className={`px-2 py-0.5 rounded-lg text-[11px] font-bold border ${
                hasStoredApiKey()
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
              }`}>
                {hasStoredApiKey() ? '✓ Đã có Key' : '⚠ Chưa có Key'}
              </span>
            </button>
          </div>

          {/* Navigation List */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
              <span>Danh Mục Học Tập</span>
              <span className="text-cyan-400">8 Tính Năng</span>
            </p>

            <nav className="space-y-1.5">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-between border cursor-pointer active:scale-98 ${
                      isActive
                        ? `bg-gradient-to-r ${tab.activeGradient} text-white border-white/40 ${tab.activeShadow} translate-x-1`
                        : `bg-slate-950/40 text-slate-300 border-slate-800/80 hover:bg-slate-800 hover:text-white hover:border-slate-700`
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg leading-none">{tab.emoji}</span>
                      <div className="text-left">
                        <div className="leading-tight font-extrabold">{tab.label}</div>
                        <div className={`text-[10px] ${isActive ? 'text-white/80' : 'text-slate-500'}`}>{tab.desc}</div>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-600'}`} />
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer Credit */}
        <div className="pt-3 border-t border-slate-800 text-center">
          <div className="bg-slate-950 text-slate-400 font-semibold text-[10px] px-3 py-1.5 rounded-xl border border-slate-800 inline-block">
            🏆 Created by Mrs Nhan DakHa • SGK Global Success 9
          </div>
        </div>
      </aside>
    </>
  );
};
