import { AuthService } from '../services/auth.js';



export class AppNavbar extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const logoutLink = this.querySelector('#logout-link');
        if (logoutLink) {
            logoutLink.addEventListener('click', async (e) => {
                e.preventDefault();
                await AuthService.logout();
            });
        }

        const toggleBtn = this.querySelector('#sidebar-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                document.body.classList.toggle('sidebar-collapsed');
                // Trigger immediate resize to adapt elements, and another one after the transition finishes
                window.dispatchEvent(new Event('resize'));
                setTimeout(() => {
                    window.dispatchEvent(new Event('resize'));
                }, 300);
            });
        }
    }

    render() {
        const isAuthenticated = AuthService.isAuthenticated();
        const showToggleBtn = isAuthenticated && window.location.pathname === '/dashboard';
        
        this.innerHTML = `
            <nav>
                <div class="nav-left">
                    ${showToggleBtn ? `
                    <button id="sidebar-toggle" class="sidebar-toggle-btn" aria-label="Mostrar/ocultar filtros">
                        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                        </svg>
                        <span>Filtros</span>
                    </button>
                    ` : ''}
                    <div class="logo">
                        <img src="./assets/img/logo_rdc.png" alt="Logotipo RDC" class="logo-img-navbar">
                    </div>
                </div>
                ${isAuthenticated ? `
                <div class="nav-links">
                    <a href="/dashboard" data-link>Dashboard</a>
                    <a href="/upload" data-link>Subir Excel</a>
                    <a href="#" id="logout-link">Cerrar Sesión</a>
                </div>
                ` : ''}
            </nav>
        `;
    }
}

customElements.define('app-navbar', AppNavbar);
