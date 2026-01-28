"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function HeaderSearch() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/formations?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <div
        className={`flex items-center h-10 bg-white border rounded-full transition-all duration-200 ${
          isFocused
            ? "border-primary/50 shadow-sm"
            : "border-gray-200"
        }`}
      >
        {/* Search Icon */}
        <div className="pl-3.5 pointer-events-none">
          <svg
            className={`w-4 h-4 transition-colors duration-200 ${
              isFocused ? "text-primary" : "text-grayBlue"
            }`}
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Rechercher..."
          className="w-32 lg:w-36 px-2.5 pr-4 bg-transparent font-satoshi text-sm text-darkBlue placeholder:text-grayBlue/60 focus:outline-none"
        />
      </div>
    </form>
  );
}
