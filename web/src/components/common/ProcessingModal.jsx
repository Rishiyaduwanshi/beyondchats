import { Loader, CheckCircle, XCircle, Sparkles } from 'lucide-react';

const ProcessingModal = ({ isOpen, status, message, onClose }) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (status) {
            case 'processing':
                return <Loader className="w-16 h-16 text-purple-500 animate-spin" />;
            case 'success':
                return <CheckCircle className="w-16 h-16 text-green-500" />;
            case 'error':
                return <XCircle className="w-16 h-16 text-red-500" />;
            default:
                return <Sparkles className="w-16 h-16 text-purple-500 animate-pulse" />;
        }
    };

    const getTitle = () => {
        switch (status) {
            case 'processing':
                return 'AI Processing...';
            case 'success':
                return 'Success!';
            case 'error':
                return 'Error';
            default:
                return 'Processing';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 fade-in">
            <div className="bg-gray-800 rounded-lg max-w-md w-full p-8 border border-gray-700 text-center">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                    {getIcon()}
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-white mb-4">
                    {getTitle()}
                </h2>

                {/* Message */}
                <p className="text-gray-400 mb-6">
                    {message}
                </p>

                {/* Progress indicators for processing */}
                {status === 'processing' && (
                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                            <span>Searching Google for similar articles...</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                            <span>Analyzing top-ranking content...</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                            <span>Generating enhanced version with AI...</span>
                        </div>
                    </div>
                )}

                {/* Close button (only for success/error) */}
                {(status === 'success' || status === 'error') && (
                    <button
                        onClick={onClose}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        {status === 'success' ? 'View Versions' : 'Close'}
                    </button>
                )}

                {/* Cancel hint for processing */}
                {status === 'processing' && (
                    <p className="text-gray-500 text-xs">
                        This may take 1-2 minutes. Please wait...
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProcessingModal;
