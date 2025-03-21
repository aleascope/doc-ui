import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';
import { DocumentArrowUpIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function UploadDocument() {
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const uploadMutation = useMutation({
        mutationFn: (file: File) => api.uploadDocument(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
            navigate('/');
        },
        onError: (error: Error) => {
            setError(error.message);
        },
    });

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            if (!file.type.includes('pdf')) {
                setError('Please upload a PDF file');
                return;
            }
            uploadMutation.mutate(file);
        }
    }, [uploadMutation]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        },
        maxFiles: 1
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload Document</h1>

                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
                >
                    <input {...getInputProps()} />
                    <DocumentArrowUpIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    {isDragActive ? (
                        <p className="text-blue-500">Drop the PDF file here</p>
                    ) : (
                        <div>
                            <p className="text-gray-600">Drag and drop a PDF file here, or click to select</p>
                            <p className="text-sm text-gray-500 mt-2">Only PDF files are accepted</p>
                        </div>
                    )}
                </div>

                {uploadMutation.isLoading && (
                    <div className="mt-4 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-2 text-gray-600">Uploading and processing document...</p>
                    </div>
                )}

                {error && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                        <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
                        <span className="text-red-700">{error}</span>
                    </div>
                )}

                <button
                    onClick={() => navigate('/')}
                    className="mt-6 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    ← Back to Documents
                </button>
            </div>
        </div>
    );
} 