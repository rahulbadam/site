import { FastifyInstance } from 'fastify';

export async function adminRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/dashboard', async (request, reply) => {
    await reply.send({
      success: true,
      data: {
        stats: {
          totalUsers: 0,
          activeUsers: 0,
          pendingVerifications: 0,
          openReports: 0,
          revenue: {
            today: 0,
            thisMonth: 0,
          },
        },
      },
    });
  });

  fastify.get('/reports', async (request, reply) => {
    await reply.send({
      success: true,
      data: {
        reports: [],
      },
    });
  });

  fastify.post('/reports/:reportId/resolve', async (request, reply) => {
    const { reportId } = request.params as { reportId: string };
    const body = request.body as { action: string; notes?: string };

    await reply.send({
      success: true,
      data: {
        report: {
          id: reportId,
          status: 'resolved',
        },
      },
    });
  });

  fastify.get('/verifications', async (request, reply) => {
    await reply.send({
      success: true,
      data: {
        verifications: [],
      },
    });
  });

  fastify.post('/verifications/:verificationId/approve', async (request, reply) => {
    await reply.send({
      success: true,
      data: {
        message: 'Verification approved',
      },
    });
  });

  fastify.post('/verifications/:verificationId/reject', async (request, reply) => {
    const body = request.body as { reason: string };

    await reply.send({
      success: true,
      data: {
        message: 'Verification rejected',
      },
    });
  });

  fastify.get('/users', async (request, reply) => {
    await reply.send({
      success: true,
      data: {
        users: [],
      },
    });
  });

  fastify.post('/users/:userId/ban', async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const body = request.body as { reason: string };

    await reply.send({
      success: true,
      data: {
        message: 'User banned successfully',
      },
    });
  });

  fastify.post('/users/:userId/unban', async (request, reply) => {
    await reply.send({
      success: true,
      data: {
        message: 'User unbanned successfully',
      },
    });
  });
}