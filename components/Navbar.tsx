
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Phone,
  Menu,
  X,
  LogIn,
  UserPlus,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  User,
} from 'lucide-react';

import { Session } from 'next-auth';
import { signOut } from 'next-auth/react';
import { getInitials } from '@/utils/generateInitials';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';

interface NavbarProps {
  session: Session | null;
}

const Navbar = ({ session }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const user = session?.user;
  const isLoggedIn = !!user;

  const displayName = user?.name || 'My Account';
  const firstName = displayName.split(' ')[0];
  const initials = getInitials(displayName);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  async function handleLogout() {
    await signOut({
      callbackUrl: '/login',
    });
  }

  const closeMobileMenu = () => setIsOpen(false);

  const UserAvatar = ({ size = 32 }: { size?: number }) => (
    <Avatar style={{ width: size, height: size }}>
      {user?.image && (
        <AvatarImage
          src={user.image}
          alt={displayName}
        />
      )}

      <AvatarFallback
        style={{
          background: '#171008',
          border: '1px solid #c9883370',
          color: '#c98833',
          fontSize: 11,
          fontFamily: 'Montserrat, sans-serif',
        }}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400;500&display=swap');

        .shiftly-nav-wrap {
          font-family: 'Montserrat', sans-serif;
        }

        .shiftly-navbar {
          background: #0d0a07;
          border-bottom: 1px solid #1a120a;
          padding: 1.1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: padding .3s, box-shadow .3s;
        }

        .shiftly-navbar.scrolled {
          padding: .75rem 2rem;
          box-shadow: 0 4px 24px rgba(0,0,0,.5);
        }

        .shiftly-brand {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 300;
          color: #f5e8d0;
          letter-spacing: 2px;
          text-decoration: none;
        }

        .shiftly-brand span {
          color: #c98833;
          font-style: italic;
        }

        .shiftly-nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .shiftly-nav-link {
          position: relative;
          font-size: 9px;
          letter-spacing: 3px;
          color: #8a6a4a;
          text-transform: uppercase;
          text-decoration: none;
          transition: color .2s;
        }

        .shiftly-nav-link:hover {
          color: #c98833;
        }

        .shiftly-nav-actions {
          display: flex;
          align-items: center;
          gap: .75rem;
        }

        .btn-nav-ghost,
        .btn-nav-gold {
          font-family: 'Montserrat', sans-serif;
          font-size: 9px;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 9px 16px;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          transition: all .3s;
        }

        .btn-nav-ghost {
          color: #8a6a4a;
          border: 1px solid #2a1f14;
          background: transparent;
        }

        .btn-nav-gold {
          color: #c98833;
          border: 1px solid #c98833;
          background: transparent;
        }

        .btn-nav-ghost:hover {
          border-color: #c98833;
          color: #c98833;
        }

        .btn-nav-gold:hover {
          background: #c98833;
          color: #0d0a07;
        }

        /* Desktop user profile */

        .shiftly-user-trigger {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          border: 1px solid #2a1f14;
          padding: 5px 12px 5px 6px;
          background: #110e09;
          transition: border-color .2s;
        }

        .shiftly-user-trigger:hover {
          border-color: #c98833;
        }

        .shiftly-user-details {
          display: flex;
          flex-direction: column;
          gap: 3px;
          text-align: left;
        }

        .shiftly-user-name {
          font-size: 10px;
          letter-spacing: 1.5px;
          color: #e8d5b8;
          text-transform: uppercase;
        }

        .shiftly-user-status {
          font-size: 8px;
          letter-spacing: 1px;
          color: #8a6a4a;
          text-transform: uppercase;
        }

        .shiftly-user-trigger svg {
          color: #c98833;
          width: 13px;
          height: 13px;
        }

        /* Dropdown */

        .shiftly-dropdown {
          background: #110e09 !important;
          border: 1px solid #2a1f14 !important;
          border-radius: 0 !important;
          min-width: 230px;
          padding: 8px !important;
        }

        .shiftly-dropdown-label {
          padding: 12px 8px;
          text-align: left;
        }

        .shiftly-dropdown-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          color: #e8d5b8;
        }

        .shiftly-dropdown-email {
          font-size: 9px;
          letter-spacing: 1px;
          color: #8a6a4a;
          margin-top: 4px;
          word-break: break-word;
        }

        .shiftly-dropdown-item {
          font-size: 9px !important;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #b89a78 !important;
          padding: 10px !important;
          cursor: pointer;
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .shiftly-dropdown-item:hover {
          background: #1c150d !important;
          color: #c98833 !important;
        }

        .shiftly-dropdown-logout {
          color: #bd6247 !important;
        }

        /* Mobile */

        .shiftly-mobile-toggle {
          display: none;
          background: transparent;
          border: none;
          color: #c98833;
          cursor: pointer;
        }

        .shiftly-mobile-menu {
          background: #0d0a07;
          border-top: 1px solid #1a120a;
          padding: 1.5rem 2rem;
        }

        .shiftly-mobile-link {
          display: block;
          font-size: 10px;
          letter-spacing: 2px;
          color: #8a6a4a;
          text-transform: uppercase;
          text-decoration: none;
          padding: 13px 0;
          border-bottom: 1px solid #1a120a;
        }

        .shiftly-mobile-link:hover {
          color: #c98833;
        }

        .shiftly-mobile-contact {
          margin-top: 1.5rem;
          padding: 1rem;
          border: 1px solid #2a1f14;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .shiftly-mobile-contact-icon {
          color: #c98833;
        }

        .shiftly-mobile-contact-label {
          font-size: 8px;
          letter-spacing: 2px;
          color: #8a6a4a;
        }

        .shiftly-mobile-contact-val {
          font-family: 'Cormorant Garamond', serif;
          font-size: 15px;
          color: #e8d5b8;
        }

        .shiftly-mobile-user-block {
          margin-top: 1.5rem;
          padding: 1rem;
          border: 1px solid #2a1f14;
          background: #110e09;
        }

        .shiftly-mobile-user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 14px;
          border-bottom: 1px solid #2a1f14;
        }

        .shiftly-mobile-user-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 19px;
          color: #e8d5b8;
        }

        .shiftly-mobile-user-email {
          font-size: 9px;
          color: #8a6a4a;
          margin-top: 3px;
          word-break: break-word;
        }

        .shiftly-mobile-actions {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: .6rem;
        }

        .shiftly-mobile-dashboard {
          margin-top: 14px;
          width: 100%;
        }

        .shiftly-mobile-logout {
          width: 100%;
          margin-top: 8px;
          color: #bd6247;
        }

        @media (max-width: 768px) {
          .shiftly-nav-links,
          .shiftly-nav-actions {
            display: none;
          }

          .shiftly-mobile-toggle {
            display: block;
          }

          .shiftly-navbar {
            padding: 1rem 1.2rem;
          }

          .shiftly-navbar.scrolled {
            padding: .75rem 1.2rem;
          }

          .shiftly-mobile-menu {
            padding: 1.2rem;
            max-height: calc(100vh - 70px);
            overflow-y: auto;
          }
        }
      `}</style>

      <div
        className="shiftly-nav-wrap"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
        }}
      >

        {/* Main navbar */}

        <nav className={`shiftly-navbar${scrolled ? ' scrolled' : ''}`}>

          <Link href="/" className="shiftly-brand">
            Sera<span>fine</span>
          </Link>

          {/* Desktop navigation */}

          <div className="shiftly-nav-links">
            <Link href="/about" className="shiftly-nav-link">About</Link>
            <Link href="/search" className="shiftly-nav-link">Search</Link>
            <Link href="/terms-and-conditions" className="shiftly-nav-link">Terms And Conditions</Link>
            <Link href="/register"  className="shiftly-mobile-link">
              Join 
            </Link>
            <Link href="/contact" className="shiftly-nav-link">Contact</Link>
          </div>

          {/* Desktop authentication */}

          <div className="shiftly-nav-actions">

            {isLoggedIn ? (

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="shiftly-user-trigger">

                    <UserAvatar size={34} />

                    <div className="shiftly-user-details">
                      <span className="shiftly-user-name">
                        {firstName}
                      </span>

                      <span className="shiftly-user-status">
                        My Account
                      </span>
                    </div>

                    <ChevronDown size={13} />

                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="shiftly-dropdown"
                >

                  <DropdownMenuLabel>
                    <div className="shiftly-dropdown-label">
                      <div className="shiftly-dropdown-name">
                        {displayName}
                      </div>

                      <div className="shiftly-dropdown-email">
                        {user?.email || 'Account'}
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator
                    style={{ background: '#2a1f14' }}
                  />

                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="shiftly-dropdown-item"
                    >
                      <LayoutDashboard size={14} />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator
                    style={{ background: '#2a1f14' }}
                  />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="shiftly-dropdown-item shiftly-dropdown-logout"
                  >
                    <LogOut size={14} />
                    Logout
                  </DropdownMenuItem>

                </DropdownMenuContent>
              </DropdownMenu>

            ) : (

              <>
                <Link href="/login" className="btn-nav-ghost">
                  <LogIn size={12} />
                  Login
                </Link>

                <Link href="/register" className="btn-nav-gold">
                  <UserPlus size={12} />
                  Join
                </Link>
              </>

            )}

          </div>

          {/* Mobile toggle */}

          <button
            className="shiftly-mobile-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

        </nav>

        {/* Mobile navigation */}

        {isOpen && (

          <div className="shiftly-mobile-menu">

            

            <Link href="/about" onClick={closeMobileMenu} className="shiftly-mobile-link">
              About
            </Link>
            <Link href="/search" className="shiftly-nav-link">Search</Link>
            <Link href="/terms-and-conditions" className="shiftly-nav-link">Terms And Conditions</Link>
            <Link href="/register" className="shiftly-nav-link">Join </Link>

            <Link href="/register" onClick={closeMobileMenu} className="shiftly-mobile-link">
              Join as Professional
            </Link>

          

            <Link href="/contact" onClick={closeMobileMenu} className="shiftly-mobile-link">
              Contact
            </Link>

            <div className="shiftly-mobile-contact">
              <div className="shiftly-mobile-contact-icon">
                <Phone size={18} />
              </div>

              <div>
                <div className="shiftly-mobile-contact-label">
                  Contact
                </div>

                <div className="shiftly-mobile-contact-val">
                  +(44) 864 434 57
                </div>
              </div>
            </div>

            {/* Logged-in mobile user */}

            {isLoggedIn ? (

              <div className="shiftly-mobile-user-block">

                <div className="shiftly-mobile-user-info">

                  <UserAvatar size={42} />

                  <div>
                    <div className="shiftly-mobile-user-name">
                      {displayName}
                    </div>

                    <div className="shiftly-mobile-user-email">
                      {user?.email}
                    </div>
                  </div>

                </div>

                <Link
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  className="btn-nav-gold shiftly-mobile-dashboard"
                >
                  <LayoutDashboard size={14} />
                  My Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="btn-nav-ghost shiftly-mobile-logout"
                >
                  <LogOut size={14} />
                  Logout
                </button>

              </div>

            ) : (

              <div className="shiftly-mobile-actions">

                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="btn-nav-ghost"
                >
                  <LogIn size={12} />
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={closeMobileMenu}
                  className="btn-nav-gold"
                >
                  <UserPlus size={12} />
                  Create Account
                </Link>

              </div>

            )}

          </div>

        )}

      </div>
    </>
  );
};

export default Navbar;
