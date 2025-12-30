import { X, Calendar, Sparkles, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const VersionsModal = ({ isOpen, onClose, versions, originalBlogTitle }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 fade-in">
            <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden border border-gray-700 flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-700 flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-6 h-6 text-purple-500" />
                            <h2 className="text-2xl font-bold text-white">AI-Enhanced Versions</h2>
                        </div>
                        <p className="text-gray-400 text-sm">
                            {originalBlogTitle}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-2"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Versions List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {versions.length === 0 ? (
                        <div className="text-center py-12">
                            <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-400 mb-2">
                                No versions yet
                            </h3>
                            <p className="text-gray-500">
                                Enhanced versions will appear here after AI processing
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {versions.map((version) => {
                                const formattedDate = new Date(version.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                });

                                return (
                                    <div
                                        key={version._id}
                                        className="bg-gray-900 rounded-lg p-5 border border-gray-700 hover:border-purple-500/50 transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-bold">
                                                    v{version.version}
                                                </span>
                                                <span className="flex items-center gap-1 text-gray-400 text-sm">
                                                    <Calendar className="w-4 h-4" />
                                                    {formattedDate}
                                                </span>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-semibold text-white mb-2">
                                            {version.title}
                                        </h3>

                                        {version.metaDesc && (
                                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                                {version.metaDesc}
                                            </p>
                                        )}

                                        {/* References */}
                                        {version.references && version.references.length > 0 && (
                                            <div className="mb-4">
                                                <p className="text-gray-500 text-xs mb-2">
                                                    References: {version.references.length} sources
                                                </p>
                                                <div className="flex flex-wrap gap-2">
                                                    {version.references.slice(0, 2).map((ref, idx) => (
                                                        <a
                                                            key={idx}
                                                            href={ref}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-purple-400 hover:text-purple-300 text-xs flex items-center gap-1"
                                                            onClick={(e) => e.stopPropagation()}
                                                        >
                                                            <ExternalLink className="w-3 h-3" />
                                                            Source {idx + 1}
                                                        </a>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <Link
                                            to={`/updated-article/${version._id}`}
                                            onClick={onClose}
                                            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Read Full Article
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VersionsModal;
