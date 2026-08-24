'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { API_BASE_URL, authHeaders, type Merch } from './api';
import { useAuth } from './auth-context';

interface FavoritesContextValue {
    favorites: Merch[];
    favoriteIds: Set<number>;
    loading: boolean;
    isFavorite: (merchId: number) => boolean;
    toggleFavorite: (merchId: number) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const { user, token } = useAuth();
    const [favorites, setFavorites] = useState<Merch[]>([]);
    const [loading, setLoading] = useState(false);

    const refresh = useCallback(async () => {
        if (!token) {
            setFavorites([]);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/FavoritesApi`, {
                headers: authHeaders(token),
            });
            if (response.ok) {
                setFavorites(await response.json());
            }
        } catch {
            // leave favorites as-is; pages that need them show their own error state
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        refresh();
    }, [refresh, user?.id]);

    const favoriteIds = new Set(favorites.map((m) => m.id));

    const isFavorite = (merchId: number) => favoriteIds.has(merchId);

    const toggleFavorite = async (merchId: number) => {
        if (!token) return;

        const currentlyFavorited = favoriteIds.has(merchId);

        try {
            if (currentlyFavorited) {
                await fetch(`${API_BASE_URL}/api/FavoritesApi/${merchId}`, {
                    method: 'DELETE',
                    headers: authHeaders(token),
                });
            } else {
                await fetch(`${API_BASE_URL}/api/FavoritesApi/${merchId}`, {
                    method: 'POST',
                    headers: authHeaders(token),
                });
            }
            await refresh();
        } catch {
            // no-op - UI stays at its last known state
        }
    };

    return (
        <FavoritesContext.Provider value={{ favorites, favoriteIds, loading, isFavorite, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const ctx = useContext(FavoritesContext);
    if (!ctx) throw new Error('useFavorites must be used within a FavoritesProvider');
    return ctx;
}
