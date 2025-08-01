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
          },

          setSortBy: (sortBy: LinkState['sortBy']) => {
            set((state) => {
              state.sortBy = sortBy;
            });
          },

          setSortOrder: (order: LinkState['sortOrder']) => {
            set((state) => {
              state.sortOrder = order;
            });
          },

          clearError: () => {
            set((state) => {
              state.error = null;
            });
          },

          refreshLinks: async () => {
            return get().fetchLinks();
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

// Utility functions for computed values
export function getFilteredLinks(links: Link[], searchQuery: string, sortBy: LinkState['sortBy'], sortOrder: LinkState['sortOrder']): Link[] {
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
}

export function getTotalClicks(links: Link[]): number {
  return links.reduce((total, link) => total + link.clicks, 0);
}

// Simple selectors that don't create new objects unless necessary
export const useLinks = () => useLinkStore((state) => state.links);
export const useIsLoading = () => useLinkStore((state) => state.isLoading);
export const useIsCreating = () => useLinkStore((state) => state.isCreating);
export const useError = () => useLinkStore((state) => state.error);
export const useSearchQuery = () => useLinkStore((state) => state.searchQuery);
export const useSortBy = () => useLinkStore((state) => state.sortBy);
export const useSortOrder = () => useLinkStore((state) => state.sortOrder);

// Action selectors
export const useFetchLinks = () => useLinkStore((state) => state.fetchLinks);
export const useCreateLink = () => useLinkStore((state) => state.createLink);
export const useSetSearchQuery = () => useLinkStore((state) => state.setSearchQuery);
export const useSetSortBy = () => useLinkStore((state) => state.setSortBy);
export const useSetSortOrder = () => useLinkStore((state) => state.setSortOrder);
export const useClearError = () => useLinkStore((state) => state.clearError);