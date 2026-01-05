import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'manager' | 'developer';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, role, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-section-alt px-4">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="mb-6 text-muted-foreground">
            You don't have permission to access the admin dashboard.
            <br />
            Please contact an administrator to get access.
          </p>
          <a href="/" className="text-primary hover:underline">
            ← Back to website
          </a>
        </div>
      </div>
    );
  }

  if (requiredRole === 'admin' && role !== 'admin') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-section-alt px-4">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-foreground">Admin Only</h1>
          <p className="mb-6 text-muted-foreground">
            This section is only accessible to administrators.
          </p>
          <a href="/admin" className="text-primary hover:underline">
            ← Back to dashboard
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
