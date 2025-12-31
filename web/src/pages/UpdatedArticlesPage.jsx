import { useState, useEffect } from 'react';
import ApiService from '../services/api';
import ArticleCard from '../components/common/ArticleCard';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { Sparkles } from 'lucide-react';

const UpdatedArticlesPage = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await ApiService.getAllLLMBlogs();
            setArticles(response.data.blogs || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch updated articles');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        await ApiService.deleteLLMBlog(id);
        setArticles(articles.filter(article => article._id !== id));
    };

    if (loading) {
        return <Loader message="Loading AI-enhanced articles..." />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={fetchArticles} />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 fade-in">
            {/* Page Header */}
            <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Sparkles className="w-10 h-10 text-purple-500" />
                    <h1 className="text-4xl md:text-5xl font-bold text-white">
                        AI-Enhanced Articles
                    </h1>
                </div>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Articles rewritten and optimized by AI using top-ranking content from Google
                </p>
                <div className="mt-4 inline-block px-4 py-2 bg-purple-500/10 rounded-full">
                    <span className="text-purple-400 font-medium">
                        {articles.length} {articles.length === 1 ? 'Article' : 'Articles'} Enhanced
                    </span>
                </div>
            </div>

            {/* Articles Grid */}
            {articles.length === 0 ? (
                <div className="text-center py-20">
                    <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No enhanced articles yet</h3>
                    <p className="text-gray-500">Enhanced articles will appear here after AI processing</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <ArticleCard
                            key={article._id}
                            article={article}
                            type="updated"
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default UpdatedArticlesPage;
