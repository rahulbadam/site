import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  matchId: string;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: string[];
  sendMessage: (receiverId: string, content: string, matchId: string) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  startTyping: (receiverId: string, matchId: string) => void;
  stopTyping: (receiverId: string, matchId: string) => void;
  markAsRead: (messageId: string, senderId: string) => void;
}

export function useSocket(): UseSocketReturn {
  const { accessToken, user } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const socketUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:4000';

  useEffect(() => {
    if (!accessToken || !user?.id) return;

    // Initialize socket connection
    socketRef.current = io(socketUrl, {
      auth: {
        token: accessToken,
        userId: user.id,
      },
      transports: ['websocket', 'polling'],
    });

    const socket = socketRef.current;

    // Connection events
    socket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // Online users
    socket.on('users:online', (users: string[]) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.disconnect();
    };
  }, [accessToken, user?.id, socketUrl]);

  const sendMessage = useCallback((receiverId: string, content: string, matchId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('message:send', {
        receiverId,
        content,
        matchId,
      });
    }
  }, [isConnected]);

  const joinConversation = useCallback((conversationId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('conversation:join', conversationId);
    }
  }, [isConnected]);

  const leaveConversation = useCallback((conversationId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('conversation:leave', conversationId);
    }
  }, [isConnected]);

  const startTyping = useCallback((receiverId: string, matchId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing:start', { receiverId, matchId });
    }
  }, [isConnected]);

  const stopTyping = useCallback((receiverId: string, matchId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('typing:stop', { receiverId, matchId });
    }
  }, [isConnected]);

  const markAsRead = useCallback((messageId: string, senderId: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('message:read', { messageId, senderId });
    }
  }, [isConnected]);

  return {
    socket: socketRef.current,
    isConnected,
    onlineUsers,
    sendMessage,
    joinConversation,
    leaveConversation,
    startTyping,
    stopTyping,
    markAsRead,
  };
}

// Hook for listening to messages in a conversation
export function useConversation(matchId: string | null) {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  useEffect(() => {
    if (!socket || !isConnected || !matchId) return;

    // Join the conversation
    socket.emit('conversation:join', matchId);

    // Listen for new messages
    const handleNewMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on('message:new', handleNewMessage);
    socket.on('message:received', handleNewMessage);

    // Listen for sent message confirmation
    socket.on('message:sent', (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Listen for typing indicators
    socket.on('typing:started', ({ userId }: { userId: string; matchId: string }) => {
      setTypingUser(userId);
    });

    socket.on('typing:stopped', () => {
      setTypingUser(null);
    });

    // Listen for read receipts
    socket.on('message:read', ({ messageId }: { messageId: string; readBy: string }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, isRead: true, readAt: new Date().toISOString() } : m
        )
      );
    });

    return () => {
      socket.emit('conversation:leave', matchId);
      socket.off('message:new');
      socket.off('message:received');
      socket.off('message:sent');
      socket.off('typing:started');
      socket.off('typing:stopped');
      socket.off('message:read');
    };
  }, [socket, isConnected, matchId]);

  return {
    messages,
    typingUser,
    setMessages,
  };
}