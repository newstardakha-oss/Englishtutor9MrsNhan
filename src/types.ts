export type UnitId = number; // 1 to 12

export interface WordFamily {
  root: string;
  noun?: string;
  verb?: string;
  adjective?: string;
  adverb?: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  ipa: string;
  partOfSpeech: string;
  meaning: string;
  unit: UnitId;
  collocations?: string[];
  wordFamily?: WordFamily;
  phrasalVerbs?: string[];
  example: string;
  commonErrors?: string;
  examNote?: string;
}

export interface GrammarTopic {
  id: string;
  title: string;
  unit?: UnitId;
  formula: string;
  usage: string;
  signs: string[];
  examples: string[];
  commonErrors: string[];
  examTraps: string[];
  memoryTips: string;
}

export interface PronunciationTopic {
  unit: UnitId;
  title: string;
  sounds: string[];
  rules: string[];
  examples: { word: string; ipa: string }[];
  commonMistakes: string[];
}

export interface SGKExercise {
  id: string;
  unit: UnitId;
  section: 'A Closer Look 1' | 'A Closer Look 2' | 'Skills 1' | 'Skills 2' | 'Looking Back' | 'Review';
  type: 'multiple-choice' | 'fill-blank' | 'word-form' | 'rewrite' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  hints: {
    level1: string; // Remind knowledge
    level2: string; // Point out structure
    level3: string; // Near answer
  };
  tag: '[SGK]' | '[TÀI LIỆU]' | '[BỔ TRỢ]' | '[MỞ RỘNG]' | '[LUYỆN TẬP MỚI]' | '[NÂNG CAO]' | '[THI VÀO 10]';
}

export interface UnitInfo {
  id: UnitId;
  title: string;
  theme: string;
  pageRange: string;
  description: string;
  vocabularyOverview: string[];
  grammarFocus: string[];
  pronunciationFocus: string;
  skillsFocus: {
    reading: string;
    speaking: string;
    listening: string;
    writing: string;
  };
}

export interface ExamQuestion {
  id: string;
  section: 'phonetics' | 'vocabulary' | 'grammar' | 'communication' | 'reading' | 'writing-rewrite' | 'error-finding';
  question: string;
  passage?: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  trapWarning?: string;
  level: 'Cơ bản' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao (Thi vào 10)';
}

export interface WritingFeedback {
  score: number;
  overallComments: string;
  strengths: string[];
  weaknesses: string[];
  criteria: {
    content: number; // /10
    structure: number; // /10
    vocabulary: number; // /10
    grammar: number; // /10
    spelling: number; // /10
  };
  sentenceBySentence: {
    original: string;
    corrected: string;
    explanation: string;
    issueType: 'Ngữ pháp' | 'Từ vựng' | 'Chính tả' | 'Cấu trúc' | 'Tự nhiên';
  }[];
  improvedVersion: string;
  recommendedPractice: string;
}

export interface LearningGap {
  topic: string;
  severity: 'Hoàn toàn mất gốc' | 'Thường xuyên nhầm' | 'Cần luyện thêm';
  description: string;
  remedyAction: string;
  recommendedExercises: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  tag?: string;
  audioText?: string;
  hasHints?: boolean;
  hints?: { level1: string; level2: string; level3: string };
}

export interface StudentProfile {
  id: string;
  fullName: string;
  className: string;
  schoolName: string;
  wardCommune: string;
  username: string;
  passwordHash: string;
  createdAt: string;
  lastActiveAt: string;
  totalStudyMinutes: number;
  masteredVocabCount: number;
  completedExercisesCount: number;
  examHighestScore: number;
}

export interface TeacherAdminState {
  email: 'hoangnhancva86@gmail.com';
  isLoggedIn: boolean;
  googleSheetsUrl?: string;
}

