const API_BASE_URL = 'http://localhost:8080/api';

const API_ENDPOINTS = {
    AUTH: {
        LOGIN: `${API_BASE_URL}/auth/login`,
        REGISTER: `${API_BASE_URL}/auth/register`
    },
    USERS: {
        BASE: `${API_BASE_URL}/users`,
        BY_ID: (id) => `${API_BASE_URL}/users/${id}`
    },
    SKILLS: {
        BASE: `${API_BASE_URL}/skills`,
        USER: (userId) => `${API_BASE_URL}/skills/user/${userId}`,
        USER_TYPE: (userId, type) => `${API_BASE_URL}/skills/user/${userId}/type/${type}`,
        USER_SKILL: `${API_BASE_URL}/skills/user`,
        DELETE: (userId, skillId, type) => `${API_BASE_URL}/skills/user/${userId}/skill/${skillId}/type/${type}`
    },
    MATCHES: {
        BY_USER: (userId) => `${API_BASE_URL}/matches/${userId}`
    },
    EXCHANGES: {
        BASE: `${API_BASE_URL}/exchanges`,
        BY_ID: (id) => `${API_BASE_URL}/exchanges/${id}`,
        BY_USER: (userId) => `${API_BASE_URL}/exchanges/user/${userId}`,
        UPDATE_STATUS: (id) => `${API_BASE_URL}/exchanges/${id}/status`
    },
    RATINGS: {
        BASE: `${API_BASE_URL}/ratings`,
        BY_USER: (userId) => `${API_BASE_URL}/ratings/user/${userId}`,
        BY_EXCHANGE: (exchangeId) => `${API_BASE_URL}/ratings/exchange/${exchangeId}`
    }
};

function getAuthToken() {
    return localStorage.getItem('authToken');
}

function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

function clearAuth() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
}

function getUserId() {
    return localStorage.getItem('userId');
}

function setUserData(userId, email, name) {
    localStorage.setItem('userId', userId);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', name);
}

function isAuthenticated() {
    return !!getAuthToken();
}

function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

async function apiRequest(url, options = {}) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers
        });

        if (response.status === 401) {
            clearAuth();
            window.location.href = 'login.html';
            throw new Error('Unauthorized');
        }

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Request failed');
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}
