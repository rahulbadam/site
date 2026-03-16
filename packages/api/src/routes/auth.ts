import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import * as argon2 from 'argon2';

import { HTTP_STATUS, ERROR_CODES } from '@vivahbandhan/shared';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  gender: z.enum(['male', 'female', 'other']),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date of birth',
  }),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const otpSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
});

const verifyOtpSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post('/register', async (request, reply) => {
    try {
      const body = registerSchema.parse(request.body);

      fastify.log.info({ email: body.email }, 'User registration attempt');

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: body.email },
      });

      if (existingUser) {
        return reply.status(HTTP_STATUS.CONFLICT).send({
          success: false,
          error: {
            code: ERROR_CODES.CONFLICT,
            message: 'An account with this email already exists',
          },
        });
      }

      // Hash password
      const passwordHash = await argon2.hash(body.password);

      // Create user and profile in a transaction
      const user = await prisma.user.create({
        data: {
          email: body.email,
          passwordHash,
          profile: {
            create: {
              name: body.name,
              gender: body.gender,
              dateOfBirth: new Date(body.dateOfBirth),
            },
          },
        },
        include: {
          profile: true,
        },
      });

      return reply.status(HTTP_STATUS.CREATED).send({
        success: true,
        data: {
          userId: user.id,
          email: user.email,
          message: 'Registration successful. Please verify your email.',
        },
      });
    } catch (error) {
      fastify.log.error(error, 'Registration error');
      return reply.status(HTTP_STATUS.BAD_REQUEST).send({
        success: false,
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: error instanceof Error ? error.message : 'Registration failed',
        },
      });
    }
  });

  fastify.post('/login', async (request, reply) => {
    try {
      const body = loginSchema.parse(request.body);

      fastify.log.info({ email: body.email }, 'User login attempt');

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: body.email },
        include: { profile: true },
      });

      if (!user) {
        return reply.status(HTTP_STATUS.UNAUTHORIZED).send({
          success: false,
          error: {
            code: ERROR_CODES.UNAUTHORIZED,
            message: 'Invalid email or password',
          },
        });
      }

      // Verify password
      const isValidPassword = await argon2.verify(user.passwordHash, body.password);
      if (!isValidPassword) {
        return reply.status(HTTP_STATUS.UNAUTHORIZED).send({
          success: false,
          error: {
            code: ERROR_CODES.UNAUTHORIZED,
            message: 'Invalid email or password',
          },
        });
      }

      // Check if user is banned
      if (user.isBanned) {
        return reply.status(HTTP_STATUS.FORBIDDEN).send({
          success: false,
          error: {
            code: ERROR_CODES.FORBIDDEN,
            message: 'Your account has been banned',
          },
        });
      }

      // Generate tokens (using fastify-jwt)
      const accessToken = (fastify as any).jwt.sign(
        { userId: user.id, email: user.email },
        { expiresIn: '24h' }
      );
      const refreshToken = (fastify as any).jwt.sign(
        { userId: user.id, type: 'refresh' },
        { expiresIn: '7d' }
      );

      return reply.send({
        success: true,
        data: {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
            name: user.profile?.name,
          },
        },
      });
    } catch (error) {
      fastify.log.error(error, 'Login error');
      return reply.status(HTTP_STATUS.BAD_REQUEST).send({
        success: false,
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: error instanceof Error ? error.message : 'Login failed',
        },
      });
    }
  });

  fastify.post('/send-otp', async (request, reply) => {
    try {
      const body = otpSchema.parse(request.body);
      fastify.log.info({ phone: body.phone }, 'OTP sent');

      // TODO: Integrate with actual SMS provider (Twilio)
      return reply.send({
        success: true,
        data: {
          message: 'OTP sent successfully',
        },
      });
    } catch (error) {
      return reply.status(HTTP_STATUS.BAD_REQUEST).send({
        success: false,
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: error instanceof Error ? error.message : 'Failed to send OTP',
        },
      });
    }
  });

  fastify.post('/verify-otp', async (request, reply) => {
    try {
      const body = verifyOtpSchema.parse(request.body);

      // TODO: Verify OTP with SMS provider
      // For development, accept 123456
      if (body.otp !== '123456') {
        return reply.status(HTTP_STATUS.BAD_REQUEST).send({
          success: false,
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: 'Invalid OTP',
          },
        });
      }

      return reply.send({
        success: true,
        data: {
          verified: true,
          message: 'Phone number verified successfully',
        },
      });
    } catch (error) {
      return reply.status(HTTP_STATUS.BAD_REQUEST).send({
        success: false,
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: error instanceof Error ? error.message : 'OTP verification failed',
        },
      });
    }
  });

  fastify.post('/refresh', async (request, reply) => {
    try {
      const { refreshToken } = request.body as { refreshToken: string };

      // Verify refresh token
      const decoded = (fastify as any).jwt.verify(refreshToken) as { userId: string; type: string };
      
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      // Find user
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Generate new tokens
      const newAccessToken = (fastify as any).jwt.sign(
        { userId: user.id, email: user.email },
        { expiresIn: '24h' }
      );
      const newRefreshToken = (fastify as any).jwt.sign(
        { userId: user.id, type: 'refresh' },
        { expiresIn: '7d' }
      );

      return reply.send({
        success: true,
        data: {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (error) {
      return reply.status(HTTP_STATUS.UNAUTHORIZED).send({
        success: false,
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Invalid or expired refresh token',
        },
      });
    }
  });

  fastify.get('/me', async (request, reply) => {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(HTTP_STATUS.UNAUTHORIZED).send({
          success: false,
          error: {
            code: ERROR_CODES.UNAUTHORIZED,
            message: 'No token provided',
          },
        });
      }

      const token = authHeader.substring(7);
      const decoded = (fastify as any).jwt.verify(token) as { userId: string };

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        include: { profile: true },
      });

      if (!user) {
        return reply.status(HTTP_STATUS.NOT_FOUND).send({
          success: false,
          error: {
            code: ERROR_CODES.NOT_FOUND,
            message: 'User not found',
          },
        });
      }

      return reply.send({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.profile?.name,
          profile: user.profile,
        },
      });
    } catch (error) {
      return reply.status(HTTP_STATUS.UNAUTHORIZED).send({
        success: false,
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Invalid or expired token',
        },
      });
    }
  });

  fastify.post('/logout', async (request, reply) => {
    return reply.send({
      success: true,
      data: {
        message: 'Logged out successfully',
      },
    });
  });
}