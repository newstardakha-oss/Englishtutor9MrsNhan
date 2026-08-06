import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TutorChat } from './components/TutorChat';
import { UnitExplorer } from './components/UnitExplorer';
import { GrammarLab } from './components/GrammarLab';
import { FlashcardMode } from './components/FlashcardMode';
import { VocabBattleGame } from './components/VocabBattleGame';
import { ExamSimulator } from './components/ExamSimulator';
import { WritingSpeakingLab } from './components/WritingSpeakingLab';
import { DiagnosticStudio } from './components/DiagnosticStudio';
import { StudentAuthModal } from './components/StudentAuthModal';
import { StudentLeaderboardModal } from './components/StudentLeaderboardModal';
import { TeacherAdminPortal } from './components/TeacherAdminPortal';
import { getCurrentStudent, logoutStudent, updateStudentProgress } from './utils/auth';
import { StudentProfile } from './types';
import { Heart, Sparkles, Star } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [selectedUnit, setSelectedUnit] = useState<number>(1);
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);

  // Student Auth & Admin Modals State
  const [currentStudent, setCurrentStudent] = useState<StudentProfile | null>(() => getCurrentStudent());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [leaderboardModalOpen, setLeaderboardModalOpen] = useState(false);
  const [teacherAdminPortalOpen, setTeacherAdminPortalOpen] = useState(false);

  // Track study time every 60 seconds when student is logged in
  useEffect(() => {
    if (!currentStudent) return;

    const timer = setInterval(() => {
      updateStudentProgress({ studyMinutesToAdd: 1 });
      setCurrentStudent(getCurrentStudent());
    }, 60000);

    return () => clearInterval(timer);
  }, [currentStudent]);

  const handleAskTutor = (query: string) => {
    setActiveTab('chat');
  };

  const handleStudentAuthSuccess = (student: StudentProfile) => {
    setCurrentStudent(student);
  };

  const handleLogout = () => {
    logoutStudent();
    setCurrentStudent(null);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-amber-100/70 via-pink-100/50 to-blue-100/60 text-slate-800 flex font-sans selection:bg-pink-200 selection:text-pink-900 relative overflow-x-hidden">
      {/* Soft Watercolor Loang Texture Spots */}
      <div className="fixed -top-10 -left-10 w-96 h-96 bg-amber-200/40 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />
      <div className="fixed top-1/4 right-0 w-[500px] h-[500px] bg-pink-200/35 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />
      <div className="fixed bottom-0 left-1/3 w-[600px] h-[600px] bg-sky-200/40 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />
      <div className="fixed bottom-10 right-10 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl pointer-events-none mix-blend-multiply" />

      {/* Left Vertical 3D Box Pastel Sidebar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedUnit={selectedUnit}
        setSelectedUnit={setSelectedUnit}
        ttsEnabled={ttsEnabled}
        setTtsEnabled={setTtsEnabled}
        currentStudent={currentStudent}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenLeaderboardModal={() => setLeaderboardModalOpen(true)}
        onOpenTeacherAdminPortal={() => setTeacherAdminPortalOpen(true)}
        onLogoutStudent={handleLogout}
      />

      {/* Right Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10">
        {/* Top Watercolor Soft Banner */}
        <header className="bg-white/70 backdrop-blur-md border-b-2 border-amber-200/80 px-6 py-2.5 flex items-center justify-between text-xs shadow-xs">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <span className="bg-amber-300 text-amber-950 font-black px-2.5 py-0.5 rounded-full text-[10px] uppercase shadow-xs">
              GLOBAL SUCCESS 9
            </span>
            <span className="font-extrabold text-slate-800">Gia Sư Tiếng Anh Lớp 9 • Created by Mrs Nhan DakHa</span>
          </div>

          <div className="flex items-center gap-3">
            {currentStudent ? (
              <span className="bg-emerald-100 text-emerald-950 border border-emerald-300 font-bold px-2.5 py-1 rounded-xl text-[11px]">
                👤 {currentStudent.fullName} ({currentStudent.className})
              </span>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white font-black px-3 py-1 rounded-xl text-[11px] shadow-xs"
              >
                🔑 Đăng Nhập Học Sinh
              </button>
            )}

            <div className="flex items-center gap-2 text-amber-900 font-bold bg-amber-100/90 px-3 py-1 rounded-xl border border-amber-300/80 shadow-xs">
              <span>✨ Unit {selectedUnit}</span>
            </div>
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
        <footer className="bg-white/80 backdrop-blur-md border-t-2 border-amber-200/80 py-4 px-6 text-xs text-slate-600">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div>
              <p className="font-black text-slate-800 flex items-center justify-center sm:justify-start gap-1">
                🦉 GIA SƯ TIẾNG ANH CHIBI 9 • BÁM SÁT 12 UNIT SGK GLOBAL SUCCESS
              </p>
              <p className="text-[11px] text-slate-500 font-medium">Quy trình Socratic • Luyện 430 từ vựng Unit 1-6 • Thi vào 10 THPT</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-950 border-2 border-amber-300 px-3 py-1 rounded-xl font-black text-[10px] shadow-xs">
                Gemini 3.6 Flash
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Modals */}
      <StudentAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleStudentAuthSuccess}
      />

      <StudentLeaderboardModal
        isOpen={leaderboardModalOpen}
        onClose={() => setLeaderboardModalOpen(false)}
      />

      <TeacherAdminPortal
        isOpen={teacherAdminPortalOpen}
        onClose={() => setTeacherAdminPortalOpen(false)}
      />
    </div>
  );
}
