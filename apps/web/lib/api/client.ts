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
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"admin-debug-1",hypothesisId:"A2",location:"lib/api/client.ts:handleResponse:error",message:"api response not ok",data:{status:response.status,statusText:response.statusText,url:response.url},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
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
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"admin-debug-1",hypothesisId:"A1",location:"lib/api/client.ts:apiRequest:start",message:"api request start",data:{endpoint,url,method:options.method??"GET"},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"admin-debug-1",hypothesisId:"A1-A2",location:"lib/api/client.ts:apiRequest:response",message:"api request response",data:{url,status:response.status,ok:response.ok},timestamp:Date.now()})}).catch(()=>{});
  // #endregion
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
