'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';

// Create context for global mouse position
interface MouseContextType {
  globalMousePosition: { x: number, y: number };
  setGlobalVisibleSection: (section: string | null) => void;
  visibleSection: string | null;
  previousSection: string | null;
}

const MouseContext = createContext<MouseContextType>({
  globalMousePosition: { x: 0, y: 0 },
  setGlobalVisibleSection: () => {},
  visibleSection: null,
  previousSection: null
});

// Hook to use the mouse context
export const useMousePosition = () => useContext(MouseContext);

interface GlobalMouseEffectProps {
  children: ReactNode;
}

export default function GlobalMouseEffect({ children }: GlobalMouseEffectProps) {
  const [globalMousePosition, setGlobalMousePosition] = useState({ x: 0, y: 0 });
  const [visibleSection, setVisibleSection] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSectionRef = useRef<string | null>(null);
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Handle mouse movements
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setGlobalMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    // Detect scroll events to temporarily pause section tracking
    const handleScroll = () => {
      setIsScrolling(true);
      
      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      // Set a timeout to mark scrolling as done after 100ms of no scroll events
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);
  
  // Handle section changes
  const setGlobalVisibleSection = (section: string | null) => {
    // Don't update if we're scrolling to avoid flicker
    if (!isScrolling) {
      // Clear any pending transitions
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      
      // If we're changing sections, store the current one
      if (section !== visibleSection) {
        lastSectionRef.current = visibleSection;
        setVisibleSection(section);
      }
    }
  };
  
  return (
    <MouseContext.Provider value={{ 
      globalMousePosition, 
      setGlobalVisibleSection, 
      visibleSection,
      previousSection: lastSectionRef.current
    }}>
      {children}
    </MouseContext.Provider>
  );
} 