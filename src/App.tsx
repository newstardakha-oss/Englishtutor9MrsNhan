import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { TutorChat } from './components/TutorChat';
import { UnitExplorer } from './components/UnitExplorer';
import { GrammarLab } from './components/GrammarLab';
import { FlashcardMode } from './components/FlashcardMode';
import { VocabBattleGame } from './components/VocabBattleGame';
import { ExamSimulator } from './components/ExamSimulator';
import { WritingSpeakingLab } from './components/WritingSpeakingLab';
import { DiagnosticStudio } from './components/DiagnosticStudio';
import { Heart, Sparkles, Star } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [selectedUnit, setSelectedUnit] = useState<number>(1);
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);

  const handleAskTutor = (query: string) => {
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fefcf6] via-[#f7f2fc] to-[#eef4ff] text-slate-800 flex font-sans selection:bg-pink-200 selection:text-pink-900 relative">
      {/* Decorative Chibi Pastel Background Blurs */}
      <div className="fixed top-12 left-64 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-12 right-12 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/2 right-1/3 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      {/* Left Vertical Pastel 3D Sidebar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedUnit={selectedUnit}
        setSelectedUnit={setSelectedUnit}
        ttsEnabled={ttsEnabled}
        setTtsEnabled={setTtsEnabled}
      />

      {/* Right Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
        {/* Top Soft Pastel Banner */}
        <header className="bg-amber-100/60 border-b border-amber-200/80 px-6 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <span className="bg-amber-300 text-amber-950 font-black px-2.5 py-0.5 rounded-full text-[10px] uppercase shadow-xs">
              GLOBAL SUCCESS 9
            </span>
            <span>Gia Sư Tiếng Anh Lớp 9 • Created by Mrs Nhan DakHa</span>
          </div>

          <div className="flex items-center gap-2 text-amber-900 font-semibold">
            <span>✨ Bài học: Unit {selectedUnit}</span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === 'chat' && (
            <TutorChat
              selectedUnit={selectedUnit}
              setSelectedUnit={setSelectedUnit}
              ttsEnabled={ttsEnabled}
            />
          )}

          {activeTab === 'sgk' && (
            <UnitExplorer
              selectedUnit={selectedUnit}
              setSelectedUnit={setSelectedUnit}
              onAskTutor={handleAskTutor}
              ttsEnabled={ttsEnabled}
            />
          )}

          {activeTab === 'grammar' && (
            <GrammarLab onAskTutor={handleAskTutor} />
          )}

          {activeTab === 'flashcards' && (
            <FlashcardMode
              selectedUnit={selectedUnit}
              setSelectedUnit={setSelectedUnit}
              onAskTutor={handleAskTutor}
            />
          )}

          {activeTab === 'vocab-game' && (
            <VocabBattleGame onAskTutor={handleAskTutor} />
          )}

          {activeTab === 'exam' && (
            <ExamSimulator onAskTutor={handleAskTutor} />
          )}

          {activeTab === 'writing' && (
            <WritingSpeakingLab
              selectedUnit={selectedUnit}
              onAskTutor={handleAskTutor}
            />
          )}

          {activeTab === 'diagnostic' && (
            <DiagnosticStudio onAskTutor={handleAskTutor} />
          )}
        </main>

        {/* Persistent Footer */}
        <footer className="bg-white/80 border-t border-amber-200/80 py-4 px-6 text-xs text-slate-500">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div>
              <p className="font-black text-slate-800 flex items-center justify-center sm:justify-start gap-1">
                🦉 GIA SƯ TIẾNG ANH CHIBI 9 • BÁM SÁT 12 UNIT SGK GLOBAL SUCCESS
              </p>
              <p className="text-[11px] text-slate-500">Quy trình Socratic • Luyện 430 từ vựng Unit 1-6 • Thi vào 10 THPT</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 border border-amber-300/80 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                Gemini 3.6 Flash
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
