export interface Award {
  id: string;
  title: string;
  studio: string;
  thumbnail: string;
  date: string;
  points: number;
  category: 'Website' | 'Mobile' | 'Installation' | 'FWOTD';
  description?: string;
  tags?: string[];
}

export interface FilterOption {
  value: string;
  label: string;
}
