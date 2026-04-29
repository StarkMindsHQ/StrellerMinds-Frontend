'use client';

import * as React from 'react';
import { InlineEditableField } from '@/components/ui/inline-editable-field';
import { CopyButton } from '@/components/ui/copy-button';
import { VisibilityTracker } from '@/components/ui/visibility-tracker';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { useActivity } from '@/hooks/use-activity';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function TestInlineEditablePage() {
  const {
    startActivity,
    endActivity,
    isActive: isGlobalActive,
  } = useActivity();
  const [eventName, setEventName] = React.useState('Tech Conference 2026');
  const [description, setDescription] = React.useState(
    'A conference about future technologies.',
  );
  const [location, setLocation] = React.useState('San Francisco, CA');

  const handleSaveName = async (newValue: string) => {
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (newValue.toLowerCase().includes('error')) {
          reject(new Error('Invalid name: name cannot contain word "error"'));
        } else {
          setEventName(newValue);
          toast.success('Event name updated');
          resolve();
        }
      }, 1000);
    });
  };

  const validateDescription = (value: string) => {
    if (value.length < 10) return 'Description must be at least 10 characters';
    return null;
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Issue #335: Inline Editable Field Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Event Name (with async save & error simulation)
            </label>
            <InlineEditableField
              value={eventName}
              onSave={handleSaveName}
              label="Event Name"
              className="text-xl font-bold"
            />
            <p className="text-xs text-muted-foreground">
              Try entering &quot;error&quot; to see error handling.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Description (with validation)
            </label>
            <InlineEditableField
              value={description}
              onSave={(val) => {
                setDescription(val);
                toast.success('Description updated');
              }}
              validate={validateDescription}
              label="Description"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Location (standard)
            </label>
            <InlineEditableField
              value={location}
              onSave={(val) => {
                setLocation(val);
                toast.success('Location updated');
              }}
              label="Location"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              Empty Field (with placeholder)
            </label>
            <InlineEditableField
              value=""
              onSave={(val) => {
                toast.info(`Saved: ${val}`);
              }}
              placeholder="Add some notes..."
              label="Empty Field"
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Issue #336: CopyButton Demo
            </h3>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground mr-4">
                  Standard:
                </label>
                <CopyButton value="0x1234...5678" label="Wallet Address" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground mr-4">
                  Icon Only:
                </label>
                <CopyButton value="https://strellerminds.com" iconMode />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground mr-4">
                  Custom Message:
                </label>
                <CopyButton
                  value="Referral-XYZ-123"
                  successMessage="Referral code copied! Share it with your friends."
                >
                  Copy Referral
                </CopyButton>
              </div>
            </div>

            <div className="pt-4">
              <Button
                variant="secondary"
                disabled={isGlobalActive}
                onClick={() => {
                  startActivity();
                  toast.info('Global activity started (3s)...');
                  setTimeout(() => {
                    endActivity();
                    toast.success('Global activity ended');
                  }, 3000);
                }}
              >
                {isGlobalActive ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Trigger Global Activity
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                This will trigger the top-page progress bar indicator.
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Issue #338: VisibilityTracker Demo
            </h3>
            <p className="text-sm text-muted-foreground">
              Scroll down to see the VisibilityTracker in action.
            </p>

            <div className="h-[50vh] flex items-center justify-center bg-accent/20 rounded-lg border-2 border-dashed border-accent">
              <span className="text-muted-foreground">Scroll Down...</span>
            </div>

            <VisibilityTracker
              onVisible={() => {
                toast.success('Footer Section is now visible!');
              }}
              onHidden={() => {
                toast.info('Footer Section is now hidden');
              }}
              once={false}
              className="p-8 bg-primary/10 rounded-lg border-2 border-primary border-dashed text-center"
            >
              <h4 className="font-bold text-primary">Tracked Footer Section</h4>
              <p className="text-sm">
                This section emits events when it enters or leaves the viewport.
              </p>
            </VisibilityTracker>

            <div className="h-[20vh]" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
