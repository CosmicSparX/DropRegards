'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';

// Create context for global mouse position
interface MouseContextType {
  globalMousePosition: { x: number, y: number };
  setGlobalVisibleSection: (section: string | null) => void;
  visibleSection: string | null;
  previousSection: string | null;
  isScrolling: boolean;
}

const MouseContext = createContext<MouseContextType>({
  globalMousePosition: { x: 0, y: 0 },
  setGlobalVisibleSection: () => {},
  visibleSection: null,
  previousSection: null,
  isScrolling: false
});

// Hook to use the mouse context
export const useMousePosition = () => useContext(MouseContext);

interface GlobalMouseEffectProps {
  children: ReactNode;
}

// Throttle function to limit how often a function can be called
const throttle = (callback: Function, delay: number) => {
  let lastCall = 0;
  return function(...args: any[]) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      callback(...args);
    }
  };
};

export default function GlobalMouseEffect({ children }: GlobalMouseEffectProps) {
  const [globalMousePosition, setGlobalMousePosition] = useState({ x: 0, y: 0 });
  const [visibleSection, setVisibleSection] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSectionRef = useRef<string | null>(null);
  const lastKnownMousePosition = useRef({ x: 0, y: 0 });
  
  // Handle mouse movements
  useEffect(() => {
    // Store last known position to use during scroll
    const handleMouseMove = (e: MouseEvent) => {
      const position = { x: e.clientX, y: e.clientY };
      lastKnownMousePosition.current = position;
      
      // Only update state if not scrolling to avoid jitter
      if (!isScrolling) {
        setGlobalMousePosition(position);
      }
    };
    
    // Throttled version to limit updates during scrolling
    const throttledMouseMove = throttle((e: MouseEvent) => {
      if (isScrolling) {
        setGlobalMousePosition({ x: e.clientX, y: e.clientY });
      }
    }, 100);
    
    // Detect scroll events to temporarily pause section tracking
    const handleScroll = () => {
      if (!isScrolling) {
        setIsScrolling(true);
      }
      
      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Set a timeout to mark scrolling as done after scroll events stop
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
        // Update position once scrolling stops to ensure accuracy
        setGlobalMousePosition(lastKnownMousePosition.current);
      }, 200);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousemove', throttledMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousemove', throttledMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isScrolling]);
  
  // Handle section changes
  const setGlobalVisibleSection = (section: string | null) => {
    // If we're changing sections, store the current one
    if (section !== visibleSection) {
      lastSectionRef.current = visibleSection;
      setVisibleSection(section);
    }
  };
  
  return (
    <MouseContext.Provider value={{ 
      globalMousePosition, 
      setGlobalVisibleSection, 
      visibleSection,
      previousSection: lastSectionRef.current,
      isScrolling
    }}>
      {children}
    </MouseContext.Provider>
  );
} 