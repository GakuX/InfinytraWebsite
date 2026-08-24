'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth-context';

export default function LoginPage() {
    const { login } = useAuth();
    const router = useRouter();

    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        const result = await login(usernameOrEmail, password);

        setSubmitting(false);

        if (result.ok) {
            router.push('/');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="container-fluid homeback1 rounded-container">
            <div className="d-flex justify-content-center">
                <div className="p-4" style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 20, width: '100%', maxWidth: 420 }}>
                    <h1 className="band-title text-center" style={{ fontSize: '2.5rem' }}>LOGIN</h1>
                    <p className="band-tagline text-center mb-4">Welcome back</p>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label" style={{ color: 'white' }}>Username or Email</label>
                            <input
                                type="text"
                                className="form-control"
                                value={usernameOrEmail}
                                onChange={(e) => setUsernameOrEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label" style={{ color: 'white' }}>Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-outline-light w-100" disabled={submitting}>
                            {submitting ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <p className="text-center mt-3" style={{ color: '#ccc' }}>
                        Don&apos;t have an account? <Link href="/signup">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
