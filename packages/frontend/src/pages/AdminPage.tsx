import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserCheck,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Ban,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  ChevronDown,
  FileText,
  Shield,
  BarChart3,
  RefreshCw,
  Download,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  CreditCard,
  Activity,
  Trash2,
  UserX,
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

// Types
interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  pendingVerifications: number;
  openReports: number;
  revenue: {
    today: number;
    thisMonth: number;
  };
}

interface User {
  id: string;
  email: string;
  name: string;
  status: 'active' | 'banned' | 'pending';
  createdAt: string;
  role: 'user' | 'admin';
  lastActive?: string;
  profileViews?: number;
  profileCompletion?: number;
  isVerified?: boolean;
  primaryPhoto?: string | null;
}

interface UserDetail {
  user: {
    id: string;
    email: string;
    phone?: string;
    role: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    isActive: boolean;
    isBanned: boolean;
    bannedAt?: string;
    bannedReason?: string;
    fraudScore: number;
    createdAt: string;
    updatedAt: string;
  };
  profile: any;
  preferences: any;
  verifications: any[];
  subscriptions: any[];
  reportsMade: any[];
  reportsAgainst: any[];
  interestsSent: number;
  interestsReceived: number;
}

interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterEmail: string;
  reportedUserId: string;
  reportedUserName: string;
  reportedUserEmail: string;
  reason: string;
  description: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  resolvedAt?: string;
}

interface Verification {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  documentType: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  verificationData?: any;
}

interface Subscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planType: string;
  amount: number;
  status: string;
  paymentId?: string;
  startedAt: string;
  expiresAt?: string;
  cancelledAt?: string;
  refundedAt?: string;
  refundAmount?: number;
  autoRenew: boolean;
  createdAt: string;
}

interface AdminLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  targetType: string;
  targetId?: string;
  details?: any;
  ipAddress?: string;
  createdAt: string;
}

type TabType = 'dashboard' | 'users' | 'reports' | 'verifications' | 'subscriptions' | 'logs';

// Date Range Picker Component
function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-maroon-400" />
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="input pl-9 pr-3 py-2 text-sm"
        />
      </div>
      <span className="text-maroon-500">to</span>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-maroon-400" />
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="input pl-9 pr-3 py-2 text-sm"
        />
      </div>
    </div>
  );
}

// Pagination Component
function PaginationComponent({
  pagination,
  onPageChange,
}: {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}) {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, pagination.page - Math.floor(maxVisible / 2));
  const end = Math.min(pagination.totalPages, start + maxVisible - 1);
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (pagination.totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gold-200">
      <div className="text-sm text-maroon-600">
        Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
        {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="p-2 rounded-lg hover:bg-gold-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {start > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="px-3 py-1 rounded-lg hover:bg-gold-100 text-sm"
            >
              1
            </button>
            {start > 2 && <span className="px-2 text-maroon-400">...</span>}
          </>
        )}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`px-3 py-1 rounded-lg text-sm ${
              p === pagination.page
                ? 'bg-maroon-950 text-gold-300'
                : 'hover:bg-gold-100'
            }`}
          >
            {p}
          </button>
        ))}
        {end < pagination.totalPages && (
          <>
            {end < pagination.totalPages - 1 && (
              <span className="px-2 text-maroon-400">...</span>
            )}
            <button
              onClick={() => onPageChange(pagination.totalPages)}
              className="px-3 py-1 rounded-lg hover:bg-gold-100 text-sm"
            >
              {pagination.totalPages}
            </button>
          </>
        )}
        <button
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
          className="p-2 rounded-lg hover:bg-gold-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// User Detail Modal
function UserDetailModal({
  userId,
  onClose,
  onBan,
  onUnban,
}: {
  userId: string;
  onClose: () => void;
  onBan: (reason: string) => void;
  onUnban: () => void;
}) {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBanModal, setShowBanModal] = useState(false);
  const [banReason, setBanReason] = useState('');
  const { accessToken } = useAuthStore();
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/admin/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleBan = () => {
    if (banReason.trim()) {
      onBan(banReason);
      setShowBanModal(false);
      onClose();
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <RefreshCw className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-cream-50 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-cream-50 border-b border-gold-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-maroon-950">User Details</h2>
            <button onClick={onClose} className="p-2 hover:bg-gold-100 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* User Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card p-4">
                <h3 className="font-semibold text-maroon-950 mb-3">Account Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-maroon-600">Email:</span>
                    <span className="font-medium">{user.user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-maroon-600">Phone:</span>
                    <span className="font-medium">{user.user.phone || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-maroon-600">Role:</span>
                    <span className="font-medium">{user.user.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-maroon-600">Status:</span>
                    <span className={`badge ${user.user.isBanned ? 'bg-red-100 text-red-800' : 'badge-success'}`}>
                      {user.user.isBanned ? 'Banned' : 'Active'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-maroon-600">Created:</span>
                    <span className="font-medium">{new Date(user.user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <h3 className="font-semibold text-maroon-950 mb-3">Profile Info</h3>
                {user.profile ? (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-maroon-600">Name:</span>
                      <span className="font-medium">{user.profile.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-maroon-600">Gender:</span>
                      <span className="font-medium">{user.profile.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-maroon-600">Verified:</span>
                      <span className="font-medium">{user.profile.isVerified ? 'Yes' : 'No'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-maroon-600">Completion:</span>
                      <span className="font-medium">{user.profile.profileCompletionPercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-maroon-600">Views:</span>
                      <span className="font-medium">{user.profile.profileViewsCount}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-maroon-500 text-sm">Profile not created</p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card p-4 text-center">
                <p className="text-2xl font-bold text-maroon-950">{user.interestsSent}</p>
                <p className="text-sm text-maroon-600">Interests Sent</p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-2xl font-bold text-maroon-950">{user.interestsReceived}</p>
                <p className="text-sm text-maroon-600">Interests Received</p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-2xl font-bold text-maroon-950">{user.reportsAgainst.length}</p>
                <p className="text-sm text-maroon-600">Reports Against</p>
              </div>
              <div className="card p-4 text-center">
                <p className="text-2xl font-bold text-maroon-950">{user.subscriptions.length}</p>
                <p className="text-sm text-maroon-600">Subscriptions</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gold-200">
              {user.user.isBanned ? (
                <button
                  onClick={() => {
                    onUnban();
                    onClose();
                  }}
                  className="btn-primary flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Unban User
                </button>
              ) : (
                <button
                  onClick={() => setShowBanModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
                >
                  <Ban className="w-4 h-4" />
                  Ban User
                </button>
              )}
            </div>
          </div>

          {/* Ban Modal */}
          {showBanModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-cream-50 rounded-xl p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold text-maroon-950 mb-4">Ban User</h3>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Enter reason for banning..."
                  className="input min-h-[100px] mb-4"
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowBanModal(false)}
                    className="px-4 py-2 text-maroon-700 hover:bg-gold-50 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBan}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Ban User
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Main Admin Page
function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<{ date: string; count: number }[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const { accessToken } = useAuthStore();
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      };

      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(searchQuery && { search: searchQuery }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });

      if (activeTab === 'dashboard') {
        const response = await fetch(`${apiBaseUrl}/admin/dashboard`, { headers });
        const data = await response.json();
        if (data.success) {
          setStats(data.data.stats);
          setAnalytics(data.data.analytics?.userGrowth || []);
        }
      } else if (activeTab === 'users') {
        const response = await fetch(`${apiBaseUrl}/admin/users?${queryParams}`, { headers });
        const data = await response.json();
        if (data.success) {
          setUsers(data.data.users);
          setPagination(data.data.pagination);
        }
      } else if (activeTab === 'reports') {
        const response = await fetch(`${apiBaseUrl}/admin/reports?${queryParams}`, { headers });
        const data = await response.json();
        if (data.success) {
          setReports(data.data.reports);
          setPagination(data.data.pagination);
        }
      } else if (activeTab === 'verifications') {
        const response = await fetch(`${apiBaseUrl}/admin/verifications?${queryParams}`, { headers });
        const data = await response.json();
        if (data.success) {
          setVerifications(data.data.verifications);
          setPagination(data.data.pagination);
        }
      } else if (activeTab === 'subscriptions') {
        const response = await fetch(`${apiBaseUrl}/admin/subscriptions?${queryParams}`, { headers });
        const data = await response.json();
        if (data.success) {
          setSubscriptions(data.data.subscriptions);
          setPagination(data.data.pagination);
        }
      } else if (activeTab === 'logs') {
        const response = await fetch(`${apiBaseUrl}/admin/logs?${queryParams}`, { headers });
        const data = await response.json();
        if (data.success) {
          setLogs(data.data.logs);
          setPagination(data.data.pagination);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, pagination.page, pagination.limit, searchQuery, statusFilter, startDate, endDate, accessToken, apiBaseUrl]);

  useEffect(() => {
    fetchData();
  }, [activeTab, pagination.page]);

  const handlePageChange = (page: number) => {
    setPagination((p) => ({ ...p, page }));
  };

  const handleBanUser = async (userId: string, reason: string) => {
    setActionLoading(userId);
    try {
      const response = await fetch(`${apiBaseUrl}/admin/users/${userId}/ban`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ reason }),
      });
      const data = await response.json();
      if (data.success) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, status: 'banned' as const } : u)));
      }
    } catch (error) {
      console.error('Failed to ban user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    setActionLoading(userId);
    try {
      const response = await fetch(`${apiBaseUrl}/admin/users/${userId}/unban`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setUsers(users.map((u) => (u.id === userId ? { ...u, status: 'active' as const } : u)));
      }
    } catch (error) {
      console.error('Failed to unban user:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkBan = async () => {
    if (selectedUsers.length === 0) return;
    setActionLoading('bulk');
    try {
      const response = await fetch(`${apiBaseUrl}/admin/users/bulk-ban`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userIds: selectedUsers,
          reason: 'Bulk ban - violated community guidelines',
        }),
      });
      const data = await response.json();
      if (data.success) {
        setUsers(
          users.map((u) =>
            selectedUsers.includes(u.id) ? { ...u, status: 'banned' as const } : u
          )
        );
        setSelectedUsers([]);
      }
    } catch (error) {
      console.error('Failed to bulk ban:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleResolveReport = async (reportId: string, action: string) => {
    setActionLoading(reportId);
    try {
      const response = await fetch(`${apiBaseUrl}/admin/reports/${reportId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ action }),
      });
      const data = await response.json();
      if (data.success) {
        setReports(reports.map((r) => (r.id === reportId ? { ...r, status: 'resolved' as const } : r)));
      }
    } catch (error) {
      console.error('Failed to resolve report:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleApproveVerification = async (verificationId: string) => {
    setActionLoading(verificationId);
    try {
      const response = await fetch(`${apiBaseUrl}/admin/verifications/${verificationId}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      if (data.success) {
        setVerifications(
          verifications.map((v) =>
            v.id === verificationId ? { ...v, status: 'approved' as const } : v
          )
        );
      }
    } catch (error) {
      console.error('Failed to approve verification:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectVerification = async (verificationId: string) => {
    setActionLoading(verificationId);
    try {
      const response = await fetch(`${apiBaseUrl}/admin/verifications/${verificationId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ reason: 'Document verification failed' }),
      });
      const data = await response.json();
      if (data.success) {
        setVerifications(
          verifications.map((v) =>
            v.id === verificationId ? { ...v, status: 'rejected' as const } : v
          )
        );
      }
    } catch (error) {
      console.error('Failed to reject verification:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRefundSubscription = async (subscriptionId: string) => {
    setActionLoading(subscriptionId);
    try {
      const response = await fetch(`${apiBaseUrl}/admin/subscriptions/${subscriptionId}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({}),
      });
      const data = await response.json();
      if (data.success) {
        setSubscriptions(
          subscriptions.map((s) =>
            s.id === subscriptionId ? { ...s, status: 'refunded' } : s
          )
        );
      }
    } catch (error) {
      console.error('Failed to refund subscription:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleExport = async (type: 'users' | 'reports') => {
    try {
      const queryParams = new URLSearchParams({
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });

      const response = await fetch(`${apiBaseUrl}/admin/export/${type}?${queryParams}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const csv = await response.text();
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export:', error);
    }
  };

  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart3 },
    { id: 'users' as const, label: 'Users', icon: Users },
    { id: 'reports' as const, label: 'Reports', icon: AlertTriangle },
    { id: 'verifications' as const, label: 'Verifications', icon: UserCheck },
    { id: 'subscriptions' as const, label: 'Subscriptions', icon: CreditCard },
    { id: 'logs' as const, label: 'Activity Logs', icon: Activity },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-cream-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-maroon-950 mb-2">Admin Dashboard</h1>
          <p className="text-maroon-700">Manage users, reports, verifications, and subscriptions</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gold-200 pb-4">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveTab(tab.id);
                setPagination((p) => ({ ...p, page: 1 }));
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-maroon-950 text-gold-300 shadow-lg'
                  : 'bg-white text-maroon-700 hover:bg-gold-50 border border-gold-200'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
              {tab.id === 'reports' && stats && stats.openReports > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {stats.openReports}
                </span>
              )}
              {tab.id === 'verifications' && stats && stats.pendingVerifications > 0 && (
                <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {stats.pendingVerifications}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-20"
            >
              <RefreshCw className="w-8 h-8 text-gold-500 animate-spin" />
            </motion.div>
          ) : (
            <>
              {/* Dashboard Tab */}
              {activeTab === 'dashboard' && stats && (
                <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'blue' },
                      { label: 'Active Users', value: stats.activeUsers, icon: TrendingUp, color: 'green' },
                      { label: 'Pending Verifications', value: stats.pendingVerifications, icon: UserCheck, color: 'amber' },
                      { label: 'Open Reports', value: stats.openReports, icon: AlertTriangle, color: 'red' },
                    ].map((stat) => (
                      <div key={stat.label} className="card p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                            <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                          </div>
                        </div>
                        <h3 className="text-3xl font-bold text-maroon-950">{stat.value}</h3>
                        <p className="text-sm text-maroon-600 mt-1">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Revenue */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="card p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gold-100 rounded-lg">
                          <DollarSign className="w-6 h-6 text-gold-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-maroon-950">Today's Revenue</h3>
                          <p className="text-sm text-maroon-600">Revenue generated today</p>
                        </div>
                      </div>
                      <p className="text-4xl font-bold text-maroon-950">{formatCurrency(stats.revenue.today)}</p>
                    </div>
                    <div className="card p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-gold-100 rounded-lg">
                          <DollarSign className="w-6 h-6 text-gold-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-maroon-950">Monthly Revenue</h3>
                          <p className="text-sm text-maroon-600">Revenue this month</p>
                        </div>
                      </div>
                      <p className="text-4xl font-bold text-maroon-950">{formatCurrency(stats.revenue.thisMonth)}</p>
                    </div>
                  </div>

                  {/* User Growth Chart */}
                  {analytics.length > 0 && (
                    <div className="card p-6">
                      <h3 className="text-lg font-semibold text-maroon-950 mb-4">User Growth (Last 30 Days)</h3>
                      <div className="h-48 flex items-end gap-1">
                        {analytics.map((day, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-gold-500 to-gold-300 rounded-t"
                            style={{ height: `${Math.max(5, (day.count / Math.max(...analytics.map((a) => a.count))) * 100)}%` }}
                            title={`${day.date}: ${day.count} users`}
                          />
                        ))}
                      </div>
                      <div className="flex justify-between mt-2 text-xs text-maroon-500">
                        <span>{analytics[0]?.date}</span>
                        <span>{analytics[analytics.length - 1]?.date}</span>
                      </div>
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="card p-6">
                    <h3 className="text-lg font-semibold text-maroon-950 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button onClick={() => setActiveTab('users')} className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span className="font-medium text-blue-800">Manage Users</span>
                      </button>
                      <button onClick={() => setActiveTab('reports')} className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span className="font-medium text-red-800">Review Reports</span>
                      </button>
                      <button onClick={() => setActiveTab('verifications')} className="flex items-center gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200 hover:bg-amber-100">
                        <UserCheck className="w-5 h-5 text-amber-600" />
                        <span className="font-medium text-amber-800">Verify Users</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <motion.div key="users" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  {/* Filters */}
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-maroon-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchData()}
                        className="input pl-10"
                      />
                    </div>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-40">
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="banned">Banned</option>
                      <option value="pending">Pending</option>
                    </select>
                    <DateRangePicker startDate={startDate} endDate={endDate} onStartDateChange={setStartDate} onEndDateChange={setEndDate} />
                    <button onClick={fetchData} className="btn-primary">Apply</button>
                    <button onClick={() => handleExport('users')} className="btn-outline flex items-center gap-2">
                      <Download className="w-4 h-4" /> Export
                    </button>
                  </div>

                  {/* Bulk Actions */}
                  {selectedUsers.length > 0 && (
                    <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <span className="text-amber-800">{selectedUsers.length} users selected</span>
                      <button onClick={handleBulkBan} disabled={actionLoading === 'bulk'} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                        {actionLoading === 'bulk' ? 'Processing...' : 'Ban Selected'}
                      </button>
                      <button onClick={() => setSelectedUsers([])} className="px-4 py-2 text-maroon-600 hover:bg-gold-50 rounded-lg">
                        Clear Selection
                      </button>
                    </div>
                  )}

                  {/* Users Table */}
                  <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-maroon-50 border-b border-gold-200">
                          <tr>
                            <th className="px-4 py-3 text-left">
                              <input
                                type="checkbox"
                                checked={selectedUsers.length === users.length && users.length > 0}
                                onChange={(e) => setSelectedUsers(e.target.checked ? users.map((u) => u.id) : [])}
                              />
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-maroon-800">User</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-maroon-800">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-maroon-800">Role</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-maroon-800">Joined</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-maroon-800">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gold-100">
                          {users.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="px-6 py-12 text-center text-maroon-600">
                                <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No users found</p>
                              </td>
                            </tr>
                          ) : (
                            users.map((user) => (
                              <tr key={user.id} className="hover:bg-gold-50/50">
                                <td className="px-4 py-4">
                                  <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={(e) =>
                                      setSelectedUsers(
                                        e.target.checked ? [...selectedUsers, user.id] : selectedUsers.filter((id) => id !== user.id)
                                      )
                                    }
                                  />
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center overflow-hidden">
                                      {user.primaryPhoto ? (
                                        <img src={user.primaryPhoto} alt="" className="w-full h-full object-cover" />
                                      ) : (
                                        <span className="text-maroon-950 font-semibold">{user.name.charAt(0).toUpperCase()}</span>
                                      )}
                                    </div>
                                    <div>
                                      <p className="font-medium text-maroon-950">{user.name}</p>
                                      <p className="text-sm text-maroon-600">{user.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`badge ${user.status === 'active' ? 'badge-success' : user.status === 'banned' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                                    {user.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>{user.role}</span>
                                </td>
                                <td className="px-6 py-4 text-maroon-700">{formatDate(user.createdAt)}</td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center justify-end gap-2">
                                    <button onClick={() => setSelectedUser(user.id)} className="p-2 text-maroon-600 hover:text-maroon-950 hover:bg-gold-100 rounded-lg">
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    {user.status === 'banned' ? (
                                      <button onClick={() => handleUnbanUser(user.id)} disabled={actionLoading === user.id} className="p-2 text-green-600 hover:bg-green-50 rounded-lg disabled:opacity-50">
                                        {actionLoading === user.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                      </button>
                                    ) : (
                                      <button onClick={() => handleBanUser(user.id, 'Violated community guidelines')} disabled={actionLoading === user.id} className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50">
                                        {actionLoading === user.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    <PaginationComponent pagination={pagination} onPageChange={handlePageChange} />
                  </div>
                </motion.div>
              )}

              {/* Reports Tab */}
              {activeTab === 'reports' && (
                <motion.div key="reports" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-maroon-400" />
                      <input
                        type="text"
                        placeholder="Search reports..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchData()}
                        className="input pl-10"
                      />
                    </div>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-40">
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    <DateRangePicker startDate={startDate} endDate={endDate} onStartDateChange={setStartDate} onEndDateChange={setEndDate} />
                    <button onClick={fetchData} className="btn-primary">Apply</button>
                    <button onClick={() => handleExport('reports')} className="btn-outline flex items-center gap-2">
                      <Download className="w-4 h-4" /> Export
                    </button>
                  </div>

                  <div className="space-y-4">
                    {reports.length === 0 ? (
                      <div className="card p-12 text-center">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No reports found</p>
                      </div>
                    ) : (
                      reports.map((report) => (
                        <div key={report.id} className="card p-6">
                          <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`badge ${report.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'badge-success'}`}>{report.status}</span>
                                <span className="text-sm text-maroon-500">{formatDate(report.createdAt)}</span>
                              </div>
                              <h4 className="font-semibold text-maroon-950 mb-2">{report.reason}</h4>
                              <p className="text-maroon-700 text-sm mb-4">{report.description}</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div><span className="text-maroon-500">Reporter:</span> <span className="font-medium">{report.reporterName}</span></div>
                                <div><span className="text-maroon-500">Reported:</span> <span className="font-medium">{report.reportedUserName}</span></div>
                              </div>
                            </div>
                            {report.status === 'pending' && (
                              <div className="flex gap-2">
                                <button onClick={() => handleResolveReport(report.id, 'warned')} disabled={actionLoading === report.id} className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg hover:bg-amber-200 disabled:opacity-50">Warn</button>
                                <button onClick={() => handleResolveReport(report.id, 'banned')} disabled={actionLoading === report.id} className="px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 disabled:opacity-50">Ban</button>
                                <button onClick={() => handleResolveReport(report.id, 'dismissed')} disabled={actionLoading === report.id} className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 disabled:opacity-50">Dismiss</button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <PaginationComponent pagination={pagination} onPageChange={handlePageChange} />
                </motion.div>
              )}

              {/* Verifications Tab */}
              {activeTab === 'verifications' && (
                <motion.div key="verifications" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-maroon-400" />
                      <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchData()} className="input pl-10" />
                    </div>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-40">
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <button onClick={fetchData} className="btn-primary">Apply</button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {verifications.length === 0 ? (
                      <div className="card p-12 text-center col-span-full">
                        <UserCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No verifications found</p>
                      </div>
                    ) : (
                      verifications.map((v) => (
                        <div key={v.id} className="card p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center">
                                <span className="text-maroon-950 font-bold">{v.userName.charAt(0).toUpperCase()}</span>
                              </div>
                              <div>
                                <h4 className="font-semibold text-maroon-950">{v.userName}</h4>
                                <p className="text-sm text-maroon-600">{v.userEmail}</p>
                              </div>
                            </div>
                            <span className={`badge ${v.status === 'pending' ? 'bg-amber-100 text-amber-800' : v.status === 'approved' ? 'badge-success' : 'bg-red-100 text-red-800'}`}>{v.status}</span>
                          </div>
                          <div className="space-y-2 text-sm mb-4">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-maroon-500" />
                              <span className="text-maroon-600">Document:</span>
                              <span className="font-medium">{v.documentType}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-maroon-500" />
                              <span className="text-maroon-600">Submitted:</span>
                              <span className="font-medium">{formatDate(v.submittedAt)}</span>
                            </div>
                          </div>
                          {v.status === 'pending' && (
                            <div className="flex gap-2">
                              <button onClick={() => handleApproveVerification(v.id)} disabled={actionLoading === v.id} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 disabled:opacity-50">
                                {actionLoading === v.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                Approve
                              </button>
                              <button onClick={() => handleRejectVerification(v.id)} disabled={actionLoading === v.id} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 disabled:opacity-50">
                                <XCircle className="w-4 h-4" /> Reject
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  <PaginationComponent pagination={pagination} onPageChange={handlePageChange} />
                </motion.div>
              )}

              {/* Subscriptions Tab */}
              {activeTab === 'subscriptions' && (
                <motion.div key="subscriptions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-maroon-400" />
                      <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchData()} className="input pl-10" />
                    </div>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-40">
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="expired">Expired</option>
                      <option value="refunded">Refunded</option>
                    </select>
                    <DateRangePicker startDate={startDate} endDate={endDate} onStartDateChange={setStartDate} onEndDateChange={setEndDate} />
                    <button onClick={fetchData} className="btn-primary">Apply</button>
                  </div>

                  <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-maroon-50 border-b border-gold-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-maroon-800">User</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-maroon-800">Plan</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-maroon-800">Amount</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-maroon-800">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-maroon-800">Started</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-maroon-800">Expires</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-maroon-800">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gold-100">
                          {subscriptions.length === 0 ? (
                            <tr>
                              <td colSpan={7} className="px-6 py-12 text-center text-maroon-600">
                                <CreditCard className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No subscriptions found</p>
                              </td>
                            </tr>
                          ) : (
                            subscriptions.map((sub) => (
                              <tr key={sub.id} className="hover:bg-gold-50/50">
                                <td className="px-6 py-4">
                                  <div>
                                    <p className="font-medium text-maroon-950">{sub.userName}</p>
                                    <p className="text-sm text-maroon-600">{sub.userEmail}</p>
                                  </div>
                                </td>
                                <td className="px-6 py-4 font-medium">{sub.planType}</td>
                                <td className="px-6 py-4 font-medium">{formatCurrency(sub.amount)}</td>
                                <td className="px-6 py-4">
                                  <span className={`badge ${sub.status === 'active' ? 'badge-success' : sub.status === 'refunded' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>{sub.status}</span>
                                </td>
                                <td className="px-6 py-4 text-maroon-700">{formatDate(sub.startedAt)}</td>
                                <td className="px-6 py-4 text-maroon-700">{sub.expiresAt ? formatDate(sub.expiresAt) : '-'}</td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center justify-end gap-2">
                                    {sub.status === 'active' && (
                                      <button onClick={() => handleRefundSubscription(sub.id)} disabled={actionLoading === sub.id} className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200 disabled:opacity-50">
                                        {actionLoading === sub.id ? 'Processing...' : 'Refund'}
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    <PaginationComponent pagination={pagination} onPageChange={handlePageChange} />
                  </div>
                </motion.div>
              )}

              {/* Activity Logs Tab */}
              {activeTab === 'logs' && (
                <motion.div key="logs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input w-48">
                      <option value="all">All Actions</option>
                      <option value="ban_user">Ban User</option>
                      <option value="unban_user">Unban User</option>
                      <option value="approve_verification">Approve Verification</option>
                      <option value="reject_verification">Reject Verification</option>
                      <option value="resolve_report">Resolve Report</option>
                      <option value="refund_subscription">Refund Subscription</option>
                    </select>
                    <DateRangePicker startDate={startDate} endDate={endDate} onStartDateChange={setStartDate} onEndDateChange={setEndDate} />
                    <button onClick={fetchData} className="btn-primary">Apply</button>
                  </div>

                  <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-maroon-50 border-b border-gold-200">
                          <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-maroon-800">Admin</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-maroon-800">Action</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-maroon-800">Target</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-maroon-800">IP Address</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-maroon-800">Time</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gold-100">
                          {logs.length === 0 ? (
                            <tr>
                              <td colSpan={5} className="px-6 py-12 text-center text-maroon-600">
                                <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <p>No activity logs found</p>
                              </td>
                            </tr>
                          ) : (
                            logs.map((log) => (
                              <tr key={log.id} className="hover:bg-gold-50/50">
                                <td className="px-6 py-4 font-medium">{log.adminName}</td>
                                <td className="px-6 py-4">
                                  <span className="badge badge-secondary">{log.action.replace(/_/g, ' ')}</span>
                                </td>
                                <td className="px-6 py-4">
                                  {log.targetType}: {log.targetId || '-'}
                                </td>
                                <td className="px-6 py-4 text-maroon-600 text-sm">{log.ipAddress || '-'}</td>
                                <td className="px-6 py-4 text-maroon-700 text-sm">{new Date(log.createdAt).toLocaleString()}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    <PaginationComponent pagination={pagination} onPageChange={handlePageChange} />
                  </div>
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <UserDetailModal
          userId={selectedUser}
          onClose={() => setSelectedUser(null)}
          onBan={(reason) => handleBanUser(selectedUser, reason)}
          onUnban={() => handleUnbanUser(selectedUser)}
        />
      )}
    </div>
  );
}

export default AdminPage;