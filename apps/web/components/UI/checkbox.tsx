import * as React from 'react';
import { cn } from '@/utils/cn';

const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }
>(({ className, checked, onCheckedChange, ...props }, ref) => {
  return (
    <input
      type="checkbox"
      ref={ref}
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={cn(
        'h-4 w-4 rounded border-gray-300 text-primary focus:ring-2 focus:ring-primary',
        className
      )}
      {...props}
    />
  );
});
Checkbox.displayName = 'Checkbox';

export { Checkbox };
