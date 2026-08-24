'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_BASE_URL, type AuthUser, type AuthResponse } from './api';

type AuthResult = { ok: true } | { ok: false; error: string };

interface AuthContextValue {
    user: AuthUser | null;
    token: string | null;
    loading: boolean;
    login: (usernameOrEmail: string, password: string) => Promise<AuthResult>;
    register: (username: string, email: string, password: string) => Promise<AuthResult>;
    logout: () => void;
}

const STORAGE_KEY = 'infinytra_auth';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // One-time hydration from a browser-only store (localStorage isn't available during SSR).
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed: AuthResponse = JSON.parse(stored);
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setToken(parsed.token);
                setUser({ id: parsed.id, username: parsed.username, email: parsed.email, isAdmin: parsed.isAdmin });
            }
        } catch {
            // ignore malformed storage
        } finally {
            setLoading(false);
        }
    }, []);

    const persist = (data: AuthResponse) => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setToken(data.token);
        setUser({ id: data.id, username: data.username, email: data.email, isAdmin: data.isAdmin });
    };

    const login = async (usernameOrEmail: string, password: string): Promise<AuthResult> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/AuthApi/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usernameOrEmail, password }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                return { ok: false, error: data?.message ?? 'Invalid username/email or password.' };
            }

            const data: AuthResponse = await response.json();
            persist(data);
            return { ok: true };
        } catch {
            return { ok: false, error: 'Could not reach the server. Is the API running?' };
        }
    };

    const register = async (username: string, email: string, password: string): Promise<AuthResult> => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/AuthApi/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                return { ok: false, error: data?.message ?? 'Could not create your account.' };
            }

            const data: AuthResponse = await response.json();
            persist(data);
            return { ok: true };
        } catch {
            return { ok: false, error: 'Could not reach the server. Is the API running?' };
        }
    };

    const logout = () => {
        window.localStorage.removeItem(STORAGE_KEY);
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
}
