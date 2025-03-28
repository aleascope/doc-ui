import { Link } from 'react-router-dom';
import { SignIn } from "@clerk/clerk-react";
import { useAuth } from '@clerk/clerk-react';

const Home = () => {
    const { isSignedIn } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to DocUI</h1>
                    <p className="text-gray-600 mb-8">Document Management System</p>
                </div>
                
                {!isSignedIn ? (
                    <div className="flex justify-center">
                        <SignIn appearance={{
                            elements: {
                                rootBox: "mx-auto",
                                card: "shadow-none",
                            },
                        }} />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <Link
                            to="/list"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            View Documents
                        </Link>
                        <br/>
                        <Link
                            to="/upload"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Upload Document
                        </Link>
                        <br/>
                        <Link
                            to="/users"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        >
                            Manage Users
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home; 