import apiClient from '@/lib/api';
import { DashboardData } from '@/types/dashboard';
import { ROUTES } from '@/lib/constants';

/**
 * Fetch dashboard analytics data
 */
export async function getDashboardData(): Promise<DashboardData> {
  // For now, return mock data. This will be replaced with actual API call
  // when the backend endpoint is implemented
  try {
    return await apiClient['request']<DashboardData>(ROUTES.API.DASHBOARD.STATS);
  } catch (error) {
    // Return mock data for development
    console.log('Using mock dashboard data for development');
    return generateMockDashboardData();
  }
}

// Mock data generator for development
export function generateMockDashboardData(): DashboardData {
  const now = new Date();
  
  // Generate clicks over time for last 7 days
  const clicksOverTime = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toISOString().split('T')[0],
      clicks: Math.floor(Math.random() * 100) + 20,
    };
  });

  // Top links data
  const topLinks = [
    { id: '1', name: 'Product Launch', slug: 'launch', clicks: 234, shortUrl: 'https://short.link/launch' },
    { id: '2', name: 'Blog Post', slug: 'blog1', clicks: 189, shortUrl: 'https://short.link/blog1' },
    { id: '3', name: 'Newsletter', slug: 'news', clicks: 156, shortUrl: 'https://short.link/news' },
    { id: '4', name: 'Docs', slug: 'docs', clicks: 134, shortUrl: 'https://short.link/docs' },
    { id: '5', name: 'API Reference', slug: 'api', clicks: 98, shortUrl: 'https://short.link/api' },
  ];

  // Device breakdown
  const deviceBreakdown = [
    { device: 'Desktop', clicks: 567, percentage: 45 },
    { device: 'Mobile', clicks: 489, percentage: 38 },
    { device: 'Tablet', clicks: 212, percentage: 17 },
  ];

  // Peak click time
  const peakClickTime = {
    hour: 14,
    clicks: 89,
    label: '2:00 PM',
  };

  // Top countries
  const topCountries = [
    { country: 'United States', code: 'US', clicks: 456 },
    { country: 'United Kingdom', code: 'GB', clicks: 234 },
    { country: 'Canada', code: 'CA', clicks: 189 },
    { country: 'Germany', code: 'DE', clicks: 156 },
    { country: 'France', code: 'FR', clicks: 123 },
  ];

  // Recent activity
  const recentActivity = Array.from({ length: 10 }, (_, i) => {
    const timestamp = new Date(now);
    timestamp.setMinutes(timestamp.getMinutes() - i * 5);
    return {
      id: `activity-${i}`,
      linkId: topLinks[i % 5].id,
      linkName: topLinks[i % 5].name,
      timestamp: timestamp.toISOString(),
      country: topCountries[i % 5].country,
      device: deviceBreakdown[i % 3].device,
    };
  });

  return {
    uniqueVisitors: 892,
    mostPopularLink: {
      id: '1',
      name: 'Product Launch',
      slug: 'launch',
      original: 'https://example.com/product-launch-announcement',
      clicks: 234,
      uniqueClicks: 189,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      shortUrl: 'https://short.link/launch',
      isActive: true,
      isExpired: false,
      disabled: false,
    },
    clicksOverTime,
    topLinks,
    deviceBreakdown,
    peakClickTime,
    topCountries,
    recentActivity,
  };
}