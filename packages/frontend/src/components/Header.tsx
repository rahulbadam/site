import { Link, useNavigate } from 'react-router-dom';
import { Heart, Menu, X, User, LogOut, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/help', label: 'Help' },
    { to: '/contact', label: 'Contact' },
    { to: '/safety', label: 'Safety' }
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-pink-100/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-r from-pink-500 to-violet-500 p-2 rounded-xl">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
            </motion.div>
            <div className="flex flex-col">
              <span className={`text-xl font-bold bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-transparent ${isScrolled ? '' : 'drop-shadow-sm'}`}>
                VivahBandhan
              </span>
              <span className="text-[10px] text-gray-400 -mt-1">Find Your Soulmate</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-4 py-2 text-gray-600 hover:text-pink-600 transition-colors group"
              >
                <span className="relative z-10">{link.label}</span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-pink-50 to-violet-50 rounded-full scale-0 group-hover:scale-100 transition-transform"
                  style={{ transformOrigin: 'center' }}
                />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-violet-500 group-hover:w-3/4 transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-pink-600 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">{user?.name || 'Dashboard'}</span>
                  </motion.div>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-5 py-2.5 text-gray-600 hover:text-pink-600 font-medium transition-colors"
                  >
                    Sign In
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(236, 72, 153, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group overflow-hidden bg-gradient-to-r from-pink-500 to-violet-500 text-white px-6 py-2.5 rounded-full font-medium"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Register Free
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-violet-500 to-pink-500"
                      initial={{ x: '100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden p-2 rounded-xl bg-gray-100/80 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6 text-gray-700" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6 text-gray-700" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={link.to}
                    className="block px-4 py-3 text-gray-600 hover:text-pink-600 hover:bg-gradient-to-r hover:from-pink-50 hover:to-violet-50 rounded-xl transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="pt-4 mt-4 border-t border-gray-100 space-y-3"
              >
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-pink-600 hover:bg-gradient-to-r hover:from-pink-50 hover:to-violet-50 rounded-xl transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block text-center px-4 py-3 text-gray-600 hover:text-pink-600 border border-gray-200 rounded-xl transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="block text-center bg-gradient-to-r from-pink-500 to-violet-500 text-white px-4 py-3 rounded-xl font-medium shadow-lg shadow-pink-200/50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register Free
                    </Link>
                  </>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

export default Header;