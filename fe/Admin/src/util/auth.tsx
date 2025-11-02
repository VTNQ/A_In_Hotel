export type Tokens={
    accessToken:string;
    refreshToken?:string;
    accessTokenAt:number;
    refreshTokenAt?:number;
}
const LS_KEY="auth/tokens";
export function saveTokens(t:Tokens){
    localStorage.setItem(LS_KEY,JSON.stringify(t));
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

function toMillis(epoch: number) {
  return epoch < 1e12 ? epoch * 1000 : epoch;
}
export function isAccessExpired(): boolean {
  const t = getTokens();
  if (!t) return true;
  return toMillis(t.accessTokenAt)  <= Date.now();
}
