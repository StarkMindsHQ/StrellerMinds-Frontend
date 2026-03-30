'use client';

import * as React from 'react';
import { Check, X, Pencil } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface InlineEditableFieldProps {
  value: string;
  onSave: (newValue: string) => void | Promise<void>;
  onCancel?: () => void;
  validate?: (value: string) => string | null;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function InlineEditableField({
  value,
  onSave,
  onCancel,
  validate,
  label,
  placeholder = 'Click to edit...',
  className,
}: InlineEditableFieldProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentValue, setCurrentValue] = React.useState(value);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setCurrentValue(value);
    setError(null);
  };

  const handleSave = async () => {
    if (validate) {
      const validationError = validate(currentValue);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    if (currentValue === value) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await onSave(currentValue);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCurrentValue(value);
    setError(null);
    onCancel?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <div className={cn('flex flex-col gap-1 w-full', className)}>
        <div className="flex items-center gap-2 w-full">
          <Input
            ref={inputRef}
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={placeholder}
            error={!!error}
            className="flex-1"
            aria-label={label}
          />
          <div className="flex items-center gap-1 shrink-0">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSave}
              disabled={isLoading}
              className="h-8 w-8 p-0 text-success hover:text-success/80"
              aria-label="Save"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCancel}
              disabled={isLoading}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive/80"
              aria-label="Cancel"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {error && <p className="text-xs text-destructive mt-1 px-1">{error}</p>}
      </div>
    );
  }

  return (
    <div
      onClick={handleEdit}
      className={cn(
        'group relative flex items-center gap-2 cursor-pointer rounded-md px-2 py-1 -mx-2 hover:bg-accent/50 transition-colors',
        className,
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
      aria-label={`Edit ${label || value}`}
    >
      <span className={cn('truncate', !value && 'text-muted-foreground')}>
        {value || placeholder}
      </span>
      <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity shrink-0" />
    </div>
  );
}
