import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ApiService from '../services/api';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { ArrowLeft, Calendar, ExternalLink, Trash2 } from 'lucide-react';

const ArticleDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchArticle();
    }, [id]);

    const fetchArticle = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await ApiService.getLLMBlogById(id);
            setArticle(response.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch article');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete "${article.title}"?`)) {
            return;
        }

        setIsDeleting(true);
        try {
            await ApiService.deleteLLMBlog(id);
            navigate('/updated-articles');
        } catch (err) {
            alert('Failed to delete article. Please try again.');
            setIsDeleting(false);
        }
    };

    if (loading) {
        return <Loader message="Loading article..." />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={fetchArticle} />;
    }

    if (!article) {
        return <ErrorMessage message="Article not found" />;
    }

    const formattedDate = article.createdAt
        ? new Date(article.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : 'N/A';

    return (
        <div className="max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8 py-4 fade-in">
            {/* Back Button */}
            <Link
                to="/updated-articles"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-8"
            >
                <ArrowLeft className="w-5 h-5" />
                Back to Articles
            </Link>

            {/* Article Header */}
            <div className="bg-gray-800 rounded-lg p-8 mb-8 border border-gray-700">
                <div className="flex items-start justify-between mb-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-white flex-1">
                        {article.title}
                    </h1>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="ml-4 bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white p-2 rounded-lg transition-colors"
                        title="Delete article"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-4">
                    <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formattedDate}
                    </span>
                </div>

                {/* Description */}
                {article.description && (
                    <p className="text-gray-300 text-lg leading-relaxed">
                        {article.description}
                    </p>
                )}

                {/* Original Blog Link */}
                {article.originalBlog?.link && (
                    <div className="mt-6 pt-6 border-t border-gray-700">
                        <a
                            href={article.originalBlog.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                        >
                            View Original Article
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                )}
            </div>

            {/* Article Content */}
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
                <div className="markdown-content prose prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {article.contentMarkdown || 'No content available'}
                    </ReactMarkdown>
                </div>
            </div>

            {/* References Section */}
            {article.references && article.references.length > 0 && (
                <div className="bg-gray-800 rounded-lg p-8 mt-8 border border-gray-700">
                    <h2 className="text-2xl font-bold text-white mb-4">References</h2>
                    <div className="space-y-3">
                        {article.references.map((ref, index) => (
                            <a
                                key={index}
                                href={ref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                            >
                                <ExternalLink className="w-4 h-4" />
                                <span className="break-all">{ref}</span>
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArticleDetailPage;
