const BASE_URL = 'http://localhost:8000';


export async function request(path, options = {}) {
    const url = `${BASE_URL}${path}`;
    
    // Configuración por defecto para JSON y credenciales (sesiones)
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        credentials: 'include', // Necesario para enviar/recibir cookies de sesión
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    if (options.body && typeof options.body === 'object') {
        mergedOptions.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
        let errorData;
        try {
            errorData = await response.json();
        } catch (e) {
            errorData = { detail: 'Error desconocido' };
        }
        throw new Error(errorData.detail || `Error ${response.status}`);
    }

    // Si la respuesta es 204 No Content, no intentamos parsear JSON
    if (response.status === 204) {
        return null;
    }

    return response.json();
}
