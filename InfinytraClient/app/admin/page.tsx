'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    API_BASE_URL,
    authHeaders,
    type Album,
    type GalleryImage,
    type Merch,
    type NewsPost,
    type TourDate,
} from '../lib/api';
import { useAuth } from '../lib/auth-context';

type Tab = 'merch' | 'albums' | 'news' | 'tours' | 'gallery';

export default function AdminPage() {
    const { user, token, loading: authLoading } = useAuth();
    const [tab, setTab] = useState<Tab>('merch');

    if (authLoading) {
        return <p className="text-center m-5">Loading...</p>;
    }

    if (!user) {
        return (
            <div className="container-fluid homeback1 rounded-container text-center">
                <h1 className="band-title">ADMIN</h1>
                <p className="text-white mt-3">
                    <Link href="/login">Login</Link> with an admin account to continue.
                </p>
            </div>
        );
    }

    if (!user.isAdmin) {
        return (
            <div className="container-fluid homeback1 rounded-container text-center">
                <h1 className="band-title">ADMIN</h1>
                <p className="text-white mt-3">Your account doesn&apos;t have admin access.</p>
            </div>
        );
    }

    const tabs: { key: Tab; label: string }[] = [
        { key: 'merch', label: 'Merch' },
        { key: 'albums', label: 'Albums' },
        { key: 'news', label: 'News' },
        { key: 'tours', label: 'Tour Dates' },
        { key: 'gallery', label: 'Gallery' },
    ];

    return (
        <div className="container-fluid homeback1 rounded-container">
            <div className="hero-content text-center">
                <h1 className="band-title">ADMIN</h1>
                <p className="band-tagline">Manage site content</p>
            </div>

            <ul className="nav nav-pills justify-content-center mt-4 mb-4 gap-2">
                {tabs.map((t) => (
                    <li className="nav-item" key={t.key}>
                        <button
                            type="button"
                            className={`btn btn-sm ${tab === t.key ? 'btn-light' : 'btn-outline-light'}`}
                            onClick={() => setTab(t.key)}
                        >
                            {t.label}
                        </button>
                    </li>
                ))}
            </ul>

            <div className="p-4" style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 20 }}>
                {tab === 'merch' && <MerchAdmin token={token} />}
                {tab === 'albums' && <AlbumsAdmin token={token} />}
                {tab === 'news' && <NewsAdmin token={token} />}
                {tab === 'tours' && <ToursAdmin token={token} />}
                {tab === 'gallery' && <GalleryAdmin token={token} />}
            </div>
        </div>
    );
}

function ErrorBox({ message }: { message: string }) {
    if (!message) return null;
    return <div className="alert alert-danger">{message}</div>;
}

// ===== Merch =====

function MerchAdmin({ token }: { token: string | null }) {
    const [items, setItems] = useState<Merch[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [itemName, setItemName] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [price, setPrice] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [categories, setCategories] = useState('Shirt');
    const [inStock, setInStock] = useState(true);
    const [newItem, setNewItem] = useState(true);

    const load = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/MerchesApi`);
            if (response.ok) setItems(await response.json());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        load();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const response = await fetch(`${API_BASE_URL}/api/MerchesApi`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
            body: JSON.stringify({
                itemName,
                itemDescription,
                price: Number(price),
                imageURL,
                categories,
                inStock,
                newItem,
                onSale: false,
            }),
        });

        if (!response.ok) {
            setError('Could not create item.');
            return;
        }

        setItemName(''); setItemDescription(''); setPrice(''); setImageURL('');
        await load();
    };

    const handleDelete = async (id: number) => {
        await fetch(`${API_BASE_URL}/api/MerchesApi/${id}`, { method: 'DELETE', headers: authHeaders(token) });
        await load();
    };

    return (
        <div>
            <h4 className="text-white">Add Merch Item</h4>
            <ErrorBox message={error} />
            <form onSubmit={handleCreate} className="row g-2 mb-4">
                <div className="col-md-3"><input className="form-control" placeholder="Name" value={itemName} onChange={(e) => setItemName(e.target.value)} required /></div>
                <div className="col-md-3"><input className="form-control" placeholder="Description" value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} /></div>
                <div className="col-md-2"><input className="form-control" placeholder="Price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required /></div>
                <div className="col-md-2"><input className="form-control" placeholder="/images/xyz.png" value={imageURL} onChange={(e) => setImageURL(e.target.value)} required /></div>
                <div className="col-md-2">
                    <select className="form-select" value={categories} onChange={(e) => setCategories(e.target.value)}>
                        <option value="Shirt">Shirt</option>
                        <option value="Album">Album</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Hoodie">Hoodie</option>
                        <option value="Collections">Collections</option>
                    </select>
                </div>
                <div className="col-md-6 d-flex gap-3 align-items-center">
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="inStock" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
                        <label className="form-check-label text-white" htmlFor="inStock">In stock</label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="newItem" checked={newItem} onChange={(e) => setNewItem(e.target.checked)} />
                        <label className="form-check-label text-white" htmlFor="newItem">New item</label>
                    </div>
                </div>
                <div className="col-md-6 text-end">
                    <button type="submit" className="btn btn-outline-light">Add Item</button>
                </div>
            </form>

            <h4 className="text-white">Existing Items</h4>
            {loading ? <p className="text-white">Loading...</p> : (
                <table className="table table-dark table-sm">
                    <thead><tr><th>Name</th><th>Price</th><th>Category</th><th>Stock</th><th></th></tr></thead>
                    <tbody>
                        {items.map((m) => (
                            <tr key={m.id}>
                                <td>{m.itemName}</td>
                                <td>${m.price}</td>
                                <td>{m.categories}</td>
                                <td>{m.inStock ? 'In stock' : 'Sold out'}</td>
                                <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(m.id)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

// ===== Albums =====

function AlbumsAdmin({ token }: { token: string | null }) {
    const [items, setItems] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageURL, setImageURL] = useState('');

    const load = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/AlbumsApi`);
            if (response.ok) setItems(await response.json());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        load();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const response = await fetch(`${API_BASE_URL}/api/AlbumsApi`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
            body: JSON.stringify({ title, description, imageURL, songFile: '', createdDate: new Date().toISOString() }),
        });

        if (!response.ok) {
            setError('Could not create album.');
            return;
        }

        setTitle(''); setDescription(''); setImageURL('');
        await load();
    };

    const handleDelete = async (id: number) => {
        await fetch(`${API_BASE_URL}/api/AlbumsApi/${id}`, { method: 'DELETE', headers: authHeaders(token) });
        await load();
    };

    return (
        <div>
            <h4 className="text-white">Add Album</h4>
            <ErrorBox message={error} />
            <form onSubmit={handleCreate} className="row g-2 mb-4">
                <div className="col-md-4"><input className="form-control" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
                <div className="col-md-4"><input className="form-control" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
                <div className="col-md-3"><input className="form-control" placeholder="/images/xyz.png" value={imageURL} onChange={(e) => setImageURL(e.target.value)} required /></div>
                <div className="col-md-1"><button type="submit" className="btn btn-outline-light w-100">Add</button></div>
            </form>

            <h4 className="text-white">Existing Albums</h4>
            {loading ? <p className="text-white">Loading...</p> : (
                <table className="table table-dark table-sm">
                    <thead><tr><th>Title</th><th>Description</th><th></th></tr></thead>
                    <tbody>
                        {items.map((a) => (
                            <tr key={a.id}>
                                <td>{a.title}</td>
                                <td>{a.description}</td>
                                <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(a.id)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

// ===== News =====

function NewsAdmin({ token }: { token: string | null }) {
    const [items, setItems] = useState<NewsPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [title, setTitle] = useState('');
    const [blurb, setBlurb] = useState('');

    const load = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/NewsApi`);
            if (response.ok) setItems(await response.json());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        load();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const response = await fetch(`${API_BASE_URL}/api/NewsApi`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
            body: JSON.stringify({ title, blurb, postedDate: new Date().toISOString() }),
        });

        if (!response.ok) {
            setError('Could not create news post.');
            return;
        }

        setTitle(''); setBlurb('');
        await load();
    };

    const handleDelete = async (id: number) => {
        await fetch(`${API_BASE_URL}/api/NewsApi/${id}`, { method: 'DELETE', headers: authHeaders(token) });
        await load();
    };

    return (
        <div>
            <h4 className="text-white">Add News Post</h4>
            <ErrorBox message={error} />
            <form onSubmit={handleCreate} className="row g-2 mb-4">
                <div className="col-md-4"><input className="form-control" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
                <div className="col-md-6"><input className="form-control" placeholder="Blurb" value={blurb} onChange={(e) => setBlurb(e.target.value)} required /></div>
                <div className="col-md-2"><button type="submit" className="btn btn-outline-light w-100">Add</button></div>
            </form>

            <h4 className="text-white">Existing Posts</h4>
            {loading ? <p className="text-white">Loading...</p> : (
                <table className="table table-dark table-sm">
                    <thead><tr><th>Title</th><th>Date</th><th></th></tr></thead>
                    <tbody>
                        {items.map((n) => (
                            <tr key={n.id}>
                                <td>{n.title}</td>
                                <td>{new Date(n.postedDate).toLocaleDateString()}</td>
                                <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(n.id)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

// ===== Tour Dates =====

function ToursAdmin({ token }: { token: string | null }) {
    const [items, setItems] = useState<TourDate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showDate, setShowDate] = useState('');
    const [venue, setVenue] = useState('');
    const [location, setLocation] = useState('');

    const load = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/TourDatesApi`);
            if (response.ok) setItems(await response.json());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        load();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const response = await fetch(`${API_BASE_URL}/api/TourDatesApi`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
            body: JSON.stringify({ showDate: new Date(showDate).toISOString(), venue, location }),
        });

        if (!response.ok) {
            setError('Could not create tour date.');
            return;
        }

        setShowDate(''); setVenue(''); setLocation('');
        await load();
    };

    const handleDelete = async (id: number) => {
        await fetch(`${API_BASE_URL}/api/TourDatesApi/${id}`, { method: 'DELETE', headers: authHeaders(token) });
        await load();
    };

    return (
        <div>
            <h4 className="text-white">Add Tour Date</h4>
            <ErrorBox message={error} />
            <form onSubmit={handleCreate} className="row g-2 mb-4">
                <div className="col-md-3"><input className="form-control" type="date" value={showDate} onChange={(e) => setShowDate(e.target.value)} required /></div>
                <div className="col-md-4"><input className="form-control" placeholder="Venue" value={venue} onChange={(e) => setVenue(e.target.value)} required /></div>
                <div className="col-md-3"><input className="form-control" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} required /></div>
                <div className="col-md-2"><button type="submit" className="btn btn-outline-light w-100">Add</button></div>
            </form>

            <h4 className="text-white">Upcoming Shows</h4>
            {loading ? <p className="text-white">Loading...</p> : (
                <table className="table table-dark table-sm">
                    <thead><tr><th>Date</th><th>Venue</th><th>Location</th><th></th></tr></thead>
                    <tbody>
                        {items.map((t) => (
                            <tr key={t.id}>
                                <td>{new Date(t.showDate).toLocaleDateString()}</td>
                                <td>{t.venue}</td>
                                <td>{t.location}</td>
                                <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(t.id)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

// ===== Gallery =====

function GalleryAdmin({ token }: { token: string | null }) {
    const [items, setItems] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [imageURL, setImageURL] = useState('');
    const [caption, setCaption] = useState('');
    const [category, setCategory] = useState('Band');

    const load = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/api/GalleryApi`);
            if (response.ok) setItems(await response.json());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        load();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const response = await fetch(`${API_BASE_URL}/api/GalleryApi`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
            body: JSON.stringify({ imageURL, caption, category }),
        });

        if (!response.ok) {
            setError('Could not add photo.');
            return;
        }

        setImageURL(''); setCaption('');
        await load();
    };

    const handleDelete = async (id: number) => {
        await fetch(`${API_BASE_URL}/api/GalleryApi/${id}`, { method: 'DELETE', headers: authHeaders(token) });
        await load();
    };

    return (
        <div>
            <h4 className="text-white">Add Photo</h4>
            <ErrorBox message={error} />
            <form onSubmit={handleCreate} className="row g-2 mb-4">
                <div className="col-md-4"><input className="form-control" placeholder="/images/xyz.png" value={imageURL} onChange={(e) => setImageURL(e.target.value)} required /></div>
                <div className="col-md-4"><input className="form-control" placeholder="Caption" value={caption} onChange={(e) => setCaption(e.target.value)} /></div>
                <div className="col-md-3">
                    <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="Band">Band</option>
                        <option value="Live">Live</option>
                        <option value="Gear">Gear</option>
                        <option value="Album">Album</option>
                    </select>
                </div>
                <div className="col-md-1"><button type="submit" className="btn btn-outline-light w-100">Add</button></div>
            </form>

            <h4 className="text-white">Existing Photos</h4>
            {loading ? <p className="text-white">Loading...</p> : (
                <table className="table table-dark table-sm">
                    <thead><tr><th>Caption</th><th>Category</th><th></th></tr></thead>
                    <tbody>
                        {items.map((g) => (
                            <tr key={g.id}>
                                <td>{g.caption}</td>
                                <td>{g.category}</td>
                                <td><button className="btn btn-sm btn-danger" onClick={() => handleDelete(g.id)}>Delete</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
