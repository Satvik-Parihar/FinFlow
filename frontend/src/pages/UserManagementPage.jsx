// frontend/src/pages/UserManagementPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AddEmployeeForm from '../components/AddEmployeeForm';
import UserList from '../components/UserList';

function UserManagementPage() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [newUser, setNewUser] = useState(null);

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-8">
             <header className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold text-gray-800">User Management</h1>
                    <p className="mt-1 text-gray-500">Add and view your company's employees.</p>
                </div>
                <div className="flex items-center space-x-4">
                    <Link to="/dashboard" className="py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg">
                        Back to Dashboard
                    </Link>
                    <button onClick={handleLogout} className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg">
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                     <AddEmployeeForm onEmployeeAdded={setNewUser} />
                </div>
                <div className="md:col-span-2">
                    <UserList newUser={newUser} />
                </div>
            </main>
        </div>
    );
}
export default UserManagementPage;