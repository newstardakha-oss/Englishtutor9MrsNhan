import { StudentProfile } from '../types';

const SHEETS_URL_KEY = 'mrs_nhan_google_sheets_url';

export const getGoogleSheetsUrl = (): string => {
  return localStorage.getItem(SHEETS_URL_KEY) || '';
};

export const setGoogleSheetsUrl = (url: string) => {
  localStorage.setItem(SHEETS_URL_KEY, url);
};

export const syncStudentToGoogleSheets = async (student: StudentProfile) => {
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

    // First try the Vercel proxy / local proxy
    try {
      const response = await fetch('/api/sheets/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (response.ok) {
        return true;
      }
      
      const responseData = await response.json().catch(() => ({}));
      if (responseData.error === 'GOOGLE_SHEETS_SCRIPT_URL environment variable is not set.') {
        // Fall back to old behavior if no env var
        throw new Error('Fallback');
      }
      return false;
    } catch (e: any) {
      if (e.message !== 'Fallback') {
        throw e;
      }
    }

    // Fall back to old behavior
    const endpoint = getGoogleSheetsUrl();
    if (!endpoint) return false;

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

export const syncAllStudentsToGoogleSheets = async (students: StudentProfile[]) => {
  let successCount = 0;
  for (const student of students) {
    const success = await syncStudentToGoogleSheets(student);
    if (success) successCount++;
  }
  return successCount === students.length;
};

export const exportStudentsToSheets = async (students: StudentProfile[]): Promise<{success: boolean, message: string}> => {
  try {
    const success = await syncAllStudentsToGoogleSheets(students);
    if (success) {
      return { success: true, message: 'Đã xuất dữ liệu học sinh thành công!' };
    } else {
      return { success: false, message: 'Có lỗi xảy ra khi xuất một số dữ liệu.' };
    }
  } catch (error: any) {
    return { success: false, message: 'Lỗi: ' + error.message };
  }
};
