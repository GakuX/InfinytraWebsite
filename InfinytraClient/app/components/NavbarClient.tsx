'use client';

import { useEffect } from 'react';

export default function NavbarClient() {
    useEffect(() => {
        // Import Bootstrap JS dynamically on client side
        import('bootstrap/dist/js/bootstrap.bundle.min.js' as any);
    }, []);

    return null; // This component just loads Bootstrap JS
}