import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import CreateModal from './CreateModal';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Inicio',
      icon: '🏠',
      path: '/',
      color: 'text-blue-600'
    },
    {
      id: 'matches',
      label: 'Partidos',
      icon: '⚽',
      path: '/matches',
      color: 'text-green-600'
    },
    {
      id: 'stats',
      label: 'Stats',
      icon: '📊',
      path: '/stats', 
      color: 'text-purple-600'
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: '👤',
      path: '/profile',
      color: 'text-gray-600'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-bottom z-50">
      {/* Navigation Items */}
      <div className="grid grid-cols-4 py-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center justify-center py-2 px-1 transition-all duration-200 ${
                active 
                  ? 'text-blue-600 scale-110' 
                  : 'text-gray-500 hover:text-gray-700 active:scale-95'
              }`}
            >
              {/* Icon */}
              <div className={`text-xl mb-1 ${active ? 'animate-bounce' : ''}`}>
                {item.icon}
              </div>
              
              {/* Label */}
              <span className={`text-xs font-medium ${
                active ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {item.label}
              </span>
              
              {/* Active indicator */}
              {active && (
                <div className="absolute bottom-0 w-6 h-0.5 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Floating Action Button */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center justify-center"
        >
          <span className="text-2xl font-bold">+</span>
        </button>
      </div>
      
      {/* Create Modal */}
      <CreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        userRole={user?.role || 'VIEWER'}
      />
    </div>
  );
};

export default BottomNavigation;
