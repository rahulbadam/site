import { FastifyInstance } from 'fastify';

export async function profileRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/me', async (request, reply) => {
    await reply.send({
      success: true,
      data: {
        profile: {
          id: 'profile_id',
          userId: 'user_id',
          name: 'John Doe',
          age: 28,
          gender: 'male',
          locationCity: 'Mumbai',
          profileCompletionPercentage: 75,
        },
      },
    });
  });

  fastify.get('/:profileId', async (request, reply) => {
    const { profileId } = request.params as { profileId: string };

    await reply.send({
      success: true,
      data: {
        profile: {
          id: profileId,
          name: 'Jane Doe',
          age: 26,
          gender: 'female',
          locationCity: 'Delhi',
        },
      },
    });
  });

  fastify.put('/me', async (request, reply) => {
    await reply.send({
      success: true,
      data: {
        message: 'Profile updated successfully',
      },
    });
  });

  fastify.post('/me/photos', async (request, reply) => {
    await reply.send({
      success: true,
      data: {
        photo: {
          id: 'photo_id',
          cdnUrl: 'https://cdn.example.com/photo.jpg',
          isPrimary: true,
        },
      },
    });
  });

  fastify.delete('/me/photos/:photoId', async (request, reply) => {
    await reply.send({
      success: true,
      data: {
        message: 'Photo deleted successfully',
      },
    });
  });

  fastify.get('/me/preferences', async (request, reply) => {
    await reply.send({
      success: true,
      data: {
        preferences: {
          preferredAgeMin: 25,
          preferredAgeMax: 32,
          preferredReligions: ['Hindu'],
          preferredLocations: ['Mumbai', 'Delhi'],
        },
      },
    });
  });

  fastify.put('/me/preferences', async (request, reply) => {
    await reply.send({
      success: true,
      data: {
        message: 'Preferences updated successfully',
      },
    });
  });
}