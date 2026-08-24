'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/auth-context';

export default function SignupPage() {
    const { register } = useAuth();
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setSubmitting(true);
        const result = await register(username, email, password);
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
                    <h1 className="band-title text-center" style={{ fontSize: '2.5rem' }}>SIGN UP</h1>
                    <p className="band-tagline text-center mb-4">Join the family</p>

                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label" style={{ color: 'white' }}>Username</label>
                            <input
                                type="text"
                                className="form-control"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label" style={{ color: 'white' }}>Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                                minLength={6}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label" style={{ color: 'white' }}>Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                minLength={6}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-outline-light w-100" disabled={submitting}>
                            {submitting ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>

                    <p className="text-center mt-3" style={{ color: '#ccc' }}>
                        Already have an account? <Link href="/login">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
