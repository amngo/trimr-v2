"use client";

import { useState } from "react";
import { LinkForm } from "@/components/link-form";
import { LinksDashboard } from "@/components/links-dashboard";
import { AuthForm } from "@/components/auth/auth-form";
import { UserProfile } from "@/components/auth/user-profile";
import { useAuth } from "@/contexts/auth-context";

export default function Home() {
  const [refreshCount, setRefreshCount] = useState(0);
  const { user, isLoading } = useAuth();

  const handleLinkCreated = () => {
    // Trigger dashboard refresh
    setRefreshCount(prev => prev + 1);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-2">URL Shortener</h1>
          <p className="text-muted-foreground">
            Create and manage your shortened links
          </p>
        </div>
        
        {!isLoading && (
          <div className="ml-auto">
            {user ? (
              <UserProfile />
            ) : (
              <AuthForm />
            )}
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <LinkForm onSuccess={handleLinkCreated} />
          <LinksDashboard refresh={refreshCount} />
        </div>
      </div>
    </div>
  );
}