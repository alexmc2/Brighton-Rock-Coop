import React from 'react';
import Image from 'next/image';
import Illustration from '@/public/hero-illustration.svg';
import HeroImage from '@/public/hero.png';

interface HeroProps {
  title: string;
  description?: string;
  showLogo?: boolean;
}

export default function Hero({ title, description, showLogo }: HeroProps) {
  return (
    <section className="relative bg-primary pt-32 pb-32 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-primary to-primary-light pointer-events-none"
        aria-hidden="true"
      />

      {/* SVG Illustration */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 pointer-events-none top-0"
        aria-hidden="true"
      >
        <Image
          src={Illustration}
          alt="Illustration"
          className="max-w-none"
          priority
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {showLogo && (
            <div className="relative z-10 w-full lg:w-1/2 mb-8 lg:mb-0 lg:mr-8">
              <div className="flex justify-center lg:justify-start">
                <Image
                  src={HeroImage}
                  alt="Hero"
                  width={500}
                  height={500}
                  className="p-4 lg:p-0" // Add padding for small screens
                />
              </div>
            </div>
          )}
          <div
            className={`text-center lg:text-left ${
              showLogo ? 'lg:w-1/2' : 'w-full'
            }`}
          >
            <h1 className="text-5xl sm:text-6xl text-white font-bold mb-6 pr-0 sm:pr-4 ">
              {title}
            </h1>
            <p className="text-2xl px-2 text-white">{description}</p>
          </div>
        </div>
      </div>
      <svg
        className="absolute bottom-0 left-0 w-full h-auto"
        viewBox="0 0 1920 120"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="fill-background"
          d="M0,158.755s63.9,52.163,179.472,50.736c121.494-1.5,185.839-49.738,305.984-49.733,109.21,0,181.491,51.733,300.537,50.233,123.941-1.562,225.214-50.126,390.43-50.374,123.821-.185,353.982,58.374,458.976,56.373,217.907-4.153,284.6-57.236,284.6-57.236V351.03H0V158.755Z"
          transform="translate(0 -158.755)"
        />
      </svg>
    </section>
  );
}
