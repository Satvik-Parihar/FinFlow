import { useState, useEffect } from 'react';
import api from '../../services/api';

const StatusBadge = ({ status }) => {
    const styles = {
        Pending: 'bg-yellow-100 text-yellow-800',
        'In Progress': 'bg-blue-100 text-blue-800',
        Approved: 'bg-green-100 text-green-800',
        Rejected: 'bg-red-100 text-red-800',
    };
    return <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status]}`}>{status}</span>;
};

export default function TeamExpenseList() {
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTeamExpenses = async () => {
            try {
                const response = await api.get('/admin/team-expenses');
                setExpenses(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch team expenses.");
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchTeamExpenses();
    }, []);

    if (isLoading) return <p className="text-center p-8">Loading team expenses...</p>;
    if (error) return <p className="text-center text-red-600 p-8">{error}</p>;

    return (
        <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Your Team's Expenses (All)</h2>
            {expenses.length === 0 ? <p className="text-center text-gray-500 py-4">No expenses have been submitted by your team yet.</p> :
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {expenses.map(expense => (
                                <tr key={expense._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{expense.user_id?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{expense.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-semibold">{expense.originalCurrency} {expense.originalAmount.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(expense.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={expense.status} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    );
}