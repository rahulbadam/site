import { FastifyInstance } from 'fastify';

export async function subscriptionRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/plans', async (request, reply) => {
    await reply.send({
      success: true,
      data: {
        plans: [
          {
            id: 'premium_1m',
            name: 'Premium 1 Month',
            price: 999,
            currency: 'INR',
            duration: '1 month',
            features: ['unlimited_messaging', 'view_phone_numbers', 'advanced_filters'],
          },
          {
            id: 'premium_3m',
            name: 'Premium 3 Months',
            price: 2499,
            currency: 'INR',
            duration: '3 months',
            features: ['unlimited_messaging', 'view_phone_numbers', 'advanced_filters', 'profile_boost'],
          },
          {
            id: 'premium_12m',
            name: 'Premium 12 Months',
            price: 6999,
            currency: 'INR',
            duration: '12 months',
            features: [
              'unlimited_messaging',
              'view_phone_numbers',
              'advanced_filters',
              'profile_boost',
              'featured_listing',
              'analytics',
            ],
          },
        ],
      },
    });
  });

  fastify.get('/me', async (request, reply) => {
    await reply.send({
      success: true,
      data: {
        subscription: {
          planType: 'free',
          status: 'active',
          features: [],
        },
      },
    });
  });

  fastify.post('/create-order', async (request, reply) => {
    const body = request.body as { planId: string };

    await reply.send({
      success: true,
      data: {
        orderId: 'order_id',
        amount: 99900,
        currency: 'INR',
        key: 'razorpay_key',
      },
    });
  });

  fastify.post('/verify', async (request, reply) => {
    await reply.send({
      success: true,
      data: {
        message: 'Subscription activated successfully',
        subscription: {
          planType: 'premium_1m',
          status: 'active',
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        },
      },
    });
  });
}