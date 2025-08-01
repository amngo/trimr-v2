import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { Link, createLink as apiCreateLink, getLinks as apiGetLinks } from '@/lib/api';

export interface LinkState {
  // Data
  links: Link[];
  
  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  
  // UI states
  selectedLink: Link | null;
  searchQuery: string;
  sortBy: 'createdAt' | 'clicks' | 'name';
  sortOrder: 'asc' | 'desc';
  
  // Actions
  fetchLinks: () => Promise<void>;
  createLink: (url: string, name?: string) => Promise<Link | null>;
  selectLink: (link: Link | null) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: LinkState['sortBy']) => void;
  setSortOrder: (order: LinkState['sortOrder']) => void;
  clearError: () => void;
  refreshLinks: () => Promise<void>;
  
  // Computed
  filteredLinks: Link[];
  totalClicks: number;
  linkCount: number;
  
  // Helper methods
  computeFilteredLinks: () => Link[];
  computeTotalClicks: () => number;
  updateComputedValues: () => void;
}

export const useLinkStore = create<LinkState>()(
  subscribeWithSelector(
    immer(
      persist(
        (set, get) => ({
          // Initial state
          links: [],
          isLoading: false,
          isCreating: false,
          error: null,
          selectedLink: null,
          searchQuery: '',
          sortBy: 'createdAt',
          sortOrder: 'desc',

          // Actions
          fetchLinks: async () => {
            set((state) => {
              state.isLoading = true;
              state.error = null;
            });

            try {
              const links = await apiGetLinks();
              set((state) => {
                state.links = links;
                state.isLoading = false;
              });
              get().updateComputedValues();
            } catch (error) {
              set((state) => {
                state.error = error instanceof Error ? error.message : 'Failed to fetch links';
                state.isLoading = false;
              });
            }
          },

          createLink: async (url: string, name?: string) => {
            set((state) => {
              state.isCreating = true;
              state.error = null;
            });

            try {
              const response = await apiCreateLink({ url, name });
              // We need to fetch the full link data since the API only returns shortUrl and slug
              await get().fetchLinks();
              
              set((state) => {
                state.isCreating = false;
              });

              // Find and return the newly created link
              const newLink = get().links.find(link => link.shortUrl === response.shortUrl);
              return newLink || null;
            } catch (error) {
              set((state) => {
                state.error = error instanceof Error ? error.message : 'Failed to create link';
                state.isCreating = false;
              });
              return null;
            }
          },

          selectLink: (link: Link | null) => {
            set((state) => {
              state.selectedLink = link;
            });
          },

          setSearchQuery: (query: string) => {
            set((state) => {
              state.searchQuery = query;
            });
            get().updateComputedValues();
          },

          setSortBy: (sortBy: LinkState['sortBy']) => {
            set((state) => {
              state.sortBy = sortBy;
            });
            get().updateComputedValues();
          },

          setSortOrder: (order: LinkState['sortOrder']) => {
            set((state) => {
              state.sortOrder = order;
            });
            get().updateComputedValues();
          },

          clearError: () => {
            set((state) => {
              state.error = null;
            });
          },

          refreshLinks: async () => {
            return get().fetchLinks();
          },

          // Computed properties - these will be functions to avoid getter issues
          filteredLinks: [],
          totalClicks: 0,
          linkCount: 0,

          // Helper methods to compute derived state
          computeFilteredLinks: () => {
            const state = get();
            const { links, searchQuery, sortBy, sortOrder } = state;
            
            let filtered = [...links];

            // Apply search filter
            if (searchQuery.trim()) {
              const query = searchQuery.toLowerCase().trim();
              filtered = filtered.filter(link => 
                (link.name?.toLowerCase().includes(query)) ||
                link.original.toLowerCase().includes(query) ||
                link.slug.toLowerCase().includes(query)
              );
            }

            // Apply sorting
            filtered.sort((a, b) => {
              let comparison = 0;
              
              switch (sortBy) {
                case 'createdAt':
                  comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                  break;
                case 'clicks':
                  comparison = a.clicks - b.clicks;
                  break;
                case 'name':
                  const aName = a.name || '';
                  const bName = b.name || '';
                  comparison = aName.localeCompare(bName);
                  break;
              }

              return sortOrder === 'asc' ? comparison : -comparison;
            });

            return filtered;
          },

          computeTotalClicks: () => {
            return get().links.reduce((total, link) => total + link.clicks, 0);
          },

          updateComputedValues: () => {
            const state = get();
            set((draft) => {
              draft.filteredLinks = state.computeFilteredLinks();
              draft.totalClicks = state.computeTotalClicks();
              draft.linkCount = state.links.length;
            });
          },
        }),
        {
          name: 'url-shortener-links',
          // Only persist non-sensitive data
          partialize: (state) => ({
            searchQuery: state.searchQuery,
            sortBy: state.sortBy,
            sortOrder: state.sortOrder,
          }),
        }
      )
    )
  )
);

// SSR-safe selectors with proper memoization
export const useLinkData = () => {
  return useLinkStore((state) => ({
    links: state.filteredLinks,
    totalClicks: state.totalClicks,
    linkCount: state.linkCount,
  }));
};

export const useLinkActions = () => {
  return useLinkStore((state) => ({
    fetchLinks: state.fetchLinks,
    createLink: state.createLink,
    refreshLinks: state.refreshLinks,
    selectLink: state.selectLink,
    clearError: state.clearError,
  }));
};

export const useLinkUI = () => {
  return useLinkStore((state) => ({
    isLoading: state.isLoading,
    isCreating: state.isCreating,
    error: state.error,
    selectedLink: state.selectedLink,
    searchQuery: state.searchQuery,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    setSearchQuery: state.setSearchQuery,
    setSortBy: state.setSortBy,
    setSortOrder: state.setSortOrder,
  }));
};