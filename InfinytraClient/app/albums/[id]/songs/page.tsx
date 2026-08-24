'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { API_BASE_URL, resolveMediaUrl, type Album, type Song } from '../../../lib/api';

export default function AlbumSongs({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const [album, setAlbum] = useState<Album | null>(null);
    const [songs, setSongs] = useState<Song[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const [albumRes, songsRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/AlbumsApi/${id}`),
                    fetch(`${API_BASE_URL}/api/SongsApi`),
                ]);

                if (!albumRes.ok) throw new Error('Album not found');
                if (!songsRes.ok) throw new Error(`Request failed with status ${songsRes.status}`);

                const albumData: Album = await albumRes.json();
                const allSongs: Song[] = await songsRes.json();
                const albumSongs = allSongs
                    .filter((s) => s.albumId === albumData.id)
                    .sort((a, b) => a.trackNumber - b.trackNumber);

                if (!cancelled) {
                    setAlbum(albumData);
                    setSongs(albumSongs);
                }
            } catch {
                if (!cancelled) setError('Could not load this album. Is the API running?');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [id]);

    if (loading) {
        return <p className="text-center m-5">Loading...</p>;
    }

    if (error || !album) {
        return <h1 className="text-danger d-flex justify-content-center m-5">{error || 'Album not found'}</h1>;
    }

    return (
        <>
            <div className="container-fluid album-container">
                <div className="album-banner">
                    <img src={resolveMediaUrl(album.imageURL)} alt={album.title} />

                    <div>
                        <p>Album</p>
                        <h1>{album.title}</h1>
                        <h5>Infinytra</h5>
                    </div>
                </div>
            </div>
            <br />

            <div className="playlist-container">
                <table className="playlist-table">
                    <thead>
                        <tr>
                            <th style={{ width: 60 }}>#</th>
                            <th>Title</th>
                            <th>Album</th>
                            <th style={{ width: 80 }}>
                                <i className="fa-solid fa-clock"></i>
                            </th>
                            <th style={{ width: 400 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {songs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center">
                                    No songs found for this album.
                                </td>
                            </tr>
                        ) : (
                            songs.map((song, index) => (
                                <tr key={song.id}>
                                    <td className="song-number">{index + 1}</td>
                                    <td className="song-title">{song.name}</td>
                                    <td className="song-album">{song.album?.title ?? album.title ?? 'Single'}</td>
                                    <td className="song-duration">{song.duration}</td>
                                    <td>
                                        <div className="song-actions">
                                            <audio controls className="custom-audio">
                                                <source src={resolveMediaUrl(song.filePath)} type="audio/mpeg" />
                                            </audio>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <br />

            <div className="text-center mb-4">
                <Link href="/albums" className="btn-back-neon">
                    ← Back to Albums
                </Link>
            </div>
        </>
    );
}
