import { Routes, Route, Navigate } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';
import ForcePasswordChangeModal from './components/ForcePasswordChangeModal';

function App() {
    const { showPasswordModal, isAuthenticated } = useAuth();

    return (
        <>
            {showPasswordModal && <ForcePasswordChangeModal />}
            <Routes>
                <Route path="/" element={!isAuthenticated ? <WelcomePage /> : <Navigate to="/dashboard" />} />
                <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
                <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/dashboard" />} />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </>
    );
}

export default App;