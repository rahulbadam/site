import { FastifyInstance } from 'fastify';

export async function searchRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/', async (request, reply) => {
    const query = request.query as {
      page?: string;
      limit?: string;
      ageMin?: string;
      ageMax?: string;
    };

    await reply.send({
      success: true,
      data: {
        results: [
          {
            profileId: 'profile_1',
            name: 'User One',
            age: 28,
            locationCity: 'Mumbai',
            primaryPhoto: 'https://cdn.example.com/photo1.jpg',
            compatibilityScore: 85,
          },
          {
            profileId: 'profile_2',
            name: 'User Two',
            age: 26,
            locationCity: 'Delhi',
            primaryPhoto: 'https://cdn.example.com/photo2.jpg',
            compatibilityScore: 78,
          },
        ],
        pagination: {
          page: parseInt(query.page || '1', 10),
          limit: parseInt(query.limit || '10', 10),
          total: 100,
          totalPages: 10,
        },
      },
    });
  });

  fastify.get('/recommendations', async (request, reply) => {
    await reply.send({
      success: true,
      data: {
        results: [
          {
            profileId: 'rec_1',
            name: 'Recommended User',
            age: 27,
            locationCity: 'Bangalore',
            primaryPhoto: 'https://cdn.example.com/rec1.jpg',
            compatibilityScore: 92,
          },
        ],
      },
    });
  });

  fastify.get('/nearby', async (request, reply) => {
    await reply.send({
      success: true,
      data: {
        results: [],
        message: 'Nearby profiles retrieved',
      },
    });
  });
}