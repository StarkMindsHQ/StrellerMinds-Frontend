import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-[#ffcc00] to-yellow-400 hover:from-yellow-400 hover:to-[#ffcc00] text-[#5c0f49] shadow-lg hover:shadow-xl transform hover:scale-105 focus-visible:ring-yellow-400',
        secondary:
          'bg-gradient-to-r from-[#5c0f49] to-purple-600 hover:from-purple-600 hover:to-[#5c0f49] text-white shadow-lg hover:shadow-xl transform hover:scale-105 focus-visible:ring-purple-400',
        outline:
          'border-2 border-[#5c0f49] bg-transparent text-[#5c0f49] hover:bg-[#5c0f49] hover:text-white shadow-md hover:shadow-lg transform hover:scale-105 focus-visible:ring-[#5c0f49]',
        ghost:
          'bg-transparent text-[#5c0f49] hover:bg-[#5c0f49]/10 hover:text-[#5c0f49] focus-visible:ring-[#5c0f49]',
        destructive:
          'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 focus-visible:ring-red-400',
        link: 'text-[#5c0f49] underline-offset-4 hover:underline focus-visible:ring-[#5c0f49]',
      },
      size: {
        sm: 'h-8 px-3 py-1 text-xs rounded-lg',
        default: 'h-10 px-6 py-2',
        lg: 'h-12 px-10 py-4 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
