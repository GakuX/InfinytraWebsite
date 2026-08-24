'use client';

import React, { useEffect, useState } from 'react';
import { API_BASE_URL, type NewsPost, type TourDate } from '../lib/api';

function formatNewsDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase();
}

function formatTourDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase();
}

export default function NewsAndTours() {
    const [news, setNews] = useState<NewsPost[]>([]);
    const [tourDates, setTourDates] = useState<TourDate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const [newsRes, toursRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/api/NewsApi`),
                    fetch(`${API_BASE_URL}/api/TourDatesApi`),
                ]);

                if (!newsRes.ok) throw new Error(`Request failed with status ${newsRes.status}`);
                if (!toursRes.ok) throw new Error(`Request failed with status ${toursRes.status}`);

                const newsData: NewsPost[] = await newsRes.json();
                const toursData: TourDate[] = await toursRes.json();

                if (!cancelled) {
                    setNews(newsData);
                    setTourDates(toursData);
                }
            } catch {
                if (!cancelled) setError('Could not load news and tours. Is the API running?');
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
                <h1 className="band-title">NEWS &amp; TOURS</h1>
                <p className="band-tagline">Everything happening with the band</p>
            </div>

            {loading ? (
                <p className="text-center text-white mt-5">Loading...</p>
            ) : error ? (
                <h4 className="text-danger text-center mt-5">{error}</h4>
            ) : (
                <>
                    {/* News Section */}
                    <div className="row mt-5">
                        <div className="col-12">
                            <h2 className="text-center mb-4" style={{ color: 'white' }}>Latest News</h2>
                        </div>

                        {news.length === 0 ? (
                            <p className="text-center text-white">No news yet.</p>
                        ) : (
                            news.map((item) => (
                                <div className="col-lg-4 mb-4" key={item.id}>
                                    <div className="p-4" style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 20, height: '100%' }}>
                                        <span className="fw-bold" style={{ color: '#ff0055' }}>{formatNewsDate(item.postedDate)}</span>
                                        <h4 className="mt-2" style={{ color: 'white' }}>{item.title}</h4>
                                        <p style={{ color: '#ccc' }}>{item.blurb}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Tour Dates Section */}
                    <div className="row mt-4">
                        <div className="col-12">
                            <div className="p-4" style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 20 }}>
                                <h2 className="text-center mb-4" style={{ color: 'white' }}>Upcoming Shows</h2>

                                {tourDates.length === 0 ? (
                                    <p className="text-center text-white">No shows announced yet.</p>
                                ) : (
                                    <div>
                                        {tourDates.map((show) => (
                                            <div
                                                key={show.id}
                                                className="d-flex justify-content-between align-items-center flex-wrap gap-2 p-3 border-bottom"
                                                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                                            >
                                                <span className="fw-bold" style={{ color: '#ff0055' }}>{formatTourDate(show.showDate)}</span>
                                                <span style={{ color: 'white' }}>{show.venue}</span>
                                                <span style={{ color: '#ccc' }}>{show.location}</span>
                                                {show.ticketUrl ? (
                                                    <a href={show.ticketUrl} className="btn btn-sm btn-outline-light" target="_blank" rel="noopener noreferrer">
                                                        Tickets →
                                                    </a>
                                                ) : (
                                                    <button className="btn btn-sm btn-outline-light" disabled>
                                                        Tickets →
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            <br />
        </div>
    );
}
