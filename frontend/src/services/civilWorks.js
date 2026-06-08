import { request } from './api.js';

export const CivilWorksService = {
    async uploadExcel(file) {
        const formData = new FormData();
        formData.append('data', file); // 'data' es el nombre que espera Litestar en ImportationAPI.upload_excel

        return await request('/civil-works/upload', {
            method: 'POST',
            body: formData
        });
    },

    async getDashboardData() {
        return await request('/analytics/dashboard');
    }
};
