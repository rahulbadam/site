import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerLinks = {
    quickLinks: [
      { to: '/search', label: 'Search Profiles' },
      { to: '/subscription', label: 'Premium Plans' },
      { to: '/about', label: 'About Us' },
      { to: '/success-stories', label: 'Success Stories' }
    ],
    support: [
      { to: '/help', label: 'Help Center' },
      { to: '/safety', label: 'Safety Tips' },
      { to: '/contact', label: 'Contact Us' },
      { to: '/faq', label: 'FAQs' }
    ],
    legal: [
      { to: '/privacy', label: 'Privacy Policy' },
      { to: '/terms', label: 'Terms of Service' },
      { to: '/cookies', label: 'Cookie Policy' },
      { to: '/refund', label: 'Refund Policy' }
    ]
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 text-gray-300 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      </div>

      {/* Scroll to top button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-violet-500 p-3 rounded-full shadow-lg shadow-pink-500/30"
      >
        <ArrowUp className="w-5 h-5 text-white" />
      </motion.button>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 rounded-xl blur-lg opacity-50" />
                <div className="relative bg-gradient-to-r from-pink-500 to-violet-500 p-2.5 rounded-xl">
                  <Heart className="w-6 h-6 text-white" fill="white" />
                </div>
              </motion.div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                  VivahBandhan
                </span>
                <p className="text-xs text-gray-500">Find Your Soulmate</p>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed max-w-md">
              India's most trusted matrimonial platform connecting millions of hearts. 
              We blend tradition with technology to help you find your perfect life partner.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a href="mailto:support@vivahbandhan.com" className="flex items-center gap-3 text-gray-400 hover:text-pink-400 transition-colors">
                <Mail className="w-4 h-4" />
                <span className="text-sm">support@vivahbandhan.com</span>
              </a>
              <a href="tel:+911800123456" className="flex items-center gap-3 text-gray-400 hover:text-pink-400 transition-colors">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+91 1800-123-456 (Toll Free)</span>
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-pink-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-pink-500 to-violet-500 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" />
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-pink-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-violet-500 to-pink-500 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-5 flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full" />
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-pink-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-gradient-to-r from-pink-500 to-violet-500 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-gray-800/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center text-gray-400 hover:bg-gradient-to-r hover:from-pink-500 hover:to-violet-500 hover:text-white transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} VivahBandhan. All rights reserved.
              </p>
              <p className="text-gray-600 text-xs mt-1">
                Made with ❤️ in India
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 pt-8 border-t border-gray-800/50">
          <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              256-bit SSL Secured
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              ISO 27001 Certified
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" />
              GDPR Compliant
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-violet-500 rounded-full animate-pulse" />
              100% Profile Verification
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;