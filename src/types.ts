export interface Note {
  id: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export type Theme = 'light' | 'dark' | 'sepia' | 'midnight';

export type View = 'write' | 'notes' | 'review';
