import { FastifyInstance } from 'fastify';

export async function messageRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/conversations', async (request, reply) => {
    await reply.send({
      success: true,
      data: {
        conversations: [],
      },
    });
  });

  fastify.get('/:matchId', async (request, reply) => {
    const { matchId } = request.params as { matchId: string };

    await reply.send({
      success: true,
      data: {
        matchId,
        messages: [],
      },
    });
  });

  fastify.post('/send', async (request, reply) => {
    const body = request.body as { matchId: string; content: string };

    await reply.send({
      success: true,
      data: {
        message: {
          id: 'message_id',
          matchId: body.matchId,
          content: body.content,
          createdAt: new Date().toISOString(),
        },
      },
    });
  });

  fastify.post('/mark-read/:matchId', async (request, reply) => {
    await reply.send({
      success: true,
      data: {
        message: 'Messages marked as read',
      },
    });
  });

  fastify.get('/templates', async (request, reply) => {
    await reply.send({
      success: true,
      data: {
        templates: [
          { id: 'template_1', text: 'Hi! I liked your profile and would like to know more about you.' },
          { id: 'template_2', text: 'Hello! We have similar interests. Would love to connect!' },
        ],
      },
    });
  });
}