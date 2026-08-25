import { GoogleGenAI } from '@google/genai';

/**
 * API KEY POOL MANAGER
 * Tự động xoay vòng và fallback danh sách API Key Gemini.
 * Đọc từ biến môi trường GEMINI_API_KEYS (ngăn cách bởi dấu phẩy) hoặc GEMINI_API_KEY (1 key).
 */

const getApiKeysPool = (): string[] => {
  const keysStr = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "";
  const keys = keysStr.split(',').map(k => k.trim()).filter(Boolean);
  return keys;
};

let currentKeyIndex = 0;

export const getNextApiKey = (): string => {
  const pool = getApiKeysPool();
  if (pool.length === 0) return "";
  const key = pool[currentKeyIndex % pool.length];
  currentKeyIndex = (currentKeyIndex + 1) % pool.length;
  return key;
};

function safeErrorMessage(err: any): string {
  try {
    if (typeof err === 'string') return err;
    if (err?.message && typeof err.message === 'string') return err.message;
    return JSON.stringify(err);
  } catch {
    return 'Unknown error occurred';
  }
}

export const MODEL_FALLBACK_CHAIN = ['gemini-2.5-flash', 'gemini-3-flash-preview', 'gemini-2.5-flash-lite', 'gemini-2.5-pro'];

export async function executeGeminiWithPool<T>(
  fn: (ai: GoogleGenAI, model: string) => Promise<T>,
  model: string = 'gemini-2.5-flash',
  clientApiKey?: string
): Promise<T> {
  // If client provided an API key, try it first
  if (clientApiKey) {
    try {
      const ai = new GoogleGenAI({
        apiKey: clientApiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
      return await fn(ai, model);
    } catch (err: any) {
      const errMsg = safeErrorMessage(err);
      console.warn(`[Gemini Client Key] Failed: ${errMsg.substring(0, 200)}`);
      // Fall through to pool keys
    }
  }

  const pool = getApiKeysPool();

  if (pool.length === 0 && !clientApiKey) {
    throw new Error("Chưa cấu hình API Key. Vui lòng nhập API Key Gemini trong phần Cài đặt trên giao diện app, hoặc liên hệ giáo viên.");
  }
  
  if (pool.length === 0) {
    throw new Error("API Key bạn nhập không hợp lệ hoặc đã hết quota. Vui lòng kiểm tra lại hoặc dùng API Key khác.");
  }

  let lastError: any = null;
  const maxAttempts = Math.min(pool.length, 5);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const key = getNextApiKey();
    try {
      const ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });
      return await fn(ai, model);
    } catch (err: any) {
      const errMsg = safeErrorMessage(err);
      console.warn(`[Gemini Key Pool] Attempt ${attempt + 1}/${maxAttempts} failed: ${errMsg.substring(0, 200)}`);
      lastError = err;

      const isQuotaError = errMsg.includes('429') ||
        errMsg.includes('quota') ||
        errMsg.includes('RESOURCE_EXHAUSTED') ||
        errMsg.includes('limit') ||
        errMsg.includes('rate');

      if (isQuotaError && attempt < maxAttempts - 1) {
        continue;
      }

      // Non-quota error or last attempt: break and throw
      break;
    }
  }

  // Wrap error to ensure it's a proper Error object with a clean message
  const finalMsg = safeErrorMessage(lastError);
  if (finalMsg.includes('RESOURCE_EXHAUSTED') || finalMsg.includes('429') || finalMsg.includes('quota')) {
    throw new Error("Tất cả API Key trong Pool đều tạm thời hết lượt sử dụng miễn phí hôm nay. Vui lòng thử lại sau hoặc liên hệ cô giáo để cập nhật API Key mới.");
  }
  throw new Error(finalMsg.substring(0, 500));
}

export async function executeGeminiWithModelFallback<T>(
  fn: (ai: GoogleGenAI, model: string) => Promise<T>,
  preferredModel?: string,
  clientApiKey?: string
): Promise<T> {
  // Build chain starting with preferred model if specified
  const chain = preferredModel && !MODEL_FALLBACK_CHAIN.includes(preferredModel)
    ? [preferredModel, ...MODEL_FALLBACK_CHAIN]
    : preferredModel
    ? [preferredModel, ...MODEL_FALLBACK_CHAIN.filter(m => m !== preferredModel)]
    : [...MODEL_FALLBACK_CHAIN];

  let lastError: any = null;
  
  for (const model of chain) {
    try {
      return await executeGeminiWithPool(fn, model, clientApiKey);
    } catch (err: any) {
      const errMsg = safeErrorMessage(err);
      console.warn(`[Model Fallback] Model ${model} failed, trying next. Error: ${errMsg.substring(0, 200)}`);
      lastError = err;
      continue;
    }
  }
  
  throw lastError;
}
