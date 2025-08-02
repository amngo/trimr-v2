import { Link } from './index';

export interface DashboardData {
  uniqueVisitors: number;
  mostPopularLink: Link | null;
  clicksOverTime: ClicksOverTimeData[];
  topLinks: TopLinkData[];
  deviceBreakdown: DeviceData[];
  peakClickTime: PeakTimeData | null;
  topCountries: CountryData[];
  recentActivity: ActivityData[];
}

export interface ClicksOverTimeData {
  date: string;
  clicks: number;
}

export interface TopLinkData {
  id: string;
  name: string;
  slug: string;
  clicks: number;
  shortUrl: string;
}

export interface DeviceData {
  device: string;
  clicks: number;
  percentage: number;
}

export interface PeakTimeData {
  hour: number;
  clicks: number;
  label: string;
}

export interface CountryData {
  country: string;
  code: string;
  clicks: number;
}

export interface ActivityData {
  id: string;
  linkId: string;
  linkName: string;
  timestamp: string;
  country: string;
  device: string;
}