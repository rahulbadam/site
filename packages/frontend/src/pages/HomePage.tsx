import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, Shield, Users, Star, ArrowRight, CheckCircle, Heart, Sparkles, Flame, Gem } from 'lucide-react';
import HeroScene from '../components/three/HeroScene';

function HomePage() {
  const features = [
    {
      icon: Shield,
      title: '100% Verified Profiles',
      description: 'Every profile is verified with government ID, phone, and horoscope authentication for complete peace of mind',
      color: 'from-gold-500 to-gold-600'
    },
    {
      icon: Users,
      title: 'Traditional Matchmaking',
      description: 'Expert matchmakers combined with smart technology to find compatible matches based on family values and preferences',
      color: 'from-maroon-600 to-maroon-700'
    },
    {
      icon: Star,
      title: 'Privacy & Traditions',
      description: 'Respecting Indian family values with advanced privacy controls and traditional matchmaking practices',
      color: 'from-gold-500 to-gold-600'
    }
  ];

  const steps = [
    { number: '01', title: 'Register', description: 'Create your profile with family details' },
    { number: '02', title: 'Verify', description: 'Verify phone, email, ID & horoscope' },
    { number: '03', title: 'Search', description: 'Find matches based on preferences' },
    { number: '04', title: 'Connect', description: 'Connect with families respectfully' }
  ];

  const stats = [
    { value: '2M+', label: 'Registered Profiles' },
    { value: '50K+', label: 'Successful Marriages' },
    { value: '99%', label: 'Verified Users' },
    { value: '4.8', label: 'Family Rating' }
  ];

  const testimonialData = [
    {
      name: 'Priya & Rahul Sharma',
      location: 'Delhi',
      quote: 'VivahBandhan helped our families find the perfect match. The traditional approach with modern convenience made all the difference.',
      image: '👫'
    },
    {
      name: 'Anjali & Vikram Patel',
      location: 'Mumbai',
      quote: 'The horoscope matching feature and family-oriented profiles helped us find exactly what we were looking for.',
      image: '💑'
    }
  ];

  return (
    <div className="relative overflow-hidden bg-cream-50">
      {/* Hero Section with 3D Scene */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <HeroScene />
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-cream-50/60 via-transparent to-cream-50/90 pointer-events-none z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-gold-500/5 via-transparent to-maroon-500/5 pointer-events-none z-10" />
        
        {/* Traditional pattern overlay */}
        <div className="absolute inset-0 bg-mandala-pattern opacity-30 pointer-events-none z-10" />
        
        {/* Hero Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Sanskrit Mantra Banner */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-6"
            >
              <div className="inline-flex flex-col items-center bg-gradient-to-r from-gold-100 to-cream-100 px-6 py-3 rounded-xl border border-gold-300/50">
                <span className="text-lg font-display text-maroon-800 tracking-wide mb-1">
                  ॐ सह नाववतु सह नौ भुनक्तु सह वीर्यं करवावहै
                </span>
                <span className="text-xs text-gold-600 font-medium">
                  "May we be protected together, may we be nourished together, may we work together with great energy"
                </span>
              </div>
            </motion.div>
            
            {/* Decorative element */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-gold-100 to-cream-100 px-5 py-2.5 rounded-full mb-6 border border-gold-300/50"
            >
              <Sparkles className="w-5 h-5 text-maroon-700" />
              <span className="text-sm font-medium text-maroon-800">
                India's #1 Trusted Matrimonial Platform
              </span>
            </motion.div>
            
            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
              <span className="text-maroon-950">
                Find Your
              </span>
              <br />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gold-gradient"
              >
                Perfect Life Partner
              </motion.span>
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-display text-maroon-800 mb-4">
              Begin Your Blessed Journey to Marriage
            </h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg md:text-xl text-maroon-700/80 mb-10 max-w-3xl mx-auto leading-relaxed font-light"
            >
              Where <span className="text-gold-600 font-medium">traditions meet trust</span> — 
              Find your perfect life partner with verified profiles, horoscope matching, 
              and family-oriented matchmaking that honors Indian values
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/register">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(212, 175, 55, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative bg-gradient-to-r from-gold-500 to-gold-400 text-maroon-950 px-8 py-4 rounded-xl font-semibold text-lg shadow-gold border border-gold-300"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    Create Free Profile
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              </Link>
              <Link to="/search">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative bg-cream-50 text-maroon-900 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gold-400 hover:border-gold-500 overflow-hidden"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-maroon-600 group-hover:animate-pulse" />
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
                className="text-center p-4"
              >
                <div className="text-3xl md:text-4xl font-bold text-gold-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-maroon-700 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="relative py-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
        </div>
        <div className="relative flex justify-center">
          <div className="bg-cream-50 px-4">
            <Gem className="w-8 h-8 text-gold-500" />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-cream-50 via-cream-100/50 to-cream-50 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-maroon-200/10 rounded-full blur-3xl" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="text-maroon-950">
                Why Choose VivahBandhan?
              </span>
            </h2>
            <p className="text-maroon-700/80 text-lg max-w-2xl mx-auto">
              Blending timeless Indian traditions with modern technology for a trusted matchmaking experience
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
                className="group relative bg-cream-50 rounded-2xl p-8 shadow-lg border border-gold-200/50 overflow-hidden"
              >
                {/* Gold top border */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 via-gold-300 to-gold-400" />
                
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-6 shadow-md`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                
                <h3 className="text-2xl font-display font-semibold mb-3 text-maroon-950">{feature.title}</h3>
                <p className="text-maroon-700/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-maroon-950 via-burgundy-900 to-maroon-950">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-mandala-pattern opacity-20" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="text-gold-400">
                Your Journey to a Blessed Union
              </span>
            </h2>
            <p className="text-gold-200/70 text-lg">Four simple steps to find your life partner</p>
          </motion.div>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-400/50 via-gold-500 to-gold-400/50 -translate-y-1/2" />
            
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
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center shadow-lg shadow-gold-500/30 border-2 border-gold-300"
                      >
                        <CheckCircle className="w-8 h-8 text-maroon-950" />
                      </motion.div>
                      <motion.div
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-500 to-gold-400 opacity-20"
                      />
                    </div>
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-maroon-900 rounded-full shadow flex items-center justify-center text-sm font-bold text-gold-400 border border-gold-500">
                      {step.number}
                    </span>
                  </motion.div>
                  
                  <h3 className="text-xl font-display font-semibold mt-6 mb-1 text-gold-300">{step.title}</h3>
                  <p className="text-gold-100/70 text-sm">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-cream-50 relative">
        <div className="absolute inset-0 bg-mandala-pattern opacity-20" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-maroon-950">
              Success Stories
            </h2>
            <p className="text-maroon-700/80 text-lg max-w-2xl mx-auto">
              Real couples who found their perfect match through VivahBandhan
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonialData.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative bg-cream-50 rounded-2xl p-8 shadow-lg border border-gold-200/50"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-400 via-gold-300 to-gold-400" />
                <div className="text-4xl mb-4">{testimonial.image}</div>
                <p className="text-maroon-700/80 italic mb-4 leading-relaxed">"{testimonial.quote}"</p>
                <div className="border-t border-gold-200/50 pt-4">
                  <p className="font-display font-semibold text-maroon-950">{testimonial.name}</p>
                  <p className="text-sm text-maroon-600">{testimonial.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-cream-100 via-cream-50 to-cream-100">
        {/* Decorative border */}
        <div className="absolute inset-0 border-4 border-gold-300/30 m-4 rounded-2xl pointer-events-none" />
        
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-mandala-pattern opacity-10" />
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
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-maroon-900 to-maroon-950 border-2 border-gold-400 mb-8 shadow-royal"
          >
            <Flame className="w-10 h-10 text-gold-400" />
          </motion.div>
          
          {/* Wedding Mantra */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <p className="text-xl font-display text-gold-600 mb-2">
              ॐ द्यौः शान्तिरन्तरिक्षं शान्तिः पृथिवी शान्तिरापः शान्तिरोषधयः शान्तिः
            </p>
            <p className="text-sm text-maroon-600 italic">
              "May there be peace in heaven, peace in the sky, peace on earth, peace in water, peace in plants"
            </p>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-display font-bold text-maroon-950 mb-4">
            Begin Your Marriage Journey Today
          </h2>
          <p className="text-xl text-maroon-700/80 mb-10 max-w-2xl mx-auto">
            Join millions of happy couples who found their perfect life partner through our trusted platform
          </p>
          
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(212, 175, 55, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="group bg-gradient-to-r from-gold-500 to-gold-400 text-maroon-950 px-10 py-5 rounded-xl font-bold text-xl shadow-gold border-2 border-gold-300"
            >
              <span className="flex items-center gap-3">
                <Crown className="w-6 h-6" />
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
          
          <p className="text-sm text-maroon-600/60 mt-6">
            Free registration • Verified profiles • Trusted by millions of families
          </p>
        </motion.div>
      </section>
    </div>
  );
}

export default HomePage;