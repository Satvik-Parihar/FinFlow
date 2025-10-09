import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Header() {
    const { user, logout } = useAuth();
    return (
        <header className="bg-white shadow-sm">
            <nav className="container mx-auto px-6 py-3 flex justify-between items-center">
                <Link to="/dashboard" className="text-2xl font-bold text-blue-600">FinFlow</Link>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-700 hidden sm:block">Welcome, <span className="font-semibold">{user?.name}</span> ({user?.role})</span>
                    <button onClick={logout} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition">Logout</button>
                </div>
            </nav>
        </header>
    );
}