"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";

interface FaviconProps {
  url: string;
  alt?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Favicon({ url, alt, size = "md", className = "" }: FaviconProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Extract domain from URL for favicon fetching
  const getDomain = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return "";
    }
  };

  // Get favicon URL using Google's favicon service as fallback
  const getFaviconUrl = (url: string) => {
    const domain = getDomain(url);
    if (!domain) return "";
    
    // Try multiple favicon sources
    const faviconSources = [
      `https://${domain}/favicon.ico`,
      `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
      `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    ];
    
    return faviconSources[imageError ? 1 : 0]; // Use Google's service as fallback
  };

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const domain = getDomain(url);
  const faviconUrl = getFaviconUrl(url);

  if (!domain || !faviconUrl) {
    return (
      <div className={`${sizeClasses[size]} ${className} flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-sm`}>
        <Globe className="w-3 h-3 text-slate-400 dark:text-slate-500" />
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${className} relative overflow-hidden rounded-sm`}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-700 animate-pulse rounded-sm" />
      )}
      
      {!imageError ? (
        <motion.img
          src={faviconUrl}
          alt={alt || `${domain} favicon`}
          className={`${sizeClasses[size]} object-cover rounded-sm`}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setImageError(true);
            setIsLoading(false);
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        />
      ) : (
        <motion.img
          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
          alt={alt || `${domain} favicon`}
          className={`${sizeClasses[size]} object-cover rounded-sm`}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoading ? 0 : 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
      
      {imageError && isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-sm">
          <Globe className="w-3 h-3 text-slate-400 dark:text-slate-500" />
        </div>
      )}
    </div>
  );
}