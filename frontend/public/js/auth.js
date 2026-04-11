const API_URL = 'http://localhost:5000/api';
const TOKEN_KEY = 'car_token';
const USER_KEY = 'car_user';

function saveAuthData(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    // Принудительно обновляем UI сразу после сохранения
    setTimeout(() => forceUpdateAllPages(), 10);
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

async function logout() {
    const token = getToken();
    if (token) {
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch(e) { console.error(e); }
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = '/';
}

async function register(data) {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Ошибка регистрации');
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
    if (!response.ok) throw new Error(result.error || 'Ошибка входа');
    saveAuthData(result.token, result.user);
    return result;
}

// ГЛАВНАЯ ФУНКЦИЯ - принудительно обновляет ВСЕ страницы
function forceUpdateAllPages() {
    const isAuth = isAuthenticated();
    const user = getUser();
    
    console.log('forceUpdateAllPages called, isAuth:', isAuth);
    
    // Обновляем все элементы с классом user-name и id userName
    document.querySelectorAll('#userName, .user-name').forEach(el => {
        if (el) {
            el.textContent = user?.full_name || user?.username || '';
            el.style.display = isAuth ? 'inline-block' : 'none';
        }
    });
    
    // Скрываем/показываем кнопки входа и регистрации
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    
    if (authButtons) {
        authButtons.style.display = isAuth ? 'none' : 'flex';
        console.log('authButtons display:', authButtons.style.display);
    }
    
    if (userMenu) {
        userMenu.style.display = isAuth ? 'flex' : 'none';
        console.log('userMenu display:', userMenu.style.display);
    }
    
    // Дополнительно: скрываем все ссылки на регистрацию и вход
    document.querySelectorAll('a[href="/login.html"], a[href="/register.html"]').forEach(link => {
        if (link.closest('#userMenu') === null) {
            link.style.display = isAuth ? 'none' : 'inline-block';
        }
    });
}

// Функция обновления UI
function updateUI() {
    forceUpdateAllPages();
}

// Проверка авторизации для защищенных страниц
function checkAuth() {
    const publicPages = ['/', '/login.html', '/register.html', '/visualization.html'];
    const path = window.location.pathname;
    
    if (!publicPages.includes(path) && path !== '/' && !isAuthenticated()) {
        localStorage.setItem('redirectAfterLogin', path);
        window.location.href = '/login.html';
        return false;
    }
    
    forceUpdateAllPages();
    return true;
}

// Обработчик регистрации
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const password = document.getElementById('password').value;
        const confirm = document.getElementById('confirm_password').value;
        if (password !== confirm) {
            alert('Пароли не совпадают');
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
            window.location.href = '/';
        } catch (err) {
            alert(err.message);
        }
    });
}

// Обработчик входа
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            await login(email, password);
            window.location.href = '/';
        } catch (err) {
            alert(err.message);
        }
    });
}

// Обработчик кнопки выхода
document.addEventListener('click', function(e) {
    if (e.target.id === 'logoutBtn' || e.target.closest('#logoutBtn')) {
        e.preventDefault();
        logout();
    }
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    forceUpdateAllPages();
    checkAuth();
});

// Слушаем изменения в localStorage
window.addEventListener('storage', function(e) {
    if (e.key === TOKEN_KEY || e.key === USER_KEY) {
        console.log('Storage changed, updating UI');
        forceUpdateAllPages();
    }
});

// Также обновляем при каждом переходе на страницу
window.addEventListener('pageshow', function() {
    forceUpdateAllPages();
});

window.auth = { 
    getToken, 
    getUser, 
    isAuthenticated, 
    logout, 
    getProfile: () => getUser(), 
    updateUI,
    forceUpdateAllPages 
};