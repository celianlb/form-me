"use client";

import { cn } from "@/utils/cn";
import { useEffect, useRef, useState } from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  name?: string;
  required?: boolean;
}

export default function Dropdown({
  options,
  value,
  defaultValue,
  placeholder = "Sélectionner une option",
  disabled = false,
  className,
  onChange,
  name,
  required = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    value || defaultValue || ""
  );
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option: SelectOption) => {
    if (option.disabled) return;

    setSelectedValue(option.value);
    setIsOpen(false);
    onChange?.(option.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
      case "Escape":
        setIsOpen(false);
        break;
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          const currentIndex = options.findIndex(
            (opt) => opt.value === selectedValue
          );
          const nextIndex = Math.min(currentIndex + 1, options.length - 1);
          if (options[nextIndex] && !options[nextIndex].disabled) {
            setSelectedValue(options[nextIndex].value);
            onChange?.(options[nextIndex].value);
          }
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          const currentIndex = options.findIndex(
            (opt) => opt.value === selectedValue
          );
          const prevIndex = Math.max(currentIndex - 1, 0);
          if (options[prevIndex] && !options[prevIndex].disabled) {
            setSelectedValue(options[prevIndex].value);
            onChange?.(options[prevIndex].value);
          }
        }
        break;
    }
  };

  return (
    <div ref={selectRef} className={cn("relative w-full md:w-fit", className)}>
      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name={name}
        value={selectedValue}
        required={required}
      />

      {/* Select Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          "w-full md:w-fit py-2 px-3 text-left bg-primary border border-platinium rounded-full cursor-pointer",
          "font-satoshi text-white placeholder:text-grayBlue",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
          "transition-colors duration-200",
          "flex gap-4 items-center justify-between",
          disabled && "opacity-50 cursor-not-allowed bg-gray-50",
          isOpen && "border-primary ring-2 ring-primary"
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="dropdown-list"
        role="combobox"
      >
        <span
          className={cn(
            selectedOption ? "text-white truncate" : "text-white truncate"
          )}
        >
          {selectedOption?.label || placeholder}
        </span>

        <svg
          className={cn(
            "w-4 h-4 text-white transition-transform duration-200",
            isOpen && "rotate-180"
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown List */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-platinium rounded-lg shadow-lg z-50 max-h-60 overflow-auto">
          <ul role="listbox" className="py-1">
            {options.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={selectedValue === option.value}
                onClick={() => handleSelect(option)}
                className={cn(
                  "px-4 py-2 cursor-pointer font-satoshi text-sm",
                  "hover:bg-primary/5 transition-colors duration-150",
                  selectedValue === option.value &&
                    "bg-primary/10 text-primary font-medium",
                  option.disabled &&
                    "opacity-50 cursor-not-allowed hover:bg-transparent"
                )}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
