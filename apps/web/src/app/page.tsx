'use client';

import { useState } from 'react';
import {
  HeroSection,
  FeaturesSection,
  LinksDashboard,
  AuthForm,
  UserProfile,
} from '@/components';
import { useAuth } from '@/contexts/auth-context';

export default function Home() {
  const [, setRefreshCount] = useState(0);
  const { user, isLoading } = useAuth();

  const handleLinkCreated = () => {
    // Trigger dashboard refresh
    setRefreshCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen">
      <HeroSection onLinkCreated={handleLinkCreated} />
      <FeaturesSection />

      {/* Dashboard Section */}
      <section
        id="dashboard"
        className="py-20 md:py-32 bg-slate-50 dark:bg-slate-800"
      >
        <div className="container mx-auto px-6 md:px-8">
          <div className="flex justify-between items-center mb-16">
            <div className="text-center space-y-6 flex-1">
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-purple-800 dark:from-slate-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                  Your Link Dashboard
                </span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Manage all your shortened links in one beautiful interface.
                Track performance, analyze clicks, and optimize your link
                strategy.
              </p>
            </div>

            {!isLoading && (
              <div className="ml-8">
                {user ? <UserProfile /> : <AuthForm />}
              </div>
            )}
          </div>

          <LinksDashboard />
        </div>
      </section>
    </div>
  );
}
