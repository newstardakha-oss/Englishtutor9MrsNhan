import { StudentProfile } from '../types';

const SHEETS_URL_KEY = 'mrs_nhan_google_sheets_url';

export const getGoogleSheetsUrl = (): string => {
  return localStorage.getItem(SHEETS_URL_KEY) || '';
};

export const setGoogleSheetsUrl = (url: string) => {
  localStorage.setItem(SHEETS_URL_KEY, url);
};

export const syncStudentToGoogleSheets = async (student: StudentProfile) => {
  const endpoint = getGoogleSheetsUrl();
  if (!endpoint) return false;

  try {
    const payload = {
      action: 'sync_student',
      id: student.id,
      fullName: student.fullName,
      className: student.className,
      schoolName: student.schoolName,
      wardCommune: student.wardCommune,
      username: student.username,
      createdAt: student.createdAt,
      lastActiveAt: new Date().toLocaleString('vi-VN'),
      totalStudyMinutes: student.totalStudyMinutes,
      masteredVocabCount: student.masteredVocabCount,
      completedExercisesCount: student.completedExercisesCount,
      examHighestScore: student.examHighestScore,
    };

    // Use mode: 'no-cors' if needed or standard POST
    await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      mode: 'no-cors'
    });

    return true;
  } catch (error) {
    console.error('Google Sheets sync error:', error);
    return false;
  }
};
