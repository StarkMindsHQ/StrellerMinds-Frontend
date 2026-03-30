'use client';

import * as React from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export interface CopyButtonProps extends Omit<ButtonProps, 'onClick' | 'onCopy'> {
  value: string;
  iconMode?: boolean;
  label?: string;
  successMessage?: string;
  onCopy?: (value: string) => void;
}

export function CopyButton({
  value,
  iconMode = false,
  label,
  successMessage,
  onCopy,
  className,
  variant = 'outline',
  size = 'sm',
  children,
  ...props
}: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard();

  const handleCopy = async () => {
    const success = await copy(value);
    if (success) {
      toast.success(
        successMessage || (label ? `${label} copied!` : 'Copied to clipboard'),
      );
      onCopy?.(value);
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  const buttonLabel = label || children || 'Copy';

  return (
    <Button
      variant={variant}
      size={iconMode ? 'icon' : size}
      className={cn('relative gap-2 px-3', iconMode && 'w-8 h-8 p-0', className)}
      onClick={handleCopy}
      aria-label={label ? `Copy ${label}` : 'Copy to clipboard'}
      {...props}
    >
      <div className="relative flex items-center justify-center">
        <Copy
          className={cn(
            'h-3.5 w-3.5 transition-all duration-300',
            copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100',
          )}
        />
        <Check
          className={cn(
            'absolute h-3.5 w-3.5 text-success transition-all duration-300',
            copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
          )}
        />
      </div>
      {!iconMode && (
        <span className="truncate">{copied ? 'Copied' : buttonLabel}</span>
      )}
    </Button>
  );
}
