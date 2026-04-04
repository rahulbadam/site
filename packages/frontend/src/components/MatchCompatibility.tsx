import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Moon, Sun, Users, MapPin, Heart, ChevronDown, ChevronUp, Info, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

interface MatchBreakdown {
  preferences: number;
  horoscope: number;
  profile: number;
  behavior: number;
  location: number;
}

interface HoroscopeDetails {
  totalGuns: number;
  varna: number;
  vashya: number;
  tara: number;
  yoni: number;
  grahaMaitri: number;
  gana: number;
  bhakoot: number;
  nadi: number;
}

interface MatchResult {
  overallScore: number;
  breakdown: MatchBreakdown;
  horoscopeDetails?: HoroscopeDetails;
  isCompatible: boolean;
  recommendations: string[];
}

interface MatchCompatibilityProps {
  profileId: string;
  showDetails?: boolean;
  compact?: boolean;
}

const GUN_NAMES: Record<string, { name: string; max: number; description: string }> = {
  varna: { name: 'Varna (Spiritual)', max: 1, description: 'Spiritual compatibility and ego matching' },
  vashya: { name: 'Vashya (Attraction)', max: 2, description: 'Mutual attraction and control' },
  tara: { name: 'Tara (Health)', max: 3, description: 'Health and well-being compatibility' },
  yoni: { name: 'Yoni (Intimacy)', max: 4, description: 'Physical and sexual compatibility' },
  grahaMaitri: { name: 'Graha Maitri (Mental)', max: 5, description: 'Mental and intellectual compatibility' },
  gana: { name: 'Gana (Temperament)', max: 6, description: 'Temperament and nature matching' },
  bhakoot: { name: 'Bhakoot (Influence)', max: 7, description: 'Relative influence and prosperity' },
  nadi: { name: 'Nadi (Genes)', max: 8, description: 'Health and genetic compatibility' },
};

function MatchCompatibility({ profileId, showDetails = false, compact = false }: MatchCompatibilityProps) {
  const { accessToken } = useAuthStore();
  const [matchData, setMatchData] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(showDetails);

  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

  useEffect(() => {
    fetchMatchScore();
  }, [profileId]);

  const fetchMatchScore = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/matching/score/${profileId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setMatchData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch match score:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-green-500 to-green-600';
    if (score >= 60) return 'from-blue-500 to-blue-600';
    if (score >= 40) return 'from-amber-500 to-amber-600';
    return 'from-red-500 to-red-600';
  };

  const getGunStatus = (score: number, max: number) => {
    const percentage = (score / max) * 100;
    if (percentage >= 75) return { color: 'bg-green-500', text: 'Excellent' };
    if (percentage >= 50) return { color: 'bg-blue-500', text: 'Good' };
    if (percentage >= 25) return { color: 'bg-amber-500', text: 'Average' };
    return { color: 'bg-red-500', text: 'Low' };
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
        <span className="text-sm text-gray-400">Calculating...</span>
      </div>
    );
  }

  if (!matchData) {
    return null;
  }

  // Compact view (just the score badge)
  if (compact) {
    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${getScoreColor(matchData.overallScore)}`}>
        <Star className="w-3 h-3" />
        {matchData.overallScore}%
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      {/* Main Score */}
      <div className="p-4 bg-gradient-to-br from-maroon-950 to-maroon-900 text-gold-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${getScoreGradient(matchData.overallScore)} flex items-center justify-center`}>
              <span className="text-xl font-bold text-white">{matchData.overallScore}%</span>
            </div>
            <div>
              <h3 className="font-semibold text-gold-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Match Score
              </h3>
              <p className="text-sm text-gold-400">
                {matchData.isCompatible ? 'Compatible match!' : 'May need consideration'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Score Breakdown */}
              <div>
                <h4 className="text-sm font-medium text-maroon-700 mb-3">Score Breakdown</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(matchData.breakdown).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-2 bg-cream-50 rounded-lg">
                      <span className="text-sm text-maroon-600 capitalize">{key}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${getScoreGradient(value)}`}
                            style={{ width: `${value}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-maroon-950 w-8">{value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 36-Gun Horoscope Details */}
              {matchData.horoscopeDetails && (
                <div>
                  <h4 className="text-sm font-medium text-maroon-700 mb-3 flex items-center gap-2">
                    <Moon className="w-4 h-4" />
                    36-Gun Horoscope Matching
                  </h4>
                  <div className="p-3 bg-cream-50 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-maroon-600">Total Guns</span>
                      <span className={`text-lg font-bold ${matchData.horoscopeDetails.totalGuns >= 18 ? 'text-green-600' : 'text-amber-600'}`}>
                        {matchData.horoscopeDetails.totalGuns} / 36
                      </span>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(matchData.horoscopeDetails)
                        .filter(([key]) => key !== 'totalGuns')
                        .map(([key, value]) => {
                          const gunInfo = GUN_NAMES[key];
                          if (!gunInfo) return null;
                          const status = getGunStatus(value as number, gunInfo.max);
                          return (
                            <div key={key} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-maroon-600">{gunInfo.name}</span>
                                <span className="text-xs text-maroon-400">({value}/{gunInfo.max})</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${status.color}`}
                                    style={{ width: `${((value as number) / gunInfo.max) * 100}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gold-200">
                      <p className="text-xs text-maroon-500">
                        <Info className="w-3 h-3 inline mr-1" />
                        18+ guns is considered acceptable. 27+ guns is excellent.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {matchData.recommendations.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-maroon-700 mb-2">Insights</h4>
                  <ul className="space-y-1">
                    {matchData.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-maroon-600">
                        <span className="text-gold-500 mt-1">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MatchCompatibility;