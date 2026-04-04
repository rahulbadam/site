import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Search,
  User,
  Phone,
  Video,
  MoreVertical,
  Check,
  CheckCheck,
  Clock,
  Heart,
  UserCheck,
  MapPin,
  Briefcase,
  Image,
  Smile,
  Paperclip,
  X,
  RefreshCw,
  ChevronLeft,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

// Types
interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: 'text' | 'template' | 'image';
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}

interface Conversation {
  id: string;
  matchId: string;
  otherUser: {
    id: string;
    name: string;
    primaryPhoto: string | null;
    isOnline: boolean;
    lastActiveAt: string | null;
  };
  lastMessage: Message | null;
  unreadCount: number;
  matchScore?: number;
  createdAt: string;
}

interface Interest {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  message: string | null;
  sender: {
    id: string;
    name: string;
    primaryPhoto: string | null;
    age: number;
    location: string | null;
    occupation: string | null;
  };
  createdAt: string;
}

function MessagesPage() {
  const navigate = useNavigate();
  const { accessToken, user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'messages' | 'interests'>('messages');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);

  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

  // Fetch conversations and interests
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const [conversationsRes, interestsRes] = await Promise.all([
        fetch(`${apiBaseUrl}/messages/conversations`, { headers }),
        fetch(`${apiBaseUrl}/interests`, { headers }),
      ]);

      if (conversationsRes.ok) {
        const data = await conversationsRes.json();
        if (data.success) {
          setConversations(data.data.conversations);
        }
      }

      if (interestsRes.ok) {
        const data = await interestsRes.json();
        if (data.success) {
          setInterests(data.data.interests);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = useCallback(async () => {
    if (!selectedConversation) return;

    try {
      const response = await fetch(
        `${apiBaseUrl}/messages/conversations/${selectedConversation.matchId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setMessages(data.data.messages);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  }, [selectedConversation, accessToken, apiBaseUrl]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages();
    }
  }, [selectedConversation]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setSendingMessage(true);
    try {
      const response = await fetch(`${apiBaseUrl}/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          receiverId: selectedConversation.otherUser.id,
          content: newMessage.trim(),
          messageType: 'text',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessages([...messages, data.data.message]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleAcceptInterest = async (interestId: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/interests/${interestId}/accept`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        // Remove from interests list and add to conversations
        setInterests(interests.filter((i) => i.id !== interestId));
        fetchData(); // Refresh conversations
      }
    } catch (error) {
      console.error('Failed to accept interest:', error);
    }
  };

  const handleRejectInterest = async (interestId: string) => {
    try {
      const response = await fetch(`${apiBaseUrl}/interests/${interestId}/reject`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setInterests(interests.filter((i) => i.id !== interestId));
      }
    } catch (error) {
      console.error('Failed to reject interest:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const getMessageStatus = (message: Message) => {
    if (message.senderId !== user?.id) return null;
    if (message.isRead) {
      return <CheckCheck className="w-4 h-4 text-blue-500" />;
    }
    return <Check className="w-4 h-4 text-maroon-400" />;
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingInterests = interests.filter((i) => i.status === 'pending' && i.receiverId === user?.id);
  const sentInterests = interests.filter((i) => i.senderId === user?.id);

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-maroon-950 mb-2">Messages</h1>
          <p className="text-maroon-700">Connect with your matches and manage interests</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Conversations List */}
          <div className={`lg:col-span-1 ${showMobileChat ? 'hidden lg:block' : ''}`}>
            <div className="card overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-gold-200">
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`flex-1 py-3 text-sm font-medium ${
                    activeTab === 'messages'
                      ? 'text-maroon-950 border-b-2 border-gold-500'
                      : 'text-maroon-600'
                  }`}
                >
                  Messages ({conversations.length})
                </button>
                <button
                  onClick={() => setActiveTab('interests')}
                  className={`flex-1 py-3 text-sm font-medium relative ${
                    activeTab === 'interests'
                      ? 'text-maroon-950 border-b-2 border-gold-500'
                      : 'text-maroon-600'
                  }`}
                >
                  Interests
                  {pendingInterests.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {pendingInterests.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Search */}
              <div className="p-3 border-b border-gold-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-maroon-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input pl-9 py-2 text-sm"
                  />
                </div>
              </div>

              {/* List */}
              <div className="max-h-[calc(100vh-350px)] overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="w-6 h-6 text-gold-500 animate-spin" />
                  </div>
                ) : activeTab === 'messages' ? (
                  filteredConversations.length === 0 ? (
                    <div className="p-6 text-center">
                      <MessageCircle className="w-10 h-10 text-maroon-400 mx-auto mb-2" />
                      <p className="text-maroon-600 text-sm">No conversations yet</p>
                      <p className="text-maroon-500 text-xs mt-1">
                        Accept interests to start chatting
                      </p>
                    </div>
                  ) : (
                    filteredConversations.map((conv) => (
                      <button
                        key={conv.id}
                        onClick={() => {
                          setSelectedConversation(conv);
                          setShowMobileChat(true);
                        }}
                        className={`w-full flex items-center gap-3 p-3 hover:bg-gold-50 transition-colors ${
                          selectedConversation?.id === conv.id ? 'bg-gold-50' : ''
                        }`}
                      >
                        <div className="relative">
                          {conv.otherUser.primaryPhoto ? (
                            <img
                              src={conv.otherUser.primaryPhoto}
                              alt={conv.otherUser.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                              <span className="text-maroon-950 font-bold">
                                {conv.otherUser.name.charAt(0)}
                              </span>
                            </div>
                          )}
                          {conv.otherUser.isOnline && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-maroon-950 truncate">
                              {conv.otherUser.name}
                            </span>
                            {conv.lastMessage && (
                              <span className="text-xs text-maroon-500">
                                {formatTime(conv.lastMessage.createdAt)}
                              </span>
                            )}
                          </div>
                          {conv.lastMessage ? (
                            <p className="text-sm text-maroon-600 truncate">
                              {conv.lastMessage.content}
                            </p>
                          ) : (
                            <p className="text-sm text-maroon-500 italic">New match</p>
                          )}
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="bg-gold-500 text-maroon-950 text-xs px-2 py-0.5 rounded-full">
                            {conv.unreadCount}
                          </span>
                        )}
                      </button>
                    ))
                  )
                ) : (
                  <div className="divide-y divide-gold-100">
                    {/* Received Interests */}
                    {pendingInterests.length > 0 && (
                      <div className="p-2">
                        <p className="text-xs font-medium text-maroon-500 px-2 mb-1">Received ({pendingInterests.length})</p>
                        {pendingInterests.map((interest) => (
                          <div key={interest.id} className="p-3 bg-gold-50 rounded-lg mb-2">
                            <div className="flex items-center gap-3 mb-2">
                              {interest.sender.primaryPhoto ? (
                                <img
                                  src={interest.sender.primaryPhoto}
                                  alt={interest.sender.name}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                                  <span className="text-maroon-950 font-bold text-sm">
                                    {interest.sender.name.charAt(0)}
                                  </span>
                                </div>
                              )}
                              <div className="flex-1">
                                <p className="font-medium text-maroon-950 text-sm">{interest.sender.name}</p>
                                <p className="text-xs text-maroon-600">
                                  {interest.sender.age} yrs {interest.sender.location && `• ${interest.sender.location}`}
                                </p>
                              </div>
                            </div>
                            {interest.message && (
                              <p className="text-sm text-maroon-700 mb-2 italic">"{interest.message}"</p>
                            )}
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAcceptInterest(interest.id)}
                                className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200"
                              >
                                <Heart className="w-4 h-4" /> Accept
                              </button>
                              <button
                                onClick={() => handleRejectInterest(interest.id)}
                                className="flex-1 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
                              >
                                Decline
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Sent Interests */}
                    {sentInterests.length > 0 && (
                      <div className="p-2">
                        <p className="text-xs font-medium text-maroon-500 px-2 mb-1">Sent</p>
                        {sentInterests.map((interest) => (
                          <div key={interest.id} className="flex items-center gap-3 p-2">
                            <div className="w-8 h-8 bg-gold-200 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-maroon-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-maroon-950">{interest.sender.name}</p>
                              <p className="text-xs text-maroon-500">
                                {interest.status === 'pending' ? 'Waiting for response' : interest.status}
                              </p>
                            </div>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                interest.status === 'pending'
                                  ? 'bg-amber-100 text-amber-700'
                                  : interest.status === 'accepted'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {interest.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {pendingInterests.length === 0 && sentInterests.length === 0 && (
                      <div className="p-6 text-center">
                        <Heart className="w-10 h-10 text-maroon-400 mx-auto mb-2" />
                        <p className="text-maroon-600 text-sm">No interests yet</p>
                        <p className="text-maroon-500 text-xs mt-1">
                          Start sending interests to profiles you like
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className={`lg:col-span-3 ${!showMobileChat ? 'hidden lg:block' : ''}`}>
            {selectedConversation ? (
              <div className="card overflow-hidden h-[calc(100vh-220px)] flex flex-col">
                {/* Chat Header */}
                <div className="flex items-center gap-3 p-4 border-b border-gold-200 bg-cream-50">
                  <button
                    onClick={() => setShowMobileChat(false)}
                    className="lg:hidden p-1 text-maroon-600 hover:text-maroon-950"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  {selectedConversation.otherUser.primaryPhoto ? (
                    <img
                      src={selectedConversation.otherUser.primaryPhoto}
                      alt={selectedConversation.otherUser.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                      <span className="text-maroon-950 font-bold">
                        {selectedConversation.otherUser.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-maroon-950">
                      {selectedConversation.otherUser.name}
                    </h3>
                    <p className="text-xs text-maroon-600">
                      {selectedConversation.otherUser.isOnline ? (
                        <span className="text-green-600">Online</span>
                      ) : selectedConversation.otherUser.lastActiveAt ? (
                        `Last seen ${formatTime(selectedConversation.otherUser.lastActiveAt)}`
                      ) : (
                        'Offline'
                      )}
                    </p>
                  </div>
                  <button className="p-2 text-maroon-600 hover:text-maroon-950 hover:bg-gold-50 rounded-lg">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-maroon-600 hover:text-maroon-950 hover:bg-gold-50 rounded-lg">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-maroon-600 hover:text-maroon-950 hover:bg-gold-50 rounded-lg">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-cream-100">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <MessageCircle className="w-12 h-12 text-maroon-400 mb-3" />
                      <p className="text-maroon-600">Start your conversation</p>
                      <p className="text-maroon-500 text-sm">Say hello to {selectedConversation.otherUser.name}!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${
                          message.senderId === user?.id ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                            message.senderId === user?.id
                              ? 'bg-maroon-950 text-gold-100 rounded-br-md'
                              : 'bg-white text-maroon-950 rounded-bl-md shadow-sm'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div
                            className={`flex items-center justify-end gap-1 mt-1 ${
                              message.senderId === user?.id ? 'text-gold-400' : 'text-maroon-400'
                            }`}
                          >
                            <span className="text-xs">
                              {new Date(message.createdAt).toLocaleTimeString('en-IN', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true,
                              })}
                            </span>
                            {getMessageStatus(message)}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gold-200 bg-cream-50">
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-maroon-600 hover:text-maroon-950 hover:bg-gold-50 rounded-lg">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-maroon-600 hover:text-maroon-950 hover:bg-gold-50 rounded-lg">
                      <Image className="w-5 h-5" />
                    </button>
                    <input
                      ref={messageInputRef}
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Type a message..."
                      className="flex-1 input py-2"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sendingMessage}
                      className="btn-primary p-2 disabled:opacity-50"
                    >
                      {sendingMessage ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card h-[calc(100vh-220px)] flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-maroon-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-maroon-950 mb-2">Your Messages</h3>
                  <p className="text-maroon-600 mb-4">
                    Select a conversation to start chatting
                  </p>
                  <p className="text-maroon-500 text-sm">
                    Accept interests to start conversations with matches
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessagesPage;