import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormErrorProps {
  message?: string;
  className?: string;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  id?: string;
}

export function FormError({
  message,
  className,
  'aria-live': ariaLive = 'polite',
  id,
}: FormErrorProps) {
  if (!message) return null;

  return (
    <div
      id={id}
      role="alert"
      aria-live={ariaLive}
      className={cn(
        'flex items-center gap-2 text-sm text-red-600 mt-1',
        className,
      )}
    >
      <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}

interface FormFieldErrorProps extends FormErrorProps {
  fieldName: string;
}

export function FormFieldError({
  message,
  fieldName,
  className,
  'aria-live': ariaLive = 'polite',
}: FormFieldErrorProps) {
  if (!message) return null;

  return (
    <FormError
      message={message}
      className={className}
      aria-live={ariaLive}
      id={`${fieldName}-error`}
    />
  );
}
