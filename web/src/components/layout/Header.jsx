import { Link } from 'react-router-dom';
import { Newspaper } from 'lucide-react';

const Header = () => {
    return (
        <header className="bg-gray-900/95 border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
                            <Newspaper className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">BeyondChats</h1>
                            <p className="text-xs text-gray-400">Article Manager</p>
                        </div>
                    </Link>

                    <nav className="flex items-center gap-6">
                        <Link
                            to="/"
                            className="text-gray-300 hover:text-white transition-colors font-medium"
                        >
                            Original Articles
                        </Link>
                        <Link
                            to="/updated-articles"
                            className="text-gray-300 hover:text-white transition-colors font-medium"
                        >
                            Updated Articles
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
