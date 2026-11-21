
"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Search,
  MapPin,
  Check,
} from "lucide-react";
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
      filteredOptions.length > 0 &&
      isOpen
    ) {
      event.preventDefault();
      handleOptionClick(filteredOptions[0]);
    }
  };

  return (
    <div className="relative z-20 w-full max-w-3xl mx-auto px-3 sm:px-0">

      <div className="
        relative w-full
        bg-[#0a0703]
        border border-[#2a1f14]
        shadow-[0_15px_50px_rgba(0,0,0,0.25)]
      ">

        <div className="
          grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto]
          items-stretch
        ">

          {/* Location selector */}
          <div
            ref={dropdownRef}
            className="relative min-w-0"
          >

            <div className={`
              flex items-center
              gap-3 sm:gap-4
              min-h-[76px] sm:min-h-[86px]
              px-4 sm:px-6
              bg-[#110e09]
              border-b sm:border-b-0 sm:border-r
              border-[#2a1f14]
              transition-colors duration-300
              ${isOpen ? "bg-[#171008]" : "hover:bg-[#150f08]"}
            `}>

              {/* Icon */}
              <div className="
                w-10 h-10 shrink-0
                flex items-center justify-center
                border border-[#c9883325]
                bg-[#c9883308]
              ">
                <MapPin className="w-4 h-4 text-[#c98833]" />
              </div>

              {/* Input */}
              <div className="flex-1 min-w-0">

                <label
                  htmlFor="city-search"
                  className="
                    block mb-1
                    text-[9px]
                    tracking-[2.5px]
                    text-[#8a6a4a]
                    uppercase
                  "
                >
                  Select City
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
                      : "Search your location"
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
                    block w-full min-w-0
                    bg-transparent
                    outline-none
                    border-none
                    text-[#e8d5b8]
                    placeholder:text-[#6b5540]
                    text-base sm:text-sm
                    tracking-[0.5px]
                    font-light
                    p-0
                    focus:ring-0
                  "
                />

              </div>

              {/* Dropdown toggle */}
              <button
                type="button"
                aria-label={isOpen ? "Close locations" : "Open locations"}
                aria-expanded={isOpen}
                onClick={() => {
                  setIsOpen(!isOpen);
                  inputRef.current?.focus();
                }}
                className="
                  w-9 h-9 shrink-0
                  flex items-center justify-center
                  text-[#8a6a4a]
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
                id="city-options"
                className="
                  absolute top-full left-0 right-0
                  z-[100]
                  mt-1
                  w-full
                  max-w-full
                  bg-[#110e09]
                  border border-[#2a1f14]
                  shadow-[0_15px_40px_rgba(0,0,0,0.8)]
                  overflow-hidden
                "
              >

                <div className="
                  px-4 sm:px-5 py-3
                  border-b border-[#2a1f14]
                ">
                  <p className="
                    text-[9px]
                    tracking-[2.5px]
                    uppercase
                    text-[#6b5540]
                  ">
                    Available Locations
                  </p>
                </div>

                <ul className="
                  max-h-52 sm:max-h-60
                  overflow-y-auto
                  overscroll-contain
                  custom-scrollbar
                ">

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
                            w-full
                            min-h-[48px]
                            flex items-center justify-between
                            gap-3
                            px-4 sm:px-5 py-3
                            text-left
                            text-xs
                            tracking-[1px]
                            text-[#b89b79]
                            hover:text-[#c98833]
                            hover:bg-[#1a120a]
                            active:bg-[#1a120a]
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
                              w-4 h-4
                              shrink-0
                              text-[#c98833]
                            " />
                          )}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="px-5 py-6 text-center">
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
              min-h-[58px] sm:min-h-[86px]
              px-5 sm:px-8
              py-4
              bg-[#c98833]
              text-[#0d0a07]
              hover:bg-[#e0a34b]
              active:bg-[#b77927]
              transition-colors duration-300
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
              text-[10px]
              tracking-[2.5px]
              uppercase
              font-semibold
            ">
              Search
            </span>

          </button>

        </div>

        {/* Decorative line */}
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
