import React from 'react';
import { BookOpen, Bot, Award, Sparkles, AlertCircle, FileText, Zap, Volume2, VolumeX, Swords, Heart } from 'lucide-react';

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
  const tabs = [
    { id: 'chat', label: 'Gia Sư AI Chat', emoji: '🤖', icon: Bot, color: 'from-sky-400 to-blue-600', activeShadow: 'shadow-[0_4px_0_#1d4ed8]', badge: 'AI Chibi' },
    { id: 'sgk', label: '12 Unit SGK 9', emoji: '📘', icon: BookOpen, color: 'from-emerald-400 to-teal-600', activeShadow: 'shadow-[0_4px_0_#0f766e]', badge: 'Global Success' },
    { id: 'grammar', label: 'Ngữ Pháp Bẫy Đề', emoji: '⚡', icon: Zap, color: 'from-amber-400 to-orange-500', activeShadow: 'shadow-[0_4px_0_#c2410c]', badge: 'Trọng tâm' },
    { id: 'flashcards', label: 'Từ Vựng Flashcard', emoji: '🎴', icon: Sparkles, color: 'from-pink-400 to-rose-600', activeShadow: 'shadow-[0_4px_0_#be123c]', badge: '430 Từ' },
    { id: 'vocab-game', label: 'Game Đấu Trường', emoji: '⚔️', icon: Swords, color: 'from-purple-400 to-indigo-600', activeShadow: 'shadow-[0_4px_0_#4338ca]', badge: 'HOT 🔥' },
    { id: 'exam', label: 'Thi Vào 10', emoji: '🏆', icon: Award, color: 'from-yellow-400 to-amber-600', activeShadow: 'shadow-[0_4px_0_#b45309]', badge: 'Đề Thi' },
    { id: 'writing', label: 'Chấm Bài Viết', emoji: '✍️', icon: FileText, color: 'from-indigo-400 to-purple-600', activeShadow: 'shadow-[0_4px_0_#6b21a8]', badge: '#SUAVIET' },
    { id: 'diagnostic', label: 'Lỗ Hổng Kiến Thức', emoji: '🔍', icon: AlertCircle, color: 'from-rose-400 to-red-600', activeShadow: 'shadow-[0_4px_0_#b91c1c]', badge: '#LOHONG' },
  ];

  return (
    <header className="bg-slate-900 text-white border-b-2 border-slate-800 sticky top-0 z-50 shadow-xl backdrop-blur-md">
      {/* Top Playful Chibi Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-xs py-1.5 px-4 border-b border-indigo-700/50">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-bold text-slate-100">
            <span className="bg-amber-300 text-slate-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
              ✨ SGK GLOBAL SUCCESS 9 ✨
            </span>
            <span className="hidden sm:inline text-pink-200">Gia Sư AI Chibi Dễ Thương • Định Hướng Ôn Thi Vào Lớp 10 THPT</span>
          </div>

          <div className="flex items-center gap-3 text-slate-200 text-xs">
            <div className="flex items-center gap-1.5 bg-slate-900/80 px-2.5 py-1 rounded-xl border border-slate-700">
              <span className="text-slate-400 font-medium">Đang học:</span>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(Number(e.target.value))}
                className="bg-indigo-600 text-amber-300 font-bold text-xs px-2 py-0.5 rounded-lg border border-indigo-400/40 outline-none cursor-pointer"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((u) => (
                  <option key={u} value={u}>
                    Unit {u}: SGK Tiếng Anh 9
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all border shadow-xs ${
                ttsEnabled
                  ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_2px_0_#047857]'
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
              }`}
            >
              {ttsEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-200" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{ttsEnabled ? 'Âm thanh: Bật' : 'Âm thanh: Tắt'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
        {/* Chibi Mascot Brand Header */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 via-pink-500 to-indigo-500 p-0.5 shadow-[0_4px_0_#4338ca] hover:scale-105 transition-transform cursor-pointer">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-black text-2xl text-amber-300">
              🦉
            </div>
          </div>

          <div>
            <h1 className="font-black text-base leading-tight text-white flex items-center gap-1.5 tracking-tight">
              GIA SƯ CHIBI 9
              <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                AI SOCRATIC
              </span>
            </h1>
            <p className="text-[11px] text-pink-300 font-medium">Học vui say mê • Tự tin bứt phá Lớp 10 ✨</p>
          </div>
        </div>

        {/* 3D Tactile Tab Buttons */}
        <nav className="flex items-center gap-2 shrink-0 py-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 border-2 cursor-pointer active:translate-y-1 active:shadow-none ${
                  isActive
                    ? `bg-gradient-to-r ${tab.color} text-white border-white/60 ${tab.activeShadow} translate-y-[-2px] ring-2 ring-amber-300/60`
                    : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-800 hover:border-slate-500 hover:text-white shadow-[0_3px_0_#1e293b]'
                }`}
              >
                <span className="text-base leading-none">{tab.emoji}</span>
                <span className="tracking-tight">{tab.label}</span>

                {tab.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider ${
                      isActive
                        ? 'bg-amber-300 text-slate-950 shadow-xs'
                        : 'bg-slate-950/60 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
