"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { useLinkStore } from '@/stores/link-store';

interface StoreProviderProps {
  children: React.ReactNode;
}

const StoreContext = createContext<boolean>(false);

export function StoreProvider({ children }: StoreProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Ensure hydration is complete
    setIsHydrated(true);
  }, []);

  return (
    <StoreContext.Provider value={isHydrated}>
      {children}
    </StoreContext.Provider>
  );
}

export function useHydration() {
  return useContext(StoreContext);
}

// SSR-safe hook wrapper
export function useSSRSafeStore<T>(
  storeHook: () => T,
  defaultValue: T
): T {
  const isHydrated = useHydration();
  const storeValue = storeHook();
  
  if (!isHydrated) {
    return defaultValue;
  }
  
  return storeValue;
}