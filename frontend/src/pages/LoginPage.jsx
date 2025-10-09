import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ForgotPasswordModal = ({ onClose, setSuccessMessage }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await api.post('/auth/forgot-password', { email });
            setSuccessMessage(response.data.message);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full relative">
                <button onClick={onClose} className="absolute top-2 right-4 text-gray-400 hover:text-gray-600 font-bold text-2xl">&times;</button>
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Forgot Password</h2>
                <p className="text-center text-gray-500 mb-6">Enter your email to initiate a password reset.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="reset-email" className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                        <input id="reset-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 border rounded-lg" />
                    </div>
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                    <button type="submit" disabled={isLoading} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg disabled:bg-gray-400">
                        {isLoading ? 'Sending...' : 'Request Reset'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotModal, setShowForgotModal] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccessMessage(''); setIsLoading(true);
        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {showForgotModal && <ForgotPasswordModal onClose={() => setShowForgotModal(false)} setSuccessMessage={setSuccessMessage} />}
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
                <div className="max-w-md w-full mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-600 mb-4">Welcome Back!</h1>
                    <p className="text-center text-gray-500 mb-8">Log in to manage your expenses.</p>
                </div>
                <div className="max-w-md w-full mx-auto bg-white p-6 md:p-8 border border-gray-200 rounded-2xl shadow-lg">
                    {successMessage && <p className="p-3 mb-4 bg-green-100 text-green-800 rounded-lg text-center text-sm">{successMessage}</p>}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                            <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
                                <button type="button" onClick={() => setShowForgotModal(true)} className="text-sm text-blue-600 hover:underline font-semibold">
                                    Forgot Password?
                                </button>
                            </div>
                            <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        {error && <p className="text-sm text-red-600 text-center font-medium">{error}</p>}
                        <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg disabled:bg-gray-400 transition">
                            {isLoading ? 'Logging In...' : 'Log In'}
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-600 mt-6">
                        Don't have an account? <Link to="/signup" className="font-semibold text-blue-600 hover:underline">Sign Up</Link>
                    </p>
                </div>
            </div>
        </>
    );
}