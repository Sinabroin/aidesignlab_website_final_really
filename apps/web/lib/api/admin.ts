/** Admin API client functions */
import {
  apiGet,
  apiPost,
  apiDeleteWithBody,
  ApiError,
} from './client';
import type {
  AllowlistResponse,
  AddMemberRequest,
  AddMemberResponse,
  RemoveMemberRequest,
  RemoveMemberResponse,
} from './types';

export async function getAllowlists(): Promise<AllowlistResponse> {
  return apiGet<AllowlistResponse>('/admin/allowlist');
}

export async function addToAllowlist(
  request: AddMemberRequest
): Promise<AddMemberResponse> {
  return apiPost<AddMemberResponse>('/admin/allowlist', request);
}

export async function removeFromAllowlist(
  request: RemoveMemberRequest
): Promise<RemoveMemberResponse> {
  return apiDeleteWithBody<RemoveMemberResponse>(
    '/admin/allowlist',
    request
  );
}

export { ApiError };
