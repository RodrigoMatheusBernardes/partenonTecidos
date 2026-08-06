import { getApiUrl } from '@/config';
export { getApiUrl };

export function extractDataArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown }).data)) {
    return (payload as { data: T[] }).data;
  }

  return [];
}

export function getCachedApiUrl(): string {
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('activeApiUrl');
    if (cached) return cached;
  }
  return getApiUrl();
}
