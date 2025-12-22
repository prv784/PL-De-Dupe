import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HiHome, 
  HiUpload, 
  HiClock, 
  HiChartBar, 
  HiUser,
  HiLogout,
  HiDocumentDuplicate,
  HiSun,
  HiMoon,
  HiMenu,
  HiX
} from 'react-icons/hi';

const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HiHome },
    { name: 'De-duplicate', href: '/upload', icon: HiDocumentDuplicate },
    { name: 'History', href: '/history', icon: HiClock },
    { name: 'Analytics', href: '/analytics', icon: HiChartBar },
    { name: 'Profile', href: '/profile', icon: HiUser }, // Only one Profile link
  ];

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md"
      >
        {isSidebarOpen ? (
          <HiX className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        ) : (
          <HiMenu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        )}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 z-40
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary dark:text-primary-300 flex items-center">
            <HiDocumentDuplicate className="w-6 h-6 mr-2" />
            PL De-Dupe
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Price List De-duplication System
          </p>
        </div>
        
        <nav className="mt-6 px-4">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setIsSidebarOpen(false)}
              className={`
                flex items-center px-4 py-3 mb-2 rounded-lg transition-all
                ${location.pathname === item.href || 
                  (item.href === '/dashboard' && location.pathname === '/')
                  ? 'bg-primary text-white shadow-sm dark:bg-primary-600'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }
              `}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-primary dark:bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="font-medium dark:text-gray-200">{user?.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                {user?.email}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={toggleDarkMode}
              className="flex-1 flex items-center justify-center px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {isDarkMode ? (
                <>
                  <HiSun className="w-5 h-5 mr-2" />
                  Light Mode
                </>
              ) : (
                <>
                  <HiMoon className="w-5 h-5 mr-2" />
                  Dark Mode
                </>
              )}
            </button>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <HiLogout className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;