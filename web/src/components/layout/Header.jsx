import { Link } from 'react-router-dom';
import { Newspaper, Github, Globe, BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="bg-gray-900/95 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
                        <div className="bg-blue-600 p-1.5 sm:p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
                            <Newspaper className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg sm:text-2xl font-bold text-white">BeyondChats</h1>
                            <p className="text-[10px] sm:text-xs text-gray-400 hidden sm:block">Article Manager</p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-4 lg:gap-6">
                        <Link
                            to="/"
                            className="text-gray-300 hover:text-white transition-colors font-medium text-sm lg:text-base"
                        >
                            Original
                        </Link>
                        <Link
                            to="/updated-articles"
                            className="text-gray-300 hover:text-white transition-colors font-medium text-sm lg:text-base"
                        >
                            Updated
                        </Link>
                        <div className="flex items-center gap-2 lg:gap-3 ml-2 pl-4 lg:pl-6 border-l border-gray-700">
                            <a
                                href="https://github.com/rishiyaduwanshi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                                title="GitHub"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="https://iamabhinav.dev"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                                title="Portfolio"
                            >
                                <Globe className="w-5 h-5" />
                            </a>
                            <a
                                href="https://blog.iamabhinav.dev"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                                title="Blog"
                            >
                                <BookOpen className="w-4 h-4 lg:w-5 lg:h-5" />
                            </a>
                        </div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-gray-400 hover:text-white transition-colors p-2"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <nav className="md:hidden mt-4 pb-4 space-y-3 border-t border-gray-800 pt-4">
                        <Link
                            to="/"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-gray-300 hover:text-white transition-colors font-medium py-2"
                        >
                            Original Articles
                        </Link>
                        <Link
                            to="/updated-articles"
                            onClick={() => setMobileMenuOpen(false)}
                            className="block text-gray-300 hover:text-white transition-colors font-medium py-2"
                        >
                            Updated Articles
                        </Link>
                        <div className="flex items-center gap-4 pt-3 border-t border-gray-800">
                            <a
                                href="https://github.com/rishiyaduwanshi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                                title="GitHub"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="https://iamabhinav.dev"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                                title="Portfolio"
                            >
                                <Globe className="w-5 h-5" />
                            </a>
                            <a
                                href="https://blog.iamabhinav.dev"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-white transition-colors"
                                title="Blog"
                            >
                                <BookOpen className="w-5 h-5" />
                            </a>
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
};

export default Header;
