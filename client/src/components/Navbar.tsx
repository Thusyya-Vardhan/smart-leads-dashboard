import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-blue-600">SmartLeads</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {user?.name} <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full ml-1">{user?.role}</span>
        </span>
        <button
          onClick={handleLogout}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;