import { useState, useEffect } from 'react';
import ApiService from '../services/api';
import ArticleCard from '../components/common/ArticleCard';
import VersionsModal from '../components/common/VersionsModal';
import ProcessingModal from '../components/common/ProcessingModal';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { FileText, Download } from 'lucide-react';

const HomePage = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scraping, setScraping] = useState(false);
    const [scrapeCount, setScrapeCount] = useState(5);

    // Versions modal state
    const [showVersionsModal, setShowVersionsModal] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [versions, setVersions] = useState([]);
    const [loadingVersions, setLoadingVersions] = useState(false);

    // Processing modal state
    const [showProcessingModal, setShowProcessingModal] = useState(false);
    const [processingStatus, setProcessingStatus] = useState('processing'); // 'processing' | 'success' | 'error'
    const [processingMessage, setProcessingMessage] = useState('');

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

    const handleViewVersions = async (article) => {
        setSelectedArticle(article);
        setShowVersionsModal(true);
        setLoadingVersions(true);
        setVersions([]);

        try {
            const response = await ApiService.getBlogVersions(article._id);
            setVersions(response.data.versions || []);
        } catch (err) {
            console.error('Failed to fetch versions:', err);
            setVersions([]);
        } finally {
            setLoadingVersions(false);
        }
    };

    const handleRewrite = async (blogId) => {
        // Show processing modal
        setShowProcessingModal(true);
        setProcessingStatus('processing');
        setProcessingMessage('Generating AI-enhanced version of your article. This may take 1-2 minutes...');

        try {
            const response = await ApiService.rewriteBlog(blogId);

            // Success - response structure is data.blog.updated
            const updatedBlog = response.data.blog?.updated;
            setProcessingStatus('success');
            setProcessingMessage(
                updatedBlog
                    ? `Article rewritten successfully! Version ${updatedBlog.version} has been created.`
                    : 'Article rewritten successfully!'
            );

            // Auto-close after 2 seconds and refresh versions
            setTimeout(() => {
                setShowProcessingModal(false);
                // Open versions modal to show the new version
                const article = articles.find(a => a._id === blogId);
                if (article) {
                    handleViewVersions(article);
                }
            }, 2000);
        } catch (err) {
            // Error
            setProcessingStatus('error');
            setProcessingMessage(err.message || 'Failed to rewrite article. Please try again.');
        }
    };

    const handleCloseProcessingModal = () => {
        if (processingStatus !== 'processing') {
            setShowProcessingModal(false);
        }
    };

    const handleCloseVersionsModal = () => {
        setShowVersionsModal(false);
        setSelectedArticle(null);
        setVersions([]);
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
                            <label htmlFor="scrapeCount" className="text-gray-400 text-sm whitespace-nowrap">
                                Count:
                            </label>
                            <select
                                id="scrapeCount"
                                value={scrapeCount}
                                onChange={(e) => setScrapeCount(Number(e.target.value))}
                                className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 cursor-pointer"
                                disabled={scraping}
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
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
                            onViewVersions={handleViewVersions}
                            onRewrite={handleRewrite}
                        />
                    ))}
                </div>
            )}

            {/* Versions Modal */}
            <VersionsModal
                isOpen={showVersionsModal}
                onClose={handleCloseVersionsModal}
                versions={loadingVersions ? [] : versions}
                originalBlogTitle={selectedArticle?.title || ''}
            />

            {/* Processing Modal */}
            <ProcessingModal
                isOpen={showProcessingModal}
                status={processingStatus}
                message={processingMessage}
                onClose={handleCloseProcessingModal}
            />
        </div>
    );
};

export default HomePage;
