import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Using Groq API - FREE tier with Llama models
// Get your free API key at: https://console.groq.com/
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface MatchmakingContext {
  userName: string;
  userProfile: any;
  userPreferences: any;
  potentialMatches: any[];
}

interface AIResponse {
  message: string;
  recommendations?: {
    profileId: string;
    reason: string;
    compatibilityNotes: string;
  }[];
}

export async function getAIMatchmakingAdvice(
  userId: string,
  userQuery: string
): Promise<AIResponse> {
  try {
    // Fetch user context
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        preferences: true,
      },
    });

    if (!user || !user.profile) {
      return {
        message: 'I noticed your profile is incomplete. Please complete your profile first so I can give you personalized matchmaking advice!',
      };
    }

    // Get potential matches for context
    const potentialMatches = await getTopMatches(userId, 5);

    const systemPrompt = `You are an expert Indian matrimonial matchmaking assistant named "Vivah Mitra" (Wedding Friend). 
You have deep knowledge of:
- Indian marriage traditions and customs
- Horoscope matching (Kundali Milan)
- Caste and religious compatibility considerations
- Modern matchmaking preferences
- Family values and expectations

User Profile:
- Name: ${user.profile.name}
- Age: ${calculateAge(user.profile.dateOfBirth)}
- Gender: ${user.profile.gender}
- Religion: ${user.profile.religion || 'Not specified'}
- Caste: ${user.profile.caste || 'Not specified'}
- Education: ${user.profile.education || 'Not specified'}
- Occupation: ${user.profile.occupation || 'Not specified'}
- Location: ${user.profile.locationCity || ''}, ${user.profile.locationState || ''}
- About: ${user.profile.aboutMe || 'Not provided'}
- Horoscope: Nakshatra - ${user.profile.nakshatra || 'Not specified'}, Rashi - ${user.profile.rashi || 'Not specified'}, Manglik - ${user.profile.manglik ? 'Yes' : 'No'}

Partner Preferences:
- Age: ${user.preferences?.preferredAgeMin || 21} to ${user.preferences?.preferredAgeMax || 40}
- Religion: ${user.preferences?.preferredReligions?.join(', ') || 'Any'}
- Caste: ${user.preferences?.preferredCastes?.join(', ') || 'Any'}
- Location: ${user.preferences?.preferredLocations?.join(', ') || 'Any'}

Available Matches (Top 5):
${potentialMatches.map((m, i) => `
${i + 1}. ${m.name} (${calculateAge(m.dateOfBirth)} yrs)
   - Location: ${m.locationCity || 'N/A'}, ${m.locationState || 'N/A'}
   - Education: ${m.education || 'N/A'}
   - Occupation: ${m.occupation || 'N/A'}
   - Religion: ${m.religion || 'N/A'}
   - Caste: ${m.caste || 'N/A'}
   - Match Score: ${m.matchScore || 'N/A'}%
`).join('\n')}

Instructions:
1. Be friendly, helpful, and culturally sensitive
2. Provide personalized matchmaking advice
3. Consider both traditional and modern compatibility factors
4. Suggest specific profiles from the available matches if relevant
5. Give practical tips for profile improvement
6. Answer questions about Indian marriage traditions
7. Be encouraging but honest about compatibility
8. Keep responses concise (under 300 words)
9. Use Hinglish (Hindi + English) when appropriate for warmth
10. Always prioritize user's happiness and compatibility`;

    // Call Groq API
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile', // Free model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userQuery },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      // Fallback response if API fails
      return getFallbackResponse(userQuery, user.profile);
    }

    const data = await response.json();
    const aiMessage = data.choices?.[0]?.message?.content || getFallbackResponse(userQuery, user.profile).message;

    return {
      message: aiMessage,
      recommendations: potentialMatches.slice(0, 3).map((m) => ({
        profileId: m.id,
        reason: `Good compatibility based on your preferences`,
        compatibilityNotes: `${m.name} matches your criteria for ${m.education || 'education'} and ${m.locationCity || 'location'}`,
      })),
    };
  } catch (error) {
    console.error('AI Matchmaking error:', error);
    return {
      message: 'I\'m having trouble connecting right now. Please try again in a moment. Meanwhile, you can browse profiles in the Search section!',
    };
  }
}

async function getTopMatches(userId: string, limit: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user?.profile) return [];

  const oppositeGender = user.profile.gender === 'male' ? 'female' : 'male';

  const matches = await prisma.profile.findMany({
    where: {
      gender: oppositeGender,
      userId: { not: userId },
    },
    include: {
      photos: { where: { isPrimary: true }, take: 1 },
    },
    take: limit * 2, // Get more to filter
  });

  // Simple scoring
  return matches
    .map((m) => ({
      ...m,
      matchScore: calculateSimpleScore(user.profile, m),
    }))
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
}

function calculateSimpleScore(userProfile: any, otherProfile: any): number {
  let score = 50;

  // Same religion bonus
  if (userProfile.religion && userProfile.religion === otherProfile.religion) {
    score += 15;
  }

  // Same caste bonus
  if (userProfile.caste && userProfile.caste === otherProfile.caste) {
    score += 10;
  }

  // Same state bonus
  if (userProfile.locationState && userProfile.locationState === otherProfile.locationState) {
    score += 10;
  }

  // Has photo bonus
  if (otherProfile.photos?.length > 0) {
    score += 5;
  }

  // Verified bonus
  if (otherProfile.isVerified) {
    score += 5;
  }

  return Math.min(100, score);
}

function getFallbackResponse(query: string, profile: any): AIResponse {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('match') || lowerQuery.includes('find')) {
    return {
      message: `Namaste ${profile.name || 'there'}! 💫 

Based on your profile, I recommend:
1. Complete your profile with more details and photos
2. Be clear about your partner preferences
3. Use the Search feature to find matches

Pro tip: Profiles with photos get 10x more responses!

Shall I help you with anything specific about your search?`,
    };
  }

  if (lowerQuery.includes('profile') || lowerQuery.includes('improve')) {
    return {
      message: `Here are my tips to improve your profile:

✨ Add a clear, recent photo
✨ Write a genuine 'About Me' section  
✨ Fill in family details
✨ Add your horoscope details for better matching
✨ Be specific about partner preferences

A complete profile gets 3x more responses! Would you like help with any specific section?`,
    };
  }

  if (lowerQuery.includes('horoscope') || lowerQuery.includes('kundali')) {
    return {
      message: `Kundali Milan (Horoscope Matching) is an important part of Indian marriages!

The 36-gun matching system checks:
• Varna (spiritual compatibility)
• Vashya (mutual attraction)  
• Tara (health & well-being)
• Yoni (physical compatibility)
• Graha Maitri (mental connection)
• Gana (temperament)
• Bhakoot (prosperity)
• Nadi (genetic compatibility)

18+ guns is considered acceptable, 27+ is excellent!

Fill in your horoscope details in your profile for automatic matching.`,
    };
  }

  return {
    message: `Namaste! I'm Vivah Mitra, your matchmaking assistant. 🙏

I can help you with:
• Finding compatible matches
• Profile improvement tips
• Understanding horoscope matching
• Indian marriage traditions
• Relationship advice

What would you like to know?`,
  };
}

function calculateAge(dob: Date): number {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export { calculateAge };