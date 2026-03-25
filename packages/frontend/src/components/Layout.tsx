import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-gray-50/30 to-white">
      <Header />
      <main className="flex-1 pt-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
