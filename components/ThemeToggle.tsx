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
        md:w-10 w-10 h-5 rounded-full 
        bg-secondary
        transition-colors duration-200 ease-in-out focus:outline-none  
        lg:mr-4
      `}
    >
      <div
        className={`
          w-4 h-4 rounded-full bg-white dark:bg-black shadow-md transform 
          ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}
          transition-transform duration-200 ease-in-out
        `}
      />
    </button>
  );
};

export default ThemeToggle;
