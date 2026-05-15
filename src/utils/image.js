const API_BASE = import.meta.env.VITE_API_URL || 'https://rizwan-store-api.onrender.com';

export function getImageUrl(url) {
    if (!url) return 'https://placehold.co/600x400?text=No+Image';
    if (url.startsWith('http')) return url;
    return `${API_BASE}/uploads/${url}`;
}
