'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface Dependency<T = any> {
  key: string;
  fn: () => Promise<T>;
}

interface DataDependencyResolverProps {
  dependencies: Dependency[];
  children: (data: Record<string, any>) => ReactNode;
  loadingUI?: ReactNode;
  fallbackUI?: (errors: Record<string, Error>) => ReactNode;
  onResolve?: (data: Record<string, any>) => void;
  onError?: (errors: Record<string, Error>) => void;
}

/**
 * DataDependencyResolver component handles multiple dependent API calls before rendering.
 * It manages chained requests (implied by the order of dependencies) and aggregates loading states.
 */
export function DataDependencyResolver({
  dependencies,
  children,
  loadingUI,
  fallbackUI,
  onResolve,
  onError,
}: DataDependencyResolverProps) {
  const [data, setData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, Error>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const resolveDependencies = async () => {
      setIsLoading(true);
      const resolvedData: Record<string, any> = {};
      const resolveErrors: Record<string, Error> = {};

      for (const dep of dependencies) {
        try {
          // Pass the already resolved data to the next function if it's a factory that needs it
          // Note: In this simple version, dependencies are executed sequentially,
          // allowing for some degree of "chaining" if the factory function uses external state updated by previous resolutions.
          const result = await dep.fn();
          if (isMounted) {
            resolvedData[dep.key] = result;
          }
        } catch (error) {
          if (isMounted) {
            resolveErrors[dep.key] =
              error instanceof Error ? error : new Error(String(error));
          }
        }
      }

      if (isMounted) {
        setData(resolvedData);
        setErrors(resolveErrors);
        setIsLoading(false);

        if (Object.keys(resolveErrors).length > 0) {
          onError?.(resolveErrors);
        } else {
          onResolve?.(resolvedData);
        }
      }
    };

    resolveDependencies();

    return () => {
      isMounted = false;
    };
  }, [dependencies]);

  if (isLoading) {
    return (
      loadingUI || (
        <div className="space-y-4 p-4">
          {dependencies.map((dep) => (
            <div key={dep.key} className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          ))}
        </div>
      )
    );
  }

  // If there are partial failures and we have a fallback UI
  if (Object.keys(errors).length > 0 && fallbackUI) {
    return fallbackUI(errors);
  }

  return <>{children(data)}</>;
}
