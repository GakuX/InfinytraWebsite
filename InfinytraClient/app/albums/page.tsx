'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { API_BASE_URL, resolveMediaUrl, type Album } from '../lib/api';

export default function Albums() {
    const [albums, setAlbums] = useState<Album[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/AlbumsApi`);
                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }
                const data: Album[] = await response.json();
                if (!cancelled) setAlbums(data);
            } catch {
                if (!cancelled) setError('Could not load albums. Is the API running?');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    const filteredAlbums = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return albums;
        return albums.filter((album) => album.title?.toLowerCase().includes(query));
    }, [albums, search]);

    return (
        <div className="albumBackground">
            <h1 className="text-center text-dark mb-4">Albums</h1>

            <form className="mb-4" onSubmit={(e) => e.preventDefault()}>
                <div className="row d-flex justify-content-center">
                    <div className="col-md-4" style={{ height: 50 }}>
                        <div className="input-group">
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="Search by album name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ height: 46 }}
                            />
                            <button type="submit" className="btn btn-edit">
                                <i className="fas fa-search"></i> Search
                            </button>
                            {search && (
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary"
                                    onClick={() => setSearch('')}
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </form>

            <div className="row d-flex justify-content-center">
                {loading ? (
                    <p className="text-center">Loading albums...</p>
                ) : error ? (
                    <h1 className="text-danger d-flex justify-content-center">{error}</h1>
                ) : filteredAlbums.length === 0 ? (
                    <h1 className="text-danger d-flex justify-content-center">item not found</h1>
                ) : (
                    filteredAlbums.map((album) => (
                        <div className="col-lg-3 col-md-4" key={album.id}>
                            <div className="album-card h-100 shadow-sm" style={{ backgroundColor: '#1b001b', color: 'white' }}>
                                <div className="album-image-container">
                                    <img
                                        src={resolveMediaUrl(album.imageURL)}
                                        className="card-img-top"
                                        alt={album.title}
                                        style={{ height: 500, objectFit: 'cover' }}
                                    />

                                    <div className="album-content">
                                        <h4 className="album-title">{album.title}</h4>

                                        <p className="album-description">{album.description}</p>

                                        <div className="album-buttons">
                                            <Link href={`/albums/${album.id}/songs`} className="btn btn-view">
                                                View Songs
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
