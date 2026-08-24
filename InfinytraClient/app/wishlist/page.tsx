'use client';

import React from 'react';
import Link from 'next/link';
import { resolveMediaUrl } from '../lib/api';
import { useAuth } from '../lib/auth-context';
import { useFavorites } from '../lib/favorites-context';

export default function WishlistPage() {
    const { user, loading: authLoading } = useAuth();
    const { favorites, loading, toggleFavorite } = useFavorites();

    if (authLoading) {
        return <p className="text-center m-5">Loading...</p>;
    }

    if (!user) {
        return (
            <div className="container-fluid homeback1 rounded-container text-center">
                <h1 className="band-title">WISHLIST</h1>
                <p className="text-white mt-3">
                    <Link href="/login">Login</Link> to save your favorite merch.
                </p>
            </div>
        );
    }

    return (
        <div className="container-fluid homeback1 rounded-container">
            <div className="hero-content text-center">
                <h1 className="band-title">WISHLIST</h1>
                <p className="band-tagline">Your favorite merch</p>
            </div>

            {loading ? (
                <p className="text-center text-white mt-5">Loading...</p>
            ) : favorites.length === 0 ? (
                <p className="text-center text-white mt-5">
                    Nothing here yet. <Link href="/merch">Browse the merch store</Link>.
                </p>
            ) : (
                <div className="row g-4 mt-3">
                    {favorites.map((item) => (
                        <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={item.id}>
                            <div className="card h-100 w-100 d-flex flex-column">
                                <img
                                    src={resolveMediaUrl(item.imageURL)}
                                    className="card-img-top"
                                    alt={item.itemName}
                                    style={{ height: 180, objectFit: 'cover' }}
                                />

                                <div className="card-body">
                                    <h5 className="card-title">{item.itemName}</h5>
                                    <p className="mb-1 fw-bold">
                                        ${item.onSale && item.salePrice != null ? item.salePrice : item.price}
                                    </p>

                                    <div className="d-flex gap-2 mt-2">
                                        <Link href={`/merch/${item.id}`} className="btn btn-sm btn-dark">
                                            View
                                        </Link>
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={() => toggleFavorite(item.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
