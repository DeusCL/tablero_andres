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
    }

    render() {
        this.innerHTML = `
            <nav>
                <div class="logo">
                    <strong>Tablero Andrés</strong>
                </div>
                <div class="nav-links">
                    <a href="/dashboard" data-link>Dashboard</a>
                    <a href="/upload" data-link>Subir Excel</a>
                    <a href="#" id="logout-link">Cerrar Sesión</a>
                </div>
            </nav>
        `;
    }
}

customElements.define('app-navbar', AppNavbar);
