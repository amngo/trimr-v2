'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { PeakTimeData, CountryData, ActivityData } from '@/types/dashboard';
import { Clock, Globe, Activity } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AdditionalInsightsProps {
  peakTime: PeakTimeData | null;
  topCountries: CountryData[];
  recentActivity: ActivityData[];
  loading?: boolean;
}

function getFlagEmoji(countryCode: string): string {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export function AdditionalInsights({ 
  peakTime, 
  topCountries, 
  recentActivity,
  loading 
}: AdditionalInsightsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Peak Click Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Peak Click Time
          </CardTitle>
          <CardDescription>Most active hour of the day</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <>
              <Skeleton className="h-10 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </>
          ) : peakTime ? (
            <>
              <div className="text-3xl font-bold">{peakTime.label}</div>
              <p className="text-sm text-muted-foreground">
                {peakTime.clicks} clicks on average
              </p>
            </>
          ) : (
            <p className="text-muted-foreground">No data yet</p>
          )}
        </CardContent>
      </Card>

      {/* Top Countries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Top Countries
          </CardTitle>
          <CardDescription>Geographic distribution</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
          ) : topCountries.length > 0 ? (
            <div className="space-y-2">
              {topCountries.map((country) => (
                <div key={country.code} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getFlagEmoji(country.code)}</span>
                    <span className="text-sm font-medium">{country.country}</span>
                  </div>
                  <Badge variant="secondary">{country.clicks}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No data yet</p>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Recent Activity
          </CardTitle>
          <CardDescription>Last 10 link clicks</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i}>
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              ))}
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate">{activity.linkName}</p>
                    <Badge variant="outline" className="text-xs">
                      {activity.device}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {getFlagEmoji(
                      topCountries.find(c => c.country === activity.country)?.code || 'US'
                    )} {activity.country} • {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No activity yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}