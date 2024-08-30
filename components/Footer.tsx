// src/components/Footer.tsx

'use client';
import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-auto mb-4 md:mb-0">
            <ul className="flex flex-wrap justify-center md:justify-start space-x-6">
              <li>
                <FooterLink href="/">Home</FooterLink>
              </li>
              <li>
                <FooterLink href="/meeting-dates">Meetings</FooterLink>
              </li>
              <li>
                <FooterLink href="/contact">Contact</FooterLink>
              </li>
              <li>
                <FooterLink href="/vacancies">Vacancies</FooterLink>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-auto text-center md:text-right">
            <p className="text-sm">
              Copyright &copy; Brighton Rock Housing Co-operative
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => (
  <Link
    href={href}
    className="text-gray-300 hover:text-white transition-colors duration-300"
  >
    {children}
  </Link>
);

export default Footer;
