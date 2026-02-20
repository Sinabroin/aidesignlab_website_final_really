/** Base API client configuration and error handling */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_V1_PREFIX = '/api/v1';

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: { error: string; message: string }
  ) {
    super(data.message || `API Error: ${status}`);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: 'Unknown',
      message: `HTTP ${response.status}: ${response.statusText}`,
    }));
    throw new ApiError(response.status, errorData);
  }
  return response.json();
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${API_V1_PREFIX}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  return handleResponse<T>(response);
}

export async function apiGet<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'GET' });
}

export async function apiPost<T>(
  endpoint: string,
  body: unknown
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function apiDelete<T>(endpoint: string): Promise<T> {
  return apiRequest<T>(endpoint, { method: 'DELETE' });
}

export async function apiDeleteWithBody<T>(
  endpoint: string,
  body: unknown
): Promise<T> {
  return apiRequest<T>(endpoint, {
    method: 'DELETE',
    body: JSON.stringify(body),
  });
}
