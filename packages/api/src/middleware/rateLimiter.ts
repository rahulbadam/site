import rateLimit from '@fastify/rate-limit';
import fp from 'fastify-plugin';

import { RATE_LIMITS } from '@vivahbandhan/shared';

export const rateLimiter = fp(async (fastify) => {
  await fastify.register(rateLimit, {
    max: RATE_LIMITS.DEFAULT.max,
    timeWindow: RATE_LIMITS.DEFAULT.windowMs,
    cache: 10000,
    allowList: ['127.0.0.1'],
    skipOnError: true,
    keyGenerator: (request) => {
      return request.ip;
    },
  });
});