export interface Post {
  id: string;
  title: string;
  description: string;
  prompt: string;
  negativePrompt?: string;
  setupImage: string; // Behind-the-scenes / camera angle / setup image
  setupTitle?: string; // e.g., طريقة التصوير وزاوية الكاميرا
  resultImage: string; // The output image after applying prompt
  aspectRatio?: string;
  lens?: string;
  lighting?: string;
  cameraAngle?: string;
  category: string;
  createdAt: string;
  authorEmail: string;
}

export type ThemeMode = 'white' | 'burgundy';

export interface GoogleUser {
  email: string;
  name: string;
  avatar: string;
  isAuthorized: boolean;
}

export interface UserProfile {
  email: string;
  name: string;
  username: string; // Unique username (e.g. 'admin' for the 5 admin accounts, or user-selected with 3+ digits)
  avatar: string;
  bio?: string;
  title?: string; // Professional title / role
  location?: string; // City / Country
  website?: string; // Portfolio / personal website
  isAuthorized: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const ADMIN_USERNAME = 'admin';

// Hidden admin accounts list (5 accounts share the unique 'admin' username)
export const ADMIN_EMAILS: readonly string[] = [
  'alrhmnabd91@gmail.com',
  'abdalrhmnabdah911@gmail.com',
  'abdalrhmnabdah1642010@gmail.com',
  'irbidabdah@gmail.com',
  'qudiqudi164@gmail.com',
];

// Support team responders & chat targets
export const SUPPORT_AGENTS = ['عبد الرحمن', 'زيد', 'خالد', 'محمد'] as const;
export type SupportAgent = (typeof SUPPORT_AGENTS)[number];

export interface SupportTicket {
  id: string;
  senderName: string;
  senderEmail: string;
  targetAgent?: string; // Specific support member (عبد الرحمن / زيد / خالد / محمد) or general team
  subject: string;
  message: string;
  category: 'issue' | 'question' | 'suggestion' | 'prompt_request' | 'other';
  status: 'new' | 'in_progress' | 'resolved';
  createdAt: string;
  replies?: Array<{
    id: string;
    sender: string;
    text: string;
    createdAt: string;
    isAdmin: boolean;
  }>;
}

export function checkIsAuthorized(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((allowed) => allowed.toLowerCase() === normalized);
}
