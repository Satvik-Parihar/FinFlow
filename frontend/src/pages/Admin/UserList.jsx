import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

const EditUserModal = ({ user, allUsers, onClose, onUserUpdated }) => {
    const [role, setRole] = useState(user.role);
    const [selectedManagers, setSelectedManagers] = useState(user.manager_ids || []);
    const [isLoading, setIsLoading] = useState(false);

    const availableManagers = allUsers.filter(u => u.role === 'Manager' && u._id !== user._id);

    const handleManagerSelect = (managerId) => {
        setSelectedManagers(prev =>
            prev.includes(managerId)
                ? prev.filter(id => id !== managerId)
                : [...prev, managerId]
        );
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const updatedData = {
                role,
                manager_ids: role === 'Manager' ? [] : selectedManagers
            };
            await api.put(`/admin/employees/${user._id}`, updatedData);
            onUserUpdated();
            onClose();
        } catch (err) {
            alert('Failed to update user.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full">
                <h2 className="text-2xl font-bold mb-4">Edit User: {user.name}</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="edit-role" className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                        <select id="edit-role" value={role} onChange={e => setRole(e.target.value)} className="w-full p-3 border rounded-lg bg-white">
                            <option value="Employee">Employee</option>
                            <option value="Manager">Manager</option>
                        </select>
                    </div>
                    {(role === 'Employee' || role === 'Manager') && (
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Assign Managers</label>
                            <div className="max-h-48 overflow-y-auto border p-3 rounded-lg space-y-2">
                                {availableManagers.length > 0 ? availableManagers.map(manager => (
                                    <div key={manager._id} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`manager-${manager._id}`}
                                            checked={selectedManagers.includes(manager._id)}
                                            onChange={() => handleManagerSelect(manager._id)}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor={`manager-${manager._id}`} className="ml-3 block text-sm text-gray-900">{manager.name}</label>
                                    </div>
                                )) : <p className="text-sm text-gray-500">No other managers available to assign.</p>}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSubmit} disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400">
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
};

function UserList({ newUser }) {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingUser, setEditingUser] = useState(null);

    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/admin/employees');
            setUsers(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch users.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);
    useEffect(() => { if (newUser) fetchUsers() }, [newUser, fetchUsers]);

    const handleRemoveUser = async (employeeId) => {
        if (!window.confirm("Are you sure? This will also remove all their expenses.")) return;
        try {
            await api.delete(`/admin/employees/${employeeId}`);
            setUsers(prev => prev.filter(u => u._id !== employeeId));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to remove user.');
        }
    };

    const handleResetPassword = async (employeeId, employeeName) => {
        if (!window.confirm(`Are you sure you want to reset the password for ${employeeName}?`)) return;
        try {
            const response = await api.post(`/admin/employees/${employeeId}/reset-password`);
            window.prompt(
                `Password reset for ${employeeName}. Share this new temporary password securely. You can copy it from here:`,
                response.data.temporaryPassword
            );
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to reset password.');
        }
    };

    if (isLoading) return <p>Loading users...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <>
            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    allUsers={users}
                    onClose={() => setEditingUser(null)}
                    onUserUpdated={fetchUsers}
                />
            )}
            <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">Company Employees</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((employee) => (
                                <tr key={employee._id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{employee.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{employee.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{employee.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                        <button onClick={() => setEditingUser(employee)} className="text-indigo-600 hover:text-indigo-900">
                                            Edit
                                        </button>
                                        <button onClick={() => handleResetPassword(employee._id, employee.name)} className="text-blue-600 hover:text-blue-900">
                                            Reset Password
                                        </button>
                                        <button onClick={() => handleRemoveUser(employee._id)} className="text-red-600 hover:text-red-900">
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
export default UserList;