/**
 * Secure Code Playground Page
 *
 * A fully-featured code playground with secure sandboxed execution,
 * multi-language support, and real-time output streaming.
 *
 * Features:
 * - Multi-language support (JavaScript, TypeScript, Python)
 * - Secure sandboxed execution (Web Workers + WebAssembly)
 * - Real-time output streaming
 * - Resource limits (CPU, memory, time)
 * - Rate limiting
 * - Code templates library
 * - Code sharing via URL
 * - Local storage for saved snippets
 *
 * @see https://github.com/StarkMindsHQ/StrellerMinds-Frontend/issues/170
 */

import dynamic from 'next/dynamic';

const SecureCodePlayground = dynamic(() => import('./secure-playground'), {
  ssr: false,
  loading: () => (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="h-[70vh] animate-pulse rounded-lg bg-muted" />
    </div>
  ),
});

export default function CodePlaygroundPage() {
  return <SecureCodePlayground />;
}
