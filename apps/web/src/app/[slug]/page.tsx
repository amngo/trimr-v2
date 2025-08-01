"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { checkLinkAccess } from "@/lib/api";
import { PasswordPrompt } from "@/components";
import { Skeleton } from "@/components/ui/skeleton";

export default function LinkAccessPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [loading, setLoading] = useState(true);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        setLoading(true);
        const response = await checkLinkAccess(slug);
        
        if (response.passwordRequired) {
          setNeedsPassword(true);
        } else if (response.originalUrl) {
          // Redirect to the original URL
          window.location.href = response.originalUrl;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to access link");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      checkAccess();
    }
  }, [slug]);

  const handlePasswordSuccess = (originalUrl: string) => {
    window.location.href = originalUrl;
  };

  const handleCancel = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-16 w-16 rounded-full mx-auto" />
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">{error}</p>
          <button 
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (needsPassword) {
    return (
      <PasswordPrompt 
        slug={slug}
        onSuccess={handlePasswordSuccess}
        onCancel={handleCancel}
      />
    );
  }

  return null;
}