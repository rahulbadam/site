import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { isAuthenticated, user, accessToken } = useAuthStore();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      // If not authenticated, no need to check further
      if (!isAuthenticated || !accessToken) {
        setIsAdmin(false);
        setIsChecking(false);
        return;
      }

      // Check if user has admin role from the store
      if (user?.role === 'admin') {
        setIsAdmin(true);
        setIsChecking(false);
        return;
      }

      // If role is not in store, we need to verify with the backend
      // This handles cases where the user object might be stale
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';
        const response = await fetch(`${apiBaseUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.role === 'admin') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Failed to verify admin status:', error);
        setIsAdmin(false);
      }
      
      setIsChecking(false);
    };

    checkAdminStatus();
  }, [isAuthenticated, user, accessToken]);

  // Show loading state while checking admin status
  if (isChecking) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-gold-500 animate-spin mx-auto mb-4" />
          <p className="text-maroon-700">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to home if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-display font-bold text-maroon-950 mb-2">Access Denied</h1>
          <p className="text-maroon-700 mb-6">You don't have admin privileges to access this page.</p>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  // User is authenticated and is admin, render the protected content
  return <>{children}</>;
}

export default ProtectedAdminRoute;