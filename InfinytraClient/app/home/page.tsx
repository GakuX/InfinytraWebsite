'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Modal from 'react-bootstrap/Modal';
import { API_BASE_URL } from '../lib/api';

export default function Home() {
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState('');

    const openModal = async (url: string, title: string) => {
        setShowModal(true);
        setModalTitle(title);
        setModalContent('Loading...');

        try {
            const response = await fetch(url);
            const html = await response.text();
            setModalContent(html);
        } catch {
            setModalContent('<div class="alert alert-danger">Could not load content.</div>');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setModalContent('');
    };

    return (
        <>
            <div className="container-fluid homeback1 rounded-container">
                {/* Hero Section */}
                <div className="hero-content text-center">
                    <h1 className="band-title">INFINYTRA</h1>
                    <p className="band-tagline">Welcome to the family</p>

                    <div className="hero-buttons button2fonts">
                        <Link href="/albums" className="btn btn-outline-light">
                            Explore Albums
                        </Link>
                        <Link href="/contact" className="btn btn-outline-light">
                            Contact
                        </Link>
                    </div>

                    <div className="about-preview">
                        <p style={{ fontWeight: 'bold' }}>
                            Infinytra is a Metalcore band striving to create songs with different and unique sound
                        </p>
                    </div>
                </div>

                {/* Featured Album Section */}
                <div className="text-center my-5">
                    <div className="featured-album">
                        <img src="/images/vermillion.png" alt="Album cover" style={{ maxWidth: 250, borderRadius: 15 }} />
                        <h3 className="mt-3">Check Our Latest Release!</h3>
                        <p style={{ color: 'white' }}>Debut Album • 2025</p>

                        <div className="d-flex justify-content-center gap-3 flex-wrap button2fonts">
                            <button
                                className="btn btn-outline-light"
                                onClick={() => openModal(`${API_BASE_URL}/Home/ListenModal`, 'Listen Now')}
                            >
                                Listen Now
                            </button>

                            <button
                                className="btn btn-outline-light"
                                onClick={() => openModal(`${API_BASE_URL}/Home/NewsletterModal`, 'Join Newsletter')}
                            >
                                Join Newsletter
                            </button>
                        </div>
                    </div>
                </div>

                {/* Two Column Layout: Latest Single (Left) + Tour Dates (Right) */}
                <div className="row mt-5">
                    {/* LEFT COLUMN - Latest Single */}
                    <div className="col-lg-6 mb-4">
                        <div className="p-4" style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 20, height: '100%' }}>
                            <h2 className="text-center mb-4" style={{ color: 'white' }}>Latest Single</h2>

                            <div className="text-center">
                                <img src="/images/poison.webp" alt="Single Artwork" style={{ maxWidth: 250, borderRadius: 15 }} />
                            </div>

                            <div className="text-center mt-3">
                                <h3 style={{ color: 'white' }}>&quot;Tears Don&apos;t Fall&quot;</h3>
                                <p style={{ color: '#ccc' }}>Out Now on all platforms</p>

                                <div className="d-flex justify-content-center gap-3 mt-3">
                                    <a href="#" className="btn btn-outline-light btn-sm">
                                        <i className="fab fa-spotify"></i> Spotify
                                    </a>
                                    <a href="#" className="btn btn-outline-light btn-sm">
                                        <i className="fab fa-apple"></i> Apple Music
                                    </a>
                                    <a href="#" className="btn btn-outline-light btn-sm">
                                        <i className="fab fa-youtube"></i> YouTube
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - Upcoming Shows */}
                    <div className="col-lg-6 mb-4">
                        <div className="p-4" style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 20, height: '100%' }}>
                            <h2 className="text-center mb-4" style={{ color: 'white' }}>Upcoming Shows</h2>

                            <div>
                                {[
                                    { date: 'JUN 25', venue: 'The Whisky a Go Go', location: 'Los Angeles, CA' },
                                    { date: 'JUL 15', venue: 'Saint Vitus Bar', location: 'Brooklyn, NY' },
                                    { date: 'AUG 05', venue: 'The Underworld', location: 'London, UK' },
                                ].map((show) => (
                                    <div
                                        key={show.date}
                                        className="d-flex justify-content-between align-items-center p-3 border-bottom"
                                        style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                                    >
                                        <span className="fw-bold" style={{ color: '#ff0055' }}>{show.date}</span>
                                        <span style={{ color: 'white' }}>{show.venue}</span>
                                        <span style={{ color: '#ccc' }}>{show.location}</span>
                                        <button className="btn btn-sm btn-outline-light">Tickets →</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <br />
            <br />

            {/* Bootstrap Modal for dynamic content */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div dangerouslySetInnerHTML={{ __html: modalContent }} />
                </Modal.Body>
            </Modal>
        </>
    );
}
