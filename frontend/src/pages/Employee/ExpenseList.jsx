import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

function ExpenseList({ newExpense }) {
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchExpenses = useCallback(async () => {
        try {
            const response = await api.get('/expenses');
            setExpenses(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch expenses.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchExpenses(); }, [fetchExpenses]);
    useEffect(() => { if (newExpense) setExpenses(prev => [newExpense, ...prev]); }, [newExpense]);

    const StatusBadge = ({ status }) => {
        const styles = {
            Pending: 'bg-yellow-100 text-yellow-800',
            'In Progress': 'bg-blue-100 text-blue-800',
            Approved: 'bg-green-100 text-green-800',
            Rejected: 'bg-red-100 text-red-800',
        };
        return <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status]}`}>{status}</span>;
    };

    if (isLoading) return <p className="text-center p-8">Loading expenses...</p>;
    if (error) return <p className="text-center text-red-600 p-8">{error}</p>;

    return (
        <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">Your Submitted Expenses</h2>
            {expenses.length === 0 ? <p className="text-center text-gray-500">No expenses yet.</p> : (
                <ul className="divide-y divide-gray-200">
                    {expenses.map(expense => (
                        <li key={expense._id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                            <div className="mb-2 sm:mb-0">
                                <p className="text-lg font-semibold text-gray-800">{expense.description}</p>
                                <p className="text-sm text-gray-500">{new Date(expense.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-left sm:text-right">
                                <p className="text-lg sm:text-xl font-bold text-blue-600">{expense.originalCurrency} {expense.originalAmount.toFixed(2)}</p>
                                <StatusBadge status={expense.status} />
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
export default ExpenseList;