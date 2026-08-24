'use client';

import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { API_BASE_URL, resolveMediaUrl, type Member } from '../../lib/api';

export default function MemberDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const [member, setMember] = useState<Member | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/MembersApi/${id}`);
                if (!response.ok) throw new Error('Member not found');
                const data: Member = await response.json();
                if (!cancelled) setMember(data);
            } catch {
                if (!cancelled) setError('Could not load this member. Is the API running?');
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

    if (error || !member) {
        return <h4 className="text-danger text-center m-5">{error || 'Member not found'}</h4>;
    }

    return (
        <div className="container py-4">
            <div className="card p-3 detailsbackcard">
                <div className="d-flex gap-3 align-items-start">
                    <img
                        src={resolveMediaUrl(member.photoURL)}
                        alt={member.name}
                        className="img-thumbnail"
                        style={{ width: 140, height: 140, objectFit: 'cover' }}
                    />
                    <div>
                        <h2 style={{ color: 'white', textShadow: '5px 2px purple' }}>{member.name}</h2>
                        <p style={{ color: 'white', textShadow: '5px 2px purple' }}>Instrument: {member.instrument}</p>
                        <p style={{ color: 'white', textShadow: '5px 2px purple' }}>Description: {member.description}</p>

                        <img src={resolveMediaUrl(member.imageURL)} alt="" style={{ width: 300 }} />

                        <div className="mt-3">
                            <Link href="/members" className="btn-back-neon">
                                ← Back to Members
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
