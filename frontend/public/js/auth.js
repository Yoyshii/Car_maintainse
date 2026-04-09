const API_URL = 'http://localhost:5000/api';
const TOKEN_KEY = 'car_token';
const USER_KEY = 'car_user';

function saveAuthData(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

function getUser() {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
}

function isAuthenticated() {
    return getToken() !== null;
}

function logout() {
    const token = getToken();
    if (token) {
        fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        }).catch(console.error);
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = '/login.html';
}

async function register(data) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Registration failed');
    saveAuthData(result.token, result.user);
    return result;
}

async function login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Login failed');
    saveAuthData(result.token, result.user);
    return result;
}

async function getProfile() {
    const token = getToken();
    if (!token) return null;
    const response = await fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
        if (response.status === 401) logout();
        return null;
    }
    return await response.json();
}

function checkAuth() {
    const publicPages = ['/login.html', '/register.html', '/'];
    const path = window.location.pathname;
    if (!isAuthenticated() && !publicPages.includes(path) && path !== '/') {
        window.location.href = '/login.html';
        return false;
    }
    
    if (isAuthenticated()) {
        const user = getUser();
        const userNameElements = document.querySelectorAll('#userName, #welcomeName');
        userNameElements.forEach(el => {
            if (el) el.textContent = user?.full_name || user?.username || '';
        });
        
        const userMenu = document.getElementById('userMenu');
        const authButtons = document.getElementById('authButtons');
        if (userMenu) userMenu.style.display = 'flex';
        if (authButtons) authButtons.style.display = 'none';
        
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
    }
    return true;
}

// Register form handler
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        const confirm = document.getElementById('confirm_password').value;
        if (password !== confirm) {
            alert('Passwords do not match');
            return;
        }
        try {
            await register({
                username: document.getElementById('username').value,
                email: document.getElementById('email').value,
                password: password,
                full_name: document.getElementById('full_name').value,
                phone: document.getElementById('phone').value
            });
            window.location.href = '/dashboard.html';
        } catch (err) {
            alert(err.message);
        }
    });
}

// Login form handler
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await login(
                document.getElementById('email').value,
                document.getElementById('password').value
            );
            window.location.href = '/dashboard.html';
        } catch (err) {
            alert(err.message);
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

window.auth = { getToken, getUser, isAuthenticated, logout, getProfile };