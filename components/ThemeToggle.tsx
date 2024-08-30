// src/components/ThemeToggle.tsx
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

const ThemeToggle: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={`
        md:w-10 w-12 h-5 rounded-full p-0.5 md:pr-0 pr-1
        bg-secondary
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-offset-1  focus:ring-white 
        mr-4 // Add margin to the right
      `}
    >
      <div
        className={`
          w-4 h-4 rounded-full bg-white shadow-md transform 
          ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}
          transition-transform duration-200 ease-in-out
        `}
      />
    </button>
  );
};

export default ThemeToggle;
