import { useState, useEffect } from 'react';
import ApiService from '../services/api';
import ArticleCard from '../components/common/ArticleCard';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { FileText, Download } from 'lucide-react';

const HomePage = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scraping, setScraping] = useState(false);
    const [scrapeCount, setScrapeCount] = useState(5);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await ApiService.getAllBlogs();
            setArticles(response.data.blogs || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch articles');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        await ApiService.deleteBlog(id);
        setArticles(articles.filter(article => article._id !== id));
    };

    const handleScrape = async () => {
        if (!window.confirm(`Scrape ${scrapeCount} oldest articles from BeyondChats blog?`)) {
            return;
        }

        setScraping(true);
        try {
            const response = await ApiService.scrapeBlogs(scrapeCount);
            alert(`Successfully scraped ${response.data.count} articles!`);
            await fetchArticles(); // Refresh list
        } catch (err) {
            alert('Failed to scrape articles: ' + (err.message || 'Unknown error'));
        } finally {
            setScraping(false);
        }
    };

    if (loading) {
        return <Loader message="Loading original articles..." />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={fetchArticles} />;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 fade-in">
            {/* Page Header */}
            <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-4">
                    <FileText className="w-10 h-10 text-purple-500" />
                    <h1 className="text-4xl md:text-5xl font-bold text-white">
                        Original Articles
                    </h1>
                </div>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Scraped from BeyondChats blog - these are the original articles before AI enhancement
                </p>
                <div className="mt-4 inline-block px-4 py-2 bg-purple-500/10 rounded-full">
                    <span className="text-purple-400 font-medium">
                        {articles.length} {articles.length === 1 ? 'Article' : 'Articles'} Found
                    </span>
                </div>
            </div>

            {/* Scrape Section */}
            <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">Scrape New Articles</h3>
                        <p className="text-gray-400 text-sm">
                            Fetch the oldest articles from BeyondChats blog
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <label htmlFor="scrapeCount" className="text-gray-400 text-sm">
                                Count:
                            </label>
                            <input
                                id="scrapeCount"
                                type="number"
                                min="1"
                                max="20"
                                value={scrapeCount}
                                onChange={(e) => setScrapeCount(Number(e.target.value))}
                                className="w-20 bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500"
                                disabled={scraping}
                            />
                        </div>
                        <button
                            onClick={handleScrape}
                            disabled={scraping}
                            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            {scraping ? 'Scraping...' : 'Scrape Articles'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Articles Grid */}
            {articles.length === 0 ? (
                <div className="text-center py-20">
                    <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No articles found</h3>
                    <p className="text-gray-500">Articles will appear here once they are scraped</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.map((article) => (
                        <ArticleCard
                            key={article._id}
                            article={article}
                            type="original"
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;
