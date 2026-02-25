// 공통 타입 정의
export interface GalleryItem {
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  thumbnail?: string;
  fullDescription?: string;
  tags?: string[];
  attachments?: {
    name: string;
    url: string;
    size: string;
    type: string;
  }[];
  session?: number;
}

export interface Notice {
  title: string;
  date: string;
  badge: string;
  badgeColor: string;
}

export interface HomeBanner {
  id: string;
  title: string;
  description: string;
  content?: string;
  href?: string;
  attachments?: { name: string; type: string; size: number; data: string }[];
  isActive: boolean;
  sortOrder: number;
}

export interface HomePlaydayGuide {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
}

export interface HelpRequest {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  status: 'pending' | 'in-progress' | 'completed';
  content: string;
  replies: {
    author: string;
    date: string;
    content: string;
    isAdmin: boolean;
  }[];
}

export type Tab = 'home' | 'playbook' | 'playday' | 'activity';
export type PlaybookCategory = 'usecase' | 'trend' | 'prompt' | 'hai';
export type ActivityCategory = 'safety' | 'planning' | 'ai' | 'design' | 'all';
export type UserRole = 'R1' | 'R2' | 'R3'; // R1=전사, R2=ACE, R3=운영진
