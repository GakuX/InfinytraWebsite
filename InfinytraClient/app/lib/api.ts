// Base URL of the InfinytraServer ASP.NET Core API.
// Override with NEXT_PUBLIC_API_BASE_URL in .env.local if the server runs on a different port.
export const API_BASE_URL = (
    process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://localhost:7097'
).replace(/\/$/, '');

// Album/Song image and audio paths come back from the API as paths relative to
// InfinytraServer's wwwroot (e.g. "/images/vermillion.png"), not the Next.js public folder.
export function resolveMediaUrl(path?: string | null): string {
    if (!path) return '';
    if (/^https?:\/\//i.test(path)) return path;
    return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

// Field casing verified against the running API - camelCase (System.Text.Json default policy).
export interface Song {
    id: number;
    name: string;
    filePath: string;
    albumId: number;
    album?: Album | null;
    duration: string;
    trackNumber: number;
}

export interface Album {
    id: number;
    title: string;
    description: string;
    createdDate: string | null;
    imageURL: string;
    songs?: Song[] | null;
    songFile: string;
}

export interface Member {
    id: number;
    name: string;
    description: string;
    instrument: string;
    photoURL: string;
    role: string;
    imageURL: string;
}

export interface AuthUser {
    id: number;
    username: string;
    email: string;
    isAdmin: boolean;
}

export interface AuthResponse extends AuthUser {
    token: string;
}

export interface NewsPost {
    id: number;
    title: string;
    blurb: string;
    postedDate: string;
}

export interface TourDate {
    id: number;
    showDate: string;
    venue: string;
    location: string;
    ticketUrl: string | null;
}

export interface Merch {
    id: number;
    itemName: string;
    itemDescription: string;
    newItem: boolean;
    price: number;
    imageURL: string;
    gender: string | null;
    inStock: boolean;
    categories: string;
    onSale: boolean;
    salePrice: number | null;
}

export interface GalleryImage {
    id: number;
    imageURL: string;
    caption: string;
    category: string;
    uploadedDate: string;
}

export interface Review {
    id: number;
    merchId: number;
    userId: number;
    username: string;
    rating: number;
    comment: string;
    createdDate: string;
}

export interface OrderItem {
    id: number;
    orderId: number;
    merchId: number;
    itemName: string;
    unitPrice: number;
    qty: number;
}

export interface Order {
    id: number;
    userId: number;
    orderDate: string;
    total: number;
    status: string;
    items: OrderItem[];
}

// Attaches the bearer token to a fetch call for endpoints behind [Authorize].
export function authHeaders(token: string | null): HeadersInit {
    return token ? { Authorization: `Bearer ${token}` } : {};
}
