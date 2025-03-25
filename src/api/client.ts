import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export interface DocumentInfo {
    document_id: string;
    created_at: string;
    size_bytes: number;
}

export const api = {
    listDocuments: async (limit: number = 50, prefix: string = ''): Promise<DocumentInfo[]> => {
        const response = await axios.get(`${API_URL}/documents/`, {
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
        
        const response = await axios.post(`${API_URL}/upload/`, formData, {
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