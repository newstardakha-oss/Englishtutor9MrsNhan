import { StudentProfile, TeacherAdminState } from '../types';
import { syncStudentToGoogleSheets } from './googleSheetsSync';

const CURRENT_STUDENT_KEY = 'mrs_nhan_current_student';
const ALL_STUDENTS_KEY = 'mrs_nhan_all_students';
const TEACHER_ADMIN_KEY = 'mrs_nhan_teacher_admin';

// Sample initial data for testing dashboard
const SAMPLE_STUDENTS: StudentProfile[] = [
  {
    id: 'std-101',
    fullName: 'Nguyễn Văn Minh',
    className: '9A1',
    schoolName: 'THCS Chu Văn An',
    wardCommune: 'Thị trấn Đắk Hà',
    username: 'vanminh9a1',
    passwordHash: '123456',
    createdAt: '01/08/2026',
    lastActiveAt: new Date().toLocaleString('vi-VN'),
    totalStudyMinutes: 145,
    masteredVocabCount: 86,
    completedExercisesCount: 24,
    examHighestScore: 9.2
  },
  {
    id: 'std-102',
    fullName: 'Trần Thị Thảo',
    className: '9A2',
    schoolName: 'THCS Chu Văn An',
    wardCommune: 'Xã Đắk Hring',
    username: 'thaotran9a2',
    passwordHash: '123456',
    createdAt: '02/08/2026',
    lastActiveAt: new Date().toLocaleString('vi-VN'),
    totalStudyMinutes: 190,
    masteredVocabCount: 120,
    completedExercisesCount: 35,
    examHighestScore: 9.5
  },
  {
    id: 'std-103',
    fullName: 'Lê Hoàng Nam',
    className: '9B',
    schoolName: 'THCS Đắk Mar',
    wardCommune: 'Xã Đắk Mar',
    username: 'hoangnam9b',
    passwordHash: '123456',
    createdAt: '03/08/2026',
    lastActiveAt: new Date().toLocaleString('vi-VN'),
    totalStudyMinutes: 98,
    masteredVocabCount: 64,
    completedExercisesCount: 18,
    examHighestScore: 8.5
  },
  {
    id: 'std-104',
    fullName: 'Phạm Bảo Ngọc',
    className: '9A1',
    schoolName: 'THCS Chu Văn An',
    wardCommune: 'Thị trấn Đắk Hà',
    username: 'baongoc9a1',
    passwordHash: '123456',
    createdAt: '04/08/2026',
    lastActiveAt: new Date().toLocaleString('vi-VN'),
    totalStudyMinutes: 210,
    masteredVocabCount: 154,
    completedExercisesCount: 42,
    examHighestScore: 9.8
  }
];

export const getAllStudents = (): StudentProfile[] => {
  const data = localStorage.getItem(ALL_STUDENTS_KEY);
  if (!data) {
    localStorage.setItem(ALL_STUDENTS_KEY, JSON.stringify(SAMPLE_STUDENTS));
    return SAMPLE_STUDENTS;
  }
  try {
    return JSON.parse(data);
  } catch {
    return SAMPLE_STUDENTS;
  }
};

export const saveAllStudents = (students: StudentProfile[]) => {
  localStorage.setItem(ALL_STUDENTS_KEY, JSON.stringify(students));
};

export const getCurrentStudent = (): StudentProfile | null => {
  const data = localStorage.getItem(CURRENT_STUDENT_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const setCurrentStudent = (student: StudentProfile | null) => {
  if (student) {
    localStorage.setItem(CURRENT_STUDENT_KEY, JSON.stringify(student));
  } else {
    localStorage.removeItem(CURRENT_STUDENT_KEY);
  }
};

export const registerStudent = (data: {
  fullName: string;
  className: string;
  schoolName: string;
  wardCommune: string;
  username: string;
  password: string;
}): { success: boolean; message: string; student?: StudentProfile } => {
  const students = getAllStudents();
  const exists = students.some(s => s.username.toLowerCase() === data.username.trim().toLowerCase());
  if (exists) {
    return { success: false, message: 'Tên đăng nhập này đã được sử dụng. Vui lòng chọn tên khác!' };
  }

  const newStudent: StudentProfile = {
    id: `std-${Date.now()}`,
    fullName: data.fullName.trim(),
    className: data.className.trim(),
    schoolName: data.schoolName.trim(),
    wardCommune: data.wardCommune.trim(),
    username: data.username.trim(),
    passwordHash: data.password.trim(),
    createdAt: new Date().toLocaleDateString('vi-VN'),
    lastActiveAt: new Date().toLocaleString('vi-VN'),
    totalStudyMinutes: 0,
    masteredVocabCount: 0,
    completedExercisesCount: 0,
    examHighestScore: 0
  };

  const updated = [newStudent, ...students];
  saveAllStudents(updated);
  setCurrentStudent(newStudent);
  syncStudentToGoogleSheets(newStudent);

  return { success: true, message: 'Đăng ký tài khoản học sinh thành công!', student: newStudent };
};

export const loginStudent = (username: string, password: string): { success: boolean; message: string; student?: StudentProfile } => {
  const students = getAllStudents();
  const student = students.find(
    s => s.username.toLowerCase() === username.trim().toLowerCase() && s.passwordHash === password.trim()
  );

  if (!student) {
    return { success: false, message: 'Tên đăng nhập hoặc mật khẩu không chính xác!' };
  }

  student.lastActiveAt = new Date().toLocaleString('vi-VN');
  saveAllStudents(students);
  setCurrentStudent(student);
  syncStudentToGoogleSheets(student);

  return { success: true, message: `Chào mừng ${student.fullName} đã quay trở lại học!`, student };
};

export const logoutStudent = () => {
  setCurrentStudent(null);
};

export const resetStudentPasswordByTeacher = (username: string, newPassword: string): boolean => {
  const students = getAllStudents();
  const student = students.find(s => s.username.toLowerCase() === username.trim().toLowerCase());
  if (!student) return false;

  student.passwordHash = newPassword.trim();
  saveAllStudents(students);
  return true;
};

export const updateStudentProgress = (stats: {
  studyMinutesToAdd?: number;
  vocabAdd?: number;
  exerciseAdd?: number;
  examScore?: number;
}) => {
  const current = getCurrentStudent();
  if (!current) return;

  if (stats.studyMinutesToAdd) current.totalStudyMinutes += stats.studyMinutesToAdd;
  if (stats.vocabAdd) current.masteredVocabCount += stats.vocabAdd;
  if (stats.exerciseAdd) current.completedExercisesCount += stats.exerciseAdd;
  if (stats.examScore && stats.examScore > current.examHighestScore) {
    current.examHighestScore = stats.examScore;
  }
  current.lastActiveAt = new Date().toLocaleString('vi-VN');

  setCurrentStudent(current);
  const students = getAllStudents();
  const idx = students.findIndex(s => s.id === current.id);
  if (idx !== -1) {
    students[idx] = current;
    saveAllStudents(students);
  }

  syncStudentToGoogleSheets(current);
};

export const getTeacherAdminState = (): TeacherAdminState => {
  const data = localStorage.getItem(TEACHER_ADMIN_KEY);
  if (!data) return { email: 'hoangnhancva86@gmail.com', isLoggedIn: false };
  try {
    return JSON.parse(data);
  } catch {
    return { email: 'hoangnhancva86@gmail.com', isLoggedIn: false };
  }
};

export const setTeacherAdminState = (isLoggedIn: boolean) => {
  const state: TeacherAdminState = {
    email: 'hoangnhancva86@gmail.com',
    isLoggedIn
  };
  localStorage.setItem(TEACHER_ADMIN_KEY, JSON.stringify(state));
};
