"use client";

import { useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";

interface SearchBarProps {
  items: string[];
  placeholder?: string;
  onSelect: (item: string) => void;
}

export default function SearchBar({
  items,
  placeholder = "Search...",
  onSelect,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const filtered = items.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  const clearSearch = () => {
    setQuery("");
    onSelect("");
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-3 bg-white border border-[#e0d7cb] rounded-xl px-5 py-3 shadow-md">
        <FiSearch className="text-[#CD1015]" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          placeholder={placeholder}
          className="w-full focus:outline-none bg-transparent text-[#1F1F1F]"
        />
        {query && (
          <button
            onClick={clearSearch}
            type="button"
            className="text-[#CD1015] hover:text-[#a60d11] focus:outline-none"
          >
            <FiX size={20} />
          </button>
        )}
      </div>

      {isFocused && filtered.length > 0 && (
        <ul className="absolute left-0 right-0 mt-2 bg-white border border-[#e0d7cb] rounded-xl shadow-md z-20 max-h-64 overflow-y-auto">
          {filtered.map((item, idx) => (
            <li
              key={idx}
              className="px-5 py-3 hover:bg-[#F3E8D8] cursor-pointer text-[#1F1F1F] transition-all"
              onClick={() => {
                onSelect(item);
                setQuery(item);
                setIsFocused(false);
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
