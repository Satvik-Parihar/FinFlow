import { useState, useEffect } from 'react';
import api from '../../services/api';
import axios from 'axios';

function AddExpenseForm({ onExpenseAdded }) {
    const [formData, setFormData] = useState({
        description: '',
        originalAmount: '',
        originalCurrency: 'INR',
        category: 'Meals',
        otherReason: ''
    });
    const [currencies, setCurrencies] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const response = await axios.get('https://open.er-api.com/v6/latest/USD');
                setCurrencies(Object.keys(response.data.rates));
            } catch (err) {
                console.error("Failed to fetch currency list. Using a default list.");
                setCurrencies(['INR', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'AED']);
            }
        };
        fetchCurrencies();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccess(''); setIsSubmitting(true);
        try {
            const expenseData = { ...formData, originalAmount: parseFloat(formData.originalAmount) };
            const response = await api.post('/expenses', expenseData);
            setSuccess('Expense added successfully!');
            setFormData({ description: '', originalAmount: '', originalCurrency: 'INR', category: 'Meals', otherReason: '' });
            if (onExpenseAdded) onExpenseAdded(response.data.expense);
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add expense.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg h-full">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">Add New Expense</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                    <input id="description" type="text" name="description" placeholder="e.g., Team Lunch" value={formData.description} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                </div>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-2">
                    <div className="flex-grow">
                        <label htmlFor="originalAmount" className="block text-sm font-semibold text-gray-700 mb-1">Amount</label>
                        <input id="originalAmount" type="number" step="0.01" name="originalAmount" value={formData.originalAmount} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                    </div>
                    <div className="sm:w-1/2">
                        <label htmlFor="originalCurrency" className="block text-sm font-semibold text-gray-700 mb-1">Currency</label>
                        <select id="originalCurrency" name="originalCurrency" value={formData.originalCurrency} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white">
                            {currencies.map(code => <option key={code} value={code}>{code}</option>)}
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                    <select id="category" name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white">
                        <option value="Meals">Meals</option>
                        <option value="Flights">Flights</option>
                        <option value="Hotels">Hotels</option>
                        <option value="Transport">Transport</option>
                        <option value="Client Entertainment">Client Entertainment</option>
                        <option value="Office Supplies">Office Supplies</option>
                        <option value="Software">Software</option>
                        <option value="Utilities">Utilities</option>
                        <option value="Health">Health</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                {formData.category === 'Other' && (
                    <div>
                        <label htmlFor="otherReason" className="block text-sm font-semibold text-gray-700 mb-1">Please specify reason</label>
                        <input id="otherReason" type="text" name="otherReason" value={formData.otherReason} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                    </div>
                )}
                {error && <p className="text-sm text-red-600 text-center">{error}</p>}
                {success && <p className="text-sm text-green-600 text-center">{success}</p>}
                <button type="submit" disabled={isSubmitting} className="w-full py-3 mt-2 bg-blue-600 text-white font-bold rounded-lg disabled:bg-gray-400">
                    {isSubmitting ? 'Submitting...' : 'Submit Expense'}
                </button>
            </form>
        </div>
    );
}
export default AddExpenseForm;