export class UploadView extends HTMLElement {
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
                <h1>Subir Excel Maestro</h1>
                <p>Selecciona tu archivo .xlsx para actualizar el tablero.</p>
                <div style="margin-top: 2rem; border: 2px dashed #cbd5e1; padding: 3rem; text-align: center; border-radius: 12px;">
                    <input type="file" id="excel-file" accept=".xlsx" style="display: none;">
                    <button id="select-file-btn">Elegir Archivo</button>
                    <p id="file-name" style="margin-top: 1rem; color: #64748b;">Ningún archivo seleccionado</p>
                </div>
                <button id="upload-btn" style="margin-top: 2rem; width: 100%; padding: 1rem;" disabled>Subir y Procesar</button>
            </div>
        `;
    }

    afterRender() {
        const fileInput = this.querySelector('#excel-file');
        const fileName = this.querySelector('#file-name');
        const uploadBtn = this.querySelector('#upload-btn');
        const selectBtn = this.querySelector('#select-file-btn');

        if (selectBtn) {
            selectBtn.addEventListener('click', () => fileInput.click());
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    fileName.textContent = e.target.files[0].name;
                    uploadBtn.disabled = false;
                }
            });
        }

        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                alert('Archivo recibido. Iniciando procesamiento...');
            });
        }
    }
}

customElements.define('upload-view', UploadView);
