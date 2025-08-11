export const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://127.0.0.1:8000';

export type ApiError = {
  status: number;
  message: string;
  details?: unknown;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const resp = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    credentials: 'omit',
    ...options,
  });

  const text = await resp.text();
  const data = text ? JSON.parse(text) : null;
  if (!resp.ok) {
    const error: ApiError = {
      status: resp.status,
      message: (data && (data.detail || data.message)) || resp.statusText,
      details: data,
    };
    throw error;
  }
  return data as T;
}

export const api = {
  register(payload: { username: string; email: string; password: string; role?: string }) {
    return request<{ id?: string } | {}>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  verifyOtp(payload: { identifier: string; code: string; purpose: 'signup' | 'password_reset' | 'login_otp' }) {
    return request<{ success?: boolean }>('/auth/verify-otp/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};


