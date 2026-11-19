
"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Search, MapPin, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { locations } from "../../lib/locations";

interface OptionType {
  value: string;
  label: string;
}

export default function SearchBar() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] =
    useState<OptionType | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = locations.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Select location
  const handleOptionClick = (option: OptionType) => {
    setSelectedOption(option);
    setSearchTerm("");
    setIsOpen(false);
  };

  // Search
  const handleSearch = () => {
    if (!selectedOption) {
      setIsOpen(true);
      inputRef.current?.focus();
      return;
    }

    router.push(
      `/search?city=${encodeURIComponent(selectedOption.value)}`
    );
  };

  // Keyboard support
  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }

    if (event.key === "Enter" && filteredOptions.length > 0 && isOpen) {
      event.preventDefault();
      handleOptionClick(filteredOptions[0]);
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="relative bg-[#0a0703] border border-[#2a1f14] shadow-[0_15px_50px_rgba(0,0,0,0.25)]">

        <div className="flex flex-col sm:flex-row">

          {/* Location selector */}
          <div
            ref={dropdownRef}
            className="relative flex-1 min-w-0"
          >
            <div
              className={`
                flex items-center gap-3
                px-4 sm:px-6 py-4 sm:py-5
                bg-[#110e09]
                transition-all duration-300
                border-b sm:border-b-0 sm:border-r
                border-[#2a1f14]
                ${isOpen ? "bg-[#171008]" : "hover:bg-[#150f08]"}
              `}
            >
              <div className="w-9 h-9 shrink-0 flex items-center justify-center border border-[#c9883325] bg-[#c9883308]">
                <MapPin className="w-4 h-4 text-[#c98833]" />
              </div>

              <div className="flex-1 min-w-0">
                <label
                  htmlFor="city-search"
                  className="block text-[8px] sm:text-[9px] tracking-[3px] text-[#8a6a4a] uppercase mb-1.5"
                >
                  Select Location
                </label>

                <input
                  ref={inputRef}
                  id="city-search"
                  type="text"
                  role="combobox"
                  aria-expanded={isOpen}
                  aria-controls="city-options"
                  aria-autocomplete="list"
                  autoComplete="off"
                  placeholder={
                    selectedOption
                      ? selectedOption.label
                      : "City"
                  }
                  value={searchTerm}
                  onFocus={() => setIsOpen(true)}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setIsOpen(true);
                    setSelectedOption(null);
                  }}
                  onKeyDown={handleKeyDown}
                  className="
                    w-full bg-transparent outline-none
                    text-[#e8d5b8]
                    placeholder:text-[#6b5540]
                    text-xs sm:text-sm
                    tracking-[0.5px]
                    font-light
                  "
                />
              </div>

              <button
                type="button"
                aria-label={isOpen ? "Close locations" : "Open locations"}
                aria-expanded={isOpen}
                onClick={() => {
                  setIsOpen(!isOpen);
                  inputRef.current?.focus();
                }}
                className="w-9 h-9 shrink-0 flex items-center justify-center text-[#8a6a4a] hover:text-[#c98833] transition-colors"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>

            {/* Dropdown */}
            {isOpen && (
              <div
                id="city-options"
                className="
                  absolute top-full left-0 right-0 z-50
                  mt-1
                  bg-[#110e09]
                  border border-[#2a1f14]
                  shadow-[0_15px_40px_rgba(0,0,0,0.7)]
                  overflow-hidden
                "
              >
                <div className="px-4 py-3 border-b border-[#2a1f14]">
                  <p className="text-[8px] tracking-[3px] uppercase text-[#6b5540]">
                    Available Locations
                  </p>
                </div>

                <ul className="max-h-56 overflow-y-auto custom-scrollbar">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                      <li key={option.value}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={
                            selectedOption?.value === option.value
                          }
                          onClick={() => handleOptionClick(option)}
                          className="
                            w-full flex items-center justify-between
                            px-5 py-3.5
                            text-left
                            text-xs tracking-[1px]
                            text-[#b89b79]
                            hover:text-[#c98833]
                            hover:bg-[#1a120a]
                            transition-all duration-200
                            border-b border-[#1a120a]
                            last:border-0
                          "
                        >
                          <span>{option.label}</span>

                          {selectedOption?.value === option.value && (
                            <Check className="w-4 h-4 text-[#c98833]" />
                          )}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="px-5 py-5 text-center">
                      <p className="text-xs text-[#6b5540]">
                        No locations found.
                      </p>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Search button */}
          <button
            type="button"
            onClick={handleSearch}
            className="
              group
              flex items-center justify-center
              gap-3
              w-full sm:w-auto
              px-7 sm:px-8
              py-4 sm:py-5
              min-h-[58px]
              bg-[#c98833]
              text-[#0d0a07]
              hover:bg-[#e0a34b]
              transition-all duration-300
              disabled:opacity-40
              disabled:cursor-not-allowed
              cursor-pointer
              whitespace-nowrap
            "
          >
            <Search className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />

            <span className="text-[9px] sm:text-[10px] tracking-[3px] uppercase font-medium">
              Find Experiences
            </span>
          </button>

        </div>

        {/* Bottom decorative line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#c9883340] to-transparent" />

      </div>

  
    </div>
  );
}
