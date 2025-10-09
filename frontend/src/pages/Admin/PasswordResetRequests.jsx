import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function PasswordResetRequests() {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchRequests = async () => {
        try {
            const response = await api.get('/admin/password-resets');
            setRequests(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch password reset requests.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleResolve = async (requestId) => {
        if (!window.confirm("Are you sure you have communicated this password to the user? This request will be permanently removed.")) {
            return;
        }
        try {
            await api.delete(`/admin/password-resets/${requestId}`);
            setRequests(prev => prev.filter(req => req._id !== requestId));
        } catch (err) {
            alert("Failed to resolve the request.");
        }
    };

    if (isLoading) return <div className="bg-white p-4 rounded-lg shadow"><p>Loading password requests...</p></div>;
    if (error) return <div className="bg-red-100 p-4 rounded-lg"><p className="text-red-700">{error}</p></div>;
    if (requests.length === 0) return null;

    return (
        <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold text-orange-800 mb-4">Pending Password Reset Requests</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-orange-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase">Employee</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase">New Temporary Password</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-orange-700 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {requests.map((req) => (
                            <tr key={req._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">{req.userName}</div>
                                    <div className="text-sm text-gray-500">{req.userEmail}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <strong className="text-red-600 bg-red-100 px-2 py-1 rounded select-all">{req.temporaryPassword}</strong>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button onClick={() => handleResolve(req._id)} className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700">
                                        Mark as Resolved
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}