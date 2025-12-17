// API Utility Functions

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.outletexpense.xyz/api';

// Token management
export const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(process.env.NEXT_PUBLIC_TOKEN_KEY || 'super_admin_token');
    }
    return null;
};

export const setToken = (token) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(process.env.NEXT_PUBLIC_TOKEN_KEY || 'super_admin_token', token);
    }
};

export const removeToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(process.env.NEXT_PUBLIC_TOKEN_KEY || 'super_admin_token');
    }
};

// User data management
export const getUser = () => {
    if (typeof window !== 'undefined') {
        const user = localStorage.getItem(process.env.NEXT_PUBLIC_USER_KEY || 'super_admin_user');
        return user ? JSON.parse(user) : null;
    }
    return null;
};

export const setUser = (user) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(process.env.NEXT_PUBLIC_USER_KEY || 'super_admin_user', JSON.stringify(user));
    }
};

export const removeUser = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(process.env.NEXT_PUBLIC_USER_KEY || 'super_admin_user');
    }
};

// Logout function
export const logout = () => {
    removeToken();
    removeUser();
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
};

// API request helper
async function apiRequest(endpoint, options = {}) {
    const token = getToken();

    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
}

// ============ AUTH APIs ============

// Login with email and password
export async function login(email, password) {
    const data = await apiRequest('/user-login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });

    if (data.status === 'success' && data.authorisation?.token) {
        setToken(data.authorisation.token);
        setUser(data.user);
    }

    return data;
}

// Verify PIN (2FA)
export async function verifyPin(pin) {
    const data = await apiRequest('/verify-pin', {
        method: 'POST',
        body: JSON.stringify({ pin }),
    });

    return data;
}

// ============ DASHBOARD APIs ============

// Get user summary for dashboard stats
export async function getUserSummary() {
    return await apiRequest('/user-summary', {
        method: 'GET',
    });
}

// Get users by status (active=1, inactive=0) with pagination
export async function getStatusWiseUsers(status = 1, limit = 20, page = 1) {
    return await apiRequest(`/status-wise-users?page=${page}`, {
        method: 'POST',
        body: JSON.stringify({ status, limit: String(limit) }),
    });
}

// ============ SUBSCRIPTIONS APIs ============

// Get all subscriptions
export async function getSubscriptionsList() {
    return await apiRequest('/subscriptions-list', {
        method: 'GET',
    });
}
