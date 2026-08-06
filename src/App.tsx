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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/50 to-pink-50/40 text-slate-900 flex flex-col font-sans selection:bg-pink-200 selection:text-pink-900 relative">
      {/* Decorative Chibi background elements */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-purple-300/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl pointer-events-none" />

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedUnit={selectedUnit}
        setSelectedUnit={setSelectedUnit}
        ttsEnabled={ttsEnabled}
        setTtsEnabled={setTtsEnabled}
      />

      <main className="flex-1 pb-12 relative z-10">
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

      {/* Persistent Footer with Cute Chibi Styling */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t-2 border-slate-800 text-xs relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="space-y-1">
            <p className="font-black text-amber-300 text-sm flex items-center justify-center sm:justify-start gap-1">
              🦉 GIA SƯ TIẾNG ANH CHIBI LỚP 9 • SGK GLOBAL SUCCESS
            </p>
            <p className="text-[11px] text-slate-400">
              Quy trình giảng dạy Socratic • Luyện 430 từ vựng Unit 1-6 • Ôn thi bứt phá vào Lớp 10 THPT
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="bg-indigo-950 text-indigo-300 border border-indigo-700/60 px-3 py-1 rounded-xl font-bold text-[11px] shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" /> AI Engine: Gemini 3.6 Flash
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
