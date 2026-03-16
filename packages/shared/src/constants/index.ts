export const APP_NAME = 'VivahBandhan';

export const API_VERSION = 'v1';

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_EXISTS: 'EMAIL_EXISTS',
  PHONE_EXISTS: 'PHONE_EXISTS',
  INVALID_OTP: 'INVALID_OTP',
  OTP_EXPIRED: 'OTP_EXPIRED',
  PROFILE_NOT_FOUND: 'PROFILE_NOT_FOUND',
  QUOTA_EXCEEDED: 'QUOTA_EXCEEDED',
  PREMIUM_FEATURE: 'PREMIUM_FEATURE',
  USER_BANNED: 'USER_BANNED',
  VERIFICATION_PENDING: 'VERIFICATION_PENDING',
} as const;

export const FREE_TIER_LIMITS = {
  DAILY_SEARCHES: 20,
  DAILY_INTERESTS: 5,
  MAX_SHORTLISTED: 50,
} as const;

export const PREMIUM_FEATURES = {
  UNLIMITED_MESSAGING: 'unlimited_messaging',
  VIEW_PHONE_NUMBERS: 'view_phone_numbers',
  PROFILE_BOOST: 'profile_boost',
  FEATURED_LISTING: 'featured_listing',
  ADVANCED_FILTERS: 'advanced_filters',
  PROFILE_VIEWERS: 'profile_viewers',
  ANALYTICS: 'analytics',
  PRIORITY_SUPPORT: 'priority_support',
} as const;

export const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  OTP_EXPIRY_SECONDS: 300,
  PASSWORD_RESET_EXPIRY_SECONDS: 3600,
} as const;

export const RATE_LIMITS = {
  DEFAULT: { windowMs: 60000, max: 100 },
  AUTH: { windowMs: 60000, max: 10 },
  SEARCH: { windowMs: 60000, max: 20 },
  MESSAGING: { windowMs: 60000, max: 30 },
} as const;

export const FRAUD_THRESHOLDS = {
  LOW: { min: 0, max: 30 },
  MEDIUM: { min: 31, max: 60 },
  HIGH: { min: 61, max: 80 },
  CRITICAL: { min: 81, max: 100 },
} as const;

export const PROFILE_COMPLETION = {
  MINIMUM_FOR_VISIBILITY: 40,
  BASIC_FIELDS_WEIGHT: 30,
  PHOTOS_WEIGHT: 20,
  PREFERENCES_WEIGHT: 20,
  ABOUT_ME_WEIGHT: 15,
  VERIFICATION_WEIGHT: 15,
} as const;

export const RELIGIONS = [
  'Hindu',
  'Muslim',
  'Christian',
  'Sikh',
  'Buddhist',
  'Jain',
  'Parsi',
  'Jewish',
  'Other',
] as const;

export const EDUCATIONS = [
  'High School',
  'Diploma',
  'Graduate',
  'Post Graduate',
  'Doctorate',
  'Professional',
  'Other',
] as const;

export const OCCUPATIONS = [
  'Software Engineer',
  'Doctor',
  'Engineer',
  'Teacher',
  'CA/Accountant',
  'Lawyer',
  'Business Owner',
  'Government Employee',
  'Manager',
  'Consultant',
  'Other',
] as const;

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
] as const;

export const CASTE_CONSENT_TEXT =
  'I voluntarily provide my caste/community information to improve match relevance. This is optional, visible only as you choose, and can be removed anytime.';

export const ASTROLOGY_CONSENT_TEXT =
  'I consent to use my birth details for astrological matching. This is optional and can be disabled anytime.';