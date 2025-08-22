"use client";

import { cn } from "@/utils/cn";
import { useState } from "react";

interface SearchInputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  name?: string;
  disabled?: boolean;
}

export default function SearchInput({
  value,
  defaultValue = "",
  placeholder = "Saisissez votre recherche...",
  className,
  onChange,
  onSubmit,
  name,
  disabled = false,
}: SearchInputProps) {
  const [searchValue, setSearchValue] = useState(value || defaultValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    onChange?.(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(searchValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit?.(searchValue);
    }
  };

  return (
    <div className={cn("relative w-fit", className)}>
      <form onSubmit={handleSubmit} className="relative">
        {/* Search Icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-grayBlue"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Input Field */}
        <input
          type="text"
          name={name}
          value={value !== undefined ? value : searchValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-[300px] pl-12 pr-4 py-2",
            "bg-white border border-grayBlue/30 rounded-full",
            "font-satoshi text-blackBlue placeholder:text-grayBlue",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
            "transition-colors duration-200",
            disabled && "opacity-50 cursor-not-allowed bg-gray-50"
          )}
        />
      </form>
    </div>
  );
}
