/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import { cn } from '@/utils/cn';

interface RadioGroupContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue>({});

const RadioGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: string;
    onValueChange?: (value: string) => void;
  }
>(({ className, value, onValueChange, children, ...props }, ref) => {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div ref={ref} className={cn('grid gap-2', className)} {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
});
RadioGroup.displayName = 'RadioGroup';

const RadioGroupItem = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, value: itemValue, ...props }, ref) => {
  const { value, onValueChange } = React.useContext(RadioGroupContext);

  return (
    <input
      type="radio"
      ref={ref}
      value={itemValue}
      checked={itemValue === value}
      onChange={() => itemValue && onValueChange?.(String(itemValue))}
      className={cn(
        'h-4 w-4 rounded-full border border-primary text-primary focus:ring-2 focus:ring-primary',
        className
      )}
      {...props}
    />
  );
});
RadioGroupItem.displayName = 'RadioGroupItem';

export { RadioGroup, RadioGroupItem };
