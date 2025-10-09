import { useState } from 'react';
import AddEmployeeForm from './AddEmployeeForm';
import UserList from './UserList';
import AllCompanyExpenses from './AllCompanyExpenses';
import PasswordResetRequests from './PasswordResetRequests';

export default function AdminDashboard() {
    const [newUser, setNewUser] = useState(null);

    return (
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
            <div className="space-y-8">
                <PasswordResetRequests />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <AddEmployeeForm onEmployeeAdded={setNewUser} />
                    </div>
                    <div className="lg:col-span-2">
                        <UserList newUser={newUser} />
                    </div>
                </div>
                <AllCompanyExpenses />
            </div>
        </div>
    );
}