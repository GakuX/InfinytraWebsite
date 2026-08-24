'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth-context';

export default function AuthNavItem() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    const navLinkStyle = { color: 'white', fontSize: '20px', fontWeight: 'bold' as const };

    if (loading) {
        return null;
    }

    if (!user) {
        return (
            <>
                <li className="nav-item">
                    <Link href="/login" className="nav-link" style={navLinkStyle}>
                        Login
                    </Link>
                </li>
                <li className="nav-item">
                    <Link href="/signup" className="nav-link" style={navLinkStyle}>
                        Sign Up
                    </Link>
                </li>
            </>
        );
    }

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <>
            <li className="nav-item">
                <Link href="/wishlist" className="nav-link" style={navLinkStyle}>
                    Wishlist
                </Link>
            </li>
            <li className="nav-item">
                <Link href="/orders" className="nav-link" style={navLinkStyle}>
                    Orders
                </Link>
            </li>
            {user.isAdmin && (
                <li className="nav-item">
                    <Link href="/admin" className="nav-link" style={{ ...navLinkStyle, color: '#ff0055' }}>
                        Admin
                    </Link>
                </li>
            )}
            <li className="nav-item d-flex align-items-center gap-2">
                <span style={navLinkStyle}>Hi, {user.username}</span>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-light"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </li>
        </>
    );
}
