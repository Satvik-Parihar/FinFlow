import { useState, useEffect } from 'react';
import api from '../../services/api';

function AddEmployeeForm({ onEmployeeAdded }) {
    const [formData, setFormData] = useState({ name: '', email: '', role: 'Employee', manager_id: '' });
    const [managers, setManagers] = useState([]);
    const [error, setError] = useState('');
    const [successInfo, setSuccessInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const response = await api.get('/admin/employees');
                const managerList = response.data.filter(user => user.role === 'Manager');
                setManagers(managerList);
            } catch (err) {
                console.error("Failed to fetch managers list.");
            }
        };
        fetchManagers();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => {
            const newData = { ...prevData, [name]: value };
            if (name === 'role' && value === 'Manager') {
                newData.manager_id = '';
            }
            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); setSuccessInfo(null); setIsLoading(true);

        const submissionData = { ...formData };
        if (!submissionData.manager_id) {
            delete submissionData.manager_id;
        }

        try {
            const response = await api.post('/admin/employees', submissionData);
            setSuccessInfo(response.data);
            setFormData({ name: '', email: '', role: 'Employee', manager_id: '' });
            if (onEmployeeAdded) {
                onEmployeeAdded(response.data.employee);
                if (submissionData.role === 'Manager') {
                    setManagers(prev => [...prev, response.data.employee]);
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add employee.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg h-full">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">Add New Employee</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                    <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                </div>
                <div>
                    <label htmlFor="email-add" className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                    <input id="email-add" type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-3 border rounded-lg" required />
                </div>
                <div>
                    <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                    <select id="role" name="role" value={formData.role} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white">
                        <option value="Employee">Employee</option>
                        <option value="Manager">Manager</option>
                    </select>
                </div>

                {formData.role === 'Employee' && (
                    <div>
                        <label htmlFor="manager_id" className="block text-sm font-semibold text-gray-700 mb-1">Assign Manager (Optional)</label>
                        <select id="manager_id" name="manager_id" value={formData.manager_id} onChange={handleChange} className="w-full p-3 border rounded-lg bg-white">
                            <option value="">No Manager</option>
                            {managers.map(manager => (
                                <option key={manager._id} value={manager._id}>
                                    {manager.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                
                <button type="submit" disabled={isLoading} className="w-full py-3 mt-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg disabled:bg-gray-400">
                    {isLoading ? 'Creating...' : 'Create Account'}
                </button>

                {error && <p className="text-sm text-red-600 text-center mt-4">{error}</p>}
                
                {successInfo && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-300 rounded-lg text-center">
                        <p className="font-semibold text-green-800">{successInfo.message}</p>
                        <p className="text-sm text-gray-600 mt-2">Please share these credentials with the new employee:</p>
                        <div className="mt-2 text-left bg-gray-50 p-3 rounded">
                            <p><span className="font-semibold">Email:</span> {successInfo.employee.email}</p>
                            <p><span className="font-semibold">Temp Password:</span>
                                <strong className="text-red-600 ml-2 select-all bg-red-100 px-2 py-1 rounded">{successInfo.temporaryPassword}</strong>
                            </p>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
export default AddEmployeeForm;