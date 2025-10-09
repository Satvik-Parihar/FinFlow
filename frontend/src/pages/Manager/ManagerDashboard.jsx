import ApprovalQueue from "./ApprovalQueue";
import TeamExpenseList from "./TeamExpenseList";

export default function ManagerDashboard() {
    return (
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Manager Dashboard</h1>
            <div className="space-y-8">
                {/* This is the component with the "Approve" and "Reject" buttons */}
                <ApprovalQueue />
                
                {/* This is the read-only view of all team expenses */}
                <TeamExpenseList />
            </div>
        </div>
    );
}