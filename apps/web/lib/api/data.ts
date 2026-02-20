/** Data retrieval API client functions */
import { apiGet } from './client';
import type {
  PlaydayResponse,
  PlaybookResponse,
  NoticesResponse,
} from './types';

export async function getPlaydayData(): Promise<PlaydayResponse> {
  return apiGet<PlaydayResponse>('/data/playday');
}

export async function getPlaybookData(
  category: 'usecase' | 'trend' | 'prompt' | 'hai' | 'teams' = 'usecase'
): Promise<PlaybookResponse> {
  return apiGet<PlaybookResponse>(`/data/playbook?category=${category}`);
}

export async function getNotices(): Promise<NoticesResponse> {
  return apiGet<NoticesResponse>('/data/notices');
}
