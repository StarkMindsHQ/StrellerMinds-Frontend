import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Code2, Users } from 'lucide-react';

// Dynamically import the client component with SSR disabled
const CollaborativePlaygroundClient = dynamic(
  () => import('@/components/code-playground/collaborative-playground-client'),
  { ssr: false }
);

// Loading fallback
function CollaborativePlaygroundLoading() {
  return (
    <div className="container mx-auto p-2 sm:p-4 max-w-7xl">
      <Card className="mb-4 sm:mb-6">
        <CardHeader className="px-3 sm:px-6 py-3 sm:py-6">
          <CardTitle className="text-lg sm:text-2xl flex items-center gap-2">
            <Code2 className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
            <span className="truncate">Collaborative Code Playground</span>
          </CardTitle>
          <CardDescription className="mt-1 text-xs sm:text-sm">
            Real-time collaborative coding with live synchronization
          </CardDescription>
        </CardHeader>
      </Card>
      <Card>
        <CardContent className="py-8 sm:py-12 text-center px-4">
          <Users className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-muted-foreground" />
          <h3 className="text-base sm:text-lg font-semibold mb-2">
            Loading...
          </h3>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CollaborativePlaygroundPage() {
  return (
    <Suspense fallback={<CollaborativePlaygroundLoading />}>
      <CollaborativePlaygroundClient />
    </Suspense>
  );
}
