const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://campusvoice-api-h528.onrender.com/api';

/**
 * Decodes a JWT token manually to extract the payload.
 * Useful for getting the role and expiration without an external library.
 */
export const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window.atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
};

/**
 * A wrapper around fetch that handles:
 * 1. Attaching the Bearer token.
 * 2. Parsing JSON responses.
 * 3. Handling global errors (e.g., Token Expired).
 */
export const api = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
    };

    // Ensure endpoint starts with / for consistency
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${API_BASE_URL}${path}`;

    console.log(`API Request: ${url}`, config);

    try {
        const response = await fetch(url, config);

        // Handle 204 No Content
        if (response.status === 204) return null;

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            console.error('API Error Response:', { status: response.status, data });
            // Global Error Handling
            if (data.error_code === 'AUTH_003' || response.status === 401) {
                console.warn('Session expired or unauthorized. Redirecting to login.');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                // Force redirect to login
                window.location.href = '/login';
                return;
            }
            throw new Error(data.error || `Request failed with status ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API Network/Code Error:', error);
        throw error;
    }
};

export default api;
