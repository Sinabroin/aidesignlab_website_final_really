/** Admin API client functions */
import { ApiError } from './client';
import type {
  AllowlistResponse,
  AddMemberRequest,
  AddMemberResponse,
  RemoveMemberRequest,
  RemoveMemberResponse,
  AdminHomeContentResponse,
  HomeContentType,
} from './types';

async function adminRequest<T>(
  path: string,
  method: 'GET' | 'POST' | 'DELETE',
  body?: unknown
): Promise<T> {
  const response = await fetch(path, {
    method,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
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

export async function getAllowlists(): Promise<AllowlistResponse> {
  return adminRequest<AllowlistResponse>('/api/admin/allowlist', 'GET');
}

export async function addToAllowlist(
  request: AddMemberRequest
): Promise<AddMemberResponse> {
  return adminRequest<AddMemberResponse>('/api/admin/allowlist', 'POST', request);
}

export async function removeFromAllowlist(
  request: RemoveMemberRequest
): Promise<RemoveMemberResponse> {
  return adminRequest<RemoveMemberResponse>('/api/admin/allowlist', 'DELETE', request);
}

export async function getAdminHomeContent(): Promise<AdminHomeContentResponse> {
  return adminRequest<AdminHomeContentResponse>('/api/admin/home-content', 'GET');
}

export async function createAdminHomeContent(
  contentType: HomeContentType,
  payload: Record<string, unknown>
) {
  return adminRequest<{ ok: boolean; item: unknown }>(
    '/api/admin/home-content',
    'POST',
    { contentType, ...payload }
  );
}

export async function deleteAdminHomeContent(
  contentType: HomeContentType,
  id: string
) {
  return adminRequest<{ ok: boolean }>('/api/admin/home-content', 'DELETE', {
    contentType,
    id,
  });
}

export { ApiError };
