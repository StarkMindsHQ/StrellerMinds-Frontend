'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

interface SaveCodeFormProps {
  code: string;
  onSave: (name: string, code: string) => void;
}

export default function SaveCodeForm({ code, onSave }: SaveCodeFormProps) {
  const [snippetName, setSnippetName] = useState('');

  const handleSave = () => {
    if (!snippetName.trim()) {
      toast.error('Please enter a name for your code snippet');
      return;
    }

    onSave(snippetName, code);
    toast.success(`Your code snippet "${snippetName}" has been saved`);
    setSnippetName('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Save Current Code</CardTitle>
        <CardDescription>Save your code for future use</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid w-full gap-1.5">
            <label htmlFor="snippet-name" className="text-sm font-medium">
              Snippet Name
            </label>
            <input
              id="snippet-name"
              value={snippetName}
              onChange={(e) => setSnippetName(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="My Stellar Code"
            />
          </div>
          <Button onClick={handleSave} className="w-full gap-2">
            <Save className="h-4 w-4" />
            Save Code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
