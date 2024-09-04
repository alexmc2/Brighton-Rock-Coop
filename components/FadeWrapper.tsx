// components/FadeWrapper.tsx

'use client';

import React from 'react';
import { Fade, Reveal } from 'react-awesome-reveal';
import { keyframes } from '@emotion/react';

interface FadeWrapperProps {
  children: React.ReactNode;
  duration?: number;
  cascade?: boolean;
  triggerOnce?: boolean;
  useCustomAnimation?: boolean;
  delay?: number;
}

const customAnimation = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, -5px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`;

const FadeWrapper: React.FC<FadeWrapperProps> = ({
  children,
  duration = 2000,
  cascade = false,
  triggerOnce = true,
  useCustomAnimation = false,
  delay = 0,
}) => {
  if (useCustomAnimation) {
    return (
      <Reveal
        keyframes={customAnimation}
        duration={duration}
        cascade={cascade}
        triggerOnce={triggerOnce}
        delay={delay}
      >
        {children}
      </Reveal>
    );
  }

  return (
    <Fade
      duration={duration}
      cascade={cascade}
      triggerOnce={triggerOnce}
      delay={delay}
    >
      {children}
    </Fade>
  );
};

export default FadeWrapper;
