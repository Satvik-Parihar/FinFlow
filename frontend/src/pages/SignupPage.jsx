import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export default function SignupPage() {
    const [formData, setFormData] = useState({ companyName: '', adminName: '', email: '', password: '', country: '' });
    const [countries, setCountries] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { signup } = useAuth();

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get('https://restcountries.com/v3.1/all?fields=name');
                const countryNames = response.data.map(c => c.name.common).sort();
                setCountries(countryNames);
            } catch (err) {
                console.warn('Could not load country list.');
            }
        };
        fetchCountries();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const validateForm = () => {
        if (!EMAIL_REGEX.test(formData.email)) {
            setError('Please enter a valid email address.');
            return false;
        }
        if (!PASSWORD_REGEX.test(formData.password)) {
            setError('Password: 8+ chars, with uppercase, lowercase, number, & special character.');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            await signup(formData);
            alert('Signup successful! Please proceed to log in.');
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-600 mb-4">Create Your FinFlow Account</h1>
                <p className="text-center text-gray-500 mb-8">Join and streamline your company's expenses.</p>
            </div>
            <div className="max-w-md w-full mx-auto bg-white p-6 md:p-8 border border-gray-200 rounded-2xl shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
                        <input id="companyName" type="text" name="companyName" value={formData.companyName} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                    </div>
                    <div>
                        <label htmlFor="adminName" className="block text-sm font-semibold text-gray-700 mb-1">Your Full Name</label>
                        <input id="adminName" type="text" name="adminName" value={formData.adminName} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                        <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <input id="password" type="password" name="password" value={formData.password} onChange={handleChange} required className="w-full p-3 border rounded-lg" />
                    </div>
                    <div>
                        <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
                        <select id="country" name="country" value={formData.country} onChange={handleChange} required className="w-full p-3 border rounded-lg bg-white">
                            <option value="" disabled>Select your country</option>
                            {countries.map(name => <option key={name} value={name}>{name}</option>)}
                        </select>
                    </div>
                    
                    {error && <p className="text-sm text-red-600 text-center font-medium">{error}</p>}
                    
                    <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg disabled:bg-gray-400 transition">
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>
                 <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account? <Link to="/login" className="font-semibold text-blue-600 hover:underline">Log In</Link>
                </p>
            </div>
        </div>
    );
}