'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/lib/api';
import {
  useLinks,
  useIsLoading,
  useError,
  useFetchLinks,
  useSearchQuery,
  useSortBy,
  useSortOrder,
  getFilteredLinks,
} from '@/stores/link-store';
import { useLinkToasts } from '@/stores/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Favicon } from '@/components/ui/favicon';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Copy,
  ExternalLink,
  Clock,
  Calendar,
  Eye,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Pause,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Switch } from '@/components/ui/switch';
import { deleteLink, updateLink } from '@/lib/api';
import { useState } from 'react';

export function LinksDashboard() {
  // Zustand stores
  const allLinks = useLinks();
  const searchQuery = useSearchQuery();
  const sortBy = useSortBy();
  const sortOrder = useSortOrder();
  const isLoading = useIsLoading();
  const error = useError();
  const fetchLinks = useFetchLinks();

  // Local state for operations
  const [deletingLinkId, setDeletingLinkId] = useState<string | null>(null);
  const [togglingLinkId, setTogglingLinkId] = useState<string | null>(null);

  // Computed values
  const links = getFilteredLinks(allLinks, searchQuery, sortBy, sortOrder);

  const { showLinkCopied } = useLinkToasts();

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showLinkCopied();
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      setDeletingLinkId(linkId);
      await deleteLink(linkId);
      await fetchLinks(); // Refresh the list
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to delete link:', err);
      // You could add an error toast here
    } finally {
      setDeletingLinkId(null);
    }
  };

  const handleToggleDisabled = async (
    linkId: string,
    currentDisabled: boolean,
  ) => {
    try {
      setTogglingLinkId(linkId);
      await updateLink(linkId, { disabled: !currentDisabled });
      await fetchLinks(); // Refresh the list
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to toggle link status:', err);
      // You could add an error toast here
    } finally {
      setTogglingLinkId(null);
    }
  };

  const getStatusBadge = (link: Link) => {
    if (link.disabled) {
      return (
        <Badge
          variant="secondary"
          className="flex items-center space-x-1 bg-gray-500 hover:bg-gray-600"
        >
          <Pause className="w-3 h-3" />
          <span>Disabled</span>
        </Badge>
      );
    }

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
      <Badge
        variant="default"
        className="flex items-center space-x-1 bg-green-500 hover:bg-green-600"
      >
        <CheckCircle className="w-3 h-3" />
        <span>Active</span>
      </Badge>
    );
  };

  const getFeatureBadges = (link: Link) => {
    const badges = [];

    if (link.expiresAt) {
      badges.push(
        <Badge
          key="expiry"
          variant="outline"
          className="flex items-center space-x-1"
        >
          <Calendar className="w-3 h-3" />
          <span>Expires</span>
        </Badge>,
      );
    }

    if (link.activeFrom) {
      badges.push(
        <Badge
          key="scheduled"
          variant="outline"
          className="flex items-center space-x-1"
        >
          <Clock className="w-3 h-3" />
          <span>Scheduled</span>
        </Badge>,
      );
    }

    // We can't directly check if password exists from the API response for security,
    // but we can infer it from other indicators if needed

    return badges;
  };

  if (isLoading) {
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
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
                <Eye className="w-8 h-8 text-slate-400" />
              </div>
            </div>
            <h3 className="text-lg font-medium mb-2">No links created yet</h3>
            <p className="text-muted-foreground mb-4">
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
                <div className="font-semiboldtext-green-400">
                  {links.filter((l) => l.isActive && !l.isExpired).length}
                </div>
                <div className="text-slate-500">Active</div>
              </div>
              <div className="text-center">
                <div className="font-semiboldtext-blue-400">
                  {links.reduce((sum, l) => sum + l.clicks, 0)}
                </div>
                <div className="text-slate-500">Total Clicks</div>
              </div>
              <div className="text-center">
                <div className="font-semiboldtext-purple-400">
                  {links.reduce((sum, l) => sum + l.uniqueClicks, 0)}
                </div>
                <div className="text-slate-500">Unique Clicks</div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-white/20 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-800/50">
                  <TableHead className="font-semibold">Link Details</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold text-center">
                    Analytics
                  </TableHead>
                  <TableHead className="font-semibold">Timing</TableHead>
                  <TableHead className="font-semibold text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {links.map((link, index) => (
                  <motion.tr
                    key={link.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group hover:bg-slate-800/50 transition-colors"
                  >
                    <TableCell className="space-y-2">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-3">
                          <Favicon
                            url={link.original}
                            size="md"
                            className="flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-slate-100 truncate">
                              {link.name || (
                                <span className="text-slate-500 italic">
                                  Untitled Link
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {link.original}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <code className="px-2 py-1 bg-slate-800 rounded text-xs font-mono text-blue-400">
                            {link.shortUrl}
                          </code>
                          <div className="flex space-x-1">
                            {getFeatureBadges(link)}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>{getStatusBadge(link)}</TableCell>

                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <div className="flex items-center justify-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4 text-slate-500" />
                            <span className="font-medium">{link.clicks}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-slate-500" />
                            <span className="font-medium text-purple-400">
                              {link.uniqueClicks}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {link.uniqueClicks > 0
                            ? `${Math.round((link.uniqueClicks / link.clicks) * 100)}% unique`
                            : 'No clicks yet'}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="space-y-1">
                      <div className="text-xs space-y-1">
                        <div className="text-muted-foreground">
                          Created: {formatDate(link.createdAt)}
                        </div>
                        {link.activeFrom && (
                          <div className="text-blue-400">
                            Active: {formatDate(link.activeFrom)}
                          </div>
                        )}
                        {link.expiresAt && (
                          <div className="text-amber-400">
                            Expires: {formatDate(link.expiresAt)}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Disable/Enable Toggle */}
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={!link.disabled}
                            onCheckedChange={() =>
                              handleToggleDisabled(link.id, link.disabled)
                            }
                            disabled={togglingLinkId === link.id}
                            className="data-[state=checked]:bg-green-500"
                          />
                        </div>

                        {/* More Actions Dropdown */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-slate-800"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => copyToClipboard(link.shortUrl)}
                            >
                              <Copy className="w-4 h-4 mr-2" />
                              Copy Link
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                window.open(link.shortUrl, '_blank')
                              }
                              disabled={
                                !link.isActive ||
                                link.isExpired ||
                                link.disabled
                              }
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Visit Link
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                  className="text-red-400 focus:text-red-400"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete Link
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Delete Link
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this link?
                                    This action cannot be undone and all click
                                    analytics will be lost.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteLink(link.id)}
                                    disabled={deletingLinkId === link.id}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    {deletingLinkId === link.id
                                      ? 'Deleting...'
                                      : 'Delete'}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
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
