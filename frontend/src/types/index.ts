export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type LegalCategory =
  | 'criminal_law' | 'civil_law' | 'corporate_law'
  | 'family_law'   | 'property_law' | 'general';

export interface Message {
  _id?: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  category?: LegalCategory | null;
  timestamp?: string;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  category: LegalCategory;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  preview: string;
}

export interface ChatSessionDetail {
  _id: string;
  title: string;
  category: LegalCategory;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export const CATEGORY_LABELS: Record<LegalCategory, string> = {
  criminal_law:  'Criminal Law',
  civil_law:     'Civil Law',
  corporate_law: 'Corporate Law',
  family_law:    'Family Law',
  property_law:  'Property Law',
  general:       'General',
};

// Light-theme badge colours
export const CATEGORY_COLORS: Record<LegalCategory, string> = {
  criminal_law:  'text-red-600   border-red-200   bg-red-50',
  civil_law:     'text-blue-600  border-blue-200  bg-blue-50',
  corporate_law: 'text-emerald-600 border-emerald-200 bg-emerald-50',
  family_law:    'text-purple-600 border-purple-200 bg-purple-50',
  property_law:  'text-orange-600 border-orange-200 bg-orange-50',
  general:       'text-slate-600  border-slate-200  bg-slate-50',
};
