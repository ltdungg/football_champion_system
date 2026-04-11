// frontend/src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext'; // <-- path './' correct
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import TeamsList from './pages/Teams/TeamsList';
import PlayersList from './pages/Players/PlayersList';
import StadiumsList from './pages/Stadiums/StadiumsList';
import MatchesList from './pages/Matches/MatchesList';
import TicketCalculator from './pages/Tickets/TicketCalculator';
import TournamentStandings from './pages/Tournament/TournamentStandings';
import Reports from './pages/Reports/Reports';
import Settings from './pages/Settings/Settings';

// Wrapper component for protected routes
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, isLoading } = useAuth(); // <-- CHANGED: use token
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600 dark:text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }
  
  // <-- CHANGED: check for token availability
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

// Component for routes accessible only to unauthorized users
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token, isLoading } = useAuth(); // <-- CHANGED: use token
    
    if (isLoading) {
        return <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">Loading...</div>;
    }
    
    return !token ? <>{children}</> : <Navigate to="/" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            
            {/* Protected routes */}
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/teams" element={<TeamsList />} />
                      <Route path="/players" element={<PlayersList />} />
                      <Route path="/stadiums" element={<StadiumsList />} />
                      <Route path="/matches" element={<MatchesList />} />
                      <Route path="/tickets" element={<TicketCalculator />} />
                      <Route path="/tournament" element={<TournamentStandings />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/settings" element={<Settings />} />
                      {/* Redirect to home page for all other paths */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;