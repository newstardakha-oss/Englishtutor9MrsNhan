/**
 * API Client — Wrapper fetch tự động gắn API Key & Model vào header
 * Tất cả component gọi API Gemini qua module này.
 */

import { getStoredApiKey, getSelectedModel } from './apiKeyManager';

export class ApiError extends Error {
  status: number;
  isQuotaError: boolean;
  isAuthError: boolean;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.isQuotaError = status === 429 ||
      message.includes('quota') ||
      message.includes('RESOURCE_EXHAUSTED') ||
      message.includes('hết lượt');
    this.isAuthError = status === 401 ||
      message.includes('API Key') ||
      message.includes('không hợp lệ') ||
      message.includes('Chưa cấu hình');
  }
}

export async function apiPost<T = any>(url: string, body: any): Promise<T> {
  const apiKey = getStoredApiKey();
  const model = getSelectedModel();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (apiKey) {
    headers['x-gemini-api-key'] = apiKey;
  }
  if (model) {
    headers['x-gemini-model'] = model;
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let errorMessage = 'Lỗi kết nối server';
    try {
      const errData = await res.json();
      errorMessage = errData.error || errorMessage;
    } catch {
      // ignore JSON parse error
    }
    throw new ApiError(res.status, errorMessage);
  }

  return res.json();
}

/**
 * Tạo thông báo lỗi thân thiện cho học sinh
 */
export function getErrorMessage(err: unknown): { message: string; isQuota: boolean; isAuth: boolean } {
  if (err instanceof ApiError) {
    if (err.isQuotaError) {
      return {
        message: '⚠️ API Key đã hết lượt miễn phí hôm nay. Em hãy bấm nút ⚙️ Cài đặt API trên thanh menu để nhập API Key từ tài khoản Gmail khác, hoặc thử lại vào ngày mai nhé!',
        isQuota: true,
        isAuth: false,
      };
    }
    if (err.isAuthError) {
      return {
        message: '🔑 Chưa có API Key hoặc Key không hợp lệ. Em hãy bấm nút ⚙️ Cài đặt API trên thanh menu để nhập API Key Gemini miễn phí nhé!',
        isQuota: false,
        isAuth: true,
      };
    }
    return {
      message: `Thầy gặp sự cố: ${err.message}. Em thử gửi lại câu hỏi nhé!`,
      isQuota: false,
      isAuth: false,
    };
  }
  return {
    message: 'Thầy vừa gặp sự cố kết nối mạng. Em hãy bấm nút gửi lại câu hỏi giúp thầy nhé!',
    isQuota: false,
    isAuth: false,
  };
}
