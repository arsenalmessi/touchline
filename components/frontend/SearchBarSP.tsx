"use client";

import { ChevronDown, Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { locations } from '../../lib/locations';

interface OptionType {
  value: string;
  label: string;
}

export default function SearchBar() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = locations.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOptionClick = (option: OptionType) => {
    setSelectedOption(option);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleSearch = () => {
    if (selectedOption) {
      router.push(`/search?city=${selectedOption.value}`);
    }
  };

  useEffect(() => {
    if (typeof document === "undefined") return;
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  return (
    <div className="max-w-3xl mx-auto border border-[#1e160d] bg-[#0a0703]">
      <div className="flex flex-col md:flex-row items-stretch gap-px">

        {/* Location dropdown */}
        <div ref={dropdownRef} className="relative flex-1">
          <div
            className="flex items-center gap-3 px-5 py-4 bg-[#110e09] cursor-pointer group border-b md:border-b-0 md:border-r border-[#1e160d] hover:bg-[#150f08] transition-colors duration-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            {/* Label */}
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[8px] tracking-[3px] text-[#4a3828] uppercase mb-1">City</span>
              <input
                type="text"
                placeholder={selectedOption ? selectedOption.label : "Select city..."}
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setIsOpen(true); }}
                className="w-full bg-transparent outline-none text-[#e8d5b8] placeholder-[#5a4535] text-[11px] tracking-[1px] font-light"
              />
            </div>
            <ChevronDown
              className={`h-4 w-4 text-[#5a4535] flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          </div>

          {/* Dropdown list */}
          {isOpen && (
            <ul className="absolute z-20 w-full bg-[#110e09] border border-[#1e160d] mt-px max-h-56 overflow-y-auto shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    onClick={() => handleOptionClick(option)}
                    className="cursor-pointer px-5 py-3 text-[11px] tracking-[1px] text-[#8a6a4a] hover:text-[#c98833] hover:bg-[#150f08] transition-colors duration-150 border-b border-[#1a120a] last:border-0"
                  >
                    {option.label}
                  </li>
                ))
              ) : (
                <li className="px-5 py-3 text-[10px] tracking-[1px] text-[#4a3828]">No results found</li>
              )}
            </ul>
          )}
        </div>

        {/* Search button */}
        <button
          onClick={handleSearch}
          disabled={!selectedOption}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-t md:border-t-0 border-[#1e160d] text-[#c98833] text-[9px] tracking-[3px] uppercase cursor-pointer hover:bg-[#c98833] hover:text-[#0d0a07] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 whitespace-nowrap"
        >
          <Search className="h-4 w-4" />
          Find Therapists
        </button>

      </div>
    </div>
  );
}