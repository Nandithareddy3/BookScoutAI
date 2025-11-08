import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User, LogIn, LogOut }from 'lucide-react';
function Header() {
  const { isAuthenticated, userName, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
  <nav className="bg-zinc-800 p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white">
          <span role="img" aria-label="book emoji">📚</span>
          BookAI
        </Link>
       
        <div className="flex items-center gap-4">
         {isAuthenticated ? (
            <>
              <Link 
                to="/profile" 
                className="text-zinc-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <User size={18} />
                Welcome, {userName}
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center gap-1"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/profile" 
                className="text-zinc-300 hover:text-white transition-colors flex items-center gap-1"
              >
                <User size={18} />
                Profile
              </Link>
              <Link 
                to="/login" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1"
              >
                <LogIn size={18} />
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;