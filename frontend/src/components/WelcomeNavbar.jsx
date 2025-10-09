import { Link } from 'react-router-dom';

export default function WelcomeNavbar() {
    return (
        <header className="bg-white/80 backdrop-blur-md fixed top-0 left-0 right-0 z-40 shadow-sm">
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600">
                    FinFlow
                </Link>
                <div className="flex items-center space-x-4">
                    <Link to="/login" className="px-5 py-2 text-gray-800 font-semibold rounded-lg hover:bg-gray-100 transition duration-300">
                        Log In
                    </Link>
                    <Link to="/signup" className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                        Sign Up
                    </Link>
                </div>
            </nav>
        </header>
    );
}