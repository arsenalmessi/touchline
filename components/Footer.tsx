'use client';
import React, { useEffect, useState } from 'react';
import { MapPin, Mail, ArrowUp } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#080604] text-[#6b5e50] py-16 px-4 relative border-t border-[#1e1a14]">

      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #b8924a, transparent)' }}
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Get In Touch */}
        <div className="space-y-6">
          <div>
            <p className="font-sans text-[10px] tracking-[0.25em] text-[#7a5f32] uppercase mb-2">Contact</p>
            <h3 className="font-serif text-2xl font-light text-[#f0ebe0]">Get In Touch</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#7a5f32] shrink-0 mt-0.5" />
              <span className="font-sans text-xs font-light leading-relaxed">
                15 Samora Machel Avenue, Harare, Zimbabwe
              </span>
            </div>
    
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#7a5f32] shrink-0" />
              <span className="font-sans text-xs font-light">hello@Touchline.co.zw</span>
            </div>
          </div>

          {/* Socials */}
          <div className="flex gap-3">
          
               Twitter
          
            
         
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-6">
          <div>
            <p className="font-sans text-[10px] tracking-[0.25em] text-[#7a5f32] uppercase mb-2">Navigate</p>
            <h3 className="font-serif text-2xl font-light text-[#f0ebe0]">Quick Links</h3>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/about' },
              { label: 'Treatments', href: '/treatments' },
              { label: 'Our Therapists', href: '/workers' },
              { label: 'Book Now', href: '/search' },
              { label: 'Contact', href: '/contact' },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="font-sans text-[10px] tracking-[0.2em] text-[#6b5e50] uppercase hover:text-[#b8924a] transition-colors duration-300"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Treatments */}
        <div className="space-y-6">
          <div>
            <p className="font-sans text-[10px] tracking-[0.25em] text-[#7a5f32] uppercase mb-2">Offerings</p>
            <h3 className="font-serif text-2xl font-light text-[#f0ebe0]">Treatments</h3>
          </div>
          <div className="space-y-3">
            {[
              'Swedish Massage',
              'Deep Tissue',
              'Hot Stone Ritual',
              'Aromatherapy',
              'Couples Retreat',
              'Sports Recovery',
            ].map((t) => (
              <div key={t} className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full bg-[#b8924a] shrink-0" />
                <span className="font-sans text-xs text-[#6b5e50] font-light hover:text-[#a89880] transition-colors duration-300 cursor-pointer">
                  {t}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Join / CTA */}
        <div className="space-y-6">
          <div>
            <p className="font-sans text-[10px] tracking-[0.25em] text-[#7a5f32] uppercase mb-2">Join Us</p>
            <h3 className="font-serif text-2xl font-light text-[#f0ebe0]">Become a Therapist</h3>
          </div>
          <p className="font-sans text-xs text-[#6b5e50] font-light leading-relaxed">
            Are you a certified massage therapist in Zimbabwe? Join Touchline and connect with clients seeking premium wellness experiences.
          </p>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-[#1e1a14]" />
            <div className="w-1 h-1 rounded-full bg-[#7a5f32]" />
            <div className="flex-1 h-px bg-[#1e1a14]" />
          </div>

          <Link
            href="/join/professionals"
            className="inline-flex items-center gap-3 px-8 py-3 bg-[#b8924a] font-sans text-[10px] tracking-[0.25em] text-[#0d0b08] uppercase hover:bg-[#d4af71] transition-colors duration-300"
          >
            Apply Now
            <svg width="16" height="8" viewBox="0 0 16 8" fill="none">
              <path d="M12 1L15 4M15 4L12 7M15 4H1" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" />
            </svg>
          </Link>

          <p className="font-serif italic text-[#4a3e30] text-xs">
            "Bringing luxury wellness to every corner of Zimbabwe."
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-16 pt-8 border-t border-[#1e1a14]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="font-serif text-sm font-light tracking-[0.15em] text-[#f0ebe0]">Touchline</span>
            <span className="text-[#2a2318]">·</span>
            <p className="font-sans text-[10px] text-[#4a3e30]">
              © 2026 All rights reserved · Harare, Zimbabwe
            </p>
          </div>
          <div className="flex gap-6">
            {[
              { label: 'Terms & Conditions', href: '/terms-and-conditions' },
              { label: 'Cookies', href: '/cookies' },
              { label: 'Privacy Policy', href: '/privacy-policy' },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="font-sans text-[10px] tracking-[0.15em] text-[#4a3e30] uppercase hover:text-[#b8924a] transition-colors duration-300"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      {isClient && (
        <button
          onClick={scrollToTop}
          className="absolute right-6 bottom-6 w-10 h-10 border border-[#2a2318] bg-[#100e0b] flex items-center justify-center text-[#7a5f32] hover:border-[#b8924a44] hover:text-[#b8924a] transition-all duration-300"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </footer>
  );
};

export default Footer;