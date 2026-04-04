import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Users,
  MessageCircle,
  Eye,
  Star,
  TrendingUp,
  Calendar,
  ChevronRight,
  UserCheck,
  MapPin,
  Briefcase,
  RefreshCw,
  Crown,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

interface DashboardStats {
  profileViews: number;
  interestsReceived: number;
  interestsSent: number;
  newMatches: number;
  unreadMessages: number;
}

interface Match {
  id: string;
  name: string;
  age: number;
  location: string | null;
  primaryPhoto: string | null;
  matchScore: number;
  occupation: string | null;
}

interface Interest {
  id: string;
  name: string;
  age: number;
  primaryPhoto: string | null;
  location: string | null;
  createdAt: string;
}

function DashboardPage() {
  const navigate = useNavigate();
  const { user, accessToken } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    profileViews: 0,
    interestsReceived: 0,
    interestsSent: 0,
    newMatches: 0,
    unreadMessages: 0,
  });
  const [matches, setMatches] = useState<Match[]>([]);
  const [recentInterests, setRecentInterests] = useState<Interest[]>([]);
  const [profileCompletion, setProfileCompletion] = useState(0);

  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      // Fetch profile
      const profileRes = await fetch(`${apiBaseUrl}/profiles/me`, { headers });
      if (profileRes.ok) {
        const data = await profileRes.json();
        if (data.success && data.data.profile) {
          setProfileCompletion(data.data.profile.profileCompletionPercentage || 0);
        }
      }

      // Fetch matches
      const matchesRes = await fetch(`${apiBaseUrl}/profiles/matches`, { headers });
      if (matchesRes.ok) {
        const data = await matchesRes.json();
        if (data.success) {
          setMatches(data.data.matches || []);
          setStats((s) => ({ ...s, newMatches: data.data.matches?.length || 0 }));
        }
      }

      // Fetch interests
      const interestsRes = await fetch(`${apiBaseUrl}/interests`, { headers });
      if (interestsRes.ok) {
        const data = await interestsRes.json();
        if (data.success) {
          const received = data.data.interests?.filter((i: any) => i.receiverId === user?.id) || [];
          const sent = data.data.interests?.filter((i: any) => i.senderId === user?.id) || [];
          setStats((s) => ({
            ...s,
            interestsReceived: received.filter((i: any) => i.status === 'pending').length,
            interestsSent: sent.length,
          }));
          setRecentInterests(received.slice(0, 3));
        }
      }

      // Fetch messages count
      const messagesRes = await fetch(`${apiBaseUrl}/messages/conversations`, { headers });
      if (messagesRes.ok) {
        const data = await messagesRes.json();
        if (data.success) {
          const unread = data.data.conversations?.reduce(
            (acc: number, c: any) => acc + (c.unreadCount || 0),
            0
          ) || 0;
          setStats((s) => ({ ...s, unreadMessages: unread }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      label: 'Complete Profile',
      description: 'Add more details to get better matches',
      icon: UserCheck,
      href: '/profile',
      color: 'blue',
    },
    {
      label: 'Search Matches',
      description: 'Find your perfect partner',
      icon: Heart,
      href: '/search',
      color: 'pink',
    },
    {
      label: 'View Messages',
      description: `${stats.unreadMessages} unread messages`,
      icon: MessageCircle,
      href: '/messages',
      color: 'green',
    },
    {
      label: 'Upgrade Premium',
      description: 'Get unlimited access',
      icon: Crown,
      href: '/subscription',
      color: 'gold',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-maroon-950 mb-2">
            Welcome back, {user?.name || 'Guest'}!
          </h1>
          <p className="text-maroon-700">
            Here's what's happening with your profile today
          </p>
        </div>

        {/* Profile Completion Banner */}
        {profileCompletion < 100 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-gradient-to-r from-gold-100 to-gold-50 border border-gold-200 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold-200 rounded-lg">
                  <Sparkles className="w-5 h-5 text-gold-700" />
                </div>
                <div>
                  <h3 className="font-semibold text-maroon-950">Complete Your Profile</h3>
                  <p className="text-sm text-maroon-600">
                    Profiles with 80%+ completion get 3x more responses
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/profile')}
                className="btn-primary flex items-center gap-2"
              >
                Complete Now
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="w-full bg-gold-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-gold-500 to-gold-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
            <p className="text-sm text-maroon-600 mt-2">{profileCompletion}% complete</p>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Profile Views', value: stats.profileViews, icon: Eye, color: 'blue' },
            { label: 'Interests Received', value: stats.interestsReceived, icon: Heart, color: 'pink' },
            { label: 'New Matches', value: stats.newMatches, icon: Users, color: 'green' },
            { label: 'Unread Messages', value: stats.unreadMessages, icon: MessageCircle, color: 'purple' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                {stat.value > 0 && (
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                    New
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-maroon-950">{stat.value}</p>
              <p className="text-sm text-maroon-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {quickActions.map((action) => (
            <motion.button
              key={action.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate(action.href)}
              className="card p-4 text-left hover:shadow-lg transition-shadow group"
            >
              <div className={`p-2 bg-${action.color}-100 rounded-lg w-fit mb-3`}>
                <action.icon className={`w-5 h-5 text-${action.color}-600`} />
              </div>
              <h3 className="font-semibold text-maroon-950 group-hover:text-gold-600 transition-colors">
                {action.label}
              </h3>
              <p className="text-sm text-maroon-600">{action.description}</p>
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Matches Section */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-maroon-950">Your Matches</h2>
              <button
                onClick={() => navigate('/search')}
                className="text-sm text-maroon-600 hover:text-maroon-950 flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            {matches.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-maroon-400 mx-auto mb-3" />
                <p className="text-maroon-600 mb-2">No matches yet</p>
                <p className="text-sm text-maroon-500 mb-4">
                  Complete your profile to start getting matches
                </p>
                <button onClick={() => navigate('/search')} className="btn-primary">
                  Find Matches
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {matches.slice(0, 3).map((match) => (
                  <div
                    key={match.id}
                    className="flex items-center gap-4 p-3 bg-cream-50 rounded-lg hover:bg-gold-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/profile/${match.id}`)}
                  >
                    {match.primaryPhoto ? (
                      <img
                        src={match.primaryPhoto}
                        alt={match.name}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                        <span className="text-maroon-950 font-bold text-lg">
                          {match.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-maroon-950">{match.name}</h3>
                        <span className="text-sm text-maroon-600">{match.age} yrs</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-maroon-600">
                        {match.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {match.location}
                          </span>
                        )}
                        {match.occupation && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {match.occupation}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                      <Star className="w-3 h-3" />
                      {match.matchScore}%
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Interests */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-maroon-950">Recent Interests</h2>
              <button
                onClick={() => navigate('/messages')}
                className="text-sm text-maroon-600 hover:text-maroon-950 flex items-center gap-1"
              >
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {recentInterests.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-maroon-400 mx-auto mb-3" />
                <p className="text-maroon-600 mb-2">No interests yet</p>
                <p className="text-sm text-maroon-500 mb-4">
                  Start sending interests to profiles you like
                </p>
                <button onClick={() => navigate('/search')} className="btn-primary">
                  Browse Profiles
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentInterests.map((interest) => (
                  <div
                    key={interest.id}
                    className="flex items-center gap-4 p-3 bg-cream-50 rounded-lg"
                  >
                    {interest.primaryPhoto ? (
                      <img
                        src={interest.primaryPhoto}
                        alt={interest.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                        <span className="text-maroon-950 font-bold">
                          {interest.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-medium text-maroon-950">{interest.name}</h3>
                      <p className="text-sm text-maroon-600">
                        {interest.age} yrs {interest.location && `• ${interest.location}`}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate('/messages')}
                      className="btn-primary text-sm py-1.5 px-3"
                    >
                      Respond
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Premium Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-gradient-to-r from-maroon-950 to-maroon-900 rounded-xl p-8 text-center"
        >
          <Crown className="w-12 h-12 text-gold-400 mx-auto mb-4" />
          <h2 className="text-2xl font-display font-bold text-gold-300 mb-2">
            Upgrade to Premium
          </h2>
          <p className="text-gold-100 mb-6 max-w-xl mx-auto">
            Get unlimited matches, see who viewed your profile, and connect with more people
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/subscription')}
              className="bg-gold-400 text-maroon-950 px-8 py-3 rounded-lg font-semibold hover:bg-gold-300 transition-colors"
            >
              View Plans
            </button>
            <p className="text-gold-200 text-sm">Starting at ₹999/month</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default DashboardPage;