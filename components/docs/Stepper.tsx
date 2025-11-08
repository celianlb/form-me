/**
 * Composant Stepper visuel pour le flux de génération
 * Design modernisé avec la DA Form Me
 */
'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepperProps {
  currentStep: number;
  steps: Array<{ label: string; description?: string }>;
}

export function Stepper({ currentStep, steps }: StepperProps) {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={stepNumber} className="flex items-center flex-1">
              {/* Step circle with modern design */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 font-sora font-bold shadow-md',
                    isCompleted && 'bg-primary border-primary text-white shadow-[0_0_14px_rgba(20,94,255,0.4)]',
                    isActive && 'border-primary text-primary bg-white shadow-[0_0_20px_rgba(20,94,255,0.3)] scale-110',
                    !isActive && !isCompleted && 'border-platinium bg-white text-grayBlue'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <span className="text-base">{stepNumber}</span>
                  )}
                </div>
                <div className="mt-3 text-center max-w-[100px]">
                  <p
                    className={cn(
                      'text-sm font-sora font-bold',
                      isActive && 'text-primary',
                      isCompleted && 'text-darkBlue',
                      !isActive && !isCompleted && 'text-grayBlue'
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-grayBlue/70 mt-1 font-satoshi">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connector line with gradient */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4 mt-[-40px]">
                  <div
                    className={cn(
                      'h-1 rounded-full transition-all duration-500',
                      stepNumber < currentStep ? 'bg-gradient-to-r from-primary to-primary' : 'bg-platinium'
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
