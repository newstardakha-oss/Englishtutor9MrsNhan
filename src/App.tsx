import React, { useState, useEffect, useRef, Suspense } from 'react';
const TutorChat = React.lazy(() => import('./components/TutorChat').then(m => ({ default: m.TutorChat })));
const UnitExplorer = React.lazy(() => import('./components/UnitExplorer').then(m => ({ default: m.UnitExplorer })));
const GrammarLab = React.lazy(() => import('./components/GrammarLab').then(m => ({ default: m.GrammarLab })));
const FlashcardMode = React.lazy(() => import('./components/FlashcardMode').then(m => ({ default: m.FlashcardMode })));
const VocabBattleGame = React.lazy(() => import('./components/VocabBattleGame').then(m => ({ default: m.VocabBattleGame })));
const ExamSimulator = React.lazy(() => import('./components/ExamSimulator').then(m => ({ default: m.ExamSimulator })));
const WritingSpeakingLab = React.lazy(() => import('./components/WritingSpeakingLab').then(m => ({ default: m.WritingSpeakingLab })));
const DiagnosticStudio = React.lazy(() => import('./components/DiagnosticStudio').then(m => ({ default: m.DiagnosticStudio })));
import { Navbar } from './components/Navbar';
import { StudentAuthModal } from './components/StudentAuthModal';
import { StudentLeaderboardModal } from './components/StudentLeaderboardModal';
import { TeacherAdminPortal } from './components/TeacherAdminPortal';
import { ApiKeySettingsModal } from './components/ApiKeySettingsModal';
import { LoginPage } from './components/LoginPage';
import { getCurrentStudent, logoutStudent, updateStudentProgress, getCurrentTeacher, logoutTeacher } from './utils/auth';
import { hasStoredApiKey } from './utils/apiKeyManager';
import { StudentProfile } from './types';
import { Sparkles, Award, Settings } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('chat');
  const [selectedUnit, setSelectedUnit] = useState<number>(1);
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);
  const [pendingTutorQuery, setPendingTutorQuery] = useState<string>('');

  // Student Auth & Admin Modals State
  const [currentStudent, setCurrentStudent] = useState<StudentProfile | null>(null);
  const [isTeacherLoggedIn, setIsTeacherLoggedIn] = useState<boolean>(() => !!getCurrentTeacher());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [leaderboardModalOpen, setLeaderboardModalOpen] = useState(false);
  const [teacherAdminPortalOpen, setTeacherAdminPortalOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);



  const studentRef = useRef(currentStudent);
  useEffect(() => {
    studentRef.current = currentStudent;
  }, [currentStudent]);

  // Track study time every 60 seconds when student is logged in
  useEffect(() => {
    const timer = setInterval(() => {
      if (!studentRef.current) return;
      updateStudentProgress({ studyMinutesToAdd: 1 });
      setCurrentStudent(getCurrentStudent());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleAskTutor = (query: string) => {
    setPendingTutorQuery(query);
    setActiveTab('chat');
  };

  const handleStudentAuthSuccess = (student: StudentProfile) => {
    setCurrentStudent(student);
  };

  const handleLogout = () => {
    logoutStudent();
    setCurrentStudent(null);
    setIsTeacherLoggedIn(false);
  };

  const handleTeacherLogout = () => {
    logoutTeacher();
    setIsTeacherLoggedIn(false);
    setTeacherAdminPortalOpen(false);
  };

  // ═══ GATE CHECK: Chưa đăng nhập → Hiển thị LoginPage full-page ═══
  if (!currentStudent && !isTeacherLoggedIn) {
    return (
      <LoginPage
        onStudentLogin={(student) => {
          setCurrentStudent(student);
        }}
        onTeacherLogin={() => {
          setIsTeacherLoggedIn(true);
          setTeacherAdminPortalOpen(true);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-indigo-500 selection:text-white relative overflow-x-hidden w-full max-w-full">
      {/* Background ambient lighting glows */}
      <div className="fixed -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-1/3 -right-40 w-[600px] h-[600px] bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed -bottom-40 left-1/3 w-[700px] h-[700px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Left Vertical EdTech Sidebar Navigation */}
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
        onOpenApiKeyModal={() => setApiKeyModalOpen(true)}
        onLogoutStudent={handleLogout}
      />

      {/* Right Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative z-10 w-full max-w-full">
        {/* Top Professional Banner */}
        <header className="hidden lg:flex bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 py-2 items-center justify-between text-xs shadow-md">
          <div className="flex items-center gap-2 font-bold">
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] uppercase shadow-sm flex items-center gap-1">
              <Award className="w-3 h-3" /> GLOBAL SUCCESS 9
            </span>
            <span className="hidden md:inline font-bold text-slate-300">
              Gia Sư Tiếng Anh Lớp 9 • Created by Mrs Nhan DakHa
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentStudent ? (
              <div className="flex items-center gap-1.5">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl text-[10px] sm:text-[11px] flex items-center gap-1 truncate max-w-[150px] sm:max-w-none">
                  👤 {currentStudent.fullName} ({currentStudent.className})
                </span>
                <button
                  onClick={handleLogout}
                  title="Đăng xuất về màn hình đăng nhập"
                  className="bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 text-slate-400 font-bold px-2 py-0.5 sm:py-1 rounded-xl text-[10px] sm:text-[11px] transition-colors border border-slate-700"
                >
                  🚪 Đăng xuất
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2.5 py-1 rounded-xl text-[10px] sm:text-[11px] shadow-sm transition-all border border-indigo-400/30"
              >
                🔑 Đăng Nhập Học Sinh
              </button>
            )}

            <button
                onClick={() => setApiKeyModalOpen(true)}
                className={`flex items-center gap-1 font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-xl text-[10px] sm:text-xs transition-colors border ${
                  hasStoredApiKey()
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/80'
                    : 'bg-rose-950/80 text-rose-300 border-rose-500/40 hover:bg-rose-900/80 animate-pulse'
                }`}
              >
                <Settings className="w-3 h-3" />
                <span>{hasStoredApiKey() ? 'API ✓' : 'Lấy API key'}</span>
              </button>

            <div className="flex items-center gap-1 text-cyan-300 font-bold bg-indigo-950/80 px-2 py-0.5 sm:px-3 sm:py-1 rounded-xl border border-indigo-500/40 text-[10px] sm:text-xs">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Unit {selectedUnit}</span>
            </div>
          </div>
        </header>

        {/* Dynamic Workspace Container */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6">
          <Suspense fallback={
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="w-10 h-10 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm text-slate-400 font-semibold">Đang tải...</p>
              </div>
            </div>
          }>
            {activeTab === 'chat' && (
              <TutorChat
                selectedUnit={selectedUnit}
                setSelectedUnit={setSelectedUnit}
                ttsEnabled={ttsEnabled}
                pendingQuery={pendingTutorQuery}
                onPendingQueryConsumed={() => setPendingTutorQuery('')}
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
          </Suspense>
        </main>

        {/* Persistent Footer */}
        <footer className="bg-slate-900/90 backdrop-blur-md border-t border-slate-800/80 py-3.5 px-6 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
            <div>
              <p className="font-bold text-slate-200 flex items-center justify-center sm:justify-start gap-1.5">
                🦉 ENGLISH MASTER 9 • BÁM SÁT 12 UNIT SGK GLOBAL SUCCESS
              </p>
              <p className="text-[11px] text-slate-500 font-medium">Quy trình Socratic • 430 Từ vựng trọng tâm • Luyện bẫy đề thi vào 10 THPT</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-indigo-950 text-cyan-300 border border-indigo-500/40 px-3 py-1 rounded-xl font-bold text-[10px]">
                Powered by Gemini 2.5 Flash
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Persistent Modals */}
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

      <ApiKeySettingsModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
      />
    </div>
  );
}
