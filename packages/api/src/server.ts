import 'dotenv/config';
import { createServer } from 'http';

import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import jwt from '@fastify/jwt';
import Fastify from 'fastify';
import { initializeSocketIO } from './socket.js';

import { authRoutes } from './routes/auth.js';
import { profileRoutes } from './routes/profiles.js';
import { searchRoutes } from './routes/search.js';
import { interestRoutes } from './routes/interests.js';
import { messageRoutes } from './routes/messages.js';
import { subscriptionRoutes } from './routes/subscriptions.js';
import { adminRoutes } from './routes/admin.js';
import { matchingRoutes } from './routes/matching.js';
import { aiRoutes } from './routes/ai.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { requestLogger } from './middleware/requestLogger.js';

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport:
      process.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
  },
});

// Create HTTP server for Socket.io
const httpServer = createServer(fastify.server);

// Initialize Socket.io
const io = initializeSocketIO(httpServer);

async function buildServer() {
  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        scriptSrc: ["'self'"],
      },
    },
  });

  await fastify.register(cors, {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  });

  await fastify.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'VivahBandhan API',
        description: 'Production-ready Indian matrimonial platform API',
        version: '1.0.0',
      },
      servers: [
        { url: 'http://localhost:4000', description: 'Development server' },
        { url: 'https://api.vivahbandhan.com', description: 'Production server' },
      ],
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  });

  await fastify.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  });

  await fastify.register(rateLimiter);

  fastify.addHook('onRequest', requestLogger);

  fastify.setErrorHandler(errorHandler);

  await fastify.register(authRoutes, { prefix: '/api/v1/auth' });
  await fastify.register(profileRoutes, { prefix: '/api/v1/profiles' });
  await fastify.register(searchRoutes, { prefix: '/api/v1/search' });
  await fastify.register(interestRoutes, { prefix: '/api/v1/interests' });
  await fastify.register(messageRoutes, { prefix: '/api/v1/messages' });
  await fastify.register(subscriptionRoutes, { prefix: '/api/v1/subscriptions' });
  await fastify.register(adminRoutes, { prefix: '/api/v1/admin' });
  await fastify.register(matchingRoutes, { prefix: '/api/v1/matching' });
  await fastify.register(aiRoutes, { prefix: '/api/v1/ai' });

  fastify.get('/health', async () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }));

  return fastify;
}

async function start() {
  try {
    const app = await buildServer();
    const port = parseInt(process.env.PORT || '4000', 10);
    const host = process.env.HOST || '0.0.0.0';

    // Use HTTP server with Socket.io instead of Fastify's listen
    httpServer.listen(port, host, () => {
      app.log.info(`Server running at http://${host}:${port}`);
      app.log.info(`API Documentation available at http://${host}:${port}/documentation`);
      app.log.info(`Socket.io enabled for real-time chat`);
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
