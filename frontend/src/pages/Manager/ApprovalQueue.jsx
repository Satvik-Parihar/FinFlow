import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

export default function ApprovalQueue() {
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAllExpenses = useCallback(async () => {
        try {
            const response = await api.get('/admin/approvals');
            setExpenses(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch approval queue.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchAllExpenses(); }, [fetchAllExpenses]);

    const handleDecision = async (expenseId, decision) => {
        const comment = prompt(`Add a comment for this ${decision.toLowerCase()} (optional):`);
        if (comment === null) return;

        try {
            await api.put(`/admin/approvals/${expenseId}`, { decision, comment });
            setExpenses(prev => prev.filter(exp => exp._id !== expenseId));
        } catch (err) {
            alert('Failed to update status.');
        }
    };

    return (
        <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Expense Approval Queue</h2>
            {isLoading ? <p>Loading...</p> : error ? <p className="text-red-500">{error}</p> : (
                 expenses.length === 0 ? <p className="text-center text-gray-500 py-4">Your approval queue is empty.</p> :
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount (Original)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount (Company Currency)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {expenses.map(expense => (
                                <tr key={expense._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{expense.user_id?.name || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{expense.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-semibold">{expense.originalCurrency} {expense.originalAmount.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-semibold">{expense.baseCurrency} {expense.convertedAmount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(expense.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleDecision(expense._id, 'Approved')} className="text-green-600 hover:text-green-900">Approve</button>
                                            <button onClick={() => handleDecision(expense._id, 'Rejected')} className="text-red-600 hover:text-red-900">Reject</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}