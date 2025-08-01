// Link management store
export {
  useLinkStore,
  useLinks,
  useIsLoading,
  useIsCreating,
  useError,
  useSearchQuery,
  useSortBy,
  useSortOrder,
  useFetchLinks,
  useCreateLink,
  useSetSearchQuery,
  useSetSortBy,
  useSetSortOrder,
  useClearError,
  getFilteredLinks,
  getTotalClicks,
  type LinkState,
} from './link-store';

// UI state store
export {
  useUIStore,
  useTheme,
  useLayout,
  useModals,
  useToasts,
  useGlobalState,
  type UIState,
  type Theme,
  type Toast,
  type ToastType,
} from './ui-store';

// Store utilities and hooks
export * from './utils';