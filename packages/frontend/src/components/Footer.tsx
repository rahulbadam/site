import { Link } from 'react-router-dom';
import { Crown, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, ArrowUp } from 'lucide-react';
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
    <footer className="relative bg-gradient-to-br from-maroon-950 via-burgundy-900 to-maroon-950 text-gold-100 overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
      
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-mandala-pattern opacity-30" />
      </div>

      {/* Scroll to top button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1, y: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={scrollToTop}
        className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold-500 to-gold-400 p-3 rounded-full shadow-lg shadow-gold-500/30 border-2 border-gold-300"
      >
        <ArrowUp className="w-5 h-5 text-maroon-950" />
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
                <div className="absolute inset-0 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full blur-lg opacity-50" />
                <div className="relative bg-gradient-to-br from-gold-400 to-gold-600 p-2.5 rounded-full border-2 border-gold-300">
                  <Crown className="w-6 h-6 text-maroon-950" />
                </div>
              </motion.div>
              <div>
                <span className="text-xl font-display font-bold text-gold-400">
                  VivahBandhan
                </span>
                <p className="text-xs text-gold-500">Trusted Matrimony Partner</p>
              </div>
            </div>
            {/* Sanskrit Mantra */}
            <div className="mb-4 p-3 bg-gold-500/10 rounded-lg border border-gold-500/20">
              <p className="text-gold-400 text-sm font-display mb-1">
                ॐ भद्रं कर्णेभिः शृणुयाम देवाः
              </p>
              <p className="text-gold-200/60 text-xs italic">
                "May we hear auspicious things through our ears"
              </p>
            </div>
            
            <p className="text-gold-200/70 mb-6 leading-relaxed max-w-md font-light">
              India's most trusted matrimonial platform, blending timeless traditions with modern technology 
              to help families find the perfect life partner for their loved ones. Your journey to a blessed 
              union begins here.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <a href="mailto:support@vivahbandhan.com" className="flex items-center gap-3 text-gold-200/70 hover:text-gold-400 transition-colors">
                <Mail className="w-4 h-4" />
                <span className="text-sm">support@vivahbandhan.com</span>
              </a>
              <a href="tel:+911800123456" className="flex items-center gap-3 text-gold-200/70 hover:text-gold-400 transition-colors">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+91 1800-123-456 (Toll Free)</span>
              </a>
              <div className="flex items-center gap-3 text-gold-200/70">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Mumbai, Maharashtra, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gold-400 font-display font-semibold mb-5 flex items-center gap-2">
              <span className="w-2 h-2 bg-gold-500 rounded-full" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gold-200/70 hover:text-gold-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-gold-500 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-gold-400 font-display font-semibold mb-5 flex items-center gap-2">
              <span className="w-2 h-2 bg-gold-500 rounded-full" />
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gold-200/70 hover:text-gold-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-gold-500 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-gold-400 font-display font-semibold mb-5 flex items-center gap-2">
              <span className="w-2 h-2 bg-gold-500 rounded-full" />
              Legal
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gold-200/70 hover:text-gold-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-gold-500 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links & Copyright */}
        <div className="border-t border-gold-500/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.2, y: -3 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 hover:bg-gold-500 hover:text-maroon-950 transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-gold-200/50 text-sm">
                © {new Date().getFullYear()} VivahBandhan. All rights reserved.
              </p>
              <p className="text-gold-300/40 text-xs mt-1">
                Made with love and tradition in India
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 pt-8 border-t border-gold-500/20">
          <div className="flex flex-wrap justify-center gap-6 text-xs text-gold-200/50">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              256-bit SSL Secured
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-gold-400 rounded-full animate-pulse" />
              ISO 27001 Certified
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              GDPR Compliant
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-rose-400 rounded-full animate-pulse" />
              100% Profile Verification
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;