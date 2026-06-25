import { getApiUrl } from '@/config';
export { getApiUrl };
export function getCachedApiUrl(): string {
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('activeApiUrl');
    if (cached) return cached;
  }
  return getApiUrl();
}
