import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, UserInfo } from '../api/client';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function UserList() {
    const queryClient = useQueryClient();
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

    // Query for fetching users
    const { data: users = [], isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: api.listUsers,
    });

    // Mutation for deleting a user
    const deleteMutation = useMutation({
        mutationFn: api.deleteUser,
        onSuccess: () => {
            // Invalidate and refetch users query
            queryClient.invalidateQueries({ queryKey: ['users'] });
            setDeleteConfirmId(null);
        },
    });

    const handleDeleteClick = (userId: string) => {
        setDeleteConfirmId(userId);
    };

    const handleDeleteConfirm = async () => {
        if (deleteConfirmId) {
            await deleteMutation.mutateAsync(deleteConfirmId);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmId(null);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="text-red-500 mb-4">Failed to load users</div>
                <button
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['users'] })}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Users</h1>
            
            {/* Delete Confirmation Modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
                        <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this user? This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleDeleteCancel}
                                className="px-4 py-2 text-gray-700 hover:text-gray-900"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.clerk_id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {user.first_name} {user.last_name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{user.email}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleDeleteClick(user.clerk_id)}
                                        className="text-red-600 hover:text-red-900"
                                        title="Delete user"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 