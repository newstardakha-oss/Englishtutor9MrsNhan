/**
 * API Key Manager — Quản lý Gemini API Key & Model Selection
 * Lưu trữ trong localStorage theo quy định LỆNH.md
 */

const API_KEY_STORAGE_KEY = 'gemini_user_api_key';
const MODEL_STORAGE_KEY = 'gemini_selected_model';
const DEFAULT_MODEL = 'gemini-2.5-flash';

// ═══ API Key Management ═══

export const getStoredApiKey = (): string | null => {
  try {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  } catch {
    return null;
  }
};

export const setStoredApiKey = (key: string): void => {
  try {
    localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
  } catch (e) {
    console.error('Failed to save API key to localStorage:', e);
  }
};

export const clearStoredApiKey = (): void => {
  try {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear API key from localStorage:', e);
  }
};

export const hasStoredApiKey = (): boolean => {
  const key = getStoredApiKey();
  return !!key && key.length > 10;
};

// ═══ Model Selection ═══

export const getSelectedModel = (): string => {
  try {
    return localStorage.getItem(MODEL_STORAGE_KEY) || DEFAULT_MODEL;
  } catch {
    return DEFAULT_MODEL;
  }
};

export const setSelectedModel = (model: string): void => {
  try {
    localStorage.setItem(MODEL_STORAGE_KEY, model);
  } catch (e) {
    console.error('Failed to save model selection:', e);
  }
};

// ═══ Available Models (Hiển thị cho user chọn) ═══

export interface ModelOption {
  id: string;
  name: string;
  desc: string;
  badge?: string;
  isDefault?: boolean;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    desc: 'Nhanh, cân bằng chi phí & chất lượng',
    badge: 'Mặc định',
    isDefault: true,
  },
  {
    id: 'gemini-3-flash-preview',
    name: 'Gemini 3 Flash',
    desc: 'Mạnh nhất, reasoning frontier-class',
    badge: 'Mới nhất',
  },
  {
    id: 'gemini-2.5-flash-lite',
    name: 'Gemini 2.5 Lite',
    desc: 'Nhẹ nhất, tiết kiệm quota',
    badge: 'Tiết kiệm',
  },
];
