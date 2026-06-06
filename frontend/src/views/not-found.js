export class NotFoundView extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="view-container" style="text-align: center; margin-top: 5rem;">
                <h1 style="font-size: 6rem; margin: 0; color: #cbd5e1;">404</h1>
                <h2>Página no encontrada</h2>
                <p>Lo sentimos, la página que buscas no existe o ha sido movida.</p>
                <a href="/dashboard" data-link style="display: inline-block; margin-top: 2rem; padding: 0.5rem 1rem; background: #2563eb; color: white; text-decoration: none; border-radius: 4px;">Volver al Inicio</a>
            </div>
        `;
    }
}

customElements.define('not-found-view', NotFoundView);
