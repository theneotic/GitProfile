const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

let inMemoryToken: string | null = null;

export function setAccessToken(token: string | null): void {
  inMemoryToken = token;
  if (typeof window !== 'undefined') {
    if (token) {
      sessionStorage.setItem('instrument_stats_token', token);
    } else {
      sessionStorage.removeItem('instrument_stats_token');
    }
  }
}

export function getAccessToken(): string | null {
  if (inMemoryToken) return inMemoryToken;
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('instrument_stats_token');
  }
  return null;
}

export async function apiClient<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include', // sends refresh cookie
  });

  if (res.status === 401 && !path.includes('/auth/refresh')) {
    // Attempt automatic refresh
    const refreshed = await refreshToken();
    if (refreshed) {
      headers.Authorization = `Bearer ${refreshed}`;
      const retryRes = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
        credentials: 'include',
      });
      if (!retryRes.ok) {
        throw new Error(`API error ${retryRes.status}`);
      }
      return (await retryRes.json()) as T;
    }
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `HTTP ${res.status}`);
  }

  return (await res.json()) as T;
}

export async function refreshToken(): Promise<string | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      setAccessToken(null);
      return null;
    }
    const data = await res.json();
    setAccessToken(data.accessToken);
    return data.accessToken;
  } catch {
    setAccessToken(null);
    return null;
  }
}

export { API_BASE_URL };
