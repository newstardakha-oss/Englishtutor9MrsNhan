import React from 'react';
import { BookOpen, Bot, Award, Sparkles, AlertCircle, FileText, Zap, Volume2, VolumeX, Swords } from 'lucide-react';

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
    { id: 'chat', label: 'Gia Sư AI Chat', icon: Bot, badge: 'Tương tác' },
    { id: 'sgk', label: '12 Unit SGK 9', icon: BookOpen, badge: 'Global Success' },
    { id: 'grammar', label: 'Ngữ Pháp & Bẫy Đề', icon: Zap, badge: 'Trọng tâm' },
    { id: 'flashcards', label: 'Từ Vựng Vocab Master', icon: Sparkles, badge: '430 Từ' },
    { id: 'vocab-game', label: 'Game Đấu Trường', icon: Swords, badge: 'HOT 🔥' },
    { id: 'exam', label: 'Thi Vào 10', icon: Award, badge: 'Đề thi thử' },
    { id: 'writing', label: 'Chấm Bài Viết & Nói', icon: FileText, badge: '#SUAVIET' },
    { id: 'diagnostic', label: 'Phát Hiện Lỗ Hổng', icon: AlertCircle, badge: '#LOHONG' },
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              SGK Global Success 9
            </span>
            <span>Gia Sư Tiếng Anh Lớp 9 - Định Hướng Ôn Thi Vào Lớp 10 THPT</span>
          </div>
          <div className="flex items-center gap-4 text-slate-200">
            <div className="flex items-center gap-1">
              <span className="text-slate-400">Đang học:</span>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(Number(e.target.value))}
                className="bg-slate-800 text-amber-300 font-semibold text-xs px-2 py-0.5 rounded border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer"
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
              title={ttsEnabled ? "Tắt đọc âm thanh tự động" : "Bật đọc âm thanh tự động"}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs transition-colors ${
                ttsEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {ttsEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{ttsEnabled ? 'Âm thanh: Bật' : 'Âm thanh: Tắt'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center font-black text-xl text-white shadow-inner">
            E9
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight text-white flex items-center gap-1.5">
              GIA SƯ TIẾNG ANH 9
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30">
                AI Socratic
              </span>
            </h1>
            <p className="text-xs text-slate-400">Nền Tảng Vững Chắc • Tự Tin Thi Vào 10</p>
          </div>
        </div>

        {/* Tab Buttons */}
        <nav className="flex items-center gap-1 shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider ${
                      isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
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
