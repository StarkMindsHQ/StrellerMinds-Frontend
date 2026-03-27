'use client';

import React from 'react';
import MainLayout from '@/components/MainLayout';
import Link from 'next/link';

export default function BreadcrumbsTestPage() {
  return (
    <MainLayout variant="container">
      <div className="space-y-12 py-10">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-4xl font-bold">Breadcrumb Navigation Test</h1>
          <p className="text-muted-foreground text-center max-w-2xl">
            This page demonstrates the dynamic breadcrumb component. It
            automatically pulls the path from the URL and formats it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-card rounded-2xl border border-border shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Deep Link Example</h2>
            <p className="mb-6 text-muted-foreground">
              Try clicking these links to see how the breadcrumbs update (note:
              these routes might not exist yet, but the URL will update if you
              use a test tool or mock routing).
            </p>
            <div className="flex flex-col gap-3">
              <code className="bg-muted p-2 rounded text-xs">
                /test/breadcrumbs/deep/nested/path
              </code>
              <code className="bg-muted p-2 rounded text-xs">
                /courses/blockchain-basics/intro
              </code>
            </div>
          </div>

          <div className="p-8 bg-primary/5 rounded-2xl border border-primary/10 shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Responsive Behavior</h2>
            <p className="text-muted-foreground">
              On smaller screens, the breadcrumbs will allow horizontal
              scrolling to prevent overflow and maintain clean UI. Long segment
              names are automatically truncated.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
