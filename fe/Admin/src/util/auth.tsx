export type Tokens = {
  accessToken: string;
  refreshToken?: string;
  accessTokenAt: number;   // milliseconds
  refreshTokenAt?: number; // milliseconds
  hotelId?: number;
};

const LS_KEY = "auth/tokens";

export function saveTokens(t: Tokens) {
  localStorage.setItem(LS_KEY, JSON.stringify(t));
}

export function getTokens(): Tokens | null {
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Tokens;
  } catch {
    return null;
  }
}

export function clearTokens() {
  localStorage.removeItem(LS_KEY);
}

/**
 * 🔥 Access token expired?
 * Backend gửi về accessTokenAt = timestamp (ms)
 * Chỉ cần so sánh:
 *   accessTokenAt < now
 */
export function isAccessExpired(): boolean {
  const t = getTokens();
  if (!t) return true;

  return t.accessTokenAt <= Date.now();
}
