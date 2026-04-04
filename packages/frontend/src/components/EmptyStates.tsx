import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Heart,
  Search,
  FileText,
  Bell,
  Shield,
  Camera,
  UserPlus,
  Inbox,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
  illustration?: 'profiles' | 'messages' | 'search' | 'notifications' | 'default';
}

export function EmptyState({
  icon: Icon = FileText,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12 px-4"
    >
      <div className="w-20 h-20 bg-gradient-to-br from-gold-100 to-gold-200 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-10 h-10 text-gold-600" />
      </div>
      <h3 className="text-lg font-semibold text-maroon-950 mb-2">{title}</h3>
      <p className="text-maroon-600 mb-6 max-w-md mx-auto">{description}</p>
      {action && (
        <Link
          to={action.href}
          onClick={action.onClick}
          className="btn-primary inline-flex items-center gap-2"
        >
          {action.label}
          <Sparkles className="w-4 h-4" />
        </Link>
      )}
    </motion.div>
  );
}

export function NoProfilesFound() {
  return (
    <EmptyState
      icon={Search}
      title="No Profiles Found"
      description="We couldn't find any profiles matching your criteria. Try adjusting your filters or browse all profiles."
      action={{ label: 'Clear Filters', href: '/search' }}
    />
  );
}

export function NoMatches() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="relative w-32 h-32 mx-auto mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-red-100 rounded-full animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Heart className="w-16 h-16 text-pink-500" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-maroon-950 mb-2">No Matches Yet</h3>
      <p className="text-maroon-600 mb-6 max-w-sm mx-auto">
        Complete your profile to start getting AI-powered matches based on your preferences and horoscope compatibility.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/profile" className="btn-primary inline-flex items-center gap-2">
          Complete Profile
        </Link>
        <Link to="/search" className="btn-outline inline-flex items-center gap-2">
          Browse Profiles
        </Link>
      </div>
    </motion.div>
  );
}

export function NoMessages() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <div className="relative w-32 h-32 mx-auto mb-6">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-16 bg-gray-100 rounded-2xl" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Inbox className="w-10 h-10 text-maroon-400" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-maroon-950 mb-2">No Messages Yet</h3>
      <p className="text-maroon-600 mb-6 max-w-sm mx-auto">
        When you connect with someone, your conversations will appear here. Start by sending interests to profiles you like!
      </p>
      <Link to="/search" className="btn-primary inline-flex items-center gap-2">
        Find Matches
      </Link>
    </motion.div>
  );
}

export function NoInterests() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="relative w-24 h-24 mx-auto mb-4">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-br from-red-100 to-pink-100 rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Heart className="w-12 h-12 text-red-400" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-maroon-950 mb-2">No Interests Yet</h3>
      <p className="text-maroon-600 mb-4">
        Start sending interests to profiles you like. When someone accepts, you can start messaging!
      </p>
      <Link to="/search" className="text-maroon-700 hover:text-maroon-950 font-medium inline-flex items-center gap-1">
        Browse Profiles <TrendingUp className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}

export function ProfileIncomplete() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gold-50 to-gold-100 rounded-xl p-6 border border-gold-200"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-white rounded-lg shadow-sm">
          <UserPlus className="w-6 h-6 text-gold-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-maroon-950 mb-1">Complete Your Profile</h3>
          <p className="text-sm text-maroon-600 mb-3">
            Complete profiles get 3x more responses! Add your photo, details, and preferences to find better matches.
          </p>
          <Link to="/profile" className="text-sm font-medium text-gold-700 hover:text-gold-800">
            Complete Now →
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export function NoPhotos() {
  return (
    <EmptyState
      icon={Camera}
      title="No Photos Uploaded"
      description="Add photos to your profile to increase visibility and get more responses. You can upload up to 10 photos."
      action={{ label: 'Upload Photos', href: '/profile' }}
    />
  );
}

export function NoNotifications() {
  return (
    <EmptyState
      icon={Bell}
      title="All Caught Up!"
      description="You have no new notifications. We'll notify you when someone views your profile or sends you an interest."
    />
  );
}

export function VerificationPending() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-white rounded-lg shadow-sm">
          <Shield className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-maroon-950 mb-1">Verify Your Profile</h3>
          <p className="text-sm text-maroon-600 mb-3">
            Get a verified badge by completing ID verification. Verified profiles get more trust and visibility.
          </p>
          <button className="text-sm font-medium text-blue-700 hover:text-blue-800">
            Start Verification →
          </button>
        </div>
      </div>
    </motion.div>
  );
}