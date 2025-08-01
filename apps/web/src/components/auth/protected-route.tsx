"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { Loader2, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
    <motion.div
      className="flex flex-col items-center space-y-4"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="w-12 h-12 text-blue-600" />
      </motion.div>
      <p className="text-slate-600 dark:text-slate-300 font-medium">
        Checking authentication...
      </p>
    </motion.div>
  </div>
);

const AuthRequiredScreen = ({ onGoHome }: { onGoHome: () => void }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-6">
    <motion.div
      className="w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <motion.div
            className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Lock className="w-8 h-8 text-white" />
          </motion.div>
          <div>
            <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              Authentication Required
            </CardTitle>
            <CardDescription className="text-slate-600 dark:text-slate-300 mt-2">
              You need to be logged in to access this page. Please sign in to continue.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button 
              onClick={onGoHome}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12"
            >
              <span>Go to Home & Sign In</span>
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Don't have an account? You can create one on the home page.
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  </div>
);

export function ProtectedRoute({ 
  children, 
  fallback, 
  redirectTo = "/" 
}: ProtectedRouteProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect after loading is complete and user is not authenticated
    if (!isLoading && !isAuthenticated) {
      // Optional: Add a small delay to show the auth required screen
      const timer = setTimeout(() => {
        router.push(redirectTo);
      }, 2000); // Show auth required screen for 2 seconds before redirecting

      return () => clearTimeout(timer);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Show auth required screen or custom fallback for unauthenticated users
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <AuthRequiredScreen 
        onGoHome={() => router.push(redirectTo)}
      />
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}

// Higher-order component for easier use
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: ReactNode;
    redirectTo?: string;
  }
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute 
        fallback={options?.fallback} 
        redirectTo={options?.redirectTo}
      >
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}