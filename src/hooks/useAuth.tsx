import { createContext, useContext, useMemo, useState } from 'react';

export type LocalUser = { username: string; displayName: string; passwordHash: string; createdAt: string; acceptedTermsAt: string };
type AuthResult = { ok: boolean; message?: string };
type AuthContextValue = { user: LocalUser | null; login: (username: string, password: string) => Promise<AuthResult>; register: (displayName: string, username: string, password: string) => Promise<AuthResult>; logout: () => void };

const ACCOUNTS_KEY = 'digital-sadhana-accounts-v1';
const SESSION_KEY = 'digital-sadhana-session-v1';
const AuthContext = createContext<AuthContextValue | null>(null);

function getAccounts(): LocalUser[] {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]'); } catch { return []; }
}

async function hashPassword(password: string) {
  const bytes = new TextEncoder().encode(`digital-sadhana-v1:${password}`);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [username, setUsername] = useState(() => localStorage.getItem(SESSION_KEY));
  const user = getAccounts().find((account) => account.username === username) || null;

  async function register(displayName: string, rawUsername: string, password: string): Promise<AuthResult> {
    const normalized = rawUsername.trim().toLowerCase();
    if (!/^[a-z0-9._-]{3,24}$/.test(normalized)) return { ok: false, message: 'Use 3–24 letters, numbers, dots, dashes, or underscores.' };
    if (password.length < 6) return { ok: false, message: 'Use at least 6 characters for your password.' };
    const accounts = getAccounts();
    if (accounts.some((account) => account.username === normalized)) return { ok: false, message: 'That username already exists on this device.' };
    const account: LocalUser = { username: normalized, displayName: displayName.trim() || normalized, passwordHash: await hashPassword(password), createdAt: new Date().toISOString(), acceptedTermsAt: new Date().toISOString() };
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, account]));
    const legacy = localStorage.getItem('digital-sadhana-v1');
    if (accounts.length === 0 && legacy) localStorage.setItem(`digital-sadhana-user:${normalized}`, legacy);
    localStorage.setItem(SESSION_KEY, normalized);
    setUsername(normalized);
    return { ok: true };
  }

  async function login(rawUsername: string, password: string): Promise<AuthResult> {
    const normalized = rawUsername.trim().toLowerCase();
    const account = getAccounts().find((item) => item.username === normalized);
    if (!account || account.passwordHash !== await hashPassword(password)) return { ok: false, message: 'Username or password is incorrect.' };
    localStorage.setItem(SESSION_KEY, normalized);
    setUsername(normalized);
    return { ok: true };
  }

  function logout() { localStorage.removeItem(SESSION_KEY); setUsername(null); }
  const value = useMemo(() => ({ user, login, register, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthProvider missing');
  return context;
}
