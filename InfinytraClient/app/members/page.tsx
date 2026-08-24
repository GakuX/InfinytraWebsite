'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { API_BASE_URL, resolveMediaUrl, type Member } from '../lib/api';

export default function Members() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/MembersApi`);
                if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
                const data: Member[] = await response.json();
                if (!cancelled) setMembers(data);
            } catch {
                if (!cancelled) setError('Could not load band members. Is the API running?');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="members-page-bg">
            <div className="container py-5">
                <h1 className="text-center text-white mb-4 band-title glow-charge">Band Members</h1>

                {loading ? (
                    <p className="text-center text-white">Loading band members...</p>
                ) : error ? (
                    <h4 className="text-danger text-center">{error}</h4>
                ) : (
                    <div className="row g-4" style={{ paddingTop: 15 }}>
                        {members.map((item, i) => (
                            <div className="col-12 col-sm-6 col-md-3 d-flex align-items-stretch" key={item.id}>
                                <div
                                    className="card profile-card glow-charge w-100 p-3 d-flex flex-row align-items-start"
                                    style={{
                                        backgroundImage: "url('/images/purplebac.png')",
                                        animationDelay: `${i * 0.15}s`,
                                    }}
                                >
                                    <img className="avatar" src={resolveMediaUrl(item.photoURL)} alt={item.name} />

                                    <div className="profile-body ms-3" style={{ color: 'white' }}>
                                        <h5 className="profile-name mb-1">{item.name}</h5>

                                        <p style={{ fontWeight: 'bold', paddingTop: 10 }}>{item.role}</p>

                                        <p style={{ fontWeight: 'bold' }}>{item.description}</p>

                                        <div className="card profilebutton mt-3" style={{ backgroundColor: 'black', color: 'white' }}>
                                            <Link
                                                href={`/members/${item.id}`}
                                                className="btn btn-sm btn-light"
                                                style={{ backgroundColor: 'darkviolet', color: 'white' }}
                                            >
                                                Details
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
