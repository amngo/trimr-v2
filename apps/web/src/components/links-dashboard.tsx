"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getLinks, Link } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Copy, 
  ExternalLink, 
  Clock, 
  Calendar, 
  Lock, 
  Eye, 
  Users, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Pause
} from "lucide-react";

export function LinksDashboard({ refresh }: { refresh?: number }) {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchLinks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLinks();
      setLinks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch links");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [refresh]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getStatusBadge = (link: Link) => {
    if (link.isExpired) {
      return (
        <Badge variant="destructive" className="flex items-center space-x-1">
          <XCircle className="w-3 h-3" />
          <span>Expired</span>
        </Badge>
      );
    }
    
    if (!link.isActive) {
      return (
        <Badge variant="secondary" className="flex items-center space-x-1">
          <Pause className="w-3 h-3" />
          <span>Scheduled</span>
        </Badge>
      );
    }
    
    return (
      <Badge variant="default" className="flex items-center space-x-1 bg-green-500 hover:bg-green-600">
        <CheckCircle className="w-3 h-3" />
        <span>Active</span>
      </Badge>
    );
  };

  const getFeatureBadges = (link: Link) => {
    const badges = [];
    
    if (link.expiresAt) {
      badges.push(
        <Badge key="expiry" variant="outline" className="flex items-center space-x-1">
          <Calendar className="w-3 h-3" />
          <span>Expires</span>
        </Badge>
      );
    }
    
    if (link.activeFrom) {
      badges.push(
        <Badge key="scheduled" variant="outline" className="flex items-center space-x-1">
          <Clock className="w-3 h-3" />
          <span>Scheduled</span>
        </Badge>
      );
    }
    
    // We can't directly check if password exists from the API response for security,
    // but we can infer it from other indicators if needed
    
    return badges;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Links</CardTitle>
          <CardDescription>Manage your shortened links</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Links</CardTitle>
          <CardDescription>Manage your shortened links</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (links.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Links</CardTitle>
          <CardDescription>Manage your shortened links</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <Eye className="w-8 h-8 text-slate-400" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
              No links created yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Create your first short link using the form above!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <span>Your Links</span>
              </CardTitle>
              <CardDescription>
                Manage your shortened links ({links.length} total)
              </CardDescription>
            </div>
            
            {/* Summary Stats */}
            <div className="flex space-x-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-green-600 dark:text-green-400">
                  {links.filter(l => l.isActive && !l.isExpired).length}
                </div>
                <div className="text-slate-500">Active</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-600 dark:text-blue-400">
                  {links.reduce((sum, l) => sum + l.clicks, 0)}
                </div>
                <div className="text-slate-500">Total Clicks</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-purple-600 dark:text-purple-400">
                  {links.reduce((sum, l) => sum + l.uniqueClicks, 0)}
                </div>
                <div className="text-slate-500">Unique Clicks</div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                  <TableHead className="font-semibold">Link Details</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-center">Analytics</TableHead>
                  <TableHead className="font-semibold">Timing</TableHead>
                  <TableHead className="font-semibold text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((link, index) => (
                  <motion.tr
                    key={link.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <TableCell className="space-y-2">
                      <div className="space-y-1">
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {link.name || (
                            <span className="text-slate-500 italic">Untitled Link</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <code className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono text-blue-600 dark:text-blue-400">
                            {link.shortUrl}
                          </code>
                          <div className="flex space-x-1">
                            {getFeatureBadges(link)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {getStatusBadge(link)}
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className="flex items-center justify-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4 text-slate-500" />
                            <span className="font-medium">{link.clicks}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-slate-500" />
                            <span className="font-medium text-purple-600 dark:text-purple-400">
                              {link.uniqueClicks}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-slate-500">
                          {link.uniqueClicks > 0 ? 
                            `${Math.round((link.uniqueClicks / link.clicks) * 100)}% unique` :
                            'No clicks yet'
                          }
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell className="space-y-1">
                      <div className="text-sm space-y-1">
                        <div className="text-slate-600 dark:text-slate-400">
                          Created: {formatDate(link.createdAt)}
                        </div>
                        {link.activeFrom && (
                          <div className="text-blue-600 dark:text-blue-400 text-xs">
                            Active: {formatDate(link.activeFrom)}
                          </div>
                        )}
                        {link.expiresAt && (
                          <div className="text-amber-600 dark:text-amber-400 text-xs">
                            Expires: {formatDate(link.expiresAt)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(link.shortUrl)}
                          className="hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(link.shortUrl, "_blank")}
                          className="hover:bg-green-50 dark:hover:bg-green-900/20"
                          disabled={!link.isActive || link.isExpired}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}