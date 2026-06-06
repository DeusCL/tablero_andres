import './components/navbar.js';

import { initRouter } from './router.js';
import { AuthService } from './services/auth.js';



document.addEventListener('DOMContentLoaded', async () => {
    // Verificamos sesión con el servidor antes de nada
    await AuthService.checkAuth();
    
    // Inicializar el router
    initRouter();
});
