import { useRouteError, Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const ErrorPage = () => {
    const error = useRouteError();

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="bg-red-500/10 rounded-full p-6 inline-block mb-6">
                    <AlertTriangle className="w-16 h-16 text-red-500" />
                </div>

                <h1 className="text-6xl font-bold text-white mb-4">Oops!</h1>
                <p className="text-xl text-gray-400 mb-4">Something went wrong</p>

                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-500 font-mono">
                        {error?.statusText || error?.message || 'Unknown error'}
                    </p>
                </div>

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    <Home className="w-5 h-5" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;
