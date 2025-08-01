import { useEffect, useCallback } from 'react';
import { useLinkStore, useUIStore } from './index';

// Custom hook to initialize stores
export const useStoreInitialization = () => {
  const fetchLinks = useLinkStore((state) => state.fetchLinks);
  const setGlobalLoading = useUIStore((state) => state.setGlobalLoading);

  useEffect(() => {
    // Initialize link data on app start
    const initializeData = async () => {
      setGlobalLoading(true);
      try {
        await fetchLinks();
      } catch (error) {
        console.error('Failed to initialize data:', error);
      } finally {
        setGlobalLoading(false);
      }
    };

    initializeData();
  }, [fetchLinks, setGlobalLoading]);
};

// Custom hook for toast notifications with link operations
export const useLinkToasts = () => {
  const addToast = useUIStore((state) => state.addToast);

  const showLinkCreated = useCallback((linkName?: string) => {
    addToast({
      type: 'success',
      title: 'Link Created!',
      description: linkName 
        ? `"${linkName}" has been shortened successfully.`
        : 'Your link has been shortened successfully.',
      duration: 4000,
    });
  }, [addToast]);

  const showLinkError = useCallback((error: string) => {
    addToast({
      type: 'error',
      title: 'Link Creation Failed',
      description: error,
      duration: 6000,
    });
  }, [addToast]);

  const showLinkCopied = useCallback(() => {
    addToast({
      type: 'success',
      title: 'Copied!',
      description: 'Link copied to clipboard.',
      duration: 2000,
    });
  }, [addToast]);

  const showLinksRefreshed = useCallback(() => {
    addToast({
      type: 'info',
      title: 'Refreshed',
      description: 'Your links have been updated.',
      duration: 2000,
    });
  }, [addToast]);

  return {
    showLinkCreated,
    showLinkError,
    showLinkCopied,
    showLinksRefreshed,
  };
};

// Custom hook for keyboard shortcuts
export const useKeyboardShortcuts = () => {
  const toggleGlobalSearch = useUIStore((state) => state.toggleGlobalSearch);
  const openLinkModal = useUIStore((state) => state.openLinkModal);
  const refreshLinks = useLinkStore((state) => state.refreshLinks);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + K for global search
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        toggleGlobalSearch();
      }

      // Cmd/Ctrl + N for new link
      if ((event.metaKey || event.ctrlKey) && event.key === 'n') {
        event.preventDefault();
        openLinkModal();
      }

      // Cmd/Ctrl + R for refresh
      if ((event.metaKey || event.ctrlKey) && event.key === 'r') {
        event.preventDefault();
        refreshLinks();
      }

      // Escape to close modals/search
      if (event.key === 'Escape') {
        useUIStore.getState().setGlobalSearchOpen(false);
        useUIStore.getState().closeLinkModal();
        useUIStore.getState().closeSettingsModal();
        useUIStore.getState().closeDeleteConfirm();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleGlobalSearch, openLinkModal, refreshLinks]);
};

// Custom hook to sync stores with external events
export const useStoreSync = () => {
  const refreshLinks = useLinkStore((state) => state.refreshLinks);
  const addToast = useUIStore((state) => state.addToast);

  useEffect(() => {
    // Listen for focus events to refresh data
    const handleFocus = () => {
      refreshLinks();
    };

    // Listen for online/offline events
    const handleOnline = () => {
      addToast({
        type: 'success',
        title: 'Back Online',
        description: 'Connection restored. Refreshing data...',
        duration: 3000,
      });
      refreshLinks();
    };

    const handleOffline = () => {
      addToast({
        type: 'warning',
        title: 'Connection Lost',
        description: 'You are now offline. Some features may be limited.',
        duration: 5000,
      });
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [refreshLinks, addToast]);
};

// Utility function to create optimistic updates
export const createOptimisticUpdate = <T>(
  updateFn: () => Promise<T>,
  revertFn: () => void,
  onError?: (error: Error) => void
) => {
  return async (): Promise<T | null> => {
    try {
      return await updateFn();
    } catch (error) {
      revertFn();
      if (onError && error instanceof Error) {
        onError(error);
      }
      return null;
    }
  };
};

// Hook for debounced search
export const useDebouncedSearch = (delay: number = 300) => {
  const setSearchQuery = useLinkStore((state) => state.setSearchQuery);

  const debouncedSetSearch = useCallback(
    debounce(setSearchQuery, delay),
    [setSearchQuery, delay]
  );

  return debouncedSetSearch;
};

// Simple debounce utility
function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}