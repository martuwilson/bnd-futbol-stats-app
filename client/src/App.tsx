import { Routes, Route, Navigate } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { GET_ME_QUERY } from './graphql/queries'
import { isAuthenticated } from './graphql/client'

// 📱 Pages (las crearemos a continuación)
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import MatchesPage from './pages/MatchesPage'
import StatsPage from './pages/StatsPage'
import LoadingSpinner from './components/LoadingSpinner'

// 🔐 Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { loading, error } = useQuery(GET_ME_QUERY, {
    skip: !isAuthenticated(),
  });

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
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
        
        {/* 🎯 Redirect unknown routes to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
