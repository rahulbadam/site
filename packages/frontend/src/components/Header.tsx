import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Crown, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const isAdmin = user?.role === 'admin';
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
          ? 'bg-cream-50/95 backdrop-blur-xl shadow-lg border-b border-gold-200/50'
          : 'bg-transparent'
      }`}
    >
      {/* Decorative top border */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent transition-opacity duration-500 ${isScrolled ? 'opacity-100' : 'opacity-0'}`} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-br from-gold-400 to-gold-600 p-2.5 rounded-full border-2 border-gold-300">
                <Crown className="w-5 h-5 text-maroon-950" />
              </div>
            </motion.div>
            <div className="flex flex-col">
              <span className={`text-xl font-display font-bold text-maroon-950 ${isScrolled ? '' : 'drop-shadow-sm'}`}>
                VivahBandhan
              </span>
              <span className="text-[10px] text-gold-600 -mt-0.5 font-medium tracking-wide">Trusted Matrimony Partner</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-4 py-2 text-maroon-800 hover:text-maroon-950 transition-colors group font-medium"
              >
                <span className="relative z-10">{link.label}</span>
                <motion.div
                  className="absolute inset-0 bg-gold-100 rounded-full scale-0 group-hover:scale-100 transition-transform"
                  style={{ transformOrigin: 'center' }}
                />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-gold-400 to-gold-600 group-hover:w-3/4 transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-4 py-2 text-maroon-700 hover:text-maroon-950 transition-colors"
                    >
                      <Shield className="w-5 h-5" />
                      <span className="font-medium">Admin</span>
                    </motion.div>
                  </Link>
                )}
                <Link to="/dashboard">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-4 py-2 text-maroon-700 hover:text-maroon-950 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">{user?.name || 'Dashboard'}</span>
                  </motion.div>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-maroon-600 hover:text-maroon-950 transition-colors"
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
                    className="px-5 py-2.5 text-maroon-800 hover:text-maroon-950 font-medium transition-colors"
                  >
                    Sign In
                  </motion.button>
                </Link>
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group overflow-hidden bg-gradient-to-r from-gold-500 to-gold-400 text-maroon-950 px-6 py-2.5 rounded-full font-semibold shadow-gold"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      Register Free
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-gold-400 to-gold-300"
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
            className="md:hidden p-2 rounded-xl bg-gold-100/80 backdrop-blur-sm border border-gold-200/50"
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
                  <X className="w-6 h-6 text-maroon-800" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6 text-maroon-800" />
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
            className="md:hidden bg-cream-50/95 backdrop-blur-xl border-t border-gold-200/50"
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
                    className="block px-4 py-3 text-maroon-800 hover:text-maroon-950 hover:bg-gold-50 rounded-xl transition-all font-medium"
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
                className="pt-4 mt-4 border-t border-gold-200/50 space-y-3"
              >
                {isAuthenticated ? (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-3 px-4 py-3 text-maroon-700 hover:text-maroon-950 hover:bg-gold-50 rounded-xl transition-all"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Shield className="w-5 h-5" />
                        Admin Dashboard
                      </Link>
                    )}
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-3 px-4 py-3 text-maroon-700 hover:text-maroon-950 hover:bg-gold-50 rounded-xl transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-5 h-5" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-maroon-600 hover:bg-maroon-50 rounded-xl transition-all"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block text-center px-4 py-3 text-maroon-800 hover:text-maroon-950 border-2 border-gold-300 rounded-xl transition-all font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="block text-center bg-gradient-to-r from-gold-500 to-gold-400 text-maroon-950 px-4 py-3 rounded-xl font-semibold shadow-gold"
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