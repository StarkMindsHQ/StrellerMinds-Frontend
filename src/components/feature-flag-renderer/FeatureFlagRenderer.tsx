"use client";

import React, { useEffect, useState } from "react";
import { FeatureFlagService } from "../services/FeatureFlagService";

interface Props {
  flag: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  variants?: { [variant: string]: React.ReactNode }; // A/B testing
}

export function FeatureFlagRenderer({ flag, children, fallback, variants }: Props) {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [variant, setVariant] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function checkFlag() {
      const isEnabled = await FeatureFlagService.isEnabled(flag);
      const variantValue = await FeatureFlagService.getVariant(flag);
      setEnabled(isEnabled);
      setVariant(variantValue);
    }
    checkFlag();
  }, [flag]);

  if (enabled === null) {
    return <div>Loading feature...</div>;
  }

  if (!enabled) {
    return fallback ?? null;
  }

  if (variant && variants && variants[variant]) {
    return <>{variants[variant]}</>;
  }

  return <>{children}</>;
}
