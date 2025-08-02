"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";

export default function LinkAccessPage() {
  const params = useParams();
  const slug = params.slug as string;

  useEffect(() => {
    if (slug) {
      // Immediately redirect to the backend endpoint
      // The backend will handle all logic including:
      // - Password protection checks
      // - Click tracking
      // - Final redirect to the original URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
      
      // For non-password protected links, this will redirect immediately
      // For password-protected links, backend will return a 401 with instructions
      window.location.href = `${apiUrl}/${slug}`;
    }
  }, [slug]);

  // Show a minimal loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}