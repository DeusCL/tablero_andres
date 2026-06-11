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
                    <button id="sidebar-toggle" class="sidebar-toggle-btn" aria-label="Colapsar panel de navegación">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                        </svg>
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
