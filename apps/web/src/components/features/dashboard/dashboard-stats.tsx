'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@/types';
import { 
  Link2, 
  MousePointerClick, 
  Users, 
  TrendingUp,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

interface DashboardStatsProps {
  totalLinks: number;
  totalClicks: number;
  uniqueVisitors: number;
  mostPopularLink: Link | null;
  loading?: boolean;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  loading?: boolean;
}

function StatCard({ title, value, icon, trend, subtitle, loading }: StatCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon}
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-24 mb-2" />
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs flex items-center gap-1 mt-1 ${
            trend.isPositive ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend.isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {Math.abs(trend.value)}% from last week
          </p>
        )}
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardStats({ 
  totalLinks, 
  totalClicks, 
  uniqueVisitors, 
  mostPopularLink,
  loading 
}: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Links"
        value={totalLinks}
        icon={<Link2 className="h-4 w-4 text-muted-foreground" />}
        trend={{ value: 12, isPositive: true }}
        loading={loading}
      />
      
      <StatCard
        title="Total Clicks"
        value={totalClicks.toLocaleString()}
        icon={<MousePointerClick className="h-4 w-4 text-muted-foreground" />}
        trend={{ value: 8, isPositive: true }}
        loading={loading}
      />
      
      <StatCard
        title="Unique Visitors"
        value={uniqueVisitors.toLocaleString()}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
        trend={{ value: 15, isPositive: true }}
        loading={loading}
      />
      
      <StatCard
        title="Most Popular Link"
        value={mostPopularLink?.clicks.toLocaleString() || '0'}
        icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        subtitle={mostPopularLink?.name || 'No links yet'}
        loading={loading}
      />
    </div>
  );
}