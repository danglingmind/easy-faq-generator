import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Check if paid features are enabled via env var
// NEXT_PUBLIC_ vars are available on both client and server in Next.js
export function isPaidFeaturesEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ENABLE_PAID_FEATURES === "true";
}

// Storage keys for preserving editor state
const STORAGE_KEY = "faq-editor-state";

export interface EditorState {
  content?: {
    heading: string;
    description: string;
    items: Array<{ id: string; question: string; answer: string }>;
  };
  selectedTemplate?: string;
  styles?: any;
}

export function saveEditorState(state: EditorState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function loadEditorState(): EditorState | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function clearEditorState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
