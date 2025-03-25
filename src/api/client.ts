import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(async (config) => {
    const token = await (window as any).Clerk?.session?.getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface DocumentInfo {
    document_id: string;
    created_at: string;
    size_bytes: number;
}

export const api = {
    listDocuments: async (limit: number = 50, prefix: string = ''): Promise<DocumentInfo[]> => {
        const response = await axiosInstance.get('/documents/', {
            params: { limit, prefix }
        });
        return response.data;
    },

    uploadDocument: async (file: File): Promise<{
        message: string;
        document_id: string;
    }> => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await axiosInstance.post('/upload/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getPdfUrl: (documentId: string): string => {
        return `${API_URL}/documents/${documentId}/pdf`;
    },

    getMarkdownUrl: (documentId: string): string => {
        return `${API_URL}/documents/${documentId}/markdown`;
    }
}; 