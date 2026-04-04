import { FastifyInstance } from 'fastify';
import { calculateMatchScore, getSmartMatches, getHoroscopeCompatibility } from '../services/matchingService';

export async function matchingRoutes(fastify: FastifyInstance): Promise<void> {
  // Get smart matches (daily recommendations)
  fastify.get('/smart-matches', {
    preHandler: fastify.authenticate,
    handler: async (request: any, reply) => {
      try {
        const userId = request.user.id;
        const limit = parseInt(request.query.limit as string) || 10;

        const matches = await getSmartMatches(userId, limit);

        return reply.status(200).send({
          success: true,
          data: {
            matches,
            count: matches.length,
          },
        });
      } catch (error) {
        console.error('Get smart matches error:', error);
        return reply.status(500).send({
          success: false,
          error: { message: 'Failed to get smart matches' },
        });
      }
    },
  });

  // Get match score with a specific user
  fastify.get('/score/:userId', {
    preHandler: fastify.authenticate,
    handler: async (request: any, reply) => {
      try {
        const currentUserId = request.user.id;
        const otherUserId = request.params.userId;

        if (!otherUserId) {
          return reply.status(400).send({
            success: false,
            error: { message: 'User ID is required' },
          });
        }

        const matchResult = await calculateMatchScore(currentUserId, otherUserId);

        return reply.status(200).send({
          success: true,
          data: matchResult,
        });
      } catch (error) {
        console.error('Get match score error:', error);
        return reply.status(500).send({
          success: false,
          error: { message: 'Failed to calculate match score' },
        });
      }
    },
  });

  // Get detailed horoscope compatibility
  fastify.get('/horoscope/:userId', {
    preHandler: fastify.authenticate,
    handler: async (request: any, reply) => {
      try {
        const currentUserId = request.user.id;
        const otherUserId = request.params.userId;

        if (!otherUserId) {
          return reply.status(400).send({
            success: false,
            error: { message: 'User ID is required' },
          });
        }

        const horoscopeResult = await getHoroscopeCompatibility(currentUserId, otherUserId);

        return reply.status(200).send({
          success: true,
          data: horoscopeResult,
        });
      } catch (error) {
        console.error('Get horoscope compatibility error:', error);
        return reply.status(500).send({
          success: false,
          error: { message: 'Failed to calculate horoscope compatibility' },
        });
      }
    },
  });

  // Get mutual match score (both directions)
  fastify.get('/mutual/:userId', {
    preHandler: fastify.authenticate,
    handler: async (request: any, reply) => {
      try {
        const currentUserId = request.user.id;
        const otherUserId = request.params.userId;

        if (!otherUserId) {
          return reply.status(400).send({
            success: false,
            error: { message: 'User ID is required' },
          });
        }

        // Calculate scores from both perspectives
        const [myScore, theirScore] = await Promise.all([
          calculateMatchScore(currentUserId, otherUserId),
          calculateMatchScore(otherUserId, currentUserId),
        ]);

        // Average score
        const mutualScore = Math.round((myScore.overallScore + theirScore.overallScore) / 2);

        return reply.status(200).send({
          success: true,
          data: {
            mutualScore,
            myPerspective: myScore,
            theirPerspective: theirScore,
            isMutuallyCompatible: myScore.isCompatible && theirScore.isCompatible,
          },
        });
      } catch (error) {
        console.error('Get mutual match score error:', error);
        return reply.status(500).send({
          success: false,
          error: { message: 'Failed to calculate mutual match score' },
        });
      }
    },
  });
}