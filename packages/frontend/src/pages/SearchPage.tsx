import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search as SearchIcon,
  Filter,
  Heart,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Sliders,
  Users,
  Star,
  Shield,
  Eye,
  UserCheck,
  RefreshCw,
  Bookmark,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

// Types
interface Profile {
  id: string;
  userId: string;
  name: string;
  dateOfBirth: string;
  heightCm: number | null;
  religion: string | null;
  caste: string | null;
  education: string | null;
  occupation: string | null;
  incomeRange: string | null;
  locationCity: string | null;
  locationState: string | null;
  maritalStatus: string | null;
  aboutMe: string | null;
  isVerified: boolean;
  verificationLevel: number;
  profileViewsCount: number;
  primaryPhoto: string | null;
  matchScore?: number;
  lastActiveAt: string | null;
}

interface SearchFilters {
  ageMin: number;
  ageMax: number;
  heightMin: number | null;
  heightMax: number | null;
  religions: string[];
  castes: string[];
  educations: string[];
  occupations: string[];
  locations: string[];
  maritalStatus: string[];
  incomeMin: string | null;
  incomeMax: string | null;
  verified: boolean;
  withPhoto: boolean;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Constants
const RELIGIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Parsi', 'Jewish', 'Other'];
const HINDU_CASTES = ['Brahmin', 'Kshatriya', 'Vaishya', 'Shudra', 'Agarwal', 'Baniya', 'Gupta', 'Jain', 'Kayastha', 'Kurmi', 'Rajput', 'Reddy', 'Kamma', 'Kapu', 'Nair', 'Naidu', 'Patel', 'Patil', 'Sharma', 'Singh', 'Yadav', 'Other'];
const EDUCATION_OPTIONS = ['High School', 'Diploma', "Bachelor's", "Master's", 'Doctorate', 'Professional Degree', 'IIT/IIM', 'MBBS/MD', 'CA/CS', 'Other'];
const OCCUPATION_OPTIONS = ['Software Professional', 'Doctor', 'Engineer', 'Teacher', 'Business Owner', 'Government Employee', 'Private Employee', 'Self Employed', 'Manager', 'Executive', 'Civil Services', 'Defence', 'Farmer', 'Other'];
const INDIAN_STATES = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi NCR', 'Other'];
const MARITAL_STATUS = ['Never Married', 'Divorced', 'Widowed', 'Annulled'];
const INCOME_RANGES = ['Below ₹3 Lakhs', '₹3-5 Lakhs', '₹5-10 Lakhs', '₹10-20 Lakhs', '₹20-50 Lakhs', 'Above ₹50 Lakhs'];

const defaultFilters: SearchFilters = {
  ageMin: 21,
  ageMax: 40,
  heightMin: null,
  heightMax: null,
  religions: [],
  castes: [],
  educations: [],
  occupations: [],
  locations: [],
  maritalStatus: [],
  incomeMin: null,
  incomeMax: null,
  verified: false,
  withPhoto: false,
};

function SearchPage() {
  const navigate = useNavigate();
  const { accessToken, user } = useAuthStore();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 12, total: 0, totalPages: 0 });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [sendingInterest, setSendingInterest] = useState<string | null>(null);
  const [shortlisting, setShortlisting] = useState<string | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', pagination.page.toString());
      queryParams.append('limit', pagination.limit.toString());
      
      if (filters.ageMin) queryParams.append('ageMin', filters.ageMin.toString());
      if (filters.ageMax) queryParams.append('ageMax', filters.ageMax.toString());
      if (filters.heightMin) queryParams.append('heightMin', filters.heightMin.toString());
      if (filters.heightMax) queryParams.append('heightMax', filters.heightMax.toString());
      if (filters.religions.length > 0) queryParams.append('religions', filters.religions.join(','));
      if (filters.castes.length > 0) queryParams.append('castes', filters.castes.join(','));
      if (filters.educations.length > 0) queryParams.append('educations', filters.educations.join(','));
      if (filters.occupations.length > 0) queryParams.append('occupations', filters.occupations.join(','));
      if (filters.locations.length > 0) queryParams.append('locations', filters.locations.join(','));
      if (filters.maritalStatus.length > 0) queryParams.append('maritalStatus', filters.maritalStatus.join(','));
      if (filters.incomeMin) queryParams.append('incomeMin', filters.incomeMin);
      if (filters.incomeMax) queryParams.append('incomeMax', filters.incomeMax);
      if (filters.verified) queryParams.append('verified', 'true');
      if (filters.withPhoto) queryParams.append('withPhoto', 'true');

      const response = await fetch(`${apiBaseUrl}/search?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setProfiles(data.data.profiles);
        setPagination(data.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch profiles:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.page, accessToken, apiBaseUrl]);

  useEffect(() => {
    fetchProfiles();
  }, [pagination.page]);

  const handleSendInterest = async (profileId: string) => {
    setSendingInterest(profileId);
    try {
      const response = await fetch(`${apiBaseUrl}/interests/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ receiverId: profileId }),
      });

      const data = await response.json();
      if (data.success) {
        // Update profile in list to show interest sent
        setProfiles(profiles.map(p => 
          p.userId === profileId ? { ...p, interestSent: true } : p
        ));
      }
    } catch (error) {
      console.error('Failed to send interest:', error);
    } finally {
      setSendingInterest(null);
    }
  };

  const handleShortlist = async (profileId: string) => {
    setShortlisting(profileId);
    try {
      const response = await fetch(`${apiBaseUrl}/profiles/shortlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ profileId }),
      });

      const data = await response.json();
      if (data.success) {
        setProfiles(profiles.map(p => 
          p.userId === profileId ? { ...p, isShortlisted: true } : p
        ));
      }
    } catch (error) {
      console.error('Failed to shortlist:', error);
    } finally {
      setShortlisting(null);
    }
  };

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    setPagination(p => ({ ...p, page: 1 }));
  };

  const applyFilters = () => {
    setPagination(p => ({ ...p, page: 1 }));
    fetchProfiles();
    setShowFilters(false);
  };

  const activeFilterCount = () => {
    let count = 0;
    if (filters.ageMin !== 21 || filters.ageMax !== 40) count++;
    if (filters.heightMin || filters.heightMax) count++;
    if (filters.religions.length > 0) count++;
    if (filters.castes.length > 0) count++;
    if (filters.educations.length > 0) count++;
    if (filters.occupations.length > 0) count++;
    if (filters.locations.length > 0) count++;
    if (filters.maritalStatus.length > 0) count++;
    if (filters.incomeMin || filters.incomeMax) count++;
    if (filters.verified) count++;
    if (filters.withPhoto) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-maroon-950 mb-2">Find Your Match</h1>
          <p className="text-maroon-700">Discover profiles that match your preferences</p>
        </div>

        {/* Search Bar */}
        <div className="card p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-maroon-400" />
              <input
                type="text"
                placeholder="Search by name, location, profession..."
                className="input pl-10"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    applyFilters();
                  }
                }}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                showFilters ? 'bg-maroon-950 text-gold-300' : 'border-gold-200 text-maroon-700 hover:bg-gold-50'
              }`}
            >
              <Sliders className="w-5 h-5" />
              Filters
              {activeFilterCount() > 0 && (
                <span className="bg-gold-500 text-maroon-950 text-xs px-2 py-0.5 rounded-full">
                  {activeFilterCount()}
                </span>
              )}
            </button>
            <button onClick={applyFilters} className="btn-primary">
              Search
            </button>
          </div>

          {/* Active Filters */}
          {activeFilterCount() > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gold-200">
              <span className="text-sm text-maroon-600">Active filters:</span>
              {filters.religions.map((r) => (
                <span key={r} className="badge badge-primary flex items-center gap-1">
                  {r}
                  <button
                    onClick={() => setFilters({ ...filters, religions: filters.religions.filter((x) => x !== r) })}
                    className="hover:text-gold-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {filters.locations.map((l) => (
                <span key={l} className="badge badge-secondary flex items-center gap-1">
                  {l}
                  <button
                    onClick={() => setFilters({ ...filters, locations: filters.locations.filter((x) => x !== l) })}
                    className="hover:text-gold-300"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button onClick={clearFilters} className="text-sm text-maroon-600 hover:text-maroon-950">
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="card p-6 mb-6 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-maroon-950">Advanced Filters</h3>
                <button onClick={() => setShowFilters(false)} className="text-maroon-600 hover:text-maroon-950">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Age Range */}
                <div>
                  <label className="label">Age Range</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={filters.ageMin}
                      onChange={(e) => setFilters({ ...filters, ageMin: parseInt(e.target.value) || 18 })}
                      className="input w-20"
                      min={18}
                      max={60}
                    />
                    <span className="text-maroon-500">to</span>
                    <input
                      type="number"
                      value={filters.ageMax}
                      onChange={(e) => setFilters({ ...filters, ageMax: parseInt(e.target.value) || 60 })}
                      className="input w-20"
                      min={18}
                      max={60}
                    />
                  </div>
                </div>

                {/* Height Range */}
                <div>
                  <label className="label">Height Range (cm)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={filters.heightMin || ''}
                      onChange={(e) => setFilters({ ...filters, heightMin: parseInt(e.target.value) || null })}
                      className="input w-20"
                      placeholder="Min"
                    />
                    <span className="text-maroon-500">to</span>
                    <input
                      type="number"
                      value={filters.heightMax || ''}
                      onChange={(e) => setFilters({ ...filters, heightMax: parseInt(e.target.value) || null })}
                      className="input w-20"
                      placeholder="Max"
                    />
                  </div>
                </div>

                {/* Religion */}
                <div>
                  <label className="label">Religion</label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {RELIGIONS.map((religion) => (
                      <label key={religion} className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.religions.includes(religion)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({ ...filters, religions: [...filters.religions, religion] });
                            } else {
                              setFilters({ ...filters, religions: filters.religions.filter((r) => r !== religion) });
                            }
                          }}
                          className="rounded border-gold-300 text-maroon-950 focus:ring-gold-500"
                        />
                        <span className="text-sm text-maroon-700">{religion}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Caste */}
                <div>
                  <label className="label">Caste</label>
                  <select
                    multiple
                    value={filters.castes}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                      setFilters({ ...filters, castes: selected });
                    }}
                    className="input h-32"
                  >
                    {HINDU_CASTES.map((caste) => (
                      <option key={caste} value={caste}>{caste}</option>
                    ))}
                  </select>
                </div>

                {/* Education */}
                <div>
                  <label className="label">Education</label>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {EDUCATION_OPTIONS.map((edu) => (
                      <label key={edu} className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.educations.includes(edu)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({ ...filters, educations: [...filters.educations, edu] });
                            } else {
                              setFilters({ ...filters, educations: filters.educations.filter((x) => x !== edu) });
                            }
                          }}
                          className="rounded border-gold-300 text-maroon-950 focus:ring-gold-500"
                        />
                        <span className="text-sm text-maroon-700">{edu}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="label">Location</label>
                  <select
                    multiple
                    value={filters.locations}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                      setFilters({ ...filters, locations: selected });
                    }}
                    className="input h-32"
                  >
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                {/* Marital Status */}
                <div>
                  <label className="label">Marital Status</label>
                  <div className="flex flex-wrap gap-2">
                    {MARITAL_STATUS.map((status) => (
                      <label key={status} className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.maritalStatus.includes(status)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({ ...filters, maritalStatus: [...filters.maritalStatus, status] });
                            } else {
                              setFilters({ ...filters, maritalStatus: filters.maritalStatus.filter((x) => x !== status) });
                            }
                          }}
                          className="rounded border-gold-300 text-maroon-950 focus:ring-gold-500"
                        />
                        <span className="text-sm text-maroon-700">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Quick Filters */}
                <div>
                  <label className="label">Quick Filters</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.verified}
                        onChange={(e) => setFilters({ ...filters, verified: e.target.checked })}
                        className="rounded border-gold-300 text-maroon-950 focus:ring-gold-500"
                      />
                      <span className="text-sm text-maroon-700">Verified profiles only</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.withPhoto}
                        onChange={(e) => setFilters({ ...filters, withPhoto: e.target.checked })}
                        className="rounded border-gold-300 text-maroon-950 focus:ring-gold-500"
                      />
                      <span className="text-sm text-maroon-700">With photo only</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gold-200">
                <button onClick={clearFilters} className="btn-outline">
                  Reset
                </button>
                <button onClick={applyFilters} className="btn-primary">
                  Apply Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-maroon-600">
            {pagination.total} {pagination.total === 1 ? 'profile' : 'profiles'} found
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-8 h-8 text-gold-500 animate-spin" />
          </div>
        ) : profiles.length === 0 ? (
          <div className="card p-12 text-center">
            <Users className="w-12 h-12 text-maroon-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-maroon-950 mb-2">No profiles found</h3>
            <p className="text-maroon-600 mb-4">Try adjusting your search criteria</p>
            <button onClick={clearFilters} className="btn-primary">
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map((profile) => (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Photo */}
                  <div className="relative h-64 bg-gradient-to-br from-gold-100 to-gold-200">
                    {profile.primaryPhoto ? (
                      <img
                        src={profile.primaryPhoto}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UserCheck className="w-16 h-16 text-gold-400" />
                      </div>
                    )}
                    {/* Match Score */}
                    {profile.matchScore && (
                      <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {profile.matchScore}% Match
                      </div>
                    )}
                    {/* Verified Badge */}
                    {profile.isVerified && (
                      <div className="absolute top-3 left-3 bg-white/90 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Verified
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-maroon-950 mb-1">{profile.name}</h3>
                    <p className="text-maroon-600 text-sm mb-2">
                      {calculateAge(profile.dateOfBirth)} yrs • {profile.heightCm ? `${profile.heightCm} cm` : 'Height N/A'}
                    </p>
                    
                    <div className="space-y-1 text-sm text-maroon-700 mb-4">
                      {profile.occupation && (
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-maroon-400" />
                          {profile.occupation}
                        </div>
                      )}
                      {profile.education && (
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4 text-maroon-400" />
                          {profile.education}
                        </div>
                      )}
                      {profile.locationCity && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-maroon-400" />
                          {profile.locationCity}{profile.locationState && `, ${profile.locationState}`}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/profile/${profile.userId}`)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 border border-gold-200 rounded-lg text-maroon-700 hover:bg-gold-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleShortlist(profile.userId)}
                        disabled={shortlisting === profile.userId}
                        className="p-2 border border-gold-200 rounded-lg text-maroon-700 hover:bg-gold-50 transition-colors disabled:opacity-50"
                        title="Shortlist"
                      >
                        {shortlisting === profile.userId ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleSendInterest(profile.userId)}
                        disabled={sendingInterest === profile.userId}
                        className="flex-1 btn-primary flex items-center justify-center gap-1 py-2"
                      >
                        {sendingInterest === profile.userId ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Heart className="w-4 h-4" />
                            Interest
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
                  disabled={pagination.page === 1}
                  className="p-2 rounded-lg hover:bg-gold-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(pagination.totalPages - 4, pagination.page - 2)) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPagination((p) => ({ ...p, page: pageNum }))}
                      className={`px-4 py-2 rounded-lg ${
                        pagination.page === pageNum
                          ? 'bg-maroon-950 text-gold-300'
                          : 'hover:bg-gold-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
                  disabled={pagination.page === pagination.totalPages}
                  className="p-2 rounded-lg hover:bg-gold-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default SearchPage;