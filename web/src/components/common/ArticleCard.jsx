import { Calendar, Clock, ExternalLink, Trash2, GitBranch, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const ArticleCard = ({ article, type = 'original', onDelete, onViewVersions, onRewrite }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRewriting, setIsRewriting] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete "${article.title}"?`)) {
            return;
        }

        setIsDeleting(true);
        try {
            await onDelete(article._id);
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete article. Please try again.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleRewrite = async () => {
        if (!window.confirm(`Generate AI-enhanced version of "${article.title}"? This may take a few minutes.`)) {
            return;
        }

        setIsRewriting(true);
        try {
            await onRewrite(article._id);
        } catch (error) {
            console.error('Rewrite failed:', error);
            alert('Failed to rewrite article. Please try again.');
        } finally {
            setIsRewriting(false);
        }
    };

    const formattedDate = article.createdAt
        ? new Date(article.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : 'N/A';

    return (
        <div className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 border border-gray-700 hover:border-purple-500/50">
            {/* Card Header */}
            <div className="p-6">
                {/* Meta Info */}
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formattedDate}
                    </span>
                    {article.readTime && (
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {article.readTime} min read
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 hover:text-purple-400 transition-colors">
                    {article.title}
                </h3>

                {/* Description/Preview */}
                {article.description && (
                    <p className="text-gray-400 mb-4 line-clamp-3">
                        {article.description}
                    </p>
                )}

                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-purple-500/10 text-purple-400 text-xs rounded-full border border-purple-500/30"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 mt-4">
                    {type === 'updated' ? (
                        <Link
                            to={`/updated-article/${article._id}`}
                            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors text-center font-medium"
                        >
                            Read Full Article
                        </Link>
                    ) : (
                        <>
                            {article.link && (
                                <a
                                    href={article.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors text-center font-medium flex items-center justify-center gap-2"
                                >
                                    Original Article
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                            {onViewVersions && (
                                <button
                                    onClick={() => onViewVersions(article)}
                                    className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 p-2 rounded-lg transition-colors flex items-center justify-center border border-purple-500/30"
                                    title="View AI-enhanced versions"
                                >
                                    <GitBranch className="w-5 h-5" />
                                </button>
                            )}
                            {onRewrite && (
                                <button
                                    onClick={handleRewrite}
                                    disabled={isRewriting}
                                    className="bg-green-500/20 hover:bg-green-500/30 disabled:bg-green-500/10 text-green-400 p-2 rounded-lg transition-colors flex items-center justify-center border border-green-500/30"
                                    title={isRewriting ? "Rewriting... please wait" : "Generate AI-enhanced version"}
                                >
                                    <Sparkles className={`w-5 h-5 ${isRewriting ? 'animate-pulse' : ''}`} />
                                </button>
                            )}
                        </>
                    )}
                    {onDelete && (
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
                            title="Delete article"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Footer for Updated Articles */}
            {type === 'updated' && article.originalBlog?.link && (
                <div className="bg-gray-900/50 px-6 py-3 border-t border-gray-700">
                    <a
                        href={article.originalBlog.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
                    >
                        <ExternalLink className="w-4 h-4" />
                        View Original Article
                    </a>
                </div>
            )}
        </div>
    );
};

export default ArticleCard;
