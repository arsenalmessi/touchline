
"use client";

import {
  ChevronDown,
  Search,
  MapPin,
  Check,
} from "lucide-react";

import React, { useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
  
    document.addEventListener("pointerdown", handleClickOutside);
  
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: OptionType) => {
    setSelectedOption(option);
    setSearchTerm("");
    setIsOpen(false);
  };

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

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }

    if (
      event.key === "Enter" &&
      isOpen &&
      filteredOptions.length > 0
    ) {
      event.preventDefault();
      handleOptionClick(filteredOptions[0]);
    }
  };

  return (
    <div className="relative z-30 w-full max-w-3xl mx-auto px-3 sm:px-0">

      <div className="
        w-full
        bg-[#0a0703]
        border border-[#1e160d]
        shadow-[0_15px_45px_rgba(0,0,0,0.3)]
      ">

        <div className="
          grid grid-cols-1
          sm:grid-cols-[minmax(0,1fr)_auto]
          items-stretch
        ">

          {/* Location dropdown */}
          <div
            ref={dropdownRef}
            className="relative min-w-0"
          >

            <div className="
              flex items-center
              gap-3 sm:gap-4
              min-h-[76px] sm:min-h-[86px]
              px-4 sm:px-6
              bg-[#110e09]
              border-b sm:border-b-0 sm:border-r
              border-[#1e160d]
              transition-colors duration-300
              hover:bg-[#150f08]
            ">

              {/* Location icon */}
              <div className="
                flex items-center justify-center
                w-10 h-10 shrink-0
                border border-[#c9883325]
                bg-[#c9883308]
              ">
                <MapPin className="w-4 h-4 text-[#c98833]" />
              </div>

              {/* Input */}
              <div className="flex-1 min-w-0">

                <label
                  htmlFor="therapist-city"
                  className="
                    block mb-1
                    text-[9px]
                    tracking-[2.5px]
                    uppercase
                    text-[#8a6a4a]
                  "
                >
                  City
                </label>

                <input
                  ref={inputRef}
                  id="therapist-city"
                  type="text"
                  role="combobox"
                  aria-expanded={isOpen}
                  aria-controls="therapist-city-options"
                  aria-autocomplete="list"
                  autoComplete="off"
                  placeholder={
                    selectedOption
                      ? selectedOption.label
                      : "Select your city..."
                  }
                  value={searchTerm}
                  onFocus={() => setIsOpen(true)}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setSelectedOption(null);
                    setIsOpen(true);
                  }}
                  onKeyDown={handleKeyDown}
                  className="
                    w-full min-w-0
                    bg-transparent
                    outline-none
                    border-none
                    p-0
                    text-base sm:text-sm
                    font-light
                    tracking-[0.5px]
                    text-[#e8d5b8]
                    placeholder:text-[#5a4535]
                    focus:ring-0
                  "
                />

              </div>

              {/* Dropdown toggle */}
              <button
                type="button"
                aria-label="Toggle city list"
                aria-expanded={isOpen}
                onClick={() => {
                  setIsOpen((prev) => !prev);
                  inputRef.current?.focus();
                }}
                className="
                  flex items-center justify-center
                  w-10 h-10 shrink-0
                  text-[#5a4535]
                  hover:text-[#c98833]
                  transition-colors
                "
              >
                <ChevronDown
                  className={`
                    w-4 h-4
                    transition-transform duration-300
                    ${isOpen ? "rotate-180" : ""}
                  `}
                />
              </button>

            </div>

            {/* Floating dropdown */}
            {isOpen && (
              <div
                className="
                  absolute top-full left-0 right-0
                  z-[100]
                  mt-1
                  w-full max-w-full
                  bg-[#110e09]
                  border border-[#2a1f14]
                  shadow-[0_15px_40px_rgba(0,0,0,0.8)]
                  overflow-hidden
                "
              >

                <div className="
                  px-5 py-3
                  border-b border-[#1e160d]
                ">
                  <span className="
                    text-[9px]
                    tracking-[2.5px]
                    uppercase
                    text-[#5a4535]
                  ">
                    Available Locations
                  </span>
                </div>

                <ul
                  id="therapist-city-options"
                  role="listbox"
                  className="
                    max-h-52 sm:max-h-60
                    overflow-y-auto
                    overscroll-contain
                  "
                >

                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                      <li key={option.value} role="presentation">
                        <button
                          type="button"
                          role="option"
                          aria-selected={
                            selectedOption?.value === option.value
                          }
                          onClick={() => handleOptionClick(option)}
                          className="
                            w-full min-h-[48px]
                            flex items-center justify-between
                            gap-3
                            px-5 py-3
                            text-left
                            text-xs
                            tracking-[1px]
                            text-[#8a6a4a]
                            hover:text-[#c98833]
                            hover:bg-[#150f08]
                            transition-colors
                            border-b border-[#1a120a]
                            last:border-0
                          "
                        >
                          <span className="truncate">
                            {option.label}
                          </span>

                          {selectedOption?.value === option.value && (
                            <Check className="
                              w-4 h-4 shrink-0
                              text-[#c98833]
                            " />
                          )}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="
                      px-5 py-6
                      text-center
                      text-xs
                      text-[#5a4535]
                    ">
                      No locations found.
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
            disabled={!selectedOption}
            className="
              group
              flex items-center justify-center
              gap-3
              w-full sm:w-auto
              min-h-[60px] sm:min-h-[86px]
              px-6 sm:px-8
              py-4
              bg-[#c98833]
              text-[#0d0a07]
              hover:bg-[#e0a34b]
              active:bg-[#b77927]
              disabled:bg-[#171008]
              disabled:text-[#6b5540]
              disabled:cursor-not-allowed
              transition-all duration-300
              cursor-pointer
              whitespace-nowrap
            "
          >

            <Search className="
              w-4 h-4 shrink-0
              transition-transform duration-300
              group-hover:scale-110
            " />

            <span className="
              text-[9px] sm:text-[10px]
              tracking-[2.5px]
              uppercase
              font-semibold
            ">
              Search
            </span>

          </button>

        </div>

        {/* Decorative bottom line */}
        <div className="
          h-px w-full
          bg-gradient-to-r
          from-transparent
          via-[#c9883340]
          to-transparent
        " />

      </div>

    </div>
  );
}
