'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_BASE_URL, authHeaders, type Order } from '../lib/api';
import { useAuth } from '../lib/auth-context';

export default function OrdersPage() {
    const { user, token, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLoading(false);
            return;
        }

        let cancelled = false;

        (async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/OrdersApi`, {
                    headers: authHeaders(token),
                });
                if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
                const data: Order[] = await response.json();
                if (!cancelled) setOrders(data);
            } catch {
                if (!cancelled) setError('Could not load your orders. Is the API running?');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [token]);

    if (authLoading) {
        return <p className="text-center m-5">Loading...</p>;
    }

    if (!user) {
        return (
            <div className="container-fluid homeback1 rounded-container text-center">
                <h1 className="band-title">ORDER HISTORY</h1>
                <p className="text-white mt-3">
                    <Link href="/login">Login</Link> to see your past orders.
                </p>
            </div>
        );
    }

    return (
        <div className="container-fluid homeback1 rounded-container">
            <div className="hero-content text-center">
                <h1 className="band-title">ORDER HISTORY</h1>
                <p className="band-tagline">Everything you&apos;ve bought from us</p>
            </div>

            {loading ? (
                <p className="text-center text-white mt-5">Loading...</p>
            ) : error ? (
                <h4 className="text-danger text-center mt-5">{error}</h4>
            ) : orders.length === 0 ? (
                <p className="text-center text-white mt-5">
                    No orders yet. <Link href="/merch">Browse the merch store</Link>.
                </p>
            ) : (
                <div className="mt-4">
                    {orders.map((order) => (
                        <div key={order.id} className="p-4 mb-3" style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 20 }}>
                            <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                <div>
                                    <strong style={{ color: 'white' }}>Order #{order.id}</strong>
                                    <p className="mb-0" style={{ color: '#ccc' }}>
                                        {new Date(order.orderDate).toLocaleString()}
                                    </p>
                                </div>
                                <span className="badge bg-secondary">{order.status}</span>
                            </div>

                            <hr style={{ borderColor: 'rgba(255,255,255,0.15)' }} />

                            {order.items.map((item) => (
                                <div key={item.id} className="d-flex justify-content-between" style={{ color: '#ccc' }}>
                                    <span>{item.itemName} × {item.qty}</span>
                                    <span>${(item.unitPrice * item.qty).toFixed(2)}</span>
                                </div>
                            ))}

                            <div className="d-flex justify-content-between mt-2" style={{ color: 'white', fontWeight: 'bold' }}>
                                <span>Total</span>
                                <span>${order.total.toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
