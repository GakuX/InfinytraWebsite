'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { API_BASE_URL, authHeaders, resolveMediaUrl, type Merch, type Review } from '../../lib/api';
import { useCart } from '../../lib/cart-context';
import { useAuth } from '../../lib/auth-context';
import { useFavorites } from '../../lib/favorites-context';

export default function MerchDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const [merch, setMerch] = useState<Merch | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);

    const [reviews, setReviews] = useState<Review[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviewError, setReviewError] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    const { addToCart } = useCart();
    const { user, token } = useAuth();
    const { isFavorite, toggleFavorite } = useFavorites();

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/MerchesApi/${id}`);
                if (!response.ok) throw new Error('Item not found');
                const data: Merch = await response.json();
                if (!cancelled) setMerch(data);
            } catch {
                if (!cancelled) setError('Could not load this item. Is the API running?');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [id]);

    const loadReviews = async () => {
        setReviewsLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/ReviewsApi/merch/${id}`);
            if (response.ok) setReviews(await response.json());
        } catch {
            // leave reviews as-is
        } finally {
            setReviewsLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (loading) {
        return <p className="text-center m-5">Loading...</p>;
    }

    if (error || !merch) {
        return <h4 className="text-danger text-center m-5">{error || 'Item not found'}</h4>;
    }

    const handleAddToCart = (e: React.FormEvent) => {
        e.preventDefault();
        addToCart(merch.id, qty);
        setAdded(true);
    };

    const alreadyReviewed = user ? reviews.some((r) => r.userId === user.id) : false;
    const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null;

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        setReviewError('');

        if (!token) return;

        setSubmittingReview(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/ReviewsApi/merch/${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
                body: JSON.stringify({ rating, comment }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => null);
                setReviewError(data?.message ?? 'Could not submit your review.');
                return;
            }

            setComment('');
            setRating(5);
            await loadReviews();
        } catch {
            setReviewError('Could not reach the server. Is the API running?');
        } finally {
            setSubmittingReview(false);
        }
    };

    const favorited = isFavorite(merch.id);

    return (
        <div className="container-fluid py-4" style={{ backgroundColor: 'white', color: 'black' }}>
            <div className="row">
                <div className="col-12 col-lg-6" style={{ paddingLeft: 250 }}>
                    <img src={resolveMediaUrl(merch.imageURL)} alt={merch.itemName} style={{ width: 700 }} />
                </div>

                <div className="col-12 col-lg-6" style={{color:'black', paddingRight: 100 }}>
                    <div className="d-flex align-items-center gap-3">
                        <h1 className="mb-0">{merch.itemName}</h1>
                        {user && (
                            <button
                                type="button"
                                className="btn btn-sm"
                                style={{ border: '1px solid #ccc' }}
                                onClick={() => toggleFavorite(merch.id)}
                                aria-label={favorited ? 'Remove from wishlist' : 'Add to wishlist'}
                            >
                                <i className={favorited ? 'fa-solid fa-heart' : 'fa-regular fa-heart'} style={{ color: '#ff0055' }}></i>
                            </button>
                        )}
                    </div>

                    {averageRating != null && (
                        <p className="mt-2">
                            {'★'.repeat(Math.round(averageRating))}{'☆'.repeat(5 - Math.round(averageRating))}{' '}
                            <span className="text-muted">({reviews.length} review{reviews.length === 1 ? '' : 's'})</span>
                        </p>
                    )}

                    <br />
                    <h4>{merch.itemDescription}</h4>
                    <br />
                    <h2 style={{ fontWeight: 'bold' }}>
                        ${merch.onSale && merch.salePrice != null ? merch.salePrice : merch.price}
                    </h2>
                    <br />

                    {merch.inStock ? (
                        <h2>Availability IN STOCK</h2>
                    ) : (
                        <h2>
                            <span style={{ fontWeight: 'bold' }}>Availability</span>{' '}
                            <span style={{ color: 'red', fontSize: 25 }}>OUT OF STOCK</span>
                        </h2>
                    )}

                    <br />

                    <div className="d-flex align-items-center gap-4">
                        <form onSubmit={handleAddToCart} className="d-flex align-items-center gap-4 m-0">
                            <input
                                type="number"
                                className="form-control"
                                style={{ width: 80 }}
                                value={qty}
                                min={1}
                                onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
                            />

                            {merch.inStock ? (
                                <button type="submit" className="btn btn-sm btn-dark">
                                    <i className="fa-solid fa-cart-shopping me-1"></i>
                                    Add to cart
                                </button>
                            ) : (
                                <button type="button" className="btn btn-danger" disabled>
                                    UNAVAILABLE
                                </button>
                            )}
                        </form>
                    </div>

                    {added && (
                        <p className="text-success mt-2">
                            Added to cart. <Link href="/cart">View cart</Link>
                        </p>
                    )}

                    <br />
                    <div>
                        <Link href="/merch">
                            <button className="btn btn-dark">go back</button>
                        </Link>
                    </div>
                </div>
            </div>

            <hr className="my-4" />

            <div className="row">
                <div className="col-12 col-lg-8" style={{ margin: '0 auto', float: 'none' }}>
                    <h3>Reviews</h3>

                    {reviewsLoading ? (
                        <p>Loading reviews...</p>
                    ) : reviews.length === 0 ? (
                        <p className="text-muted">No reviews yet.</p>
                    ) : (
                        <div className="mb-4">
                            {reviews.map((review) => (
                                <div key={review.id} className="border-bottom py-2">
                                    <strong>{review.username}</strong>{' '}
                                    <span style={{ color: '#ff0055' }}>
                                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                    </span>
                                    <p className="mb-0">{review.comment}</p>
                                    <small className="text-muted">{new Date(review.createdDate).toLocaleDateString()}</small>
                                </div>
                            ))}
                        </div>
                    )}

                    {!user ? (
                        <p>
                            <Link href="/login">Login</Link> to leave a review.
                        </p>
                    ) : alreadyReviewed ? (
                        <p className="text-muted">You&apos;ve already reviewed this item.</p>
                    ) : (
                        <form onSubmit={handleSubmitReview} className="mt-3">
                            {reviewError && <div className="alert alert-danger">{reviewError}</div>}

                            <div className="mb-2">
                                <label className="form-label">Rating</label>
                                <select
                                    className="form-select"
                                    style={{ width: 120 }}
                                    value={rating}
                                    onChange={(e) => setRating(Number(e.target.value))}
                                >
                                    {[5, 4, 3, 2, 1].map((n) => (
                                        <option key={n} value={n}>{n} star{n === 1 ? '' : 's'}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-2">
                                <label className="form-label">Comment</label>
                                <textarea
                                    className="form-control"
                                    rows={3}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn-dark" disabled={submittingReview}>
                                {submittingReview ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
