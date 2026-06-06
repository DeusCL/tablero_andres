import { CivilWorksService } from '../services/civilWorks.js';

export class UploadView extends HTMLElement {
    constructor() {
        super();
        this.isUploading = false;
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
                <div id="drop-zone" style="margin-top: 2rem; border: 2px dashed #cbd5e1; padding: 3rem; text-align: center; border-radius: 12px; transition: all 0.3s ease;">
                    <input type="file" id="excel-file" accept=".xlsx" style="display: none;">
                    <button id="select-file-btn" class="btn-secondary">Elegir Archivo</button>
                    <p id="file-name" style="margin-top: 1rem; color: #64748b;">Ningún archivo seleccionado</p>
                </div>
                
                <div id="status-message" style="margin-top: 1rem; display: none; padding: 1rem; border-radius: 8px;"></div>

                <button id="upload-btn" class="btn-primary" style="margin-top: 2rem; width: 100%; padding: 1rem;" disabled>
                    <span id="btn-text">Subir y Procesar</span>
                    <span id="btn-loader" style="display: none;">Procesando...</span>
                </button>
            </div>
        `;
    }

    afterRender() {
        const fileInput = this.querySelector('#excel-file');
        const fileName = this.querySelector('#file-name');
        const uploadBtn = this.querySelector('#upload-btn');
        const selectBtn = this.querySelector('#select-file-btn');
        const statusMsg = this.querySelector('#status-message');
        const btnText = this.querySelector('#btn-text');
        const btnLoader = this.querySelector('#btn-loader');
        const dropZone = this.querySelector('#drop-zone');

        const showMessage = (msg, isError = false) => {
            statusMsg.textContent = msg;
            statusMsg.style.display = 'block';
            statusMsg.style.backgroundColor = isError ? '#fee2e2' : '#dcfce7';
            statusMsg.style.color = isError ? '#991b1b' : '#166534';
        };

        if (selectBtn) {
            selectBtn.addEventListener('click', () => fileInput.click());
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    fileName.textContent = e.target.files[0].name;
                    uploadBtn.disabled = false;
                    statusMsg.style.display = 'none';
                }
            });
        }

        if (uploadBtn) {
            uploadBtn.addEventListener('click', async () => {
                const file = fileInput.files[0];
                if (!file) return;

                try {
                    this.isUploading = true;
                    uploadBtn.disabled = true;
                    btnText.style.display = 'none';
                    btnLoader.style.display = 'inline';
                    statusMsg.style.display = 'none';

                    const result = await CivilWorksService.uploadExcel(file);
                    
                    showMessage(result.message || 'Archivo subido con éxito. Los datos se están procesando.');
                    
                    // Reset form
                    fileInput.value = '';
                    fileName.textContent = 'Ningún archivo seleccionado';
                    
                } catch (error) {
                    console.error('Upload error:', error);
                    showMessage(error.message || 'Error al subir el archivo', true);
                    uploadBtn.disabled = false;
                } finally {
                    this.isUploading = false;
                    btnText.style.display = 'inline';
                    btnLoader.style.display = 'none';
                }
            });
        }

        // Optional: Drag and drop support
        if (dropZone) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }, false);
            });

            ['dragenter', 'dragover'].forEach(eventName => {
                dropZone.addEventListener(eventName, () => dropZone.style.borderColor = '#3b82f6', false);
            });

            ['dragleave', 'drop'].forEach(eventName => {
                dropZone.addEventListener(eventName, () => dropZone.style.borderColor = '#cbd5e1', false);
            });

            dropZone.addEventListener('drop', (e) => {
                const dt = e.dataTransfer;
                const files = dt.files;
                if (files.length > 0 && files[0].name.endsWith('.xlsx')) {
                    fileInput.files = files;
                    fileName.textContent = files[0].name;
                    uploadBtn.disabled = false;
                }
            }, false);
        }
    }
}

customElements.define('upload-view', UploadView);
