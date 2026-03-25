import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Shield, Users, Star, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import HeroScene from '../components/three/HeroScene';

function HomePage() {
  const features = [
    {
      icon: Shield,
      title: '100% Verified Profiles',
      description: 'Every profile is verified with government ID and phone verification',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Users,
      title: 'Smart Matching',
      description: 'AI-powered compatibility matching based on your preferences',
      color: 'from-violet-500 to-purple-500'
    },
    {
      icon: Star,
      title: 'Privacy First',
      description: 'Control who sees your profile with advanced privacy settings',
      color: 'from-blue-500 to-cyan-500'
    }
  ];

  const steps = [
    { number: '01', title: 'Register', description: 'Create your profile with basic details' },
    { number: '02', title: 'Verify', description: 'Verify your phone, email, and ID' },
    { number: '03', title: 'Search', description: 'Find matches based on preferences' },
    { number: '04', title: 'Connect', description: 'Send interests and start conversations' }
  ];

  const stats = [
    { value: '2M+', label: 'Active Profiles' },
    { value: '50K+', label: 'Successful Matches' },
    { value: '99%', label: 'Verified Users' },
    { value: '4.8', label: 'App Rating' }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Hero Section with 3D Scene */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <HeroScene />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-white/80 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-transparent to-violet-500/5 pointer-events-none z-10" />
        
        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-violet-100 px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-medium bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-transparent">
                India's #1 Trusted Matrimonial Platform
              </span>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
              <span className="bg-gradient-to-r from-pink-600 via-rose-500 to-violet-600 bg-clip-text text-transparent">
                Find Your
              </span>
              <br />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-violet-600 via-purple-500 to-pink-600 bg-clip-text text-transparent"
              >
                Perfect Life Partner
              </motion.span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Experience the joy of finding your soulmate with our{' '}
              <span className="text-pink-600 font-semibold">AI-powered matching</span> and{' '}
              <span className="text-violet-600 font-semibold">verified profiles</span>
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(236, 72, 153, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative bg-gradient-to-r from-pink-500 to-violet-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Create Free Profile
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-violet-500 to-pink-500"
                    initial={{ x: '100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </Link>
              <Link to="/search">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative bg-white text-gray-800 px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-gray-200 hover:border-pink-300 overflow-hidden"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-500 group-hover:animate-pulse" />
                    Search Profiles
                  </span>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-white via-gray-50/50 to-white relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-transparent">
                Why Choose VivahBandhan?
              </span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              We combine tradition with technology to help you find your perfect match
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group relative bg-white rounded-3xl p-8 shadow-lg shadow-gray-100/50 border border-gray-100 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} mb-6`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.color}`}
                  style={{ transformOrigin: 'left' }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-white to-violet-50" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
                Your Journey to Love
              </span>
            </h2>
            <p className="text-gray-600 text-lg">Four simple steps to find your soulmate</p>
          </motion.div>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-200 via-violet-200 to-pink-200 -translate-y-1/2" />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative text-center"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="relative inline-flex flex-col items-center"
                  >
                    <div className="relative">
                      <motion.div
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.5 }}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center shadow-lg shadow-pink-200/50"
                      >
                        <CheckCircle className="w-8 h-8 text-white" />
                      </motion.div>
                      <motion.div
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-pink-500 to-violet-500 opacity-30"
                      />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-sm font-bold text-pink-600">
                      {step.number}
                    </span>
                  </motion.div>
                  
                  <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-600 via-rose-500 to-violet-600" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdi0wdjYwaC02MHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-30" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm mb-8"
          >
            <Heart className="w-10 h-10 text-white animate-pulse" />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Start Your Love Story Today
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join millions of happy couples who found their perfect match on VivahBandhan
          </p>
          
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)' }}
              whileTap={{ scale: 0.95 }}
              className="group bg-white text-pink-600 px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl transition-all"
            >
              <span className="flex items-center gap-3">
                Create Your Free Profile
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.span>
              </span>
            </motion.button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}

export default HomePage;