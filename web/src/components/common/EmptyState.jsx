import { FileQuestion } from 'lucide-react';

const EmptyState = ({ message = 'No data found', description = '' }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="bg-gray-800 rounded-full p-6 mb-4">
                <FileQuestion className="w-16 h-16 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{message}</h3>
            {description && (
                <p className="text-gray-400 max-w-md">{description}</p>
            )}
        </div>
    );
};

export default EmptyState;
