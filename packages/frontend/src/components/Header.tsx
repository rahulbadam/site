import { Link, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-red-600" />
            <span className="text-xl font-bold text-gray-900">VivahBandhan</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-red-600 transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-red-600 transition-colors">
              About
            </Link>
            <Link to="/help" className="text-gray-600 hover:text-red-600 transition-colors">
              Help
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-red-600 transition-colors">
              Contact
            </Link>
            <Link to="/safety" className="text-gray-600 hover:text-red-600 transition-colors">
              Safety
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
                >
                  <User className="w-5 h-5 mr-1" />
                  {user?.name || 'Dashboard'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-red-600 transition-colors font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Register Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-4">
            <Link
              to="/"
              className="block text-gray-600 hover:text-red-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block text-gray-600 hover:text-red-600"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/help"
              className="block text-gray-600 hover:text-red-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Help
            </Link>
            <Link
              to="/contact"
              className="block text-gray-600 hover:text-red-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link
              to="/safety"
              className="block text-gray-600 hover:text-red-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Safety
            </Link>
            <div className="pt-4 border-t space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block text-gray-600 hover:text-red-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-gray-600 hover:text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block text-gray-600 hover:text-red-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="block bg-red-600 text-white px-4 py-2 rounded-lg text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;