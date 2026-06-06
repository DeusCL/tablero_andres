import './views/login.js';
import './views/dashboard.js';
import './views/upload.js';
import './views/not-found.js';

import { AuthService } from './services/auth.js';



const routes = {
    '/login': { tag: 'login-view', protected: false },
    '/dashboard': { tag: 'dashboard-view', protected: true },
    '/upload': { tag: 'upload-view', protected: true },
    '404': { tag: 'not-found-view', protected: false }
};


export function initRouter() {
    const navigateTo = (url) => {
        history.pushState(null, null, url);
        handleLocation();
    };

    window.navigateTo = navigateTo;

    // Escuchar el botón atrás/adelante del navegador
    window.addEventListener('popstate', handleLocation);

    // Interceptar clicks en enlaces con data-link
    document.body.addEventListener('click', e => {
        if (e.target.matches('[data-link]')) {
            e.preventDefault();
            const href = e.target.getAttribute('href');
            navigateTo(href);
        }
    });

    // Primera carga
    handleLocation();
}


async function handleLocation() {
    let path = window.location.pathname;
    
    // Redirección especial para la raíz
    if (path === '/') {
        navigateTo(AuthService.isAuthenticated() ? '/dashboard' : '/login');
        return;
    }

    // Si la ruta no existe, usamos la 404
    const route = routes[path] || routes['404'];
    
    // Verificamos sesión REAL con el servidor antes de mostrar rutas protegidas
    if (route.protected && !AuthService.isAuthenticated()) {
        const isValid = await AuthService.checkAuth();
        if (!isValid) {
            navigateTo('/login');
            return;
        }
    }

    // Si ya está logueado e intenta ir al login, mandarlo al dashboard
    if (path === '/login' && AuthService.isAuthenticated()) {
        navigateTo('/dashboard');
        return;
    }

    const app = document.getElementById('app');
    app.innerHTML = '';
    const viewElement = document.createElement(route.tag);
    app.appendChild(viewElement);
}
