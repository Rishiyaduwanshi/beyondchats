const Footer = () => {
    return (
        <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="text-center md:text-left">
                        <p className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} Abhinav Prakash. All Rights Reserved.
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                            This codebase is protected under copyright law. Unauthorized use, reproduction, or distribution is prohibited.
                        </p>
                    </div>

                    <div className="text-center md:text-right">
                        <p className="text-gray-500 text-xs">
                            Built with React, TailwindCSS & Node.js
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
