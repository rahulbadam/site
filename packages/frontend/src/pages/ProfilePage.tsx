import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Heart,
  Camera,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  Shield,
  Star,
  Users,
  Sun,
  Moon,
  Clock,
  Home,
  ChevronRight,
  Eye,
  EyeOff,
  Lock,
  Check,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

// Types
interface Photo {
  id: string;
  cdnUrl: string;
  isPrimary: boolean;
  isVerified: boolean;
  photoOrder: number;
}

interface Profile {
  id: string;
  name: string;
  gender: string;
  dateOfBirth: string;
  heightCm: number | null;
  religion: string | null;
  caste: string | null;
  subCaste: string | null;
  gotra: string | null;
  nakshatra: string | null;
  rashi: string | null;
  manglik: boolean | null;
  education: string | null;
  occupation: string | null;
  incomeRange: string | null;
  locationCity: string | null;
  locationState: string | null;
  locationCountry: string;
  maritalStatus: string | null;
  diet: string | null;
  smoking: string | null;
  drinking: string | null;
  languages: string[];
  aboutMe: string | null;
  profileCompletionPercentage: number;
  isVerified: boolean;
  verificationLevel: number;
  profileViewsCount: number;
  photos: Photo[];
  // Family details
  fatherName: string | null;
  fatherOccupation: string | null;
  motherName: string | null;
  motherOccupation: string | null;
  siblingsCount: number | null;
  siblingsDetails: string | null;
  familyType: string | null;
  familyValues: string | null;
  familyStatus: string | null;
  // Horoscope
  birthTime: string | null;
  birthPlace: string | null;
  horoscopeEnabled: boolean;
}

interface Preferences {
  preferredAgeMin: number;
  preferredAgeMax: number;
  preferredHeightMin: number | null;
  preferredHeightMax: number | null;
  preferredReligions: string[];
  preferredCastes: string[];
  preferredEducations: string[];
  preferredOccupations: string[];
  preferredLocations: string[];
  preferredMaritalStatus: string[];
  preferredIncomeMin: number | null;
  preferredIncomeMax: number | null;
}

type TabType = 'profile' | 'photos' | 'family' | 'horoscope' | 'preferences' | 'privacy';

// Constants for Indian matrimonial options
const RELIGIONS = [
  'Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Parsi', 'Jewish', 'Other'
];

const HINDU_CASTES = [
  'Brahmin', 'Kshatriya', 'Vaishya', 'Shudra', 'Agarwal', 'Baniya', 'Gupta', 'Jain', 'Kayastha',
  'Kurmi', 'Rajput', 'Reddy', 'Kamma', 'Kapu', 'Nair', 'Naidu', 'Patel', 'Patil', 'Sharma',
  'Singh', 'Yadav', 'Other'
];

const EDUCATION_OPTIONS = [
  'High School', 'Diploma', 'Bachelor\'s', 'Master\'s', 'Doctorate', 'Professional Degree',
  'IIT/IIM', 'MBBS/MD', 'CA/CS', 'Other'
];

const OCCUPATION_OPTIONS = [
  'Software Professional', 'Doctor', 'Engineer', 'Teacher', 'Business Owner', 'Government Employee',
  'Private Employee', 'Self Employed', 'Manager', 'Executive', 'Civil Services', 'Defence',
  'Farmer', 'Other'
];

const INCOME_RANGES = [
  'Below ₹3 Lakhs', '₹3-5 Lakhs', '₹5-10 Lakhs', '₹10-20 Lakhs', '₹20-50 Lakhs', 'Above ₹50 Lakhs'
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi NCR', 'Other'
];

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya',
  'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati',
  'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana',
  'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

const RASHIS = [
  'Mesh (Aries)', 'Vrishabh (Taurus)', 'Mithun (Gemini)', 'Kark (Cancer)', 'Simha (Leo)',
  'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchik (Scorpio)', 'Dhanu (Sagittarius)', 'Makar (Capricorn)',
  'Kumbh (Aquarius)', 'Meen (Pisces)'
];

const MARITAL_STATUS = ['Never Married', 'Divorced', 'Widowed', 'Annulled'];
const DIET_OPTIONS = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan', 'Jain Vegetarian'];
const SMOKING_OPTIONS = ['No', 'Occasionally', 'Yes'];
const DRINKING_OPTIONS = ['No', 'Occasionally', 'Socially', 'Yes'];
const FAMILY_TYPE = ['Joint', 'Nuclear', 'Others'];
const FAMILY_VALUES = ['Traditional', 'Moderate', 'Liberal'];
const FAMILY_STATUS = ['Middle Class', 'Upper Middle Class', 'High Class', 'Affluent'];

const LANGUAGES = [
  'Hindi', 'English', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Urdu', 'Gujarati', 'Kannada',
  'Odia', 'Punjabi', 'Malayalam', 'Assamese', 'Maithili', 'Sanskrit', 'Other'
];

function ProfilePage() {
  const navigate = useNavigate();
  const { user, accessToken, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [preferences, setPreferences] = useState<Preferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const [profileRes, preferencesRes] = await Promise.all([
        fetch(`${apiBaseUrl}/profiles/me`, { headers }),
        fetch(`${apiBaseUrl}/profiles/preferences`, { headers }),
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData.success) {
          setProfile(profileData.data.profile);
        }
      }

      if (preferencesRes.ok) {
        const prefData = await preferencesRes.json();
        if (prefData.success) {
          setPreferences(prefData.data.preferences);
        }
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (updatedData: Partial<Profile>) => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${apiBaseUrl}/profiles/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();
      if (data.success) {
        setProfile(data.data.profile);
        setSuccess('Profile updated successfully!');
        setEditing(false);
        if (data.data.profile.name) {
          updateUser({ name: data.data.profile.name });
        }
      } else {
        setError(data.error?.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePreferences = async (updatedPrefs: Partial<Preferences>) => {
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/profiles/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedPrefs),
      });

      const data = await response.json();
      if (data.success) {
        setPreferences(data.data.preferences);
        setSuccess('Preferences updated successfully!');
      } else {
        setError(data.error?.message || 'Failed to update preferences');
      }
    } catch (err) {
      setError('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append('photo', files[0]);

    try {
      const response = await fetch(`${apiBaseUrl}/profiles/photos`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                photos: [...prev.photos, data.data.photo],
              }
            : prev
        );
        setSuccess('Photo uploaded successfully!');
      }
    } catch (err) {
      setError('Failed to upload photo');
    }
  };

  const handleSetPrimaryPhoto = async (photoId: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/profiles/photos/${photoId}/primary`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (data.success && profile) {
        setProfile({
          ...profile,
          photos: profile.photos.map((p) => ({
            ...p,
            isPrimary: p.id === photoId,
          })),
        });
        setSuccess('Primary photo updated!');
      }
    } catch (err) {
      setError('Failed to set primary photo');
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      const response = await fetch(`${apiBaseUrl}/profiles/photos/${photoId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (data.success && profile) {
        setProfile({
          ...profile,
          photos: profile.photos.filter((p) => p.id !== photoId),
        });
        setSuccess('Photo deleted!');
      }
    } catch (err) {
      setError('Failed to delete photo');
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

  const tabs = [
    { id: 'profile' as const, label: 'Basic Profile', icon: User },
    { id: 'photos' as const, label: 'Photos', icon: Camera },
    { id: 'family' as const, label: 'Family Details', icon: Users },
    { id: 'horoscope' as const, label: 'Horoscope', icon: Star },
    { id: 'preferences' as const, label: 'Partner Preferences', icon: Heart },
    { id: 'privacy' as const, label: 'Privacy Settings', icon: Lock },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-maroon-950"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-maroon-950 mb-2">My Profile</h1>
          <p className="text-maroon-700">Manage your profile and preferences</p>
        </div>

        {/* Profile Completion Banner */}
        {profile && profile.profileCompletionPercentage < 100 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gradient-to-r from-gold-100 to-gold-50 border border-gold-200 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-maroon-800 font-medium">Profile Completion</span>
              <span className="text-maroon-950 font-bold">{profile.profileCompletionPercentage}%</span>
            </div>
            <div className="w-full bg-gold-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-gold-500 to-gold-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${profile.profileCompletionPercentage}%` }}
              />
            </div>
            <p className="text-sm text-maroon-600 mt-2">
              Complete your profile to get better matches and more visibility
            </p>
          </motion.div>
        )}

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Profile Card */}
            <div className="card p-6 mb-6">
              <div className="text-center">
                <div className="relative inline-block">
                  {profile?.photos?.find((p) => p.isPrimary)?.cdnUrl ? (
                    <img
                      src={profile.photos.find((p) => p.isPrimary)?.cdnUrl}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-gold-300"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center border-4 border-gold-300">
                      <span className="text-3xl font-bold text-maroon-950">
                        {profile?.name?.charAt(0) || user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  {profile?.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-maroon-950 mt-3">{profile?.name || user?.name}</h2>
                <p className="text-maroon-600 text-sm">
                  {profile?.dateOfBirth && `${calculateAge(profile.dateOfBirth)} yrs`}
                  {profile?.locationCity && ` • ${profile.locationCity}`}
                </p>
                {profile?.isVerified && (
                  <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full mt-2">
                    <Shield className="w-3 h-3" /> Verified Profile
                  </span>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-gold-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-maroon-600">Profile Views</span>
                  <span className="font-medium text-maroon-950">{profile?.profileViewsCount || 0}</span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="card overflow-hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-maroon-950 text-gold-300'
                      : 'text-maroon-700 hover:bg-gold-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {/* Basic Profile Tab */}
              {activeTab === 'profile' && profile && (
                <ProfileBasicTab
                  profile={profile}
                  editing={editing}
                  setEditing={setEditing}
                  saving={saving}
                  onSave={handleSaveProfile}
                />
              )}

              {/* Photos Tab */}
              {activeTab === 'photos' && profile && (
                <motion.div
                  key="photos"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="card p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-maroon-950">My Photos</h2>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Photo
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {profile.photos.length === 0 ? (
                      <div className="col-span-full text-center py-12">
                        <Camera className="w-12 h-12 text-maroon-400 mx-auto mb-3" />
                        <p className="text-maroon-600">No photos uploaded yet</p>
                        <p className="text-sm text-maroon-500 mt-1">Upload photos to increase your profile visibility</p>
                      </div>
                    ) : (
                      profile.photos.map((photo) => (
                        <div key={photo.id} className="relative group">
                          <img
                            src={photo.cdnUrl}
                            alt="Profile"
                            className="w-full aspect-square object-cover rounded-lg"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleSetPrimaryPhoto(photo.id)}
                              className={`p-2 rounded-full ${
                                photo.isPrimary ? 'bg-gold-500' : 'bg-white/90'
                              }`}
                              title="Set as primary"
                            >
                              <Star className={`w-5 h-5 ${photo.isPrimary ? 'text-white' : 'text-maroon-950'}`} />
                            </button>
                            <button
                              onClick={() => handleDeletePhoto(photo.id)}
                              className="p-2 bg-red-500 rounded-full"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5 text-white" />
                            </button>
                          </div>
                          {photo.isPrimary && (
                            <span className="absolute top-2 left-2 bg-gold-500 text-maroon-950 text-xs px-2 py-1 rounded-full font-medium">
                              Primary
                            </span>
                          )}
                          {photo.isVerified && (
                            <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                              Verified
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  <div className="mt-6 p-4 bg-gold-50 rounded-lg">
                    <h3 className="font-medium text-maroon-950 mb-2">Photo Guidelines</h3>
                    <ul className="text-sm text-maroon-700 space-y-1">
                      <li>• Upload up to 10 photos</li>
                      <li>• First photo will be your primary profile picture</li>
                      <li>• Ensure your face is clearly visible</li>
                      <li>• Photos are verified within 24 hours</li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* Family Tab */}
              {activeTab === 'family' && profile && (
                <FamilyTab
                  profile={profile}
                  saving={saving}
                  onSave={handleSaveProfile}
                />
              )}

              {/* Horoscope Tab */}
              {activeTab === 'horoscope' && profile && (
                <HoroscopeTab
                  profile={profile}
                  saving={saving}
                  onSave={handleSaveProfile}
                />
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && preferences && (
                <PreferencesTab
                  preferences={preferences}
                  saving={saving}
                  onSave={handleSavePreferences}
                />
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && <PrivacyTab />}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-components for each tab
function ProfileBasicTab({
  profile,
  editing,
  setEditing,
  saving,
  onSave,
}: {
  profile: Profile;
  editing: boolean;
  setEditing: (v: boolean) => void;
  saving: boolean;
  onSave: (data: Partial<Profile>) => void;
}) {
  const [formData, setFormData] = useState(profile);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card p-6"
    >
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-maroon-950">Basic Information</h2>
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 text-maroon-700 hover:text-maroon-950"
          >
            {editing ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="label">Full Name</label>
            {editing ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
              />
            ) : (
              <p className="text-maroon-950 font-medium">{profile.name}</p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="label">Gender</label>
            <p className="text-maroon-950 font-medium capitalize">{profile.gender}</p>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="label">Date of Birth</label>
            {editing ? (
              <input
                type="date"
                value={formData.dateOfBirth?.split('T')[0] || ''}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="input"
              />
            ) : (
              <p className="text-maroon-950 font-medium">
                {new Date(profile.dateOfBirth).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>

          {/* Height */}
          <div>
            <label className="label">Height (cm)</label>
            {editing ? (
              <input
                type="number"
                value={formData.heightCm || ''}
                onChange={(e) => setFormData({ ...formData, heightCm: parseInt(e.target.value) || null })}
                className="input"
                placeholder="e.g., 165"
              />
            ) : (
              <p className="text-maroon-950 font-medium">
                {profile.heightCm ? `${profile.heightCm} cm (${Math.floor(profile.heightCm / 30.48)}'${Math.round((profile.heightCm % 30.48) / 2.54)}")` : 'Not specified'}
              </p>
            )}
          </div>

          {/* Religion */}
          <div>
            <label className="label">Religion</label>
            {editing ? (
              <select
                value={formData.religion || ''}
                onChange={(e) => setFormData({ ...formData, religion: e.target.value || null })}
                className="input"
              >
                <option value="">Select Religion</option>
                {RELIGIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            ) : (
              <p className="text-maroon-950 font-medium">{profile.religion || 'Not specified'}</p>
            )}
          </div>

          {/* Caste */}
          <div>
            <label className="label">Caste</label>
            {editing ? (
              <select
                value={formData.caste || ''}
                onChange={(e) => setFormData({ ...formData, caste: e.target.value || null })}
                className="input"
              >
                <option value="">Select Caste</option>
                {HINDU_CASTES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            ) : (
              <p className="text-maroon-950 font-medium">{profile.caste || 'Not specified'}</p>
            )}
          </div>

          {/* Sub-caste */}
          <div>
            <label className="label">Sub-caste</label>
            {editing ? (
              <input
                type="text"
                value={formData.subCaste || ''}
                onChange={(e) => setFormData({ ...formData, subCaste: e.target.value || null })}
                className="input"
                placeholder="Enter sub-caste"
              />
            ) : (
              <p className="text-maroon-950 font-medium">{profile.subCaste || 'Not specified'}</p>
            )}
          </div>

          {/* Marital Status */}
          <div>
            <label className="label">Marital Status</label>
            {editing ? (
              <select
                value={formData.maritalStatus || ''}
                onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value || null })}
                className="input"
              >
                <option value="">Select Status</option>
                {MARITAL_STATUS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            ) : (
              <p className="text-maroon-950 font-medium">{profile.maritalStatus || 'Not specified'}</p>
            )}
          </div>

          {/* Education */}
          <div>
            <label className="label">Education</label>
            {editing ? (
              <select
                value={formData.education || ''}
                onChange={(e) => setFormData({ ...formData, education: e.target.value || null })}
                className="input"
              >
                <option value="">Select Education</option>
                {EDUCATION_OPTIONS.map((e) => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            ) : (
              <p className="text-maroon-950 font-medium">{profile.education || 'Not specified'}</p>
            )}
          </div>

          {/* Occupation */}
          <div>
            <label className="label">Occupation</label>
            {editing ? (
              <select
                value={formData.occupation || ''}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value || null })}
                className="input"
              >
                <option value="">Select Occupation</option>
                {OCCUPATION_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ) : (
              <p className="text-maroon-950 font-medium">{profile.occupation || 'Not specified'}</p>
            )}
          </div>

          {/* Income */}
          <div>
            <label className="label">Annual Income</label>
            {editing ? (
              <select
                value={formData.incomeRange || ''}
                onChange={(e) => setFormData({ ...formData, incomeRange: e.target.value || null })}
                className="input"
              >
                <option value="">Select Income Range</option>
                {INCOME_RANGES.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            ) : (
              <p className="text-maroon-950 font-medium">{profile.incomeRange || 'Not specified'}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="label">City</label>
            {editing ? (
              <input
                type="text"
                value={formData.locationCity || ''}
                onChange={(e) => setFormData({ ...formData, locationCity: e.target.value || null })}
                className="input"
                placeholder="Enter city"
              />
            ) : (
              <p className="text-maroon-950 font-medium">{profile.locationCity || 'Not specified'}</p>
            )}
          </div>

          {/* State */}
          <div>
            <label className="label">State</label>
            {editing ? (
              <select
                value={formData.locationState || ''}
                onChange={(e) => setFormData({ ...formData, locationState: e.target.value || null })}
                className="input"
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            ) : (
              <p className="text-maroon-950 font-medium">{profile.locationState || 'Not specified'}</p>
            )}
          </div>

          {/* Diet */}
          <div>
            <label className="label">Diet</label>
            {editing ? (
              <select
                value={formData.diet || ''}
                onChange={(e) => setFormData({ ...formData, diet: e.target.value || null })}
                className="input"
              >
                <option value="">Select Diet</option>
                {DIET_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            ) : (
              <p className="text-maroon-950 font-medium">{profile.diet || 'Not specified'}</p>
            )}
          </div>

          {/* Smoking */}
          <div>
            <label className="label">Smoking</label>
            {editing ? (
              <select
                value={formData.smoking || ''}
                onChange={(e) => setFormData({ ...formData, smoking: e.target.value || null })}
                className="input"
              >
                <option value="">Select</option>
                {SMOKING_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            ) : (
              <p className="text-maroon-950 font-medium">{profile.smoking || 'Not specified'}</p>
            )}
          </div>

          {/* Drinking */}
          <div>
            <label className="label">Drinking</label>
            {editing ? (
              <select
                value={formData.drinking || ''}
                onChange={(e) => setFormData({ ...formData, drinking: e.target.value || null })}
                className="input"
              >
                <option value="">Select</option>
                {DRINKING_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            ) : (
              <p className="text-maroon-950 font-medium">{profile.drinking || 'Not specified'}</p>
            )}
          </div>

          {/* Languages */}
          <div className="md:col-span-2">
            <label className="label">Languages Known</label>
            {editing ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {LANGUAGES.map((lang) => (
                  <label key={lang} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.languages?.includes(lang) || false}
                      onChange={(e) => {
                        const langs = formData.languages || [];
                        if (e.target.checked) {
                          setFormData({ ...formData, languages: [...langs, lang] });
                        } else {
                          setFormData({ ...formData, languages: langs.filter((l) => l !== lang) });
                        }
                      }}
                      className="rounded border-gold-300 text-maroon-950 focus:ring-gold-500"
                    />
                    <span className="text-sm text-maroon-700">{lang}</span>
                  </label>
                ))}
              </div>
            ) : (
              <p className="text-maroon-950 font-medium">
                {profile.languages?.length > 0 ? profile.languages.join(', ') : 'Not specified'}
              </p>
            )}
          </div>

          {/* About Me */}
          <div className="md:col-span-2">
            <label className="label">About Me</label>
            {editing ? (
              <textarea
                value={formData.aboutMe || ''}
                onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value || null })}
                className="input min-h-[120px]"
                placeholder="Write about yourself, your interests, hobbies, and what you're looking for in a partner..."
                maxLength={2000}
              />
            ) : (
              <p className="text-maroon-950 whitespace-pre-wrap">
                {profile.aboutMe || 'Not specified'}
              </p>
            )}
          </div>
        </div>

        {editing && (
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => setEditing(false)} className="btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? 'Saving...' : (
                <>
                  <Save className="w-4 h-4" /> Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </motion.div>
  );
}

function FamilyTab({
  profile,
  saving,
  onSave,
}: {
  profile: Profile;
  saving: boolean;
  onSave: (data: Partial<Profile>) => void;
}) {
  const [formData, setFormData] = useState(profile);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setEditing(false);
  };

  return (
    <motion.div
      key="family"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card p-6"
    >
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-maroon-950">Family Details</h2>
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 text-maroon-700 hover:text-maroon-950"
          >
            {editing ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Father's Name */}
          <div>
            <label className="label">Father's Name</label>
            {editing ? (
              <input
                type="text"
                value={formData.fatherName || ''}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value || null })}
                className="input"
                placeholder="Enter father's name"
              />
            ) : (
              <p className="text-maroon-950 font-medium">{profile.fatherName || 'Not specified'}</p>
            )}
          </div>

          {/* Father's Occupation */}
          <div>
            <label className="label">Father's Occupation</label>
            {editing ? (
              <input
                type="text"
                value={formData.fatherOccupation || ''}
                onChange={(e) => setFormData({ ...formData, fatherOccupation: e.target.value || null })}
                className="input"
                placeholder="Enter father's occupation"
              />
            ) : (
              <p className="text-maroon-950 font-medium">{profile.fatherOccupation || 'Not specified'}</p>
            )}
          </div>

          {/* Mother's Name */}
          <div>
            <label className="label">Mother's Name</label>
            {editing ? (
              <input
                type="text"
                value={formData.motherName || ''}
                onChange={(e) => setFormData({ ...formData, motherName: e.target.value || null })}
                className="input"
                placeholder="Enter mother's name"
              />
            ) : (
              <p className="text-maroon-950 font-medium">{profile.motherName || 'Not specified'}</p>
            )}
          </div>

          {/* Mother's Occupation */}
          <div>
            <label className="label">Mother's Occupation</label>
            {editing ? (
              <input
                type="text"
                value={formData.motherOccupation || ''}
                onChange={(e) => setFormData({ ...formData, motherOccupation: e.target.value || null })}
                className="input"
                placeholder="Enter mother's occupation"
              />
            ) : (
              <p className="text-maroon-950 font-medium">{profile.motherOccupation || 'Not specified'}</p>
            )}
          </div>

          {/* Siblings Count */}
          <div>
            <label className="label">Number of Siblings</label>
            {editing ? (
              <input
                type="number"
                value={formData.siblingsCount || ''}
                onChange={(e) => setFormData({ ...formData, siblingsCount: parseInt(e.target.value) || null })}
                className="input"
                placeholder="e.g., 2"
              />
            ) : (
              <p className="text-maroon-950 font-medium">{profile.siblingsCount ?? 'Not specified'}</p>
            )}
          </div>

          {/* Siblings Details */}
          <div>
            <label className="label">Siblings Details</label>
            {editing ? (
              <input
                type="text"
                value={formData.siblingsDetails || ''}
                onChange={(e) => setFormData({ ...formData, siblingsDetails: e.target.value || null })}
                className="input"
                placeholder="e.g., 1 brother (married), 1 sister (unmarried)"
              />
            ) : (
              <p className="text-maroon-950 font-medium">{profile.siblingsDetails || 'Not specified'}</p>
            )}
          </div>

          {/* Family Type */}
          <div>
            <label className="label">Family Type</label>
            {editing ? (
              <select
                value={formData.familyType || ''}
                onChange={(e) => setFormData({ ...formData, familyType: e.target.value || null })}
                className="input"
              >
                <option value="">Select</option>
                {FAMILY_TYPE.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            ) : (
              <p className="text-maroon-950 font-medium">{profile.familyType || 'Not specified'}</p>
            )}
          </div>

          {/* Family Values */}
          <div>
            <label className="label">Family Values</label>
            {editing ? (
              <select
                value={formData.familyValues || ''}
                onChange={(e) => setFormData({ ...formData, familyValues: e.target.value || null })}
                className="input"
              >
                <option value="">Select</option>
                {FAMILY_VALUES.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            ) : (
              <p className="text-maroon-950 font-medium">{profile.familyValues || 'Not specified'}</p>
            )}
          </div>

          {/* Family Status */}
          <div>
            <label className="label">Family Status</label>
            {editing ? (
              <select
                value={formData.familyStatus || ''}
                onChange={(e) => setFormData({ ...formData, familyStatus: e.target.value || null })}
                className="input"
              >
                <option value="">Select</option>
                {FAMILY_STATUS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            ) : (
              <p className="text-maroon-950 font-medium">{profile.familyStatus || 'Not specified'}</p>
            )}
          </div>
        </div>

        {editing && (
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => setEditing(false)} className="btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? 'Saving...' : (
                <>
                  <Save className="w-4 h-4" /> Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </motion.div>
  );
}

function HoroscopeTab({
  profile,
  saving,
  onSave,
}: {
  profile: Profile;
  saving: boolean;
  onSave: (data: Partial<Profile>) => void;
}) {
  const [formData, setFormData] = useState(profile);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setEditing(false);
  };

  return (
    <motion.div
      key="horoscope"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card p-6"
    >
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-maroon-950">Horoscope Details</h2>
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 text-maroon-700 hover:text-maroon-950"
          >
            {editing ? <X className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        <div className="mb-6 p-4 bg-gold-50 rounded-lg flex items-center gap-3">
          <input
            type="checkbox"
            checked={formData.horoscopeEnabled}
            onChange={(e) => setFormData({ ...formData, horoscopeEnabled: e.target.checked })}
            disabled={!editing}
            className="rounded border-gold-300 text-maroon-950 focus:ring-gold-500"
          />
          <div>
            <p className="font-medium text-maroon-950">Enable Horoscope Matching</p>
            <p className="text-sm text-maroon-600">Show horoscope details on your profile for better match compatibility</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Birth Time */}
          <div>
            <label className="label">Birth Time</label>
            {editing ? (
              <input
                type="time"
                value={formData.birthTime || ''}
                onChange={(e) => setFormData({ ...formData, birthTime: e.target.value || null })}
                className="input"
              />
            ) : (
              <p className="text-maroon-950 font-medium">{profile.birthTime || 'Not specified'}</p>
            )}
          </div>

          {/* Birth Place */}
          <div>
            <label className="label">Birth Place</label>
            {editing ? (
              <input
                type="text"
                value={formData.birthPlace || ''}
                onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value || null })}
                className="input"
                placeholder="City, State"
              />
            ) : (
              <p className="text-maroon-950 font-medium">{profile.birthPlace || 'Not specified'}</p>
            )}
          </div>

          {/* Gotra */}
          <div>
            <label className="label">Gotra</label>
            {editing ? (
              <input
                type="text"
                value={formData.gotra || ''}
                onChange={(e) => setFormData({ ...formData, gotra: e.target.value || null })}
                className="input"
                placeholder="e.g., Bharadwaj"
              />
            ) : (
              <p className="text-maroon-950 font-medium">{profile.gotra || 'Not specified'}</p>
            )}
          </div>

          {/* Nakshatra */}
          <div>
            <label className="label">Nakshatra</label>
            {editing ? (
              <select
                value={formData.nakshatra || ''}
                onChange={(e) => setFormData({ ...formData, nakshatra: e.target.value || null })}
                className="input"
              >
                <option value="">Select Nakshatra</option>
                {NAKSHATRAS.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            ) : (
              <p className="text-maroon-950 font-medium">{profile.nakshatra || 'Not specified'}</p>
            )}
          </div>

          {/* Rashi */}
          <div>
            <label className="label">Rashi (Moon Sign)</label>
            {editing ? (
              <select
                value={formData.rashi || ''}
                onChange={(e) => setFormData({ ...formData, rashi: e.target.value || null })}
                className="input"
              >
                <option value="">Select Rashi</option>
                {RASHIS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            ) : (
              <p className="text-maroon-950 font-medium">{profile.rashi || 'Not specified'}</p>
            )}
          </div>

          {/* Manglik */}
          <div>
            <label className="label">Manglik Status</label>
            {editing ? (
              <select
                value={formData.manglik === null ? '' : formData.manglik ? 'yes' : 'no'}
                onChange={(e) => setFormData({ ...formData, manglik: e.target.value === '' ? null : e.target.value === 'yes' })}
                className="input"
              >
                <option value="">Select</option>
                <option value="no">Non-Manglik</option>
                <option value="yes">Manglik</option>
              </select>
            ) : (
              <p className="text-maroon-950 font-medium">
                {profile.manglik === null ? 'Not specified' : profile.manglik ? 'Manglik' : 'Non-Manglik'}
              </p>
            )}
          </div>
        </div>

        {editing && (
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={() => setEditing(false)} className="btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? 'Saving...' : (
                <>
                  <Save className="w-4 h-4" /> Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </motion.div>
  );
}

function PreferencesTab({
  preferences,
  saving,
  onSave,
}: {
  preferences: Preferences;
  saving: boolean;
  onSave: (data: Partial<Preferences>) => void;
}) {
  const [formData, setFormData] = useState(preferences);

  useEffect(() => {
    setFormData(preferences);
  }, [preferences]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <motion.div
      key="preferences"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card p-6"
    >
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold text-maroon-950 mb-6">Partner Preferences</h2>

        {/* Age Range */}
        <div className="mb-6">
          <label className="label mb-3">Preferred Age Range</label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="number"
                value={formData.preferredAgeMin}
                onChange={(e) => setFormData({ ...formData, preferredAgeMin: parseInt(e.target.value) || 21 })}
                className="input"
                min={18}
                max={60}
              />
              <span className="text-sm text-maroon-600 mt-1 block">Min Age</span>
            </div>
            <span className="text-maroon-500">to</span>
            <div className="flex-1">
              <input
                type="number"
                value={formData.preferredAgeMax}
                onChange={(e) => setFormData({ ...formData, preferredAgeMax: parseInt(e.target.value) || 40 })}
                className="input"
                min={18}
                max={60}
              />
              <span className="text-sm text-maroon-600 mt-1 block">Max Age</span>
            </div>
          </div>
        </div>

        {/* Height Range */}
        <div className="mb-6">
          <label className="label mb-3">Preferred Height Range (cm)</label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="number"
                value={formData.preferredHeightMin || ''}
                onChange={(e) => setFormData({ ...formData, preferredHeightMin: parseInt(e.target.value) || null })}
                className="input"
                placeholder="Min height"
              />
            </div>
            <span className="text-maroon-500">to</span>
            <div className="flex-1">
              <input
                type="number"
                value={formData.preferredHeightMax || ''}
                onChange={(e) => setFormData({ ...formData, preferredHeightMax: parseInt(e.target.value) || null })}
                className="input"
                placeholder="Max height"
              />
            </div>
          </div>
        </div>

        {/* Religion Preference */}
        <div className="mb-6">
          <label className="label mb-3">Preferred Religions</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {RELIGIONS.map((religion) => (
              <label key={religion} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.preferredReligions?.includes(religion) || false}
                  onChange={(e) => {
                    const current = formData.preferredReligions || [];
                    if (e.target.checked) {
                      setFormData({ ...formData, preferredReligions: [...current, religion] });
                    } else {
                      setFormData({ ...formData, preferredReligions: current.filter((r) => r !== religion) });
                    }
                  }}
                  className="rounded border-gold-300 text-maroon-950 focus:ring-gold-500"
                />
                <span className="text-sm text-maroon-700">{religion}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Caste Preference */}
        <div className="mb-6">
          <label className="label mb-3">Preferred Castes</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
            {HINDU_CASTES.map((caste) => (
              <label key={caste} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.preferredCastes?.includes(caste) || false}
                  onChange={(e) => {
                    const current = formData.preferredCastes || [];
                    if (e.target.checked) {
                      setFormData({ ...formData, preferredCastes: [...current, caste] });
                    } else {
                      setFormData({ ...formData, preferredCastes: current.filter((c) => c !== caste) });
                    }
                  }}
                  className="rounded border-gold-300 text-maroon-950 focus:ring-gold-500"
                />
                <span className="text-sm text-maroon-700">{caste}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Education Preference */}
        <div className="mb-6">
          <label className="label mb-3">Preferred Education</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {EDUCATION_OPTIONS.map((edu) => (
              <label key={edu} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.preferredEducations?.includes(edu) || false}
                  onChange={(e) => {
                    const current = formData.preferredEducations || [];
                    if (e.target.checked) {
                      setFormData({ ...formData, preferredEducations: [...current, edu] });
                    } else {
                      setFormData({ ...formData, preferredEducations: current.filter((e) => e !== edu) });
                    }
                  }}
                  className="rounded border-gold-300 text-maroon-950 focus:ring-gold-500"
                />
                <span className="text-sm text-maroon-700">{edu}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Location Preference */}
        <div className="mb-6">
          <label className="label mb-3">Preferred Locations</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
            {INDIAN_STATES.map((state) => (
              <label key={state} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.preferredLocations?.includes(state) || false}
                  onChange={(e) => {
                    const current = formData.preferredLocations || [];
                    if (e.target.checked) {
                      setFormData({ ...formData, preferredLocations: [...current, state] });
                    } else {
                      setFormData({ ...formData, preferredLocations: current.filter((l) => l !== state) });
                    }
                  }}
                  className="rounded border-gold-300 text-maroon-950 focus:ring-gold-500"
                />
                <span className="text-sm text-maroon-700">{state}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Marital Status Preference */}
        <div className="mb-6">
          <label className="label mb-3">Preferred Marital Status</label>
          <div className="flex flex-wrap gap-4">
            {MARITAL_STATUS.map((status) => (
              <label key={status} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.preferredMaritalStatus?.includes(status) || false}
                  onChange={(e) => {
                    const current = formData.preferredMaritalStatus || [];
                    if (e.target.checked) {
                      setFormData({ ...formData, preferredMaritalStatus: [...current, status] });
                    } else {
                      setFormData({ ...formData, preferredMaritalStatus: current.filter((s) => s !== status) });
                    }
                  }}
                  className="rounded border-gold-300 text-maroon-950 focus:ring-gold-500"
                />
                <span className="text-sm text-maroon-700">{status}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Income Range */}
        <div className="mb-6">
          <label className="label mb-3">Preferred Annual Income Range (Lakhs)</label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="number"
                value={formData.preferredIncomeMin || ''}
                onChange={(e) => setFormData({ ...formData, preferredIncomeMin: parseInt(e.target.value) || null })}
                className="input"
                placeholder="Min (Lakhs)"
              />
            </div>
            <span className="text-maroon-500">to</span>
            <div className="flex-1">
              <input
                type="number"
                value={formData.preferredIncomeMax || ''}
                onChange={(e) => setFormData({ ...formData, preferredIncomeMax: parseInt(e.target.value) || null })}
                className="input"
                placeholder="Max (Lakhs)"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            {saving ? 'Saving...' : (
              <>
                <Save className="w-4 h-4" /> Save Preferences
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
}

function PrivacyTab() {
  const [showPhotoPrivacy, setShowPhotoPrivacy] = useState(false);
  const [showContactPrivacy, setShowContactPrivacy] = useState(false);

  return (
    <motion.div
      key="privacy"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="card p-6"
    >
      <h2 className="text-xl font-semibold text-maroon-950 mb-6">Privacy Settings</h2>

      <div className="space-y-6">
        {/* Photo Privacy */}
        <div className="p-4 bg-cream-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gold-100 rounded-lg">
                <EyeOff className="w-5 h-5 text-gold-700" />
              </div>
              <div>
                <p className="font-medium text-maroon-950">Photo Privacy</p>
                <p className="text-sm text-maroon-600">Control who can see your photos</p>
              </div>
            </div>
            <button
              onClick={() => setShowPhotoPrivacy(!showPhotoPrivacy)}
              className="text-maroon-700 hover:text-maroon-950"
            >
              <ChevronRight className={`w-5 h-5 transition-transform ${showPhotoPrivacy ? 'rotate-90' : ''}`} />
            </button>
          </div>
          {showPhotoPrivacy && (
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="photoPrivacy" defaultChecked className="text-maroon-950 focus:ring-gold-500" />
                <div>
                  <p className="text-maroon-950 font-medium">Visible to all</p>
                  <p className="text-sm text-maroon-600">Anyone can see your photos</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="photoPrivacy" className="text-maroon-950 focus:ring-gold-500" />
                <div>
                  <p className="text-maroon-950 font-medium">Only after interest accepted</p>
                  <p className="text-sm text-maroon-600">Photos visible only to accepted interests</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="photoPrivacy" className="text-maroon-950 focus:ring-gold-500" />
                <div>
                  <p className="text-maroon-950 font-medium">Premium members only</p>
                  <p className="text-sm text-maroon-600">Only premium members can see your photos</p>
                </div>
              </label>
            </div>
          )}
        </div>

        {/* Contact Privacy */}
        <div className="p-4 bg-cream-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gold-100 rounded-lg">
                <Lock className="w-5 h-5 text-gold-700" />
              </div>
              <div>
                <p className="font-medium text-maroon-950">Contact Details</p>
                <p className="text-sm text-maroon-600">Control who can see your contact information</p>
              </div>
            </div>
            <button
              onClick={() => setShowContactPrivacy(!showContactPrivacy)}
              className="text-maroon-700 hover:text-maroon-950"
            >
              <ChevronRight className={`w-5 h-5 transition-transform ${showContactPrivacy ? 'rotate-90' : ''}`} />
            </button>
          </div>
          {showContactPrivacy && (
            <div className="mt-4 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="contactPrivacy" defaultChecked className="text-maroon-950 focus:ring-gold-500" />
                <div>
                  <p className="text-maroon-950 font-medium">After mutual interest</p>
                  <p className="text-sm text-maroon-600">Only after both parties accept interest</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="radio" name="contactPrivacy" className="text-maroon-950 focus:ring-gold-500" />
                <div>
                  <p className="text-maroon-950 font-medium">Premium members only</p>
                  <p className="text-sm text-maroon-600">Only premium members can view contact</p>
                </div>
              </label>
            </div>
          )}
        </div>

        {/* Profile Visibility */}
        <div className="p-4 bg-cream-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gold-100 rounded-lg">
                <Eye className="w-5 h-5 text-gold-700" />
              </div>
              <div>
                <p className="font-medium text-maroon-950">Profile Visibility</p>
                <p className="text-sm text-maroon-600">Show your profile in search results</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gold-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-maroon-950"></div>
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProfilePage;