'use client';

import { CMSProvider } from '@/contexts/CMSContext';

export default function CMSLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CMSProvider>{children}</CMSProvider>;
}
