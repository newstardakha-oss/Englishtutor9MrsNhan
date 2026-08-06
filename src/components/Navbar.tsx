import React, { useState } from 'react';
import { BookOpen, Bot, Award, Sparkles, AlertCircle, FileText, Zap, Volume2, VolumeX, Swords, Menu, X, ChevronRight } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedUnit: number;
  setSelectedUnit: (unit: number) => void;
  ttsEnabled: boolean;
  setTtsEnabled: (enabled: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedUnit,
  setSelectedUnit,
  ttsEnabled,
  setTtsEnabled,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    {
      id: 'chat',
      label: 'Gia Sư AI Chat',
      emoji: '🤖',
      icon: Bot,
      activeGradient: 'from-blue-500 via-sky-400 to-blue-600',
      activeShadow: 'shadow-[0_6px_0_#1d4ed8]',
      inactiveBorder: 'border-blue-200 hover:border-blue-400',
      badge: 'AI Chibi',
      badgeBg: 'bg-blue-100 text-blue-900 border-blue-200'
    },
    {
      id: 'sgk',
      label: '12 Unit SGK 9',
      emoji: '📘',
      icon: BookOpen,
      activeGradient: 'from-emerald-500 via-teal-400 to-emerald-600',
      activeShadow: 'shadow-[0_6px_0_#0f766e]',
      inactiveBorder: 'border-emerald-200 hover:border-emerald-400',
      badge: 'Global Success',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-200'
    },
    {
      id: 'grammar',
      label: 'Ngữ Pháp Bẫy Đề',
      emoji: '⚡',
      icon: Zap,
      activeGradient: 'from-amber-500 via-orange-400 to-amber-600',
      activeShadow: 'shadow-[0_6px_0_#c2410c]',
      inactiveBorder: 'border-amber-200 hover:border-amber-400',
      badge: 'Trọng Tâm',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-200'
    },
    {
      id: 'flashcards',
      label: 'Từ Vựng Vocab Master',
      emoji: '🎴',
      icon: Sparkles,
      activeGradient: 'from-rose-500 via-pink-400 to-rose-600',
      activeShadow: 'shadow-[0_6px_0_#be123c]',
      inactiveBorder: 'border-rose-200 hover:border-rose-400',
      badge: '430 Từ',
      badgeBg: 'bg-rose-100 text-rose-900 border-rose-200'
    },
    {
      id: 'vocab-game',
      label: 'Game Đấu Trường',
      emoji: '⚔️',
      icon: Swords,
      activeGradient: 'from-purple-600 via-indigo-500 to-purple-700',
      activeShadow: 'shadow-[0_6px_0_#4338ca]',
      inactiveBorder: 'border-purple-200 hover:border-purple-400',
      badge: 'HOT 🔥',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300'
    },
    {
      id: 'exam',
      label: 'Thi Vào 10',
      emoji: '🏆',
      icon: Award,
      activeGradient: 'from-amber-500 via-yellow-400 to-amber-600',
      activeShadow: 'shadow-[0_6px_0_#b45309]',
      inactiveBorder: 'border-yellow-200 hover:border-yellow-400',
      badge: 'Đề Thi',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-200'
    },
    {
      id: 'writing',
      label: 'Chấm Bài Viết',
      emoji: '✍️',
      icon: FileText,
      activeGradient: 'from-indigo-600 via-purple-500 to-indigo-700',
      activeShadow: 'shadow-[0_6px_0_#6b21a8]',
      inactiveBorder: 'border-indigo-200 hover:border-indigo-400',
      badge: '#SUAVIET',
      badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-200'
    },
    {
      id: 'diagnostic',
      label: 'Lỗ Hổng Kiến Thức',
      emoji: '🔍',
      icon: AlertCircle,
      activeGradient: 'from-red-500 via-rose-400 to-red-600',
      activeShadow: 'shadow-[0_6px_0_#b91c1c]',
      inactiveBorder: 'border-red-200 hover:border-red-400',
      badge: '#LOHONG',
      badgeBg: 'bg-red-100 text-red-900 border-red-200'
    },
  ];

  return (
    <>
      {/* Mobile Top Header Bar */}
      <div className="lg:hidden bg-gradient-to-r from-amber-50/90 via-pink-50/90 to-sky-50/90 backdrop-blur-md border-b-2 border-amber-200/80 p-3 sticky top-0 z-50 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 via-pink-400 to-indigo-500 p-0.5 shadow-[0_3px_0_#d97706]">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center text-lg">
              🦉
            </div>
          </div>
          <div>
            <h1 className="font-black text-sm text-slate-800 flex items-center gap-1">
              GIA SƯ CHIBI 9 <span className="text-[9px] bg-amber-300 text-amber-950 font-black px-1.5 py-0.2 rounded-full">AI</span>
            </h1>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-white border-2 border-amber-300 rounded-xl text-slate-800 shadow-[0_3px_0_#fde68a] font-black text-xs flex items-center gap-1 active:translate-y-0.5"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-rose-500" /> : <Menu className="w-5 h-5 text-indigo-600" />}
          <span>{mobileMenuOpen ? 'Đóng' : 'Menu Tabs'}</span>
        </button>
      </div>

      {/* Vertical 3D Box Sidebar Navigation Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-gradient-to-b from-[#fffbf2]/95 via-[#fef5f9]/95 to-[#f2f7ff]/95 backdrop-blur-md border-r-2 border-amber-200/90 p-4 flex flex-col justify-between z-50 transition-transform duration-300 overflow-y-auto ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-4">
          {/* Brand Chibi Mascot 3D Box Header */}
          <div className="bg-gradient-to-b from-white to-amber-50 p-3.5 rounded-3xl border-2 border-amber-300 shadow-[0_5px_0_#fcd34d] flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-400 to-indigo-500 p-0.5 shadow-[0_3px_0_#d97706] shrink-0 hover:scale-105 transition-transform">
              <div className="w-full h-full bg-amber-50 rounded-[14px] flex items-center justify-center font-black text-2xl">
                🦉
              </div>
            </div>
            <div>
              <h1 className="font-black text-base text-slate-800 tracking-tight flex items-center gap-1">
                GIA SƯ CHIBI 9
                <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded-full uppercase">
                  SOCRATIC
                </span>
              </h1>
              <p className="text-[11px] text-pink-600 font-bold">✨ Học vui say mê • Thi vào 10 ✨</p>
            </div>
          </div>

          {/* Unit Selector & Sound 3D Box Controls */}
          <div className="bg-white p-3 rounded-2xl border-2 border-amber-200 shadow-[0_4px_0_#fde68a] space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700">Bài học SGK:</span>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(Number(e.target.value))}
                className="bg-indigo-600 text-amber-300 font-black text-xs px-2.5 py-1 rounded-xl border-2 border-indigo-400 shadow-[0_2px_0_#3730a3] outline-none cursor-pointer"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((u) => (
                  <option key={u} value={u}>
                    Unit {u}: SGK 9
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
              <span className="font-medium text-slate-600">Giọng đọc AI:</span>
              <button
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`px-3 py-1 rounded-xl text-[11px] font-black transition-all border-2 ${
                  ttsEnabled
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_2.5px_0_#047857]'
                    : 'bg-slate-100 text-slate-600 border-slate-300 shadow-[0_2px_0_#cbd5e1]'
                }`}
              >
                {ttsEnabled ? '🔊 Bật âm thanh' : '🔇 Tắt âm thanh'}
              </button>
            </div>
          </div>

          {/* 3D Tactile Hộp Tabs Navigation List */}
          <div className="space-y-2">
            <p className="text-[11px] font-black uppercase tracking-wider text-amber-900/70 px-1 flex items-center justify-between">
              <span>Danh Mục Tính Năng (Tabs)</span>
              <span className="text-[10px] text-pink-600 font-bold">8 Hộp 3D</span>
            </p>

            <nav className="space-y-2.5">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full p-3 rounded-2xl text-xs font-black transition-all flex items-center justify-between border-2 cursor-pointer active:translate-y-1 active:shadow-none ${
                      isActive
                        ? `bg-gradient-to-r ${tab.activeGradient} text-white border-white/90 ${tab.activeShadow} translate-y-[-2px] ring-2 ring-amber-300/80`
                        : `bg-gradient-to-b from-white via-amber-50/40 to-slate-50 text-slate-800 ${tab.inactiveBorder} shadow-[0_5px_0_#cbd5e1] hover:shadow-[0_7px_0_#94a3b8] hover:translate-y-[-2px]`
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl leading-none drop-shadow-xs">{tab.emoji}</span>
                      <span className="tracking-tight text-left leading-tight">{tab.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {tab.badge && (
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border ${
                            isActive
                              ? 'bg-amber-300 text-slate-950 border-amber-400 shadow-xs'
                              : tab.badgeBg
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* 3D Sidebar Footer Badge */}
        <div className="pt-3 border-t border-amber-200/80 text-center">
          <div className="bg-amber-100/90 text-amber-950 font-black text-[10px] px-3 py-1.5 rounded-2xl border-2 border-amber-300 shadow-[0_2.5px_0_#fcd34d] inline-block">
            🎀 Created by Mrs Nhan DakHa • Lớp 9 Global Success
          </div>
        </div>
      </aside>
    </>
  );
};
