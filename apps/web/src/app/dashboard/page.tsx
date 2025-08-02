'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useLinkStore, getTotalClicks } from '@/stores/link-store';
import { DashboardStats } from '@/components/features/dashboard/dashboard-stats';
import { ClicksChart } from '@/components/features/dashboard/clicks-chart';
import { TopLinksChart } from '@/components/features/dashboard/top-links-chart';
import { DeviceChart } from '@/components/features/dashboard/device-chart';
import { AdditionalInsights } from '@/components/features/dashboard/additional-insights';
import { LinksDashboard } from '@/components/features/links/links-dashboard';
import { StaggerContainer, SlideUp } from '@/components/common/animated-container';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getDashboardData } from '@/lib/api/dashboard';
import type { DashboardData } from '@/types/dashboard';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { links, fetchLinks, isLoading } = useLinkStore();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setDataLoading(true);
        setError(null);
        
        // Fetch links data
        await fetchLinks();
        
        // Fetch dashboard analytics data
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard error:', err);
      } finally {
        setDataLoading(false);
      }
    };

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, fetchLinks]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const loading = isLoading || dataLoading;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <StaggerContainer>
          {/* Header */}
          <SlideUp className="mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Monitor your links performance and analytics
            </p>
          </SlideUp>

          {/* Stats Overview */}
          <SlideUp delay={0.1} className="mb-8">
            <DashboardStats
              totalLinks={links.length}
              totalClicks={getTotalClicks(links)}
              uniqueVisitors={dashboardData?.uniqueVisitors || 0}
              mostPopularLink={dashboardData?.mostPopularLink || null}
              loading={loading}
            />
          </SlideUp>

          {/* Tabs for different sections */}
          <SlideUp delay={0.2}>
            <Tabs defaultValue="analytics" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="links">My Links</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* Clicks Over Time */}
                  <div className="lg:col-span-2">
                    <ClicksChart
                      data={dashboardData?.clicksOverTime || []}
                      loading={loading}
                    />
                  </div>

                  {/* Device Breakdown */}
                  <div>
                    <DeviceChart
                      data={dashboardData?.deviceBreakdown || []}
                      loading={loading}
                    />
                  </div>
                </div>

                {/* Top 5 Links */}
                <TopLinksChart
                  links={dashboardData?.topLinks || []}
                  loading={loading}
                />
              </TabsContent>

              {/* Links Tab */}
              <TabsContent value="links">
                <LinksDashboard />
              </TabsContent>

              {/* Insights Tab */}
              <TabsContent value="insights">
                <AdditionalInsights
                  peakTime={dashboardData?.peakClickTime || null}
                  topCountries={dashboardData?.topCountries || []}
                  recentActivity={dashboardData?.recentActivity || []}
                  loading={loading}
                />
              </TabsContent>
            </Tabs>
          </SlideUp>
        </StaggerContainer>
      </div>
    </div>
  );
}