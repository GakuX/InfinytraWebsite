'use client';

import React, { useEffect, useState } from 'react';
import { API_BASE_URL, resolveMediaUrl, type GalleryImage } from '../lib/api';

export default function GalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [active, setActive] = useState<GalleryImage | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/GalleryApi`);
                if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
                const data: GalleryImage[] = await response.json();
                if (!cancelled) setImages(data);
            } catch {
                if (!cancelled) setError('Could not load the gallery. Is the API running?');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="container-fluid homeback1 rounded-container">
            <div className="hero-content text-center">
                <h1 className="band-title">GALLERY</h1>
                <p className="band-tagline">Behind the scenes</p>
            </div>

            {loading ? (
                <p className="text-center text-white mt-5">Loading gallery...</p>
            ) : error ? (
                <h4 className="text-danger text-center mt-5">{error}</h4>
            ) : images.length === 0 ? (
                <p className="text-center text-white mt-5">No photos yet.</p>
            ) : (
                <div className="row g-4 mt-3">
                    {images.map((image) => (
                        <div className="col-6 col-md-4 col-lg-3" key={image.id}>
                            <div
                                role="button"
                                onClick={() => setActive(image)}
                                style={{ cursor: 'pointer', borderRadius: 14, overflow: 'hidden', position: 'relative' }}
                            >
                                <img
                                    src={resolveMediaUrl(image.imageURL)}
                                    alt={image.caption}
                                    style={{ width: '100%', height: 220, objectFit: 'cover', display: 'block' }}
                                />
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        padding: '8px 10px',
                                        background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                                        color: 'white',
                                        fontSize: '0.85rem',
                                    }}
                                >
                                    {image.caption}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {active && (
                <div
                    onClick={() => setActive(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.85)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2000,
                        cursor: 'zoom-out',
                        padding: 24,
                    }}
                >
                    <img
                        src={resolveMediaUrl(active.imageURL)}
                        alt={active.caption}
                        style={{ maxWidth: '90vw', maxHeight: '80vh', borderRadius: 10 }}
                    />
                    <p className="text-white mt-3">{active.caption}</p>
                </div>
            )}
        </div>
    );
}
