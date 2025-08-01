import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

export interface UIState {
  // Theme
  theme: Theme;
  isDarkMode: boolean;

  // Layout
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;

  // Modals and dialogs
  isLinkModalOpen: boolean;
  isSettingsModalOpen: boolean;
  isDeleteConfirmOpen: boolean;

  // Toasts
  toasts: Toast[];

  // Loading states
  globalLoading: boolean;

  // Search and filters
  globalSearchOpen: boolean;

  // Actions
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;

  // Modal actions
  openLinkModal: () => void;
  closeLinkModal: () => void;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;
  openDeleteConfirm: () => void;
  closeDeleteConfirm: () => void;

  // Toast actions
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;

  // Global loading
  setGlobalLoading: (loading: boolean) => void;

  // Search
  toggleGlobalSearch: () => void;
  setGlobalSearchOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>()(
  subscribeWithSelector(
    immer(
      persist(
        (set, get) => ({
          // Initial state
          theme: 'system',
          isDarkMode: false,
          sidebarOpen: true,
          mobileMenuOpen: false,
          isLinkModalOpen: false,
          isSettingsModalOpen: false,
          isDeleteConfirmOpen: false,
          toasts: [],
          globalLoading: false,
          globalSearchOpen: false,

          // Theme actions
          setTheme: (theme: Theme) => {
            set((state) => {
              state.theme = theme;

              // Update isDarkMode based on theme
              if (theme === 'dark') {
                state.isDarkMode = true;
              } else if (theme === 'light') {
                state.isDarkMode = false;
              } else {
                // System theme - check system preference
                state.isDarkMode = window.matchMedia(
                  '(prefers-color-scheme: dark)',
                ).matches;
              }
            });

            // Apply theme to document
            const root = window.document.documentElement;
            const { isDarkMode } = get();

            if (isDarkMode) {
              root.classList.add('dark');
            } else {
              root.classList.remove('dark');
            }
          },

          // Layout actions
          toggleSidebar: () => {
            set((state) => {
              state.sidebarOpen = !state.sidebarOpen;
            });
          },

          setSidebarOpen: (open: boolean) => {
            set((state) => {
              state.sidebarOpen = open;
            });
          },

          toggleMobileMenu: () => {
            set((state) => {
              state.mobileMenuOpen = !state.mobileMenuOpen;
            });
          },

          setMobileMenuOpen: (open: boolean) => {
            set((state) => {
              state.mobileMenuOpen = open;
            });
          },

          // Modal actions
          openLinkModal: () => {
            set((state) => {
              state.isLinkModalOpen = true;
            });
          },

          closeLinkModal: () => {
            set((state) => {
              state.isLinkModalOpen = false;
            });
          },

          openSettingsModal: () => {
            set((state) => {
              state.isSettingsModalOpen = true;
            });
          },

          closeSettingsModal: () => {
            set((state) => {
              state.isSettingsModalOpen = false;
            });
          },

          openDeleteConfirm: () => {
            set((state) => {
              state.isDeleteConfirmOpen = true;
            });
          },

          closeDeleteConfirm: () => {
            set((state) => {
              state.isDeleteConfirmOpen = false;
            });
          },

          // Toast actions
          addToast: (toast: Omit<Toast, 'id'>) => {
            const id = Math.random().toString(36).substring(2, 9);
            const newToast: Toast = {
              ...toast,
              id,
              duration: toast.duration || 5000,
            };

            set((state) => {
              state.toasts.push(newToast);
            });

            // Auto-remove toast after duration
            if (newToast.duration && newToast.duration > 0) {
              setTimeout(() => {
                get().removeToast(id);
              }, newToast.duration);
            }
          },

          removeToast: (id: string) => {
            set((state) => {
              state.toasts = state.toasts.filter((toast) => toast.id !== id);
            });
          },

          clearToasts: () => {
            set((state) => {
              state.toasts = [];
            });
          },

          // Global loading
          setGlobalLoading: (loading: boolean) => {
            set((state) => {
              state.globalLoading = loading;
            });
          },

          // Search actions
          toggleGlobalSearch: () => {
            set((state) => {
              state.globalSearchOpen = !state.globalSearchOpen;
            });
          },

          setGlobalSearchOpen: (open: boolean) => {
            set((state) => {
              state.globalSearchOpen = open;
            });
          },
        }),
        {
          name: 'url-shortener-ui',
          // Persist theme and layout preferences
          partialize: (state) => ({
            theme: state.theme,
            sidebarOpen: state.sidebarOpen,
          }),
        },
      ),
    ),
  ),
);

// Selectors for specific pieces of UI state - using individual properties to avoid object recreation
export const useTheme = () => {
  const theme = useUIStore((state) => state.theme);
  const isDarkMode = useUIStore((state) => state.isDarkMode);
  const setTheme = useUIStore((state) => state.setTheme);
  
  return { theme, isDarkMode, setTheme };
};

export const useLayout = () => {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const mobileMenuOpen = useUIStore((state) => state.mobileMenuOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);
  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu);
  const setMobileMenuOpen = useUIStore((state) => state.setMobileMenuOpen);
  
  return {
    sidebarOpen,
    mobileMenuOpen,
    toggleSidebar,
    setSidebarOpen,
    toggleMobileMenu,
    setMobileMenuOpen,
  };
};

export const useModals = () => {
  const isLinkModalOpen = useUIStore((state) => state.isLinkModalOpen);
  const isSettingsModalOpen = useUIStore((state) => state.isSettingsModalOpen);
  const isDeleteConfirmOpen = useUIStore((state) => state.isDeleteConfirmOpen);
  const openLinkModal = useUIStore((state) => state.openLinkModal);
  const closeLinkModal = useUIStore((state) => state.closeLinkModal);
  const openSettingsModal = useUIStore((state) => state.openSettingsModal);
  const closeSettingsModal = useUIStore((state) => state.closeSettingsModal);
  const openDeleteConfirm = useUIStore((state) => state.openDeleteConfirm);
  const closeDeleteConfirm = useUIStore((state) => state.closeDeleteConfirm);
  
  return {
    isLinkModalOpen,
    isSettingsModalOpen,
    isDeleteConfirmOpen,
    openLinkModal,
    closeLinkModal,
    openSettingsModal,
    closeSettingsModal,
    openDeleteConfirm,
    closeDeleteConfirm,
  };
};

export const useToasts = () => {
  const toasts = useUIStore((state) => state.toasts);
  const addToast = useUIStore((state) => state.addToast);
  const removeToast = useUIStore((state) => state.removeToast);
  const clearToasts = useUIStore((state) => state.clearToasts);
  
  return { toasts, addToast, removeToast, clearToasts };
};

export const useGlobalState = () => {
  const globalLoading = useUIStore((state) => state.globalLoading);
  const globalSearchOpen = useUIStore((state) => state.globalSearchOpen);
  const setGlobalLoading = useUIStore((state) => state.setGlobalLoading);
  const toggleGlobalSearch = useUIStore((state) => state.toggleGlobalSearch);
  const setGlobalSearchOpen = useUIStore((state) => state.setGlobalSearchOpen);
  
  return {
    globalLoading,
    globalSearchOpen,
    setGlobalLoading,
    toggleGlobalSearch,
    setGlobalSearchOpen,
  };
};

// Initialize theme on app start
if (typeof window !== 'undefined') {
  const store = useUIStore.getState();
  store.setTheme(store.theme);

  // Listen for system theme changes
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', () => {
      if (store.theme === 'system') {
        store.setTheme('system');
      }
    });
}
