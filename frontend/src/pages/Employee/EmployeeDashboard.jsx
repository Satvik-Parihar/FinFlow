import { useState } from 'react';
import AddExpenseForm from './AddExpenseForm';
import ExpenseList from './ExpenseList';

export default function EmployeeDashboard() {
    const [newExpense, setNewExpense] = useState(null);

    return (
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Employee Dashboard</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <AddExpenseForm onExpenseAdded={setNewExpense} />
                </div>
                <div className="lg:col-span-2">
                    <ExpenseList newExpense={newExpense} />
                </div>
            </div>
        </div>
    );
}