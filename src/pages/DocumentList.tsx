import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, DocumentInfo } from '../api/client';
import { Link } from 'react-router-dom';
import { ArrowDownTrayIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function DocumentList() {
    const queryClient = useQueryClient();
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    const { data: documents, isLoading, error } = useQuery({
        queryKey: ['documents'],
        queryFn: () => api.listDocuments()
    });

    const deleteMutation = useMutation({
        mutationFn: (documentId: string) => api.deleteDocument(documentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            setDeleteConfirmId(null);
        },
    });

    const handleDownload = async (blob: Blob, filename: string) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">Error loading documents</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                File Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created At
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Size
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Source
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Parsed
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {documents?.map((doc: DocumentInfo) => (
                            <tr key={doc.file_name} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {doc.file_name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(doc.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {(doc.size_bytes / 1024).toFixed(2)} KB
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                        onClick={async () => {
                                            const { blob, filename } = await api.downloadSource(doc.document_id);
                                            handleDownload(blob, filename);
                                        }}
                                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                                    >
                                        <ArrowDownTrayIcon className="w-3 h-3" style={{ width: '12px', height: '12px' }} />
                                        <span className="ml-1">{doc.file_extension.toUpperCase()}</span>
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                        onClick={async () => {
                                            const { blob, filename } = await api.downloadParsed(doc.document_id);
                                            handleDownload(blob, filename);
                                        }}
                                        disabled={!doc.is_parsed}
                                        className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${
                                            doc.is_parsed 
                                                ? 'text-blue-600 hover:text-blue-900 hover:bg-blue-50' 
                                                : 'text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        <ArrowDownTrayIcon className="w-3 h-3" style={{ width: '12px', height: '12px' }} />
                                        <span className="ml-1">MD</span>
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    {deleteConfirmId === doc.document_id ? (
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => deleteMutation.mutate(doc.document_id)}
                                                className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirmId(null)}
                                                className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setDeleteConfirmId(doc.document_id)}
                                            className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                                        >
                                            <TrashIcon className="w-3 h-3" style={{ width: '12px', height: '12px' }} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 