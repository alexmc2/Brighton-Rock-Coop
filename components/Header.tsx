'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { cn } from '@/lib/utils';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false); // Close the menu when a link is clicked
  };

  return (
    <nav
      className={cn(
        'fixed top-0 w-full z-50 ',
        isScrolled
          ? 'bg-primary text-primary-foreground'
          : 'bg-transparent text-primary-foreground'
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
          <div className="flex items-center w-full justify-between lg:justify-start px-2 sm:px-3">
            {' '}
            {/* Updated: Allow full width and space between */}
            <ThemeToggle />
            <Link
              href="/"
              className="font-bold text-lg sm:text-xl md:text-2xl mx-auto lg:mx-0" // Center text within its container on mobile
            >
              <span className="block sm:hidden text-center">
                BRIGHTON ROCK CO-OP
              </span>{' '}
              {/* Centered text on mobile */}
              <span className="hidden sm:block">
                BRIGHTON ROCK HOUSING CO-OP
              </span>{' '}
            </Link>
          </div>
          <div className="hidden lg:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink href="/" onClick={handleLinkClick}>
                HOME
              </NavLink>
              <NavLink href="/meetings" onClick={handleLinkClick}>
                MEETINGS
              </NavLink>
              <NavLink href="/contact" onClick={handleLinkClick}>
                CONTACT
              </NavLink>
              <NavLink href="/vacancies" onClick={handleLinkClick}>
                VACANCIES
              </NavLink>
            </div>
          </div>
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md bg-primary text-primary-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Toggle main menu</span>
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      <div
        className={cn(
          'lg:hidden bg-primary text-primary-foreground overflow-hidden transition-all duration-500 ease-in-out',
          isOpen ? 'max-h-64' : 'max-h-0'
        )}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLink href="/" mobile onClick={handleLinkClick}>
            HOME
          </NavLink>
          <NavLink href="/meetings" mobile onClick={handleLinkClick}>
            MEETINGS
          </NavLink>
          <NavLink href="/contact" mobile onClick={handleLinkClick}>
            CONTACT
          </NavLink>
          <NavLink href="/vacancies" mobile onClick={handleLinkClick}>
            VACANCIES
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

const NavLink: React.FC<{
  href: string;
  children: React.ReactNode;
  mobile?: boolean;
  onClick?: () => void;
}> = ({ href, children, mobile, onClick }) => (
  <Link
    href={href}
    onClick={onClick}
    className={cn(
      'px-3 py-2 rounded-md text-lg font-medium',
      mobile
        ? 'block w-full text-center'
        : 'inline-block hover:bg-accent hover:text-accent-foreground transition-colors duration-300' // Hover effects only on desktop
    )}
  >
    {children}
  </Link>
);

export default Header;
