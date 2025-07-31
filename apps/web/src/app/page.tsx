"use client";

import { useState } from "react";
import { LinkForm } from "@/components/link-form";
import { LinksDashboard } from "@/components/links-dashboard";

export default function Home() {
  const [refreshCount, setRefreshCount] = useState(0);

  const handleLinkCreated = () => {
    // Trigger dashboard refresh
    setRefreshCount(prev => prev + 1);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">URL Shortener</h1>
        <p className="text-muted-foreground">
          Create and manage your shortened links
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <LinkForm onSuccess={handleLinkCreated} />
        </div>
        <div className="md:col-span-2">
          <LinksDashboard refresh={refreshCount} />
        </div>
      </div>
    </div>
  );
}
