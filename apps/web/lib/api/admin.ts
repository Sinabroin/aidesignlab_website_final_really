/** Admin API client functions */
import { ApiError } from './client';
import type {
  AllowlistResponse,
  AddMemberRequest,
  AddMemberResponse,
  RemoveMemberRequest,
  RemoveMemberResponse,
} from './types';

function logAdminClient(hypothesisId: string, message: string, data: Record<string, unknown>) {
  // #region agent log
  fetch("http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"admin-debug-2",hypothesisId,location:"lib/api/admin.ts",message,data,timestamp:Date.now()})}).catch(()=>{});
  // #endregion
}

async function parseAdminResponse<T>(response: Response): Promise<T> {
  logAdminClient('B2', 'admin response received', {
    status: response.status,
    ok: response.ok,
    url: response.url,
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: 'Unknown',
      message: `HTTP ${response.status}: ${response.statusText}`,
    }));
    throw new ApiError(response.status, errorData);
  }
  return response.json() as Promise<T>;
}

async function adminRequest<T>(
  method: 'GET' | 'POST' | 'DELETE',
  body?: unknown
): Promise<T> {
  logAdminClient('B1', 'admin request start', {
    method,
    hasBody: !!body,
  });
  const response = await fetch('/api/admin/allowlist', {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  return parseAdminResponse<T>(response);
}

export async function getAllowlists(): Promise<AllowlistResponse> {
  return adminRequest<AllowlistResponse>('GET');
}

export async function addToAllowlist(
  request: AddMemberRequest
): Promise<AddMemberResponse> {
  return adminRequest<AddMemberResponse>('POST', request);
}

export async function removeFromAllowlist(
  request: RemoveMemberRequest
): Promise<RemoveMemberResponse> {
  return adminRequest<RemoveMemberResponse>('DELETE', request);
}

export { ApiError };
