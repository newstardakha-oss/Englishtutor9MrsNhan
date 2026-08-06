import React, { useState } from 'react';
import { BookOpen, Bot, Award, Sparkles, AlertCircle, FileText, Zap, Volume2, VolumeX, Swords, Heart, Menu, X, ChevronRight } from 'lucide-react';

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
    { id: 'chat', label: 'Gia Sư AI Chat', emoji: '🤖', icon: Bot, color: 'from-sky-400 to-blue-500', shadow: 'shadow-[0_4px_0_#0284c7]', badge: 'AI Chibi' },
    { id: 'sgk', label: '12 Unit SGK 9', emoji: '📘', icon: BookOpen, color: 'from-emerald-400 to-teal-500', shadow: 'shadow-[0_4px_0_#0d9488]', badge: 'Global Success' },
    { id: 'grammar', label: 'Ngữ Pháp Bẫy Đề', emoji: '⚡', icon: Zap, color: 'from-amber-400 to-orange-500', shadow: 'shadow-[0_4px_0_#ea580c]', badge: 'Trọng Tâm' },
    { id: 'flashcards', label: 'Từ Vựng Vocab Master', emoji: '🎴', icon: Sparkles, color: 'from-pink-400 to-rose-500', shadow: 'shadow-[0_4px_0_#e11d48]', badge: '430 Từ' },
    { id: 'vocab-game', label: 'Game Đấu Trường', emoji: '⚔️', icon: Swords, color: 'from-purple-400 to-indigo-500', shadow: 'shadow-[0_4px_0_#6366f1]', badge: 'HOT 🔥' },
    { id: 'exam', label: 'Thi Vào 10', emoji: '🏆', icon: Award, color: 'from-yellow-400 to-amber-500', shadow: 'shadow-[0_4px_0_#d97706]', badge: 'Đề Thi' },
    { id: 'writing', label: 'Chấm Bài Viết', emoji: '✍️', icon: FileText, color: 'from-indigo-400 to-purple-500', shadow: 'shadow-[0_4px_0_#9333ea]', badge: '#SUAVIET' },
    { id: 'diagnostic', label: 'Lỗ Hổng Kiến Thức', emoji: '🔍', icon: AlertCircle, color: 'from-rose-400 to-red-500', shadow: 'shadow-[0_4px_0_#dc2626]', badge: '#LOHONG' },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-amber-50/90 backdrop-blur-md border-b-2 border-amber-200/80 p-3 sticky top-0 z-50 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 via-pink-400 to-indigo-400 p-0.5 shadow-[0_2px_0_#d97706]">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center text-lg">
              🦉
            </div>
          </div>
          <div>
            <h1 className="font-black text-sm text-slate-800 flex items-center gap-1">
              GIA SƯ CHIBI 9 <span className="text-[9px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded-full">AI</span>
            </h1>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-white border-2 border-amber-200 rounded-xl text-slate-700 shadow-xs font-bold text-xs flex items-center gap-1"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-rose-500" /> : <Menu className="w-5 h-5 text-indigo-600" />}
          <span>{mobileMenuOpen ? 'Đóng' : 'Menu Tabs'}</span>
        </button>
      </div>

      {/* Vertical Sidebar Navigation Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-amber-50/95 backdrop-blur-md border-r-2 border-amber-200/80 p-4 flex flex-col justify-between z-50 transition-transform duration-300 overflow-y-auto ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-5">
          {/* Brand Chibi Mascot Header */}
          <div className="bg-white p-3.5 rounded-3xl border-2 border-amber-200 shadow-[0_4px_0_#fde68a] flex items-center gap-3">
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

          {/* Unit Selector & Sound Bar */}
          <div className="bg-white/80 p-3 rounded-2xl border border-amber-200/80 shadow-xs space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-600">Bài học SGK:</span>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(Number(e.target.value))}
                className="bg-indigo-600 text-amber-300 font-bold text-xs px-2.5 py-1 rounded-xl border border-indigo-400 outline-none cursor-pointer"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((u) => (
                  <option key={u} value={u}>
                    Unit {u}: SGK 9
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100">
              <span className="font-medium text-slate-500">Giọng đọc AI:</span>
              <button
                onClick={() => setTtsEnabled(!ttsEnabled)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all border ${
                  ttsEnabled
                    ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_2px_0_#047857]'
                    : 'bg-slate-100 text-slate-500 border-slate-200'
                }`}
              >
                {ttsEnabled ? '🔊 Bật âm thanh' : '🔇 Tắt âm thanh'}
              </button>
            </div>
          </div>

          {/* Vertical 3D Tactile Tab Buttons */}
          <div className="space-y-2">
            <p className="text-[11px] font-black uppercase tracking-wider text-slate-400 px-1">
              Danh Mục Tính Năng (Tabs)
            </p>

            <nav className="space-y-2">
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
                        ? `bg-gradient-to-r ${tab.color} text-white border-white/80 ${tab.shadow} translate-y-[-2px] ring-2 ring-amber-300/60`
                        : 'bg-white/90 text-slate-700 border-amber-200/60 hover:bg-amber-100/50 hover:border-amber-300 shadow-[0_3px_0_#fde68a]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl leading-none">{tab.emoji}</span>
                      <span className="tracking-tight text-left">{tab.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {tab.badge && (
                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider ${
                            isActive
                              ? 'bg-amber-300 text-slate-950 shadow-xs'
                              : 'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}
                        >
                          {tab.badge}
                        </span>
                      )}
                      <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Footer Badge */}
        <div className="pt-4 border-t border-amber-200/80 text-center">
          <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-3 py-1 rounded-full border border-amber-200 inline-block">
            🎀 Created by Mrs Nhan DakHa • Lớp 9 Global Success
          </span>
        </div>
      </aside>
    </>
  );
};
