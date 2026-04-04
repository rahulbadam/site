import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Constants for matching weights
const MATCHING_WEIGHTS = {
  preferences: 0.35,      // 35% - Partner preferences match
  horoscope: 0.25,        // 25% - Horoscope compatibility (36-gun)
  profile: 0.20,          // 20% - Profile completeness & activity
  behavior: 0.10,         // 10% - User behavior (interests sent, response rate)
  location: 0.10,         // 10% - Location proximity
};

// Nakshatra compatibility matrix for 36-gun matching
// Each nakshatra has compatibility points with other nakshatras
const NAKSHATRA_COMPATIBILITY: Record<string, Record<string, number>> = {
  'Ashwini': { 'Ashwini': 0, 'Bharani': 0, 'Krittika': 0, 'Rohini': 0, 'Mrigashira': 0, 'Ardra': 0, 'Punarvasu': 3, 'Pushya': 0, 'Ashlesha': 0, 'Magha': 3, 'Purva Phalguni': 0, 'Uttara Phalguni': 0, 'Hasta': 0, 'Chitra': 0, 'Swati': 0, 'Vishakha': 0, 'Anuradha': 0, 'Jyeshtha': 0, 'Mula': 0, 'Purva Ashadha': 0, 'Uttara Ashadha': 0, 'Shravana': 0, 'Dhanishta': 0, 'Shatabhisha': 0, 'Purva Bhadrapada': 0, 'Uttara Bhadrapada': 0, 'Revati': 3 },
  'Bharani': { 'Ashwini': 0, 'Bharani': 0, 'Krittika': 0, 'Rohini': 0, 'Mrigashira': 0, 'Ardra': 0, 'Punarvasu': 0, 'Pushya': 0, 'Ashlesha': 0, 'Magha': 0, 'Purva Phalguni': 3, 'Uttara Phalguni': 0, 'Hasta': 0, 'Chitra': 0, 'Swati': 0, 'Vishakha': 0, 'Anuradha': 0, 'Jyeshtha': 0, 'Mula': 0, 'Purva Ashadha': 0, 'Uttara Ashadha': 0, 'Shravana': 0, 'Dhanishta': 0, 'Shatabhisha': 0, 'Purva Bhadrapada': 0, 'Uttara Bhadrapada': 0, 'Revati': 0 },
  'Krittika': { 'Ashwini': 0, 'Bharani': 0, 'Krittika': 0, 'Rohini': 0, 'Mrigashira': 0, 'Ardra': 0, 'Punarvasu': 0, 'Pushya': 0, 'Ashlesha': 0, 'Magha': 0, 'Purva Phalguni': 0, 'Uttara Phalguni': 3, 'Hasta': 0, 'Chitra': 0, 'Swati': 0, 'Vishakha': 0, 'Anuradha': 0, 'Jyeshtha': 0, 'Mula': 0, 'Purva Ashadha': 0, 'Uttara Ashadha': 0, 'Shravana': 0, 'Dhanishta': 0, 'Shatabhisha': 0, 'Purva Bhadrapada': 0, 'Uttara Bhadrapada': 0, 'Revati': 0 },
  'Rohini': { 'Ashwini': 0, 'Bharani': 0, 'Krittika': 0, 'Rohini': 0, 'Mrigashira': 0, 'Ardra': 0, 'Punarvasu': 0, 'Pushya': 0, 'Ashlesha': 0, 'Magha': 0, 'Purva Phalguni': 0, 'Uttara Phalguni': 0, 'Hasta': 3, 'Chitra': 0, 'Swati': 0, 'Vishakha': 0, 'Anuradha': 0, 'Jyeshtha': 0, 'Mula': 0, 'Purva Ashadha': 0, 'Uttara Ashadha': 0, 'Shravana': 0, 'Dhanishta': 0, 'Shatabhisha': 0, 'Purva Bhadrapada': 0, 'Uttara Bhadrapada': 0, 'Revati': 0 },
  'Mrigashira': { 'Ashwini': 0, 'Bharani': 0, 'Krittika': 0, 'Rohini': 0, 'Mrigashira': 0, 'Ardra': 0, 'Punarvasu': 0, 'Pushya': 0, 'Ashlesha': 0, 'Magha': 0, 'Purva Phalguni': 0, 'Uttara Phalguni': 0, 'Hasta': 0, 'Chitra': 3, 'Swati': 0, 'Vishakha': 0, 'Anuradha': 0, 'Jyeshtha': 0, 'Mula': 0, 'Purva Ashadha': 0, 'Uttara Ashadha': 0, 'Shravana': 0, 'Dhanishta': 0, 'Shatabhisha': 0, 'Purva Bhadrapada': 0, 'Uttara Bhadrapada': 0, 'Revati': 0 },
  'Ardra': { 'Ashwini': 0, 'Bharani': 0, 'Krittika': 0, 'Rohini': 0, 'Mrigashira': 0, 'Ardra': 0, 'Punarvasu': 0, 'Pushya': 0, 'Ashlesha': 0, 'Magha': 0, 'Purva Phalguni': 0, 'Uttara Phalguni': 0, 'Hasta': 0, 'Chitra': 0, 'Swati': 3, 'Vishakha': 0, 'Anuradha': 0, 'Jyeshtha': 0, 'Mula': 0, 'Purva Ashadha': 0, 'Uttara Ashadha': 0, 'Shravana': 0, 'Dhanishta': 0, 'Shatabhisha': 0, 'Purva Bhadrapada': 0, 'Uttara Bhadrapada': 0, 'Revati': 0 },
  'Punarvasu': { 'Ashwini': 3, 'Bharani': 0, 'Krittika': 0, 'Rohini': 0, 'Mrigashira': 0, 'Ardra': 0, 'Punarvasu': 0, 'Pushya': 0, 'Ashlesha': 0, 'Magha': 0, 'Purva Phalguni': 0, 'Uttara Phalguni': 0, 'Hasta': 0, 'Chitra': 0, 'Swati': 0, 'Vishakha': 3, 'Anuradha': 0, 'Jyeshtha': 0, 'Mula': 0, 'Purva Ashadha': 0, 'Uttara Ashadha': 0, 'Shravana': 0, 'Dhanishta': 0, 'Shatabhisha': 0, 'Purva Bhadrapada': 0, 'Uttara Bhadrapada': 0, 'Revati': 0 },
  'Pushya': { 'Ashwini': 0, 'Bharani': 0, 'Krittika': 0, 'Rohini': 0, 'Mrigashira': 0, 'Ardra': 0, 'Punarvasu': 0, 'Pushya': 0, 'Ashlesha': 0, 'Magha': 0, 'Purva Phalguni': 0, 'Uttara Phalguni': 0, 'Hasta': 0, 'Chitra': 0, 'Swati': 0, 'Vishakha': 0, 'Anuradha': 3, 'Jyeshtha': 0, 'Mula': 0, 'Purva Ashadha': 0, 'Uttara Ashadha': 0, 'Shravana': 0, 'Dhanishta': 0, 'Shatabhisha': 0, 'Purva Bhadrapada': 0, 'Uttara Bhadrapada': 0, 'Revati': 0 },
  'Ashlesha': { 'Ashwini': 0, 'Bharani': 0, 'Krittika': 0, 'Rohini': 0, 'Mrigashira': 0, 'Ardra': 0, 'Punarvasu': 0, 'Pushya': 0, 'Ashlesha': 0, 'Magha': 0, 'Purva Phalguni': 0, 'Uttara Phalguni': 0, 'Hasta': 0, 'Chitra': 0, 'Swati': 0, 'Vishakha': 0, 'Anuradha': 0, 'Jyeshtha': 3, 'Mula': 0, 'Purva Ashadha': 0, 'Uttara Ashadha': 0, 'Shravana': 0, 'Dhanishta': 0, 'Shatabhisha': 0, 'Purva Bhadrapada': 0, 'Uttara Bhadrapada': 0, 'Revati': 0 },
  'Magha': { 'Ashwini': 3, 'Bharani': 0, 'Krittika': 0, 'Rohini': 0, 'Mrigashira': 0, 'Ardra': 0, 'Punarvasu': 0, 'Pushya': 0, 'Ashlesha': 0, 'Magha': 0, 'Purva Phalguni': 0, 'Uttara Phalguni': 0, 'Hasta': 0, 'Chitra': 0, 'Swati': 0, 'Vishakha': 0, 'Anuradha': 0, 'Jyeshtha': 0, 'Mula': 3, 'Purva Ashadha': 0, 'Uttara Ashadha': 0, 'Shravana': 0, 'Dhanishta': 0, 'Shatabhisha': 0, 'Purva Bhadrapada': 0, 'Uttara Bhadrapada': 0, 'Revati': 0 },
  'Purva Phalguni': { 'Ashwini': 0, 'Bharani': 3, 'Krittika': 0, 'Rohini': 0, 'Mrigashira': 0, 'Ardra': 0, 'Punarvasu': 0, 'Pushya': 0, 'Ashlesha': 0, 'Magha': 0, 'Purva Phalguni': 0, 'Uttara Phalguni': 0, 'Hasta': 0, 'Chitra': 0, 'Swati': 0, 'Vishakha': 0, 'Anuradha': 0, 'Jyeshtha': 0, 'Mula': 0, 'Purva Ashadha': 3, 'Uttara Ashadha': 0, 'Shravana': 0, 'Dhanishta': 0, 'Shatabhisha': 0, 'Purva Bhadrapada': 0, 'Uttara Bhadrapada': 0, 'Revati': 0 },
  'Uttara Phalguni': { 'Ashwini': 0, 'Bharani': 0, 'Krittika': 3, 'Rohini': 0, 'Mrigashira': 0, 'Ardra': 0, 'Punarvasu': 0, 'Pushya': 0, 'Ashlesha': 0, 'Magha': 0, 'Purva Phalguni': 0, 'Uttara Phalguni': 0, 'Hasta': 0, 'Chitra': 0, 'Swati': 0, 'Vishakha': 0, 'Anuradha': 0, 'Jyeshtha': 0, 'Mula': 0, 'Purva Ashadha': 0, 'Uttara Ashadha': 3, 'Shravana': 0, 'Dhanishta': 0, 'Shatabhisha': 0, 'Purva Bhadrapada': 0, 'Uttara Bhadrapada': 0, 'Revati': 0 },
  'Hasta': { 'Ashwini': 0, 'Bharani': 0, 'Krittika': 0, 'Rohini': 3, 'Mrigashira': 0, 'Ardra': 0, 'Punarvasu': 0, 'Pushya': 0, 'Ashlesha': 0, 'Magha': 0, 'Purva Phalguni': 0, 'Uttara Phalguni': 0, 'Hasta': 0, 'Chitra': 0, 'Swati': 0, 'Vishakha': 0, 'Anuradha': 0, 'Jyeshtha': 0, 'Mula': 0, 'Purva Ashadha': 0, 'Uttara Ashadha': 0, 'Shravana': 0, 'Dhanishta': 3, 'Shatabhisha': 0, 'Purva Bhadrapada': 0, 'Uttara Bhadrapada': 0, 'Revati': 0 },
  'Chitra': { 'Ashwini': 0, 'Bharani': 0, 'Krittika': 0, 'Rohini': 0, 'Mrigashira': 3, 'Ardra': 0, 'Punarvasu': 0, 'Pushya': 0, 'Ashlesha': 0, 'Magha': 0, 'Purva Phalguni': 0, 'Uttara Phalguni': 0, 'Hasta': 0, 'Chitra': 0, 'Swati': 0, 'Vishakha': 0, 'Anuradha': 0, 'Jyeshtha': 0, 'Mula': 0, 'Purva Ashadha': 0, 'Uttara Ashadha': 0, 'Shravana': 0, 'Dhanishta': 0, 'Shatabhisha': 3, 'Purva Bhadrapada': 0, 'Uttara Bhadrapada': 0, 'Revati': 0 },
  'Swati': { 'Ashwini': 0, 'Bharani': 0, 'Krittika': 0, 'Rohini': 0, 'Mrigashira': 0, 'Ardra': 3, 'Punarvasu': 0, 'Pushya': 0, 'Ashlesha': 0, 'Magha': 0, 'Purva Phalguni': 0, 'Uttara Phalguni': 0, 'Hasta': 0, 'Chitra': 0, 'Swati': 0, 'Vishakha': 0, 'Anuradha': 0, 'Jyeshtha': 0, 'Mula': 0, 'Purva Ashadha': 0, 'Uttara Ashadha': 0, 'Shravana': 0, 'Dhanishta': 0, 'Shatabhisha': 0, 'Purva Bhadrapada': 3, 'Uttara Bhadrapada': 0, 'Revati': 0 },
  'Vishakha': { 'Ashwini': 0, 'Bharani': 0, 'Krittika': 0, 'Rohini': 0, 'Mrigashira': 0, 'Ardra': 0, 'Punarvasu': 3, 'Pushya': 0, 'Ashlesha': 0, 'Magha': 0, 'Purva Phalguni': 0, 'Uttara Phalguni': 0, 'Hasta': 0, 'Chitra': 0, 'Swati': 0, 'Vishakha': 0, 'Anuradha': 0, 'Jyeshtha': 0, 'Mula': 0, 'Purva Ashadha': 0, 'Uttara Ashadha': 0, 'Shravana': 0, 'Dhanishta': 0, 'Shatabhisha': 0, 'Purva Bhadrapada': 0, 'Uttara Bhadrapada': 3, 'Revati': 0 },
  'Anuradha': { 'Ashwini': 0, 'Bharani': 0, 'Krittika': 0, 'Rohini': 0, 'Mrigashira': 0, 'Ardra': 0, 'Punarvasu': 0, 'Pushya': 3, 'Ashlesha': 0, 'Magha': 0, 'Purva Phalguni': 0, 'Uttara Phalguni': 0, 'Hasta': 0, 'Chitra': 0, 'Swati': 0, 'Vishakha': 0, 'Anuradha': 0, 'Jyeshtha': 0, 'Mula': 0, 'Purva Ashadha': 0, 'Uttara Ashadha': 0, 'Shravana': 3, 'Dhanishta': 0, 'Shatabhisha': 0, 'Purva Bhadrapada': 0, 'Uttara Bhadrapada': 0, 'Revati': 0 },
  'Jyeshtha': { 'Ashwini': 0, 'Bharani': 0, 'Krittika': 0, 'Rohini': 0, 'Mrigashira': 0, 'Ardra': 0, 'Punarvasu': 0, 'Pushya': 0, 'Ashlesha': 3, 'Magha': 0, 'Purva Phalguni': 0, 'Uttara Phalguni': 0, 'Hasta': 0, 'Chitra': 0, 'Swati': 0, 'Vishakha': 0, 'Anuradha': 0, 'Jyeshtha': 0, 'Mula': 0, 'Purva Ashadha': 0, 'Uttara Ashadha': 0, 'Shravana': 0, 'Dhanishta': 0, 'Shatabhisha': 0, 'Purva Bhadrapada': 0, 'Uttara Bhadrapada': 0, 'Revati': 0 },
  'Mula': { 'Ashwini': 0, 'Bharani': 0, 'Krittika': 0, 'Rohini': 0, 'Mrigashira': 0, 'Ardra': 0, 'Punarvasu': 0, 'Pushya': 0, 'Ashlesha': 0, 'Magha': 3, 'Purva Phalguni': 0, 'Uttara Phalguni': 0, 'Hasta': 0, 'Chitra': 0, 'Swati': 0, 'Vishakha': 0, 'Anuradha': 0, 'Jyeshtha': 0, 'Mula': 0, 'Purva Ashadha': 0, 'Uttara Ashadha': 0, 'Shravana': 0, 'Dhanishta': 0, 'Shatabhisha': 0, 'Purva Bhadrapada': 0, 'Uttara Bhadrapada': 0, 'Revati': 0 },
  'Purva Ashadha': { 'Ashwini': 0, 'Bharani': 0, 'Krittika': 0, 'Rohini': 0, 'Mrigashira': 0, 'Ardra': 0, 'Punarvasu': 0, 'Pushya': 0, 'Ashlesha': 0, 'Magha': 0, 'Purva Phalguni': 3, 'Uttara Phalguni': 0, 'Hasta': 0, 'Chitra': 0, 'Swati': 0, 'Vishakha': 0, 'Anuradha': 0, 'Jyeshtha': 0, 'Mula': 0, 'Purva Ashadha': 0, 'Uttara Ashadha': 0, 'Shravana': 0, 'Dhanishta': 0, 'Shatabhisha': 0, 'Purva Bhadrapada': 0, 'Uttara Bhadrapada': 0, 'Revati': 0 },
  'Uttara Ashadha': { 'Ashwini': 0, 'Bharani': 0, 'Krittika': 0, 'Rohini': 0, 'Mrigashira': 0, 'Ardra': 0, 'Punarvasu': 0, 'Pushya': 0, 'Ashlesha': 0, 'Magha': 0, 'Purva Phalguni': 0, 'Uttara Phalguni': 3, 'Hasta': 0, 'Chitra': 0, 'Swati': 0, 'Vishakha': 0, 'Anuradha': 0, 'Jyeshtha': 0, 'Mula': 0, 'Purva Ashadha': 0, 'Uttara Ashadha': 0, 'Shravana': 0, 'Dhanishta': 0, 'Shatabhisha': 0, 'Purva Bhadrapada': 0, 'Uttara Bhadrapada': 0, 'Revati': 0 },
  'Shravana': { 'Ashwini': 0, 'Bharani': 0, 'Krittika': 0, 'Rohini': 0, 'Mrigashira': 0, 'Ardra': 0, 'Punarvasu': 0, 'Pushya': 0, 'Ashlesha': 0, 'Magha': 0, 'Purva Phalguni': 0, 'Uttara Phalguni': 0, 'Hasta': 0, 'Chitra': 0, 'Swati': 0, 'Vishakha': 0, 'Anuradha': 3, 'Jyeshtha': 0, 'Mula': 0, 'Purva Ashadha': 0, 'Uttara Ashadha': 0, 'Shravana': 0, 'Dhanishta': 0, 'Shatabhisha': 0, 'Purva Bhadrapada': 0, 'Uttara Bhadrapada': 0, 'Revati': 0 },
  'Dhanishta': { 'Ashwini': 0, 'Bharani': 0, 'Krittika': 0, 'Rohini': 0, 'Mrigashira': 0, 'Ardra': 0, 'Punarvasu': 0, 'Pushya': 0, 'Ashlesha': 0, 'Magha': 0, 'Purva Phalguni': 0, 'Uttara Phalguni': 0, 'Hasta': 3, 'Chitra': 0, 'Swati': 0, 'Vishakha': 0, 'Anuradha': 0, 'Jyeshtha': 0, 'Mula': 0, 'Purva Ashadha': 0, 'Uttara Ashadha': 0, 'Shravana': 0, 'Dhanishta': 0, 'Shatabhisha': 0, 'Purva Bhadrapada': 0, 'Uttara Bhadrapada': 0, 'Revati': 0 },
  'Shatabhisha': { 'Ashwini': 0, 'Bharani': 0, 'Krittika': 0, 'Rohini': 0, 'Mrigashira': 0, 'Ardra': 0, 'Punarvasu': 0, 'Pushya': 0, 'Ashlesha': 0, 'Magha': 0, 'Purva Phalguni': 0, 'Uttara Phalguni': 0, 'Hasta': 0, 'Chitra': 3, 'Swati': 0, 'Vishakha': 0, 'Anuradha': 0, 'Jyeshtha': 0, 'Mula': 0, 'Purva Ashadha': 0, 'Uttara Ashadha': 0, 'Shravana': 0, 'Dhanishta': 0, 'Shatabhisha': 0, 'Purva Bhadrapada': 0, 'Uttara Bhadrapada': 0, 'Revati': 0 },
  'Purva Bhadrapada': { 'Ashwini': 0, 'Bharani': 0, 'Krittika': 0, 'Rohini': 0, 'Mrigashira': 0, 'Ardra': 0, 'Punarvasu': 0, 'Pushya': 0, 'Ashlesha': 0, 'Magha': 0, 'Purva Phalguni': 0, 'Uttara Phalguni': 0, 'Hasta': 0, 'Chitra': 0, 'Swati': 3, 'Vishakha': 0, 'Anuradha': 0, 'Jyeshtha': 0, 'Mula': 0, 'Purva Ashadha': 0, 'Uttara Ashadha': 0, 'Shravana': 0, 'Dhanishta': 0, 'Shatabhisha': 0, 'Purva Bhadrapada': 0, 'Uttara Bhadrapada': 0, 'Revati': 0 },
  'Uttara Bhadrapada': { 'Ashwini': 0, 'Bharani': 0, 'Krittika': 0, 'Rohini': 0, 'Mrigashira': 0, 'Ardra': 0, 'Punarvasu': 0, 'Pushya': 0, 'Ashlesha': 0, 'Magha': 0, 'Purva Phalguni': 0, 'Uttara Phalguni': 0, 'Hasta': 0, 'Chitra': 0, 'Swati': 0, 'Vishakha': 3, 'Anuradha': 0, 'Jyeshtha': 0, 'Mula': 0, 'Purva Ashadha': 0, 'Uttara Ashadha': 0, 'Shravana': 0, 'Dhanishta': 0, 'Shatabhisha': 0, 'Purva Bhadrapada': 0, 'Uttara Bhadrapada': 0, 'Revati': 0 },
  'Revati': { 'Ashwini': 3, 'Bharani': 0, 'Krittika': 0, 'Rohini': 0, 'Mrigashira': 0, 'Ardra': 0, 'Punarvasu': 0, 'Pushya': 0, 'Ashlesha': 0, 'Magha': 0, 'Purva Phalguni': 0, 'Uttara Phalguni': 0, 'Hasta': 0, 'Chitra': 0, 'Swati': 0, 'Vishakha': 0, 'Anuradha': 0, 'Jyeshtha': 0, 'Mula': 0, 'Purva Ashadha': 0, 'Uttara Ashadha': 0, 'Shravana': 0, 'Dhanishta': 0, 'Shatabhisha': 0, 'Purva Bhadrapada': 0, 'Uttara Bhadrapada': 0, 'Revati': 0 },
};

// Rashi compatibility (simplified - based on element compatibility)
const RASHI_ELEMENTS: Record<string, string> = {
  'Mesh (Aries)': 'fire',
  'Vrishabh (Taurus)': 'earth',
  'Mithun (Gemini)': 'air',
  'Kark (Cancer)': 'water',
  'Simha (Leo)': 'fire',
  'Kanya (Virgo)': 'earth',
  'Tula (Libra)': 'air',
  'Vrishchik (Scorpio)': 'water',
  'Dhanu (Sagittarius)': 'fire',
  'Makar (Capricorn)': 'earth',
  'Kumbh (Aquarius)': 'air',
  'Meen (Pisces)': 'water',
};

const ELEMENT_COMPATIBILITY: Record<string, Record<string, number>> = {
  'fire': { 'fire': 2, 'earth': 1, 'air': 3, 'water': 0 },
  'earth': { 'fire': 1, 'earth': 2, 'air': 0, 'water': 3 },
  'air': { 'fire': 3, 'earth': 0, 'air': 2, 'water': 1 },
  'water': { 'fire': 0, 'earth': 3, 'air': 1, 'water': 2 },
};

// Manglik compatibility
function getManglikScore(manglik1: boolean | null, manglik2: boolean | null): number {
  if (manglik1 === null || manglik2 === null) return 2; // Unknown, neutral score
  if (manglik1 === manglik2) return 3; // Both manglik or both non-manglik
  if (!manglik1 && !manglik2) return 3; // Both non-manglik
  return 0; // One manglik, one not - traditionally considered incompatible
}

export interface MatchingResult {
  overallScore: number;
  breakdown: {
    preferences: number;
    horoscope: number;
    profile: number;
    behavior: number;
    location: number;
  };
  horoscopeDetails?: {
    totalGuns: number;
    varna: number;
    vashya: number;
    tara: number;
    yoni: number;
    grahaMaitri: number;
    gana: number;
    bhakoot: number;
    nadi: number;
  };
  isCompatible: boolean;
  recommendations: string[];
}

// Calculate age from date of birth
function calculateAge(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

// Calculate preferences match score
function calculatePreferencesMatch(
  profile: any,
  preferences: any,
  otherProfile: any
): number {
  let score = 0;
  let maxScore = 0;

  const otherAge = calculateAge(otherProfile.dateOfBirth);

  // Age preference
  maxScore += 10;
  if (otherAge >= preferences.preferredAgeMin && otherAge <= preferences.preferredAgeMax) {
    score += 10;
  } else if (otherAge >= preferences.preferredAgeMin - 2 && otherAge <= preferences.preferredAgeMax + 2) {
    score += 5; // Close enough
  }

  // Height preference
  if (preferences.preferredHeightMin && preferences.preferredHeightMax) {
    maxScore += 5;
    if (otherProfile.heightCm) {
      if (otherProfile.heightCm >= preferences.preferredHeightMin && 
          otherProfile.heightCm <= preferences.preferredHeightMax) {
        score += 5;
      } else if (otherProfile.heightCm >= preferences.preferredHeightMin - 5 && 
                 otherProfile.heightCm <= preferences.preferredHeightMax + 5) {
        score += 2;
      }
    }
  }

  // Religion preference
  if (preferences.preferredReligions?.length > 0) {
    maxScore += 10;
    if (preferences.preferredReligions.includes(otherProfile.religion)) {
      score += 10;
    }
  }

  // Caste preference
  if (preferences.preferredCastes?.length > 0) {
    maxScore += 10;
    if (preferences.preferredCastes.includes(otherProfile.caste)) {
      score += 10;
    }
  }

  // Education preference
  if (preferences.preferredEducations?.length > 0) {
    maxScore += 5;
    if (preferences.preferredEducations.includes(otherProfile.education)) {
      score += 5;
    }
  }

  // Location preference
  if (preferences.preferredLocations?.length > 0) {
    maxScore += 5;
    if (preferences.preferredLocations.some((loc: string) => 
      otherProfile.locationState === loc || otherProfile.locationCity === loc
    )) {
      score += 5;
    }
  }

  // Marital status preference
  if (preferences.preferredMaritalStatus?.length > 0) {
    maxScore += 5;
    if (preferences.preferredMaritalStatus.includes(otherProfile.maritalStatus)) {
      score += 5;
    }
  }

  // If no preferences set, return neutral score
  if (maxScore === 0) return 50;

  return Math.round((score / maxScore) * 100);
}

// Calculate 36-gun horoscope match (Ashta Koota system)
function calculateHoroscopeMatch(
  profile1: any,
  profile2: any
): { score: number; details: MatchingResult['horoscopeDetails'] } {
  const nakshatra1 = profile1.nakshatra;
  const nakshatra2 = profile2.nakshatra;
  const rashi1 = profile1.rashi;
  const rashi2 = profile2.rashi;
  const manglik1 = profile1.manglik;
  const manglik2 = profile2.manglik;

  // Default scores when data is missing
  if (!nakshatra1 || !nakshatra2) {
    return {
      score: 50,
      details: undefined,
    };
  }

  // Ashta Koota (8 categories, max 36 guns)
  let varna = 1; // Spiritual compatibility (1 gun)
  let vashya = 2; // Mutual attraction (2 guns)
  let tara = 3; // Health & well-being (3 guns)
  let yoni = 4; // Sexual compatibility (4 guns)
  let grahaMaitri = 5; // Mental compatibility (5 guns)
  let gana = 6; // Temperament (6 guns)
  let bhakoot = 7; // Relative influence (7 guns)
  let nadi = 8; // Health & genes (8 guns)

  // Simplified calculation based on nakshatra
  // In real implementation, this would use detailed Vedic astrology calculations
  
  // Nakshatra compatibility (simplified)
  const nakshatraCompat = NAKSHATRA_COMPATIBILITY[nakshatra1]?.[nakshatra2] ?? 1;
  
  // Adjust scores based on compatibility
  yoni = Math.min(4, Math.max(0, nakshatraCompat + 1));
  
  // Rashi/element compatibility
  const element1 = RASHI_ELEMENTS[rashi1 || ''];
  const element2 = RASHI_ELEMENTS[rashi2 || ''];
  if (element1 && element2) {
    grahaMaitri = ELEMENT_COMPATIBILITY[element1]?.[element2] ?? 2;
  }

  // Manglik compatibility
  const manglikScore = getManglikScore(manglik1, manglik2);
  if (manglikScore < 2) {
    // Reduce overall score if manglik mismatch
    bhakoot = Math.max(0, bhakoot - 3);
  }

  // Calculate total
  const totalGuns = varna + vashya + tara + yoni + grahaMaitri + gana + bhakoot + nadi;
  
  // Convert to percentage (max 36 guns)
  const score = Math.round((totalGuns / 36) * 100);

  return {
    score,
    details: {
      totalGuns,
      varna,
      vashya,
      tara,
      yoni,
      grahaMaitri,
      gana,
      bhakoot,
      nadi,
    },
  };
}

// Calculate profile score (completeness & activity)
function calculateProfileScore(profile: any): number {
  let score = 0;

  // Profile completion percentage
  score += (profile.profileCompletionPercentage || 0) * 0.5;

  // Verified profile bonus
  if (profile.isVerified) score += 15;

  // Photo bonus
  if (profile.photos?.length > 0) score += 10;

  // Activity bonus
  if (profile.lastActiveAt) {
    const daysSinceActive = Math.floor(
      (Date.now() - new Date(profile.lastActiveAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceActive < 1) score += 15;
    else if (daysSinceActive < 3) score += 10;
    else if (daysSinceActive < 7) score += 5;
  }

  return Math.min(100, score);
}

// Calculate behavior score (based on user actions)
async function calculateBehaviorScore(userId: string, otherUserId: string): Promise<number> {
  try {
    // Check if users have interacted before
    const sentInterests = await prisma.interest.count({
      where: { senderId: userId },
    });

    const responseRate = await prisma.interest.aggregate({
      where: { receiverId: userId },
      _count: { _all: true },
    });

    // Users who actively send interests and respond are scored higher
    const activityScore = Math.min(50, sentInterests * 5);
    
    return Math.min(100, 50 + activityScore);
  } catch (error) {
    return 50; // Default neutral score
  }
}

// Calculate location proximity score
function calculateLocationScore(profile1: any, profile2: any): number {
  // Same city
  if (profile1.locationCity && profile1.locationCity === profile2.locationCity) {
    return 100;
  }

  // Same state
  if (profile1.locationState && profile1.locationState === profile2.locationState) {
    return 80;
  }

  // Same country (assuming India)
  return 50;
}

// Main matching function
export async function calculateMatchScore(
  userId: string,
  otherUserId: string
): Promise<MatchingResult> {
  try {
    // Fetch profiles and preferences
    const [user, otherUser] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: { include: { photos: true } },
          preferences: true,
        },
      }),
      prisma.user.findUnique({
        where: { id: otherUserId },
        include: {
          profile: { include: { photos: true } },
        },
      }),
    ]);

    if (!user || !otherUser || !user.profile || !otherUser.profile) {
      return {
        overallScore: 0,
        breakdown: { preferences: 0, horoscope: 0, profile: 0, behavior: 0, location: 0 },
        isCompatible: false,
        recommendations: ['Profile data incomplete'],
      };
    }

    // Calculate individual scores
    const preferencesScore = user.preferences
      ? calculatePreferencesMatch(user.profile, user.preferences, otherUser.profile)
      : 50;

    const { score: horoscopeScore, details: horoscopeDetails } = calculateHoroscopeMatch(
      user.profile,
      otherUser.profile
    );

    const profileScore = calculateProfileScore(otherUser.profile);
    const behaviorScore = await calculateBehaviorScore(userId, otherUserId);
    const locationScore = calculateLocationScore(user.profile, otherUser.profile);

    // Calculate weighted overall score
    const overallScore = Math.round(
      preferencesScore * MATCHING_WEIGHTS.preferences +
      horoscopeScore * MATCHING_WEIGHTS.horoscope +
      profileScore * MATCHING_WEIGHTS.profile +
      behaviorScore * MATCHING_WEIGHTS.behavior +
      locationScore * MATCHING_WEIGHTS.location
    );

    // Determine compatibility and generate recommendations
    const isCompatible = overallScore >= 50;
    const recommendations: string[] = [];

    if (preferencesScore < 50) {
      recommendations.push('Some partner preferences may not match');
    }
    if (horoscopeDetails && horoscopeDetails.totalGuns < 18) {
      recommendations.push('Horoscope compatibility is below average (less than 18 guns)');
    }
    if (horoscopeDetails && horoscopeDetails.totalGuns >= 27) {
      recommendations.push('Excellent horoscope match (27+ guns)');
    }
    if (profileScore < 50) {
      recommendations.push('Profile needs more details');
    }
    if (locationScore >= 80) {
      recommendations.push('Located in the same area');
    }
    if (otherUser.profile.manglik && user.profile.manglik) {
      recommendations.push('Both are Manglik - good compatibility');
    }
    if ((otherUser.profile.manglik && !user.profile.manglik) || 
        (!otherUser.profile.manglik && user.profile.manglik)) {
      recommendations.push('Manglik status differs - consult an astrologer');
    }

    return {
      overallScore,
      breakdown: {
        preferences: preferencesScore,
        horoscope: horoscopeScore,
        profile: profileScore,
        behavior: behaviorScore,
        location: locationScore,
      },
      horoscopeDetails,
      isCompatible,
      recommendations,
    };
  } catch (error) {
    console.error('Error calculating match score:', error);
    return {
      overallScore: 0,
      breakdown: { preferences: 0, horoscope: 0, profile: 0, behavior: 0, location: 0 },
      isCompatible: false,
      recommendations: ['Error calculating match'],
    };
  }
}

// Get smart matches (daily recommendations)
export async function getSmartMatches(userId: string, limit: number = 10): Promise<any[]> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        preferences: true,
      },
    });

    if (!user || !user.profile) return [];

    // Get opposite gender (for matrimonial)
    const oppositeGender = user.profile.gender === 'male' ? 'female' : 'male';

    // Build search criteria based on preferences
    const where: any = {
      gender: oppositeGender,
      isBanned: false,
      isActive: true,
      id: { not: userId },
    };

    // Get potential matches
    const potentialMatches = await prisma.user.findMany({
      where,
      include: {
        profile: {
          include: {
            photos: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
      },
      take: 100, // Get more to calculate scores
    });

    // Calculate match scores for each potential match
    const matchesWithScores = await Promise.all(
      potentialMatches.map(async (match) => {
        const matchResult = await calculateMatchScore(userId, match.id);
        return {
          ...match,
          matchScore: matchResult.overallScore,
          matchDetails: matchResult,
        };
      })
    );

    // Sort by score and return top matches
    const sortedMatches = matchesWithScores
      .filter((m) => m.matchScore >= 40) // Minimum threshold
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);

    return sortedMatches.map((match) => ({
      id: match.id,
      userId: match.id,
      name: match.profile?.name || 'Unknown',
      age: match.profile ? calculateAge(match.profile.dateOfBirth) : 0,
      primaryPhoto: match.profile?.photos?.[0]?.cdnUrl || null,
      location: match.profile?.locationCity || null,
      locationState: match.profile?.locationState || null,
      occupation: match.profile?.occupation || null,
      education: match.profile?.education || null,
      religion: match.profile?.religion || null,
      caste: match.profile?.caste || null,
      heightCm: match.profile?.heightCm || null,
      isVerified: match.profile?.isVerified || false,
      matchScore: match.matchScore,
      matchDetails: match.matchDetails,
    }));
  } catch (error) {
    console.error('Error getting smart matches:', error);
    return [];
  }
}

// Get horoscope compatibility details
export async function getHoroscopeCompatibility(
  userId: string,
  otherUserId: string
): Promise<{ compatible: boolean; details: any }> {
  try {
    const [profile1, profile2] = await Promise.all([
      prisma.profile.findUnique({ where: { userId } }),
      prisma.profile.findUnique({ where: { userId: otherUserId } }),
    ]);

    if (!profile1 || !profile2) {
      return { compatible: false, details: null };
    }

    const { score, details } = calculateHoroscopeMatch(profile1, profile2);

    return {
      compatible: score >= 50,
      details: {
        totalGuns: details?.totalGuns || 0,
        breakdown: details,
        nakshatra1: profile1.nakshatra,
        nakshatra2: profile2.nakshatra,
        rashi1: profile1.rashi,
        rashi2: profile2.rashi,
        manglik1: profile1.manglik,
        manglik2: profile2.manglik,
        recommendation: getHoroscopeRecommendation(details?.totalGuns || 0),
      },
    };
  } catch (error) {
    console.error('Error getting horoscope compatibility:', error);
    return { compatible: false, details: null };
  }
}

function getHoroscopeRecommendation(totalGuns: number): string {
  if (totalGuns >= 27) {
    return 'Excellent match! This is considered a highly auspicious union.';
  } else if (totalGuns >= 21) {
    return 'Good compatibility. The match is favorable.';
  } else if (totalGuns >= 18) {
    return 'Average compatibility. The match is acceptable.';
  } else if (totalGuns >= 12) {
    return 'Below average compatibility. Consider consulting an astrologer.';
  } else {
    return 'Low compatibility. Traditional astrology would advise against this match.';
  }
}