'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { API_BASE_URL, resolveMediaUrl, type Merch } from '../lib/api';
import { useCart } from '../lib/cart-context';

export default function MerchPage() {
    const [merches, setMerches] = useState<Merch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [q, setQ] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [gender, setGender] = useState('');
    const [inStockOnly, setInStockOnly] = useState(false);
    const [onSaleOnly, setOnSaleOnly] = useState(false);

    const { count } = useCart();

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/MerchesApi`);
                if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
                const data: Merch[] = await response.json();
                if (!cancelled) setMerches(data);
            } catch {
                if (!cancelled) setError('Could not load merch. Is the API running?');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const filtered = useMemo(() => {
        return merches.filter((item) => {
            if (q && !item.itemName.toLowerCase().includes(q.toLowerCase())) return false;
            if (category && item.categories !== category) return false;
            if (gender && item.gender !== gender) return false;
            if (onSaleOnly && !item.onSale) return false;
            if (inStockOnly && !item.inStock) return false;

            if (price === '0-25' && !(item.price < 25)) return false;
            if (price === '25-50' && !(item.price >= 25 && item.price <= 50)) return false;
            if (price === '50-999' && !(item.price > 50)) return false;

            return true;
        });
    }, [merches, q, category, gender, price, inStockOnly, onSaleOnly]);

    const resetFilters = () => {
        setQ('');
        setCategory('');
        setPrice('');
        setGender('');
        setInStockOnly(false);
        setOnSaleOnly(false);
    };

    return (
        <div className="container-fluid">
            <br />

            <div className="row g-4">
                <div className="col-12 col-lg-3" style={{ backgroundColor: 'white', borderRadius: 20 }}>
                    <br />

                    <form onSubmit={(e) => e.preventDefault()}>
                        <h2 className="border-bottom-text" style={{ fontWeight: 'bold' }}>Categories</h2>
                        <br />

                        <input
                            className="form-control mb-3"
                            placeholder="Search..."
                            style={{ width: 250 }}
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />

                        <div className="col">
                            <select
                                className="form-select mb-2"
                                style={{ width: 254, height: 40 }}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                <option value="Shirt">Shirt</option>
                                <option value="Album">Album</option>
                                <option value="Accessories">Accessories</option>
                                <option value="Collections">Collections</option>
                                <option value="Album Special">Album special</option>
                            </select>
                        </div>

                        <br />

                        <h2 className="border-bottom-text" style={{ fontWeight: 'bold' }}>Filters</h2>

                        <br />

                        <select
                            className="row-2 form-select"
                            style={{ width: 254, height: 40, border: 'none' }}
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        >
                            <option value="">Price</option>
                            <option value="0-25">Under $25</option>
                            <option value="25-50">$25 - $50</option>
                            <option value="50-999">$50+</option>
                        </select>

                        <select
                            className="row-2 form-select mb-2"
                            style={{ width: 254, height: 40, border: 'none' }}
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="">Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>

                        <h1></h1>
                        <h1></h1>
                        <h1></h1>

                        <div className="form-check mt-2">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="inStockOnly"
                                checked={inStockOnly}
                                onChange={(e) => setInStockOnly(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="inStockOnly">In stock only</label>
                        </div>

                        <div className="form-check mt-2">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="onSaleOnly"
                                checked={onSaleOnly}
                                onChange={(e) => setOnSaleOnly(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="onSaleOnly">On sale only</label>
                        </div>

                        <div className="d-flex gap-2 mt-3" style={{ paddingTop: 10 }}>
                            <button type="submit" className="btn btn-dark btn-sm">Apply</button>
                            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={resetFilters}>
                                Reset
                            </button>
                        </div>

                        <br />
                        <br />
                    </form>
                </div>

                <div className="col-12 col-lg-7">
                    <div className="container py-4">
                        <h1 style={{ color: 'white' }}>Merch</h1>

                        <div className="row g-4">
                            {loading ? (
                                <p className="text-white">Loading merch...</p>
                            ) : error ? (
                                <h4 className="text-danger">{error}</h4>
                            ) : filtered.length === 0 ? (
                                <h1>item not found</h1>
                            ) : (
                                filtered.map((item) => (
                                    <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={item.id}>
                                        <div className="card h-100 w-100 d-flex flex-column">
                                            <img
                                                src={resolveMediaUrl(item.imageURL)}
                                                className="card-img-top"
                                                alt={item.itemName}
                                                style={{ height: 180, objectFit: 'cover' }}
                                            />

                                            <div className="card-body">
                                                <div>
                                                    {item.newItem ? (
                                                        <h1 style={{ color: 'red', fontWeight: 'bold', fontSize: 30 }}>NEW</h1>
                                                    ) : (
                                                        <h1 style={{ color: 'red', fontSize: 30, fontWeight: 'bold' }}>ALMOST GONE</h1>
                                                    )}

                                                    {!item.inStock && <span className="badge bg-danger">Sold Out</span>}
                                                </div>

                                                <div style={{ paddingTop: 5 }}>
                                                    <h5 className="card-title">{item.itemName}</h5>

                                                    {item.onSale && item.salePrice != null ? (
                                                        <div className="d-flex">
                                                            <span className="text-decoration-line-through fw-bold text-muted">
                                                                ${item.price}
                                                            </span>
                                                            <span
                                                                className="fw-bold text-danger"
                                                                style={{ fontSize: 17, paddingLeft: 10 }}
                                                            >
                                                                ONLY ${item.salePrice}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <p className="mb-1 fw-bold">${item.price}</p>
                                                    )}

                                                    <p className="small text-muted" style={{ paddingTop: 5 }}>
                                                        {item.categories}
                                                    </p>
                                                </div>

                                                <div className="bg-transparent border-0">
                                                    <Link href={`/merch/${item.id}`} className="btn btn-sm btn-dark">
                                                        Item Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-2 d-flex justify-content-end">
                    <div style={{ paddingLeft: 200 }}>
                        <Link href="/cart" style={{ position: 'relative', display: 'inline-block' }}>
                            <i
                                className="fa-solid fa-cart-shopping"
                                style={{ fontSize: 35, paddingRight: 30, color: 'white' }}
                            ></i>
                            {count > 0 && (
                                <span
                                    className="badge bg-danger rounded-pill"
                                    style={{ position: 'absolute', top: -6, right: 14, fontSize: 12 }}
                                >
                                    {count}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
