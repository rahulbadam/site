import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { HTTP_STATUS, ERROR_CODES } from '@vivahbandhan/shared';

const prisma = new PrismaClient();

// Helper function to log admin actions
async function logAdminAction(
  adminId: string,
  action: string,
  targetType: string,
  targetId: string | null,
  details: any,
  ipAddress: string | undefined,
  userAgent: string | undefined
) {
  try {
    await prisma.adminLog.create({
      data: {
        adminId,
        action,
        targetType,
        targetId,
        details,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error('Failed to log admin action:', error);
  }
}

// Admin authentication middleware
async function verifyAdmin(request: any, reply: any, fastify: FastifyInstance) {
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
  
  try {
    const decoded = (fastify as any).jwt.verify(token) as { userId: string; email: string };
    
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

    // Check if user is admin using the role field
    if (user.role !== 'admin') {
      return reply.status(HTTP_STATUS.FORBIDDEN).send({
        success: false,
        error: {
          code: ERROR_CODES.FORBIDDEN,
          message: 'Admin access required',
        },
      });
    }

    request.user = user;
    return null;
  } catch (error) {
    return reply.status(HTTP_STATUS.UNAUTHORIZED).send({
      success: false,
      error: {
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Invalid or expired token',
      },
    });
  }
}

export async function adminRoutes(fastify: FastifyInstance): Promise<void> {
  // Dashboard Stats
  fastify.get('/dashboard', async (request, reply) => {
    const authError = await verifyAdmin(request, reply, fastify);
    if (authError) return authError;

    try {
      // Get total users count
      const totalUsers = await prisma.user.count();
      
      // Get active users (not banned and active)
      const activeUsers = await prisma.user.count({
        where: {
          isActive: true,
          isBanned: false,
        },
      });

      // Get pending verifications count
      const pendingVerifications = await prisma.verification.count({
        where: {
          status: 'pending',
        },
      });

      // Get open reports count
      const openReports = await prisma.report.count({
        where: {
          status: 'pending',
        },
      });

      // Get revenue stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Count new subscriptions for revenue
      const todaySubscriptions = await prisma.subscription.count({
        where: {
          startedAt: {
            gte: today,
          },
        },
      });

      const monthlySubscriptions = await prisma.subscription.count({
        where: {
          startedAt: {
            gte: startOfMonth,
          },
        },
      });

      // Calculate actual revenue from subscriptions
      const todayRevenueResult = await prisma.subscription.aggregate({
        where: {
          startedAt: {
            gte: today,
          },
        },
        _sum: {
          amount: true,
        },
      });

      const monthlyRevenueResult = await prisma.subscription.aggregate({
        where: {
          startedAt: {
            gte: startOfMonth,
          },
        },
        _sum: {
          amount: true,
        },
      });

      const revenueToday = todayRevenueResult._sum.amount || 0;
      const revenueThisMonth = monthlyRevenueResult._sum.amount || 0;

      // Get analytics data - user growth last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const usersLast30Days = await prisma.user.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
        _count: true,
      });

      // Simplified analytics - count by day
      const dailyUserCounts: { date: string; count: number }[] = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);
        
        const count = await prisma.user.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate,
            },
          },
        });
        
        dailyUserCounts.push({
          date: date.toISOString().split('T')[0],
          count,
        });
      }

      await reply.send({
        success: true,
        data: {
          stats: {
            totalUsers,
            activeUsers,
            pendingVerifications,
            openReports,
            revenue: {
              today: revenueToday,
              thisMonth: revenueThisMonth,
            },
          },
          analytics: {
            userGrowth: dailyUserCounts,
          },
        },
      });
    } catch (error) {
      fastify.log.error(error, 'Failed to fetch dashboard stats');
      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'Failed to fetch dashboard stats',
        },
      });
    }
  });

  // Get All Users with Pagination and Filters
  fastify.get('/users', async (request, reply) => {
    const authError = await verifyAdmin(request, reply, fastify);
    if (authError) return authError;

    const query = request.query as {
      page?: string;
      limit?: string;
      search?: string;
      status?: string;
      role?: string;
      startDate?: string;
      endDate?: string;
    };

    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '20', 10);
    const skip = (page - 1) * limit;

    try {
      const where: any = {};

      // Search filter
      if (query.search) {
        where.OR = [
          { email: { contains: query.search, mode: 'insensitive' } },
          { profile: { name: { contains: query.search, mode: 'insensitive' } } },
        ];
      }

      // Status filter
      if (query.status === 'active') {
        where.isActive = true;
        where.isBanned = false;
      } else if (query.status === 'banned') {
        where.isBanned = true;
      } else if (query.status === 'pending') {
        where.isActive = false;
        where.isBanned = false;
      }

      // Role filter
      if (query.role) {
        where.role = query.role;
      }

      // Date range filter
      if (query.startDate || query.endDate) {
        where.createdAt = {};
        if (query.startDate) {
          where.createdAt.gte = new Date(query.startDate);
        }
        if (query.endDate) {
          const end = new Date(query.endDate);
          end.setHours(23, 59, 59, 999);
          where.createdAt.lte = end;
        }
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          include: {
            profile: {
              include: {
                photos: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take: limit,
        }),
        prisma.user.count({ where }),
      ]);

      const formattedUsers = users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.profile?.name || 'Unknown',
        status: user.isBanned ? 'banned' : user.isActive ? 'active' : 'pending',
        role: user.role,
        createdAt: user.createdAt.toISOString(),
        lastActive: user.profile?.lastActiveAt?.toISOString(),
        profileViews: user.profile?.profileViewsCount || 0,
        profileCompletion: user.profile?.profileCompletionPercentage || 0,
        isVerified: user.profile?.isVerified || false,
        primaryPhoto: user.profile?.photos?.find((p) => p.isPrimary)?.cdnUrl || 
          user.profile?.photos?.[0]?.cdnUrl || null,
      }));

      await reply.send({
        success: true,
        data: {
          users: formattedUsers,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      fastify.log.error(error, 'Failed to fetch users');
      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'Failed to fetch users',
        },
      });
    }
  });

  // Get User Details
  fastify.get('/users/:userId', async (request, reply) => {
    const authError = await verifyAdmin(request, reply, fastify);
    if (authError) return authError;

    const { userId } = request.params as { userId: string };

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          profile: {
            include: {
              photos: true,
            },
          },
          preferences: true,
          verifications: true,
          subscriptions: {
            orderBy: { createdAt: 'desc' },
            take: 5,
          },
          reportsMade: {
            take: 5,
            orderBy: { createdAt: 'desc' },
          },
          reportsAgainst: {
            take: 5,
            orderBy: { createdAt: 'desc' },
          },
          interestsSent: {
            take: 10,
            orderBy: { createdAt: 'desc' },
          },
          interestsRecv: {
            take: 10,
            orderBy: { createdAt: 'desc' },
          },
        },
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

      await reply.send({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            phone: user.phone,
            role: user.role,
            emailVerified: user.emailVerified,
            phoneVerified: user.phoneVerified,
            isActive: user.isActive,
            isBanned: user.isBanned,
            bannedAt: user.bannedAt?.toISOString(),
            bannedReason: user.bannedReason,
            fraudScore: user.fraudScore,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
          },
          profile: user.profile,
          preferences: user.preferences,
          verifications: user.verifications.map((v) => ({
            id: v.id,
            type: v.verificationType,
            status: v.status,
            documentType: v.documentType,
            createdAt: v.createdAt.toISOString(),
            verifiedAt: v.verifiedAt?.toISOString(),
          })),
          subscriptions: user.subscriptions.map((s) => ({
            id: s.id,
            planType: s.planType,
            amount: s.amount,
            status: s.status,
            startedAt: s.startedAt.toISOString(),
            expiresAt: s.expiresAt?.toISOString(),
          })),
          reportsMade: user.reportsMade,
          reportsAgainst: user.reportsAgainst,
          interestsSent: user.interestsSent.length,
          interestsReceived: user.interestsRecv.length,
        },
      });
    } catch (error) {
      fastify.log.error(error, 'Failed to fetch user details');
      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'Failed to fetch user details',
        },
      });
    }
  });

  // Ban User
  fastify.post('/users/:userId/ban', async (request, reply) => {
    const authError = await verifyAdmin(request, reply, fastify);
    if (authError) return authError;

    const { userId } = request.params as { userId: string };
    const body = request.body as { reason: string };
    const adminUser = (request as any).user;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
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

      await prisma.user.update({
        where: { id: userId },
        data: {
          isBanned: true,
          bannedAt: new Date(),
          bannedReason: body.reason,
          isActive: false,
        },
      });

      // Log admin action
      await logAdminAction(
        adminUser.id,
        'ban_user',
        'user',
        userId,
        { reason: body.reason },
        request.ip,
        request.headers['user-agent']
      );

      await reply.send({
        success: true,
        data: {
          message: 'User banned successfully',
        },
      });
    } catch (error) {
      fastify.log.error(error, 'Failed to ban user');
      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'Failed to ban user',
        },
      });
    }
  });

  // Unban User
  fastify.post('/users/:userId/unban', async (request, reply) => {
    const authError = await verifyAdmin(request, reply, fastify);
    if (authError) return authError;

    const { userId } = request.params as { userId: string };
    const adminUser = (request as any).user;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
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

      await prisma.user.update({
        where: { id: userId },
        data: {
          isBanned: false,
          bannedAt: null,
          bannedReason: null,
          isActive: true,
        },
      });

      // Log admin action
      await logAdminAction(
        adminUser.id,
        'unban_user',
        'user',
        userId,
        {},
        request.ip,
        request.headers['user-agent']
      );

      await reply.send({
        success: true,
        data: {
          message: 'User unbanned successfully',
        },
      });
    } catch (error) {
      fastify.log.error(error, 'Failed to unban user');
      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'Failed to unban user',
        },
      });
    }
  });

  // Bulk Ban Users
  fastify.post('/users/bulk-ban', async (request, reply) => {
    const authError = await verifyAdmin(request, reply, fastify);
    if (authError) return authError;

    const body = request.body as { userIds: string[]; reason: string };
    const adminUser = (request as any).user;

    if (!body.userIds || body.userIds.length === 0) {
      return reply.status(HTTP_STATUS.BAD_REQUEST).send({
        success: false,
        error: {
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'No user IDs provided',
        },
      });
    }

    try {
      await prisma.user.updateMany({
        where: {
          id: { in: body.userIds },
        },
        data: {
          isBanned: true,
          bannedAt: new Date(),
          bannedReason: body.reason,
          isActive: false,
        },
      });

      // Log admin action
      await logAdminAction(
        adminUser.id,
        'bulk_ban_users',
        'user',
        null,
        { userIds: body.userIds, reason: body.reason, count: body.userIds.length },
        request.ip,
        request.headers['user-agent']
      );

      await reply.send({
        success: true,
        data: {
          message: `${body.userIds.length} users banned successfully`,
        },
      });
    } catch (error) {
      fastify.log.error(error, 'Failed to bulk ban users');
      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'Failed to bulk ban users',
        },
      });
    }
  });

  // Get All Reports with Pagination
  fastify.get('/reports', async (request, reply) => {
    const authError = await verifyAdmin(request, reply, fastify);
    if (authError) return authError;

    const query = request.query as {
      page?: string;
      limit?: string;
      search?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
    };

    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '20', 10);
    const skip = (page - 1) * limit;

    try {
      const where: any = {};

      // Search filter
      if (query.search) {
        where.OR = [
          { reportType: { contains: query.search, mode: 'insensitive' } },
          { description: { contains: query.search, mode: 'insensitive' } },
        ];
      }

      // Status filter
      if (query.status && query.status !== 'all') {
        where.status = query.status;
      }

      // Date range filter
      if (query.startDate || query.endDate) {
        where.createdAt = {};
        if (query.startDate) {
          where.createdAt.gte = new Date(query.startDate);
        }
        if (query.endDate) {
          const end = new Date(query.endDate);
          end.setHours(23, 59, 59, 999);
          where.createdAt.lte = end;
        }
      }

      const [reports, total] = await Promise.all([
        prisma.report.findMany({
          where,
          include: {
            reporter: {
              include: {
                profile: true,
              },
            },
            reported: {
              include: {
                profile: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take: limit,
        }),
        prisma.report.count({ where }),
      ]);

      const formattedReports = reports.map((report) => ({
        id: report.id,
        reporterId: report.reporterId,
        reporterName: report.reporter.profile?.name || 'Unknown',
        reporterEmail: report.reporter.email,
        reportedUserId: report.reportedUserId,
        reportedUserName: report.reported.profile?.name || 'Unknown',
        reportedUserEmail: report.reported.email,
        reason: report.reportType,
        description: report.description || '',
        status: report.status,
        adminNotes: report.adminNotes,
        createdAt: report.createdAt.toISOString(),
        resolvedAt: report.resolvedAt?.toISOString(),
      }));

      await reply.send({
        success: true,
        data: {
          reports: formattedReports,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      fastify.log.error(error, 'Failed to fetch reports');
      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'Failed to fetch reports',
        },
      });
    }
  });

  // Resolve Report
  fastify.post('/reports/:reportId/resolve', async (request, reply) => {
    const authError = await verifyAdmin(request, reply, fastify);
    if (authError) return authError;

    const { reportId } = request.params as { reportId: string };
    const body = request.body as { action: string; notes?: string };
    const adminUser = (request as any).user;

    try {
      const report = await prisma.report.findUnique({
        where: { id: reportId },
      });

      if (!report) {
        return reply.status(HTTP_STATUS.NOT_FOUND).send({
          success: false,
          error: {
            code: ERROR_CODES.NOT_FOUND,
            message: 'Report not found',
          },
        });
      }

      const updatedReport = await prisma.report.update({
        where: { id: reportId },
        data: {
          status: 'resolved',
          adminNotes: body.notes,
          resolvedBy: adminUser.id,
          resolvedAt: new Date(),
        },
      });

      // If action is 'banned', ban the reported user
      if (body.action === 'banned') {
        await prisma.user.update({
          where: { id: report.reportedUserId },
          data: {
            isBanned: true,
            bannedAt: new Date(),
            bannedReason: body.notes || 'Banned due to report violation',
          },
        });
      }

      // Log admin action
      await logAdminAction(
        adminUser.id,
        'resolve_report',
        'report',
        reportId,
        { action: body.action, notes: body.notes },
        request.ip,
        request.headers['user-agent']
      );

      await reply.send({
        success: true,
        data: {
          report: {
            id: updatedReport.id,
            status: updatedReport.status,
            action: body.action,
          },
        },
      });
    } catch (error) {
      fastify.log.error(error, 'Failed to resolve report');
      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'Failed to resolve report',
        },
      });
    }
  });

  // Get All Verifications with Pagination
  fastify.get('/verifications', async (request, reply) => {
    const authError = await verifyAdmin(request, reply, fastify);
    if (authError) return authError;

    const query = request.query as {
      page?: string;
      limit?: string;
      search?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
    };

    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '20', 10);
    const skip = (page - 1) * limit;

    try {
      const where: any = {};

      // Status filter
      if (query.status && query.status !== 'all') {
        where.status = query.status;
      }

      // Date range filter
      if (query.startDate || query.endDate) {
        where.createdAt = {};
        if (query.startDate) {
          where.createdAt.gte = new Date(query.startDate);
        }
        if (query.endDate) {
          const end = new Date(query.endDate);
          end.setHours(23, 59, 59, 999);
          where.createdAt.lte = end;
        }
      }

      const [verifications, total] = await Promise.all([
        prisma.verification.findMany({
          where,
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take: limit,
        }),
        prisma.verification.count({ where }),
      ]);

      let formattedVerifications = verifications.map((verification) => ({
        id: verification.id,
        userId: verification.userId,
        userName: verification.user.profile?.name || 'Unknown',
        userEmail: verification.user.email,
        documentType: verification.documentType || verification.verificationType,
        status: verification.status,
        submittedAt: verification.createdAt.toISOString(),
        verifiedAt: verification.verifiedAt?.toISOString(),
        rejectionReason: verification.rejectionReason,
        verificationData: verification.verificationData,
      }));

      // Search filter (after fetch for profile name search)
      if (query.search) {
        const search = query.search.toLowerCase();
        formattedVerifications = formattedVerifications.filter(
          (v) =>
            v.userName.toLowerCase().includes(search) ||
            v.userEmail.toLowerCase().includes(search)
        );
      }

      await reply.send({
        success: true,
        data: {
          verifications: formattedVerifications,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      fastify.log.error(error, 'Failed to fetch verifications');
      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'Failed to fetch verifications',
        },
      });
    }
  });

  // Approve Verification
  fastify.post('/verifications/:verificationId/approve', async (request, reply) => {
    const authError = await verifyAdmin(request, reply, fastify);
    if (authError) return authError;

    const { verificationId } = request.params as { verificationId: string };
    const adminUser = (request as any).user;

    try {
      const verification = await prisma.verification.findUnique({
        where: { id: verificationId },
      });

      if (!verification) {
        return reply.status(HTTP_STATUS.NOT_FOUND).send({
          success: false,
          error: {
            code: ERROR_CODES.NOT_FOUND,
            message: 'Verification not found',
          },
        });
      }

      await prisma.verification.update({
        where: { id: verificationId },
        data: {
          status: 'approved',
          verifiedBy: adminUser.id,
          verifiedAt: new Date(),
        },
      });

      await prisma.profile.update({
        where: { userId: verification.userId },
        data: {
          isVerified: true,
          verificationLevel: 1,
        },
      });

      // Log admin action
      await logAdminAction(
        adminUser.id,
        'approve_verification',
        'verification',
        verificationId,
        {},
        request.ip,
        request.headers['user-agent']
      );

      await reply.send({
        success: true,
        data: {
          message: 'Verification approved',
        },
      });
    } catch (error) {
      fastify.log.error(error, 'Failed to approve verification');
      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'Failed to approve verification',
        },
      });
    }
  });

  // Reject Verification
  fastify.post('/verifications/:verificationId/reject', async (request, reply) => {
    const authError = await verifyAdmin(request, reply, fastify);
    if (authError) return authError;

    const { verificationId } = request.params as { verificationId: string };
    const body = request.body as { reason: string };
    const adminUser = (request as any).user;

    try {
      const verification = await prisma.verification.findUnique({
        where: { id: verificationId },
      });

      if (!verification) {
        return reply.status(HTTP_STATUS.NOT_FOUND).send({
          success: false,
          error: {
            code: ERROR_CODES.NOT_FOUND,
            message: 'Verification not found',
          },
        });
      }

      await prisma.verification.update({
        where: { id: verificationId },
        data: {
          status: 'rejected',
          rejectionReason: body.reason,
        },
      });

      // Log admin action
      await logAdminAction(
        adminUser.id,
        'reject_verification',
        'verification',
        verificationId,
        { reason: body.reason },
        request.ip,
        request.headers['user-agent']
      );

      await reply.send({
        success: true,
        data: {
          message: 'Verification rejected',
        },
      });
    } catch (error) {
      fastify.log.error(error, 'Failed to reject verification');
      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'Failed to reject verification',
        },
      });
    }
  });

  // Get All Subscriptions with Pagination
  fastify.get('/subscriptions', async (request, reply) => {
    const authError = await verifyAdmin(request, reply, fastify);
    if (authError) return authError;

    const query = request.query as {
      page?: string;
      limit?: string;
      search?: string;
      status?: string;
      planType?: string;
      startDate?: string;
      endDate?: string;
    };

    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '20', 10);
    const skip = (page - 1) * limit;

    try {
      const where: any = {};

      // Status filter
      if (query.status && query.status !== 'all') {
        where.status = query.status;
      }

      // Plan type filter
      if (query.planType && query.planType !== 'all') {
        where.planType = query.planType;
      }

      // Date range filter
      if (query.startDate || query.endDate) {
        where.createdAt = {};
        if (query.startDate) {
          where.createdAt.gte = new Date(query.startDate);
        }
        if (query.endDate) {
          const end = new Date(query.endDate);
          end.setHours(23, 59, 59, 999);
          where.createdAt.lte = end;
        }
      }

      const [subscriptions, total] = await Promise.all([
        prisma.subscription.findMany({
          where,
          include: {
            user: {
              include: {
                profile: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take: limit,
        }),
        prisma.subscription.count({ where }),
      ]);

      let formattedSubscriptions = subscriptions.map((sub) => ({
        id: sub.id,
        userId: sub.userId,
        userName: sub.user.profile?.name || 'Unknown',
        userEmail: sub.user.email,
        planType: sub.planType,
        amount: sub.amount,
        status: sub.status,
        paymentId: sub.paymentId,
        startedAt: sub.startedAt.toISOString(),
        expiresAt: sub.expiresAt?.toISOString(),
        cancelledAt: sub.cancelledAt?.toISOString(),
        refundedAt: sub.refundedAt?.toISOString(),
        refundAmount: sub.refundAmount,
        autoRenew: sub.autoRenew,
        createdAt: sub.createdAt.toISOString(),
      }));

      // Search filter
      if (query.search) {
        const search = query.search.toLowerCase();
        formattedSubscriptions = formattedSubscriptions.filter(
          (s) =>
            s.userName.toLowerCase().includes(search) ||
            s.userEmail.toLowerCase().includes(search) ||
            s.paymentId?.toLowerCase().includes(search)
        );
      }

      await reply.send({
        success: true,
        data: {
          subscriptions: formattedSubscriptions,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      fastify.log.error(error, 'Failed to fetch subscriptions');
      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'Failed to fetch subscriptions',
        },
      });
    }
  });

  // Refund Subscription
  fastify.post('/subscriptions/:subscriptionId/refund', async (request, reply) => {
    const authError = await verifyAdmin(request, reply, fastify);
    if (authError) return authError;

    const { subscriptionId } = request.params as { subscriptionId: string };
    const body = request.body as { amount?: number; reason?: string };
    const adminUser = (request as any).user;

    try {
      const subscription = await prisma.subscription.findUnique({
        where: { id: subscriptionId },
      });

      if (!subscription) {
        return reply.status(HTTP_STATUS.NOT_FOUND).send({
          success: false,
          error: {
            code: ERROR_CODES.NOT_FOUND,
            message: 'Subscription not found',
          },
        });
      }

      const refundAmount = body.amount ?? subscription.amount;

      await prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          status: 'refunded',
          refundedAt: new Date(),
          refundAmount,
        },
      });

      // Log admin action
      await logAdminAction(
        adminUser.id,
        'refund_subscription',
        'subscription',
        subscriptionId,
        { amount: refundAmount, reason: body.reason },
        request.ip,
        request.headers['user-agent']
      );

      await reply.send({
        success: true,
        data: {
          message: 'Subscription refunded successfully',
          refundAmount,
        },
      });
    } catch (error) {
      fastify.log.error(error, 'Failed to refund subscription');
      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'Failed to refund subscription',
        },
      });
    }
  });

  // Cancel Subscription
  fastify.post('/subscriptions/:subscriptionId/cancel', async (request, reply) => {
    const authError = await verifyAdmin(request, reply, fastify);
    if (authError) return authError;

    const { subscriptionId } = request.params as { subscriptionId: string };
    const adminUser = (request as any).user;

    try {
      const subscription = await prisma.subscription.findUnique({
        where: { id: subscriptionId },
      });

      if (!subscription) {
        return reply.status(HTTP_STATUS.NOT_FOUND).send({
          success: false,
          error: {
            code: ERROR_CODES.NOT_FOUND,
            message: 'Subscription not found',
          },
        });
      }

      await prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
          status: 'cancelled',
          cancelledAt: new Date(),
          autoRenew: false,
        },
      });

      // Log admin action
      await logAdminAction(
        adminUser.id,
        'cancel_subscription',
        'subscription',
        subscriptionId,
        {},
        request.ip,
        request.headers['user-agent']
      );

      await reply.send({
        success: true,
        data: {
          message: 'Subscription cancelled successfully',
        },
      });
    } catch (error) {
      fastify.log.error(error, 'Failed to cancel subscription');
      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'Failed to cancel subscription',
        },
      });
    }
  });

  // Get Admin Logs
  fastify.get('/logs', async (request, reply) => {
    const authError = await verifyAdmin(request, reply, fastify);
    if (authError) return authError;

    const query = request.query as {
      page?: string;
      limit?: string;
      action?: string;
      targetType?: string;
      adminId?: string;
      startDate?: string;
      endDate?: string;
    };

    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '50', 10);
    const skip = (page - 1) * limit;

    try {
      const where: any = {};

      // Action filter
      if (query.action && query.action !== 'all') {
        where.action = query.action;
      }

      // Target type filter
      if (query.targetType && query.targetType !== 'all') {
        where.targetType = query.targetType;
      }

      // Admin filter
      if (query.adminId) {
        where.adminId = query.adminId;
      }

      // Date range filter
      if (query.startDate || query.endDate) {
        where.createdAt = {};
        if (query.startDate) {
          where.createdAt.gte = new Date(query.startDate);
        }
        if (query.endDate) {
          const end = new Date(query.endDate);
          end.setHours(23, 59, 59, 999);
          where.createdAt.lte = end;
        }
      }

      const [logs, total] = await Promise.all([
        prisma.adminLog.findMany({
          where,
          include: {
            admin: {
              include: {
                profile: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          skip,
          take: limit,
        }),
        prisma.adminLog.count({ where }),
      ]);

      const formattedLogs = logs.map((log) => ({
        id: log.id,
        adminId: log.adminId,
        adminName: log.admin.profile?.name || log.admin.email,
        action: log.action,
        targetType: log.targetType,
        targetId: log.targetId,
        details: log.details,
        ipAddress: log.ipAddress,
        userAgent: log.userAgent,
        createdAt: log.createdAt.toISOString(),
      }));

      await reply.send({
        success: true,
        data: {
          logs: formattedLogs,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      fastify.log.error(error, 'Failed to fetch admin logs');
      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'Failed to fetch admin logs',
        },
      });
    }
  });

  // Export Users as CSV
  fastify.get('/export/users', async (request, reply) => {
    const authError = await verifyAdmin(request, reply, fastify);
    if (authError) return authError;

    const query = request.query as {
      status?: string;
      startDate?: string;
      endDate?: string;
    };

    try {
      const where: any = {};

      if (query.status === 'active') {
        where.isActive = true;
        where.isBanned = false;
      } else if (query.status === 'banned') {
        where.isBanned = true;
      }

      if (query.startDate || query.endDate) {
        where.createdAt = {};
        if (query.startDate) {
          where.createdAt.gte = new Date(query.startDate);
        }
        if (query.endDate) {
          const end = new Date(query.endDate);
          end.setHours(23, 59, 59, 999);
          where.createdAt.lte = end;
        }
      }

      const users = await prisma.user.findMany({
        where,
        include: {
          profile: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Generate CSV
      const headers = [
        'ID',
        'Email',
        'Name',
        'Status',
        'Role',
        'Created At',
        'Last Active',
        'Profile Views',
      ];

      const rows = users.map((user) => [
        user.id,
        user.email,
        user.profile?.name || '',
        user.isBanned ? 'banned' : user.isActive ? 'active' : 'pending',
        user.role,
        user.createdAt.toISOString(),
        user.profile?.lastActiveAt?.toISOString() || '',
        user.profile?.profileViewsCount?.toString() || '0',
      ]);

      const csv = [
        headers.join(','),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
      ].join('\n');

      await reply
        .header('Content-Type', 'text/csv')
        .header('Content-Disposition', 'attachment; filename="users-export.csv"')
        .send(csv);
    } catch (error) {
      fastify.log.error(error, 'Failed to export users');
      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'Failed to export users',
        },
      });
    }
  });

  // Promote User to Admin
  fastify.post('/users/:userId/promote', async (request, reply) => {
    const authError = await verifyAdmin(request, reply, fastify);
    if (authError) return authError;

    const { userId } = request.params as { userId: string };
    const adminUser = (request as any).user;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
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

      if (user.role === 'admin') {
        return reply.status(HTTP_STATUS.BAD_REQUEST).send({
          success: false,
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: 'User is already an admin',
          },
        });
      }

      await prisma.user.update({
        where: { id: userId },
        data: { role: 'admin' },
      });

      // Log admin action
      await logAdminAction(
        adminUser.id,
        'promote_to_admin',
        'user',
        userId,
        { previousRole: user.role },
        request.ip,
        request.headers['user-agent']
      );

      await reply.send({
        success: true,
        data: {
          message: 'User promoted to admin successfully',
        },
      });
    } catch (error) {
      fastify.log.error(error, 'Failed to promote user');
      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'Failed to promote user',
        },
      });
    }
  });

  // Demote Admin to User
  fastify.post('/users/:userId/demote', async (request, reply) => {
    const authError = await verifyAdmin(request, reply, fastify);
    if (authError) return authError;

    const { userId } = request.params as { userId: string };
    const adminUser = (request as any).user;

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
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

      if (user.role !== 'admin') {
        return reply.status(HTTP_STATUS.BAD_REQUEST).send({
          success: false,
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: 'User is not an admin',
          },
        });
      }

      // Prevent self-demotion
      if (user.id === adminUser.id) {
        return reply.status(HTTP_STATUS.BAD_REQUEST).send({
          success: false,
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: 'Cannot demote yourself',
          },
        });
      }

      await prisma.user.update({
        where: { id: userId },
        data: { role: 'user' },
      });

      // Log admin action
      await logAdminAction(
        adminUser.id,
        'demote_from_admin',
        'user',
        userId,
        {},
        request.ip,
        request.headers['user-agent']
      );

      await reply.send({
        success: true,
        data: {
          message: 'Admin demoted to user successfully',
        },
      });
    } catch (error) {
      fastify.log.error(error, 'Failed to demote admin');
      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'Failed to demote admin',
        },
      });
    }
  });

  // Get All Admins
  fastify.get('/admins', async (request, reply) => {
    const authError = await verifyAdmin(request, reply, fastify);
    if (authError) return authError;

    try {
      const admins = await prisma.user.findMany({
        where: { role: 'admin' },
        include: {
          profile: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const formattedAdmins = admins.map((admin) => ({
        id: admin.id,
        email: admin.email,
        name: admin.profile?.name || 'Unknown',
        createdAt: admin.createdAt.toISOString(),
        lastActive: admin.profile?.lastActiveAt?.toISOString(),
      }));

      await reply.send({
        success: true,
        data: {
          admins: formattedAdmins,
        },
      });
    } catch (error) {
      fastify.log.error(error, 'Failed to fetch admins');
      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'Failed to fetch admins',
        },
      });
    }
  });

  // Export Reports as CSV
  fastify.get('/export/reports', async (request, reply) => {
    const authError = await verifyAdmin(request, reply, fastify);
    if (authError) return authError;

    const query = request.query as {
      status?: string;
      startDate?: string;
      endDate?: string;
    };

    try {
      const where: any = {};

      if (query.status && query.status !== 'all') {
        where.status = query.status;
      }

      if (query.startDate || query.endDate) {
        where.createdAt = {};
        if (query.startDate) {
          where.createdAt.gte = new Date(query.startDate);
        }
        if (query.endDate) {
          const end = new Date(query.endDate);
          end.setHours(23, 59, 59, 999);
          where.createdAt.lte = end;
        }
      }

      const reports = await prisma.report.findMany({
        where,
        include: {
          reporter: { include: { profile: true } },
          reported: { include: { profile: true } },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      const headers = [
        'ID',
        'Reporter ID',
        'Reporter Name',
        'Reporter Email',
        'Reported User ID',
        'Reported User Name',
        'Reported User Email',
        'Type',
        'Description',
        'Status',
        'Created At',
        'Resolved At',
      ];

      const rows = reports.map((report) => [
        report.id,
        report.reporterId,
        report.reporter.profile?.name || '',
        report.reporter.email,
        report.reportedUserId,
        report.reported.profile?.name || '',
        report.reported.email,
        report.reportType,
        (report.description || '').replace(/"/g, '""'),
        report.status,
        report.createdAt.toISOString(),
        report.resolvedAt?.toISOString() || '',
      ]);

      const csv = [
        headers.join(','),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
      ].join('\n');

      await reply
        .header('Content-Type', 'text/csv')
        .header('Content-Disposition', 'attachment; filename="reports-export.csv"')
        .send(csv);
    } catch (error) {
      fastify.log.error(error, 'Failed to export reports');
      return reply.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).send({
        success: false,
        error: {
          code: ERROR_CODES.INTERNAL_ERROR,
          message: 'Failed to export reports',
        },
      });
    }
  });
}