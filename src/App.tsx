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

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [selectedUnit, setSelectedUnit] = useState<number>(1);
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);

  // Helper to jump to chat tab with a pre-filled query
  const handleAskTutor = (query: string) => {
    setActiveTab('chat');
    // We can dispatch or pass down custom query trigger if needed
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-200 selection:text-blue-900">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedUnit={selectedUnit}
        setSelectedUnit={setSelectedUnit}
        ttsEnabled={ttsEnabled}
        setTtsEnabled={setTtsEnabled}
      />

      <main className="flex-1 pb-12">
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
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <p className="font-bold text-slate-200">GIA SƯ TIẾNG ANH LỚP 9 THEO SGK GLOBAL SUCCESS</p>
            <p className="text-[11px] text-slate-400">Dạy theo quy trình Socratic • Bám sát 12 Unit SGK • Định hướng ôn thi tuyển sinh vào lớp 10 THPT</p>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="bg-blue-900/50 text-blue-300 border border-blue-700/50 px-2.5 py-1 rounded font-mono text-[10px]">
              AI Model: Gemini 3.6 Flash
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
