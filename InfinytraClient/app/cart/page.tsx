'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_BASE_URL, authHeaders, type Merch } from '../lib/api';
import { useCart } from '../lib/cart-context';
import { useAuth } from '../lib/auth-context';

export default function CartPage() {
    const { items, removeFromCart, clearCart } = useCart();
    const { user, token } = useAuth();
    const router = useRouter();
    const [merches, setMerches] = useState<Merch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [checkoutError, setCheckoutError] = useState('');
    const [checkingOut, setCheckingOut] = useState(false);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/MerchesApi`);
                if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
                const data: Merch[] = await response.json();
                if (!cancelled) setMerches(data);
            } catch {
                if (!cancelled) setError('Could not load cart items. Is the API running?');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const lines = items
        .map((item) => {
            const merch = merches.find((m) => m.id === item.id);
            if (!merch) return null;
            const unit = merch.onSale && merch.salePrice != null ? merch.salePrice : merch.price;
            return { merch, qty: item.qty, total: unit * item.qty };
        })
        .filter((line): line is { merch: Merch; qty: number; total: number } => line !== null);

    const subtotal = lines.reduce((sum, line) => sum + line.total, 0);

    const handleCheckout = async () => {
        setCheckoutError('');

        if (!user || !token) {
            router.push('/login');
            return;
        }

        setCheckingOut(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/OrdersApi/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
                body: JSON.stringify({ items: items.map((i) => ({ merchId: i.id, qty: i.qty })) }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                setCheckoutError(data?.message ?? 'Checkout failed. Please try again.');
                return;
            }

            clearCart();
            router.push('/orders');
        } catch {
            setCheckoutError('Could not reach the server. Is the API running?');
        } finally {
            setCheckingOut(false);
        }
    };

    return (
        <div className="container py-4 text-white">
            <h1>Your Cart ({items.length})</h1>

            <Link href="/merch">
                <span className="btn btn-danger text-white">Continue shopping?</span>
            </Link>

            {loading ? (
                <p className="mt-3">Loading...</p>
            ) : error ? (
                <div className="alert alert-danger mt-3">{error}</div>
            ) : lines.length === 0 ? (
                <div className="alert alert-dark mt-3">Cart is empty.</div>
            ) : (
                <>
                    <div className="mt-3">
                        {lines.map(({ merch, qty, total }) => (
                            <div className="card mb-3 p-3" key={merch.id}>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div style={{ paddingTop: 10 }}>
                                        <strong>{merch.itemName}</strong>
                                        <br />
                                        Qty: {qty}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 'bold', fontSize: 20 }}>Total: ${total.toFixed(2)}</div>
                                    </div>
                                </div>
                                <div style={{ paddingTop: 20 }}>
                                    <button className="btn btn-danger" onClick={() => removeFromCart(merch.id)}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="container-fluid" style={{ backgroundColor: 'white' }}>
                        <h3 className="text-black" style={{ fontWeight: 'bold' }}>
                            YOUR SUBTOTAL: ${subtotal.toFixed(2)}
                        </h3>

                        {checkoutError && <div className="alert alert-danger">{checkoutError}</div>}
                        {!user && <p className="text-black">You&apos;ll need to login to check out.</p>}

                        <div>
                            <Link href="/merch" className="btn btn-light" style={{ borderColor: 'black' }}>
                                Keep shopping
                            </Link>

                            <button
                                className="btn btn-dark"
                                style={{ borderColor: 'white', marginLeft: 20 }}
                                onClick={handleCheckout}
                                disabled={checkingOut}
                            >
                                {checkingOut ? 'Placing order...' : user ? 'CHECKOUT' : 'LOGIN TO CHECKOUT'}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
