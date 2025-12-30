import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message = 'Something went wrong', onRetry = null }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-red-500/10 rounded-full p-4 mb-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Error</h3>
            <p className="text-gray-400 mb-4">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                    Try Again
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;
