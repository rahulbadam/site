import { FastifyInstance } from 'fastify';

export async function interestRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post('/send', async (request, reply) => {
    const body = request.body as { receiverId: string; message?: string };

    await reply.send({
      success: true,
      data: {
        interest: {
          id: 'interest_id',
          senderId: 'current_user',
          receiverId: body.receiverId,
          status: 'pending',
        },
      },
    });
  });

  fastify.post('/:interestId/accept', async (request, reply) => {
    const { interestId } = request.params as { interestId: string };

    await reply.send({
      success: true,
      data: {
        interest: {
          id: interestId,
          status: 'accepted',
        },
        match: {
          id: 'match_id',
          createdAt: new Date().toISOString(),
        },
      },
    });
  });

  fastify.post('/:interestId/decline', async (request, reply) => {
    const { interestId } = request.params as { interestId: string };

    await reply.send({
      success: true,
      data: {
        interest: {
          id: interestId,
          status: 'declined',
        },
      },
    });
  });

  fastify.get('/sent', async (request, reply) => {
    await reply.send({
      success: true,
      data: {
        interests: [],
      },
    });
  });

  fastify.get('/received', async (request, reply) => {
    await reply.send({
      success: true,
      data: {
        interests: [],
      },
    });
  });
}