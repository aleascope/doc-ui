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
    file_name: string;
    file_extension: string;
    file_type: string | null;
    is_parsed: boolean;
    is_indexed: boolean;
    created_at: string;
    size_bytes: number;
}

export interface UserInfo {
    clerk_id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    created_at: string;
}

interface DownloadResponse {
    blob: Blob;
    filename: string;
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

    deleteDocument: async (documentId: string): Promise<{
        message: string;
        document_id: string;
    }> => {
        const response = await axiosInstance.delete(`/documents/${documentId}`);
        return response.data;
    },

    downloadSource: async (documentId: string): Promise<DownloadResponse> => {
        const response = await axiosInstance.get(`/documents/${documentId}/source`, {
            responseType: 'blob'
        });
        
        const contentDisposition = response.headers['content-disposition'];
        let filename = `${documentId}`;  // Extension will be determined by the server
        
        if (contentDisposition) {
            const matches = /filename="(.+)"/.exec(contentDisposition);
            if (matches && matches[1]) {
                filename = matches[1];
            }
        }
        
        return {
            blob: response.data,
            filename
        };
    },

    downloadParsed: async (documentId: string): Promise<DownloadResponse> => {
        const response = await axiosInstance.get(`/documents/${documentId}/parsed`, {
            responseType: 'blob'
        });
        
        const contentDisposition = response.headers['content-disposition'];
        let filename = `${documentId}.md`;
        
        if (contentDisposition) {
            const matches = /filename="(.+)"/.exec(contentDisposition);
            if (matches && matches[1]) {
                filename = matches[1];
            }
        }
        
        return {
            blob: response.data,
            filename
        };
    },

    listUsers: async (): Promise<UserInfo[]> => {
        const response = await axiosInstance.get('/users/');
        return response.data;
    },

    deleteUser: async (userId: string): Promise<{
        message: string;
        user_id: string;
        email: string;
    }> => {
        const response = await axiosInstance.delete(`/users/${userId}`);
        return response.data;
    }
}; 