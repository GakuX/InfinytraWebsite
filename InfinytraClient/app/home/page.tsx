'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Modal from 'react-bootstrap/Modal';

export default function Home() {
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState('');
    const [loading, setLoading] = useState(false);

    // Handle modal open with dynamic content
    const openModal = async (url: string, title: string) => {
        setShowModal(true);
        setModalTitle(title);
        setModalContent('Loading...');
        setLoading(true);

        try {
            const response = await fetch(url);
            const html = await response.text();
            setModalContent(html);
        } catch (error) {
            setModalContent('<div class="alert alert-danger">Could not load content.</div>');
        } finally {
            setLoading(false);
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
                <div className="hero-content">
                    <h1 className="band-title">INFINYTRA</h1>
                    <p className="band-tagline">Welcome to the family</p>
                </div>

                {/* Hero Buttons */}
                <div className="hero-buttons button2fonts">
                    <Link href="/albums" className="btn btn-outline-light">
                        Explore Albums
                    </Link>
                    <Link href="/contact" className="btn btn-outline-light">
                        Contact
                    </Link>
                </div>

                {/* About Preview */}
                <div className="about-preview">
                    <p style={{ fontWeight: 'bold' }}>
                        Infinytra is a metalcore band thriving to create songs with different and unique sound
                    </p>
                </div>

                {/* Featured Album */}
                <div className="featured-album">
                    <img 
                        src="/images/f069407edab4219e34f36ea331d1eb2e.gif" 
                        alt="Album cover" 
                    />
                    <h3>Check Our Latest Release!</h3>
                    <p style={{ color: 'white' }}>Debut Album • 2025</p>

                    {/* Action Buttons */}
                    <div className="row">
                        <div className="col-12 d-flex justify-content-center gap-3 flex-wrap button2fonts">
                            <button 
                                className="btn btn-outline-light"
                                onClick={() => openModal('http://localhost:7064/Home/ListenModal', 'Listen Now')}
                            >
                                Listen Now
                            </button>

                            <button 
                                className="btn btn-outline-light"
                                onClick={() => openModal('http://localhost:7064/Home/NewsletterModal', 'Join Newsletter')}
                            >
                                Join Newsletter
                            </button>
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