import { request } from './api.js';



export const AuthService = {
    _user: null,

    async login(username, password) {
        try {
            const data = await request('/auth/login', {
                method: 'POST',
                body: { username, password }
            });
            this._user = data;
            return data;
        } catch (error) {
            this._user = null;
            throw error;
        }
    },

    async checkAuth() {
        try {
            // Preguntamos al servidor quién soy usando la cookie de sesión
            const data = await request('/auth/me', { method: 'GET' });
            this._user = data;
            return true;
        } catch (error) {
            this._user = null;
            return false;
        }
    },

    async logout() {
        try {
            await request('/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Error al cerrar sesión en el servidor:', error);
        } finally {
            this._user = null;
            window.navigateTo('/login');
        }
    },

    getUser() {
        return this._user;
    },

    isAuthenticated() {
        return !!this._user;
    }
};
