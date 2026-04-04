import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface OnlineUser {
  userId: string;
  socketId: string;
}

let onlineUsers: OnlineUser[] = [];

export function initializeSocketIO(httpServer: HttpServer) {
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      // Verify JWT (you'll need to import your JWT verification)
      // For now, we'll accept the token and extract userId
      const userId = socket.handshake.auth.userId;
      
      if (!userId) {
        return next(new Error('Authentication error: Invalid token'));
      }

      socket.data.userId = userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    const userId = socket.data.userId;

    // Add user to online users
    if (!onlineUsers.some((user) => user.userId === userId)) {
      onlineUsers.push({ userId, socketId: socket.id });
    }

    // Emit online status to all users
    io.emit('users:online', onlineUsers.map((u) => u.userId));

    // Join user's personal room for direct messages
    socket.join(`user:${userId}`);

    // Handle joining a conversation room
    socket.on('conversation:join', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`User ${userId} joined conversation ${conversationId}`);
    });

    // Handle leaving a conversation room
    socket.on('conversation:leave', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`User ${userId} left conversation ${conversationId}`);
    });

    // Handle sending message
    socket.on('message:send', async (data: { receiverId: string; content: string; matchId: string }) => {
      try {
        const { receiverId, content, matchId } = data;

        // Save message to database
        const message = await prisma.message.create({
          data: {
            senderId: userId,
            receiverId,
            matchId,
            content,
            messageType: 'text',
          },
        });

        // Emit to sender (confirmation)
        socket.emit('message:sent', message);

        // Emit to receiver if online
        io.to(`user:${receiverId}`).emit('message:received', {
          ...message,
          senderId: userId,
        });

        // Also emit to conversation room if it exists
        io.to(`conversation:${matchId}`).emit('message:new', message);

        console.log(`Message sent from ${userId} to ${receiverId}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message:error', { error: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing:start', (data: { receiverId: string; matchId: string }) => {
      socket.to(`user:${data.receiverId}`).emit('typing:started', {
        userId,
        matchId: data.matchId,
      });
    });

    socket.on('typing:stop', (data: { receiverId: string; matchId: string }) => {
      socket.to(`user:${data.receiverId}`).emit('typing:stopped', {
        userId,
        matchId: data.matchId,
      });
    });

    // Handle mark as read
    socket.on('message:read', async (data: { messageId: string; senderId: string }) => {
      try {
        await prisma.message.update({
          where: { id: data.messageId },
          data: { isRead: true, readAt: new Date() },
        });

        // Notify sender that message was read
        io.to(`user:${data.senderId}`).emit('message:read', {
          messageId: data.messageId,
          readBy: userId,
        });
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    });

    // Handle interest notification
    socket.on('interest:sent', (data: { receiverId: string }) => {
      io.to(`user:${data.receiverId}`).emit('interest:received', {
        from: userId,
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      io.emit('users:online', onlineUsers.map((u) => u.userId));
    });
  });

  return io;
}

// Helper function to check if user is online
export function isUserOnline(userId: string): boolean {
  return onlineUsers.some((user) => user.userId === userId);
}

// Helper function to get socket ID for a user
export function getSocketId(userId: string): string | undefined {
  return onlineUsers.find((user) => user.userId === userId)?.socketId;
}