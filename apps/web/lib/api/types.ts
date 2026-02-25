/** TypeScript types matching FastAPI Pydantic schemas */

export interface AllowlistResponse {
  operators: string[];
  community: string[];
}

export interface AddMemberRequest {
  email: string;
  role: 'operator' | 'community';
}

export interface RemoveMemberRequest {
  email: string;
  role: 'operator' | 'community';
}

export interface AddMemberResponse {
  ok: boolean;
  email: string;
  role: 'operator' | 'community';
}

export interface RemoveMemberResponse {
  ok: boolean;
}

export interface Attachment {
  name: string;
  url: string;
  size: string;
  type: string;
}

export interface GalleryItem {
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  fullDescription?: string;
  tags?: string[];
  attachments?: Attachment[];
  session?: number;
}

export interface PlaydayResponse {
  items: GalleryItem[];
}

export interface PlaybookRequest {
  category: 'usecase' | 'trend' | 'prompt' | 'hai' | 'teams';
}

export interface PlaybookResponse {
  items: GalleryItem[];
  category: 'usecase' | 'trend' | 'prompt' | 'hai' | 'teams';
}

export interface Notice {
  title: string;
  date: string;
  badge: string;
  badgeColor: string;
}

export interface NoticesResponse {
  notices: Notice[];
}

export interface ErrorResponse {
  error: string;
  message: string;
}

export interface AdminHomeBanner {
  id: string;
  title: string;
  description: string;
  content?: string;
  href?: string;
  fitMode?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface AdminHomeNotice {
  id: string;
  title: string;
  date: string;
  badge: string;
  badgeColor: string;
}

export interface AdminPlaydayGuide {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
}

export interface AdminHomeContentResponse {
  banners: AdminHomeBanner[];
  notices: AdminHomeNotice[];
  playdayGuides: AdminPlaydayGuide[];
}

export type HomeContentType = 'banner' | 'notice' | 'playday-guide';
