export interface User {
  id: string;
  email: string;
  phone: string | null;
  emailVerified: boolean;
  phoneVerified: boolean;
  isActive: boolean;
  isBanned: boolean;
  fraudScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  gender: Gender;
  dateOfBirth: string;
  age: number;
  heightCm: number | null;
  religion: string | null;
  caste: string | null;
  casteConsent: boolean;
  casteConsentAt: string | null;
  subCaste: string | null;
  education: string | null;
  occupation: string | null;
  incomeRange: string | null;
  locationCity: string | null;
  locationState: string | null;
  locationCountry: string;
  locationPincode: string | null;
  latitude: number | null;
  longitude: number | null;
  maritalStatus: MaritalStatus | null;
  diet: Diet | null;
  smoking: SmokingDrinking | null;
  drinking: SmokingDrinking | null;
  languages: string[];
  aboutMe: string | null;
  profileCompletionPercentage: number;
  isVerified: boolean;
  verificationLevel: number;
  lastActiveAt: string | null;
  profileViewsCount: number;
  isFeatured: boolean;
  featuredUntil: string | null;
  isBoosted: boolean;
  boostUntil: string | null;
  astrologyEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  id: string;
  profileId: string;
  cdnUrl: string;
  isPrimary: boolean;
  isVerified: boolean;
  moderationStatus: ModerationStatus;
  photoOrder: number;
  uploadedAt: string;
}

export interface Preferences {
  id: string;
  userId: string;
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
  preferredDiet: string[];
  preferredSmoking: string[];
  preferredDrinking: string[];
  preferredLanguages: string[];
  preferredIncomeMin: number | null;
  preferredIncomeMax: number | null;
  maxDistanceKm: number | null;
}

export interface Interest {
  id: string;
  senderId: string;
  receiverId: string;
  status: InterestStatus;
  message: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  id: string;
  user1Id: string;
  user2Id: string;
  compatibilityScore: number | null;
  matchSource: MatchSource;
  astrologyScore: number | null;
  createdAt: string;
}

export interface Message {
  id: string;
  matchId: string | null;
  senderId: string;
  receiverId: string;
  messageType: MessageType;
  content: string | null;
  templateId: string | null;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

export interface Shortlist {
  id: string;
  userId: string;
  profileId: string;
  notes: string | null;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  reportType: ReportType;
  description: string | null;
  status: ReportStatus;
  adminNotes: string | null;
  resolvedBy: string | null;
  resolvedAt: string | null;
  createdAt: string;
}

export interface Verification {
  id: string;
  userId: string;
  verificationType: VerificationType;
  status: VerificationStatus;
  documentType: string | null;
  verificationData: Record<string, unknown> | null;
  verifiedBy: string | null;
  verifiedAt: string | null;
  expiresAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planType: PlanType;
  status: SubscriptionStatus;
  startedAt: string;
  expiresAt: string | null;
  cancelledAt: string | null;
  autoRenew: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VideoCall {
  id: string;
  matchId: string;
  callerId: string;
  receiverId: string;
  status: VideoCallStatus;
  startedAt: string | null;
  endedAt: string | null;
  durationSeconds: number | null;
  roomId: string | null;
  createdAt: string;
}

export interface Conversation {
  matchId: string;
  user: ProfileSummary;
  lastMessage: Message | null;
  unreadCount: number;
}

export interface ProfileSummary {
  profileId: string;
  name: string;
  age: number;
  city: string | null;
  primaryPhoto: string | null;
}

export interface SearchFilters {
  ageMin?: number;
  ageMax?: number;
  gender?: Gender;
  religions?: string[];
  castes?: string[];
  educations?: string[];
  occupations?: string[];
  locations?: string[];
  maritalStatus?: string[];
  diet?: string[];
  heightMin?: number;
  heightMax?: number;
  incomeMin?: string;
  distanceKm?: number;
  sortBy?: SortBy;
  page?: number;
  limit?: number;
}

export interface ProfileSearchResult {
  profileId: string;
  name: string;
  age: number;
  heightCm: number | null;
  education: string | null;
  occupation: string | null;
  locationCity: string | null;
  primaryPhoto: string | null;
  compatibilityScore: number | null;
  verificationBadges: string[];
  isPremium: boolean;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

export interface PaginatedResponse<T> {
  results: T[];
  pagination: Pagination;
}

export interface JwtPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export interface AdminJwtPayload extends JwtPayload {
  role: AdminRole;
}

export type Gender = 'male' | 'female' | 'other';

export type MaritalStatus = 'never_married' | 'divorced' | 'widowed' | 'awaiting_divorce';

export type Diet = 'vegetarian' | 'non_vegetarian' | 'eggetarian' | 'vegan' | 'jain';

export type SmokingDrinking = 'never' | 'occasionally' | 'regularly' | 'quit';

export type ModerationStatus = 'pending' | 'approved' | 'rejected';

export type InterestStatus = 'pending' | 'accepted' | 'declined' | 'blocked';

export type MatchSource = 'mutual_interest' | 'recommendation' | 'search';

export type MessageType = 'text' | 'template' | 'image' | 'video_call_request';

export type ReportType = 'fake_profile' | 'inappropriate_photo' | 'harassment' | 'scam' | 'misleading_info' | 'other';

export type ReportStatus = 'pending' | 'under_review' | 'resolved' | 'dismissed';

export type VerificationType = 'email' | 'phone' | 'government_id' | 'video' | 'address';

export type VerificationStatus = 'pending' | 'submitted' | 'verified' | 'rejected';

export type PlanType = 'free' | 'premium_1m' | 'premium_3m' | 'premium_6m' | 'premium_12m';

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'refunded';

export type VideoCallStatus = 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'missed';

export type AdminRole = 'moderator' | 'trust_and_safety' | 'super_admin';

export type SortBy = 'relevance' | 'recent' | 'age_asc' | 'age_desc';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export const VERIFICATION_BADGES = {
  EMAIL_VERIFIED: 'email_verified',
  PHONE_VERIFIED: 'phone_verified',
  ID_VERIFIED: 'id_verified',
  VIDEO_VERIFIED: 'video_verified',
} as const;

export const MESSAGE_TEMPLATES = {
  INTERESTED_IN_PROFILE: 'interested_in_profile',
  LIKE_TO_KNOW_MORE: 'like_to_know_more',
  SIMILAR_INTERESTS: 'similar_interests',
} as const;

export const INCOME_RANGES = [
  'Below 5 LPA',
  '5-10 LPA',
  '10-15 LPA',
  '15-20 LPA',
  '20-30 LPA',
  '30-50 LPA',
  'Above 50 LPA',
] as const;