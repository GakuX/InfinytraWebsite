'use client';

// InfinytraServer keeps the cart in an ASP.NET Core session (HttpContext.Session, cookie-based)
// via the non-API Carts/Add and Carts/RemoveItem MVC actions. Those return HTML redirects and
// require an antiforgery token, so they aren't practical to call from a decoupled React client.
// This reimplements the same { id, qty } shape client-side, persisted to localStorage instead.

import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
    id: number;
    qty: number;
}

interface CartContextValue {
    items: CartItem[];
    addToCart: (id: number, qty: number) => void;
    removeFromCart: (id: number) => void;
    clearCart: () => void;
    count: number;
}

const STORAGE_KEY = 'infinytra_cart';

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        // One-time hydration from a browser-only store (localStorage isn't available during SSR).
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            // eslint-disable-next-line react-hooks/set-state-in-effect
            if (stored) setItems(JSON.parse(stored));
        } catch {
            // ignore malformed storage
        } finally {
            setHydrated(true);
        }
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items, hydrated]);

    const addToCart = (id: number, qty: number) => {
        if (qty < 1) qty = 1;
        setItems((prev) => {
            const existing = prev.find((i) => i.id === id);
            if (existing) {
                return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i));
            }
            return [...prev, { id, qty }];
        });
    };

    const removeFromCart = (id: number) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    };

    const clearCart = () => {
        setItems([]);
    };

    const count = items.reduce((sum, i) => sum + i.qty, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, count }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within a CartProvider');
    return ctx;
}
