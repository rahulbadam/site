import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-primary-500" />
              <span className="text-lg font-semibold text-white">VivahBandhan</span>
            </div>
            <p className="text-sm">
              India's trusted matrimonial platform for finding your perfect life partner.
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/search" className="hover:text-white">Search Profiles</Link></li>
              <li><Link to="/subscription" className="hover:text-white">Premium Plans</Link></li>
              <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="hover:text-white">Help Center</Link></li>
              <li><Link to="/safety" className="hover:text-white">Safety Tips</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-white">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} VivahBandhan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;