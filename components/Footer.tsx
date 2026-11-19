
"use client";

import React from "react";
import {
  MapPin,
  Mail,
  ArrowUp,
  Sparkles,
  X,
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Our Companions", href: "/workers" },
    { label: "Personal Hosts", href: "/workers" },
    { label: "Explore", href: "/search" },
    { label: "Contact", href: "/contact" },
  ];

  const experiences = [
    "Private Experiences",
    "Personal Companionship",
    "Lifestyle Experiences",
    "Wellness Experiences",
    "Personal Hosting",
    "Exclusive Encounters",
  ];

  const legalLinks = [
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Cookies", href: "/cookies" },
  ];

  return (
    <footer className="relative bg-[#080604] text-[#6b5e50] pt-16 sm:pt-20 pb-8 px-5 sm:px-8 border-t border-[#1e1a14]">

      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, #c98833, transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto">

        {/* Main footer grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-10">

          {/* Brand / Contact */}
          <div className="space-y-6">

            <div>
              <Link href="/" className="inline-flex items-center gap-3 mb-5">
                <div className="w-10 h-10 border border-[#c9883340] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#c98833]" />
                </div>

                <span className="font-cormorant text-2xl tracking-[4px] uppercase text-[#f5e8d0]">
                  Touchline
                </span>
              </Link>

              <p className="font-sans text-[10px] tracking-[3px] text-[#c98833] uppercase mb-3">
                Private Lifestyle Experiences
              </p>

              <p className="font-sans text-xs leading-7 text-[#756451] font-light max-w-xs">
                Discover exceptional company and curated personal
                experiences across Zimbabwe. Where privacy,
                sophistication and personal choice meet.
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-4">

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#c98833] shrink-0 mt-1" />

                <span className="font-sans text-xs font-light leading-relaxed">
                  Harare, Zimbabwe
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#c98833] shrink-0" />

                <a
                  href="mailto:hello@Touchline.co.zw"
                  className="font-sans text-xs font-light hover:text-[#c98833] transition-colors"
                >
                  hello@Touchline.co.zw
                </a>
              </div>

            </div>

            {/* Social links */}
            <div className="flex items-center gap-3 pt-2">

              <a
                href="#"
                aria-label="X Twitter"
                className="w-10 h-10 border border-[#2a1f14] flex items-center justify-center text-[#8a6a4a] hover:text-[#c98833] hover:border-[#c98833] transition-all duration-300"
              >
                <X className="w-4 h-4" />
              </a>

           

            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-6">

            <div>
              <p className="font-sans text-[10px] tracking-[4px] text-[#c98833] uppercase mb-3">
                Explore
              </p>

              <h3 className="font-cormorant text-2xl font-light text-[#f5e8d0]">
                Discover Touchline
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-5">
              {quickLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="font-sans text-[10px] tracking-[2px] text-[#756451] uppercase hover:text-[#c98833] transition-colors duration-300"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Experiences */}
          <div className="space-y-6">

            <div>
              <p className="font-sans text-[10px] tracking-[4px] text-[#c98833] uppercase mb-3">
                Our World
              </p>

              <h3 className="font-cormorant text-2xl font-light text-[#f5e8d0]">
                Experiences
              </h3>
            </div>

            <div className="space-y-4">
              {experiences.map((experience) => (
                <div key={experience} className="flex items-center gap-3">
                  <div className="w-1 h-1 rounded-full bg-[#c98833] shrink-0" />

                  <span className="font-sans text-xs text-[#756451] font-light hover:text-[#c98833] transition-colors duration-300">
                    {experience}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* Join us */}
          <div className="space-y-6">

            <div>
              <p className="font-sans text-[10px] tracking-[4px] text-[#c98833] uppercase mb-3">
                Become Part Of Us
              </p>

              <h3 className="font-cormorant text-2xl font-light text-[#f5e8d0]">
                Join Our Network
              </h3>
            </div>

            <p className="font-sans text-xs text-[#756451] font-light leading-7">
              Are you an independent lifestyle professional?
              Connect with a discerning audience and showcase
              your profile on Touchline.
            </p>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-[#2a1f14]" />
              <div className="w-1 h-1 rounded-full bg-[#c98833]" />
              <div className="flex-1 h-px bg-[#2a1f14]" />
            </div>

            <Link
              href="/join/professionals"
              className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-7 py-4 bg-[#c98833] font-sans text-[9px] tracking-[3px] text-[#0d0a07] uppercase hover:bg-[#e0a34b] transition-all duration-300"
            >
              Join Our Network

              <svg
                width="16"
                height="8"
                viewBox="0 0 16 8"
                fill="none"
              >
                <path
                  d="M12 1L15 4M15 4L12 7M15 4H1"
                  stroke="currentColor"
                  strokeWidth="0.75"
                  strokeLinecap="round"
                />
              </svg>
            </Link>

            <p className="font-cormorant italic text-[#66513a] text-sm leading-relaxed">
              "Exceptional company. Memorable experiences.
              Absolute discretion."
            </p>

          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-16 pt-8 border-t border-[#1e1a14]">

          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">

            {/* Copyright */}
            <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">

              <span className="font-cormorant text-lg tracking-[3px] text-[#f5e8d0] uppercase">
                Touchline
              </span>

              <span className="hidden sm:block text-[#3a2b1b]">
                ·
              </span>

              <p className="font-sans text-[9px] tracking-[1px] text-[#5b4936]">
                © {new Date().getFullYear()} Touchline. All rights reserved.
              </p>

            </div>

            {/* Legal links */}
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-4">

              {legalLinks.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className="font-sans text-[9px] tracking-[1px] text-[#5b4936] uppercase hover:text-[#c98833] transition-colors duration-300"
                >
                  {label}
                </Link>
              ))}

            </div>

          </div>

          {/* Age notice */}
          <div className="mt-8 pt-6 border-t border-[#1e1a14] flex flex-col sm:flex-row justify-between items-center gap-3">

            <p className="font-sans text-[9px] tracking-[1px] text-[#51402e] text-center">
              An adults-only platform. Strictly for individuals aged 18 and above.
            </p>

            <span className="text-[9px] tracking-[3px] uppercase text-[#80633e]">
              Privacy · Respect · Discretion
            </span>

          </div>

        </div>
      </div>

      {/* Scroll to top */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="fixed z-40 right-5 bottom-5 sm:right-8 sm:bottom-8 w-11 h-11 border border-[#3a2b1b] bg-[#110e09] flex items-center justify-center text-[#c98833] hover:border-[#c98833] hover:bg-[#c98833] hover:text-[#0d0a07] transition-all duration-300 shadow-xl"
      >
        <ArrowUp className="w-4 h-4" />
      </button>

    </footer>
  );
};

export default Footer;
