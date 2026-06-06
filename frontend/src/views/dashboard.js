export class DashboardView extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div class="view-container">
                <h1>Panel de Control</h1>
                <p>Aquí se visualizarán los gráficos de los trabajos civiles.</p>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 2rem;">
                    <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h3>Montos por Región</h3>
                        <div style="height: 200px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; color: #94a3b8;">
                            [Gráfico de Barras]
                        </div>
                    </div>
                    <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h3>Estados de Trabajo</h3>
                        <div style="height: 200px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; color: #94a3b8;">
                            [Gráfico de Torta]
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('dashboard-view', DashboardView);
