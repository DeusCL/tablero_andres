import { AuthService } from '../services/auth.js';



export class LoginView extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
        this.afterRender();
    }

    render() {
        this.innerHTML = `
            <div class="view-container">
                <h1>Iniciar Sesión</h1>
                <form id="login-form">
                    <div style="margin-bottom: 1rem;">
                        <label>Usuario</label><br>
                        <input type="text" id="username" required>
                    </div>
                    <div style="margin-bottom: 1rem;">
                        <label>Contraseña</label><br>
                        <input type="password" id="password" required>
                    </div>
                    <div id="error-message" style="color: #ef4444; margin-bottom: 1rem; display: none;"></div>
                    <button type="submit" id="submit-btn">Entrar</button>
                </form>
            </div>
        `;
    }

    afterRender() {
        const form = this.querySelector('#login-form');
        const errorMsg = this.querySelector('#error-message');
        const submitBtn = this.querySelector('#submit-btn');

        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const username = this.querySelector('#username').value;
                const password = this.querySelector('#password').value;
                
                // UI Feedback
                submitBtn.disabled = true;
                submitBtn.textContent = 'Cargando...';
                errorMsg.style.display = 'none';

                try {
                    await AuthService.login(username, password);
                    window.navigateTo('/dashboard');
                } catch (error) {
                    errorMsg.textContent = error.message || 'Error al iniciar sesión';
                    errorMsg.style.display = 'block';
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Entrar';
                }
            });
        }
    }
}

customElements.define('login-view', LoginView);
