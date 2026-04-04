import { FastifyInstance } from 'fastify';
import { getAIMatchmakingAdvice } from '../services/aiMatchmaker.js';

export async function aiRoutes(fastify: FastifyInstance): Promise<void> {
  // Chat with AI Matchmaker
  fastify.post('/chat', {
    preHandler: fastify.authenticate,
    handler: async (request: any, reply) => {
      try {
        const userId = request.user.id;
        const { message } = request.body;

        if (!message || typeof message !== 'string') {
          return reply.status(400).send({
            success: false,
            error: { message: 'Message is required' },
          });
        }

        const response = await getAIMatchmakingAdvice(userId, message);

        return reply.status(200).send({
          success: true,
          data: response,
        });
      } catch (error) {
        console.error('AI chat error:', error);
        return reply.status(500).send({
          success: false,
          error: { message: 'Failed to get AI response' },
        });
      }
    },
  });

  // Get quick suggestions
  fastify.get('/suggestions', {
    preHandler: fastify.authenticate,
    handler: async (request: any, reply) => {
      try {
        const suggestions = [
          { id: '1', text: 'Find me the best matches', icon: 'search' },
          { id: '2', text: 'How can I improve my profile?', icon: 'edit' },
          { id: '3', text: 'Explain Kundali Milan', icon: 'star' },
          { id: '4', text: 'What should I write in About Me?', icon: 'pen' },
          { id: '5', text: 'Tips for first conversation', icon: 'message' },
          { id: '6', text: 'How to handle family introductions?', icon: 'users' },
        ];

        return reply.status(200).send({
          success: true,
          data: { suggestions },
        });
      } catch (error) {
        console.error('Get suggestions error:', error);
        return reply.status(500).send({
          success: false,
          error: { message: 'Failed to get suggestions' },
        });
      }
    },
  });
}