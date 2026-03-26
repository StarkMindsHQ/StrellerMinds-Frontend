'use client';

import * as React from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Button, type ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

export interface CopyToClipboardProps
  extends Omit<ButtonProps, 'onClick' | 'children' | 'onCopy'> {
  text: string;
  label?: string;
  successMessage?: string;
  showToast?: boolean;
  onCopy?: (text: string) => void;
  children?: React.ReactNode;
}

const CopyToClipboard = React.forwardRef<
  HTMLButtonElement,
  CopyToClipboardProps
>(
  (
    {
      text,
      label,
      successMessage,
      showToast = true,
      onCopy,
      children,
      className,
      variant = 'ghost',
      size = 'icon',
      ...props
    },
    ref,
  ) => {
    const { copied, copy } = useCopyToClipboard();

    const ariaLabel = copied
      ? 'Copied!'
      : label
        ? `Copy ${label}`
        : 'Copy to clipboard';

    const handleClick = async () => {
      const success = await copy(text);
      if (success) {
        if (showToast) {
          toast.success(
            successMessage ?? (label ? `${label} copied!` : 'Copied!'),
          );
        }
        onCopy?.(text);
      }
    };

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn('relative', className)}
        aria-label={ariaLabel}
        title={ariaLabel}
        onClick={handleClick}
        {...props}
      >
        <span
          className={cn(
            'transition-all duration-200',
            copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100',
          )}
          aria-hidden="true"
        >
          <Copy className="h-4 w-4" />
        </span>
        <span
          className={cn(
            'absolute transition-all duration-200 text-green-500',
            copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0',
          )}
          aria-hidden="true"
        >
          <Check className="h-4 w-4" />
        </span>
        {children && (
          <span className="ml-1">{copied ? 'Copied!' : children}</span>
        )}
        <span className="sr-only" aria-live="polite">
          {copied ? 'Copied!' : ''}
        </span>
      </Button>
    );
  },
);

CopyToClipboard.displayName = 'CopyToClipboard';

export { CopyToClipboard };
