'use client';

import React, { useEffect } from 'react';
import { useTour } from '@/contexts/TourContext';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/MainLayout';

export default function TourTestPage() {
  const { startTour } = useTour();

  const handleStartTour = () => {
    startTour('test-tour', [
      {
        target: '#tour-step-1',
        title: 'Welcome!',
        content: 'This is the first step of the tour. We highlight this button.',
      },
      {
        target: '#tour-step-2',
        title: 'Feature Two',
        content: 'You can also highlight paragraphs or any other element.',
      },
      {
        target: '#tour-step-3',
        title: 'Finish Line',
        content: 'Last step of the test tour. Hope you enjoyed it!',
      },
    ]);
  };

  return (
    <MainLayout variant="container">
      <div className="space-y-20 py-10">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-4xl font-bold">Onboarding Tour Test</h1>
          <Button onClick={handleStartTour} id="tour-step-1">
            Start the Tour
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div id="tour-step-2" className="p-8 bg-card rounded-2xl border border-border">
            <h2 className="text-2xl font-bold mb-4">Highlighted Card</h2>
            <p className="text-muted-foreground">
              This card will be highlighted in the second step of our onboarding tour.
              Notice how the overlay smoothly transitions.
            </p>
          </div>

          <div className="p-8 bg-muted rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Normal Card</h2>
            <p className="text-muted-foreground">
              This one is just here for layout purposes. Not part of the tour!
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <div id="tour-step-3" className="max-w-md text-center p-6 border-2 border-dashed border-primary rounded-xl">
            <h3 className="text-xl font-bold">The End!</h3>
            <p className="text-sm text-muted-foreground mt-2">
              If you see this highlighted, the tour is working perfectly.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
