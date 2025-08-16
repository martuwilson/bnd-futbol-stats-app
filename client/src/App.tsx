import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from './graphql/client'

// 📱 Pages
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import MatchesPage from './pages/MatchesPage'
import StatsPage from './pages/StatsPage'
import ProfilePage from './pages/ProfilePage'

// 🧭 Components
import BottomNavigation from './components/BottomNavigation'

// 🔐 Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  const location = useLocation();
  const showBottomNav = isAuthenticated() && location.pathname !== '/login';

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* 🔐 Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* 🔒 Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path="/matches" element={
          <ProtectedRoute>
            <MatchesPage />
          </ProtectedRoute>
        } />
        
        <Route path="/stats" element={
          <ProtectedRoute>
            <StatsPage />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        
        {/* 🎯 Redirect unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* 🧭 Bottom Navigation - Only show when authenticated */}
      {showBottomNav && <BottomNavigation />}
    </div>
  )
}

export default App
