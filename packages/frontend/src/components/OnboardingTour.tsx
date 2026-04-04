import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, User, Search, MessageCircle, Heart, Settings, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  action?: {
    label: string;
    href: string;
  };
}

const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to VivahBandhan! 🎉',
    description: 'Your journey to find a life partner begins here. Let us show you around to help you get started.',
    icon: Sparkles,
  },
  {
    id: 'profile',
    title: 'Complete Your Profile',
    description: 'Add your details, photos, family information, and horoscope to increase your chances of finding the perfect match.',
    icon: User,
    action: { label: 'Go to Profile', href: '/profile' },
  },
  {
    id: 'search',
    title: 'Find Your Match',
    description: 'Use our advanced search with filters for caste, religion, location, education, and more. Our AI-powered matching helps you find compatible profiles.',
    icon: Search,
    action: { label: 'Start Searching', href: '/search' },
  },
  {
    id: 'interests',
    title: 'Send & Receive Interests',
    description: 'Found someone interesting? Send them an interest! Accept interests from others to start conversations.',
    icon: Heart,
    action: { label: 'View Messages', href: '/messages' },
  },
  {
    id: 'messages',
    title: 'Connect & Communicate',
    description: 'Once your interest is accepted, start messaging! Build connections and get to know your matches.',
    icon: MessageCircle,
  },
  {
    id: 'premium',
    title: 'Upgrade for More',
    description: 'Get unlimited searches, see who viewed your profile, and connect with more people with our premium plans.',
    icon: Settings,
    action: { label: 'View Plans', href: '/subscription' },
  },
];

const ONBOARDING_KEY = 'vivahbandhan_onboarding_complete';

function OnboardingTour() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem(ONBOARDING_KEY);
    const hasJustLoggedIn = localStorage.getItem('vivahbandhan_just_logged_in');
    
    if (!hasCompletedOnboarding && hasJustLoggedIn) {
      setIsOpen(true);
      localStorage.removeItem('vivahbandhan_just_logged_in');
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setIsOpen(false);
  };

  const handleAction = (href: string) => {
    handleComplete();
    navigate(href);
  };

  if (!isOpen) return null;

  const step = tourSteps[currentStep];
  const Icon = step.icon;
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          {/* Progress Bar */}
          <div className="h-1 bg-gray-100">
            <motion.div
              className="h-full bg-gradient-to-r from-gold-400 to-gold-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Close Button */}
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-8 text-center">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-gold-100 to-gold-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-gold-600" />
              </div>
              <h2 className="text-xl font-semibold text-maroon-950 mb-2">{step.title}</h2>
              <p className="text-maroon-600 text-sm leading-relaxed">{step.description}</p>
            </motion.div>
          </div>

          {/* Actions */}
          <div className="px-8 pb-8 space-y-4">
            {step.action && (
              <button
                onClick={() => handleAction(step.action!.href)}
                className="w-full btn-primary"
              >
                {step.action.label}
              </button>
            )}

            <div className="flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="flex items-center gap-1 text-maroon-600 hover:text-maroon-950 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              {/* Step Indicators */}
              <div className="flex items-center gap-1">
                {tourSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep
                        ? 'bg-gold-500'
                        : index < currentStep
                        ? 'bg-gold-300'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-1 text-maroon-700 hover:text-maroon-950 font-medium transition-colors"
              >
                {currentStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default OnboardingTour;