import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);

  // Apply saved theme on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDark = () => {
    const newDark = !dark;
    setDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-blue-600">SmartLeads</h1>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleDark}
          className="text-sm border border-gray-300 dark:border-gray-600 px-3 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300"
        >
          {dark ? '☀️ Light' : '🌙 Dark'}
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {user?.name} <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full ml-1">{user?.role}</span>
        </span>
        <button onClick={handleLogout} className="text-sm text-red-500 hover:text-red-700">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;