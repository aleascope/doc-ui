import { useQuery } from '@tanstack/react-query';
import { api, DocumentInfo } from '../api/client';
import { Link } from 'react-router-dom';
import { DocumentTextIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';

export default function DocumentList() {
    const { data: documents, isLoading, error } = useQuery({
        queryKey: ['documents'],
        queryFn: () => api.listDocuments()
    });

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
                <Link
                    to="/upload"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                    Upload New Document
                </Link>
            </div>

            <div className="grid gap-4">
                {documents?.map((doc: DocumentInfo) => (
                    <div
                        key={doc.document_id}
                        className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                                <DocumentTextIcon className="h-6 w-6 text-gray-500" />
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900">
                                        Document {doc.document_id.slice(0, 8)}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Created: {new Date(doc.created_at).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Size: {(doc.size_bytes / 1024).toFixed(2)} KB
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <a
                                    href={doc.pdf_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:text-blue-700 flex items-center"
                                >
                                    <span className="mr-1">PDF</span>
                                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                                </a>
                                <a
                                    href={doc.markdown_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green-500 hover:text-green-700 flex items-center"
                                >
                                    <span className="mr-1">Markdown</span>
                                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 