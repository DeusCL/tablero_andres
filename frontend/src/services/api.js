const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000' 
    : '/api';


export async function request(path, options = {}) {
    const url = `${BASE_URL}${path}`;
    
    // Configuración por defecto para JSON y credenciales (sesiones)
    const defaultOptions = {
        headers: {},
        credentials: 'include', // Necesario para enviar/recibir cookies de sesión
    };

    // Si el body no es FormData, asumimos JSON
    if (!(options.body instanceof FormData)) {
        defaultOptions.headers['Content-Type'] = 'application/json';
        defaultOptions.headers['Accept'] = 'application/json';
    }

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
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
