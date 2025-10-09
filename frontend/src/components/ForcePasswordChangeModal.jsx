import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ForcePasswordChangeModal() {
    const { user, updateUserContext, setShowPasswordModal, logout } = useAuth();
    const [formData, setFormData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.newPassword !== formData.confirmPassword) return setError('New passwords do not match.');
        if (formData.newPassword.length < 8) return setError('Password must be at least 8 characters.');

        setIsLoading(true);
        try {
            await api.post(`/auth/set-password`, { userId: user._id, currentPassword: formData.currentPassword, newPassword: formData.newPassword });
            setSuccess('Password updated successfully!');
            updateUserContext({ isTemporaryPassword: false });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full relative">
                <button onClick={logout} title="Logout if you forgot your temporary password" className="absolute top-2 right-4 text-gray-400 hover:text-gray-600 font-bold text-2xl">&times;</button>
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-4">Set Your New Password</h2>
                
                {success ? (
                    <div className="text-center">
                        <p className="text-lg text-green-600 font-semibold mb-6">{success}</p>
                        <button 
                            onClick={() => setShowPasswordModal(false)}
                            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg"
                        >
                            Continue to Dashboard
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="text-center text-gray-500 mb-6">You must change your temporary password to continue.</p>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <input type="password" name="currentPassword" placeholder="Temporary Password" onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                            <input type="password" name="newPassword" placeholder="New Password" onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                            <input type="password" name="confirmPassword" placeholder="Confirm New Password" onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                            <button type="submit" disabled={isLoading} className="w-full py-3 mt-2 bg-blue-600 text-white font-bold rounded-lg disabled:bg-gray-400">
                                {isLoading ? 'Updating...' : 'Set Password'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}