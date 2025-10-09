import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./Admin/AdminDashboard";
import ManagerDashboard from "./Manager/ManagerDashboard";
import EmployeeDashboard from "./Employee/EmployeeDashboard";
import Header from "../components/Header";

export default function DashboardPage() {
    const { user } = useAuth();

    const renderDashboard = () => {
        switch (user?.role) {
            case 'Admin':
                return <AdminDashboard />;
            case 'Manager':
                return <ManagerDashboard />;
            case 'Employee':
                return <EmployeeDashboard />;
            default:
                return <div className="text-center p-10">Invalid user role. Please contact support.</div>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                {renderDashboard()}
            </main>
        </div>
    );
}