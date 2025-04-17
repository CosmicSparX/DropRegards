import { useState, useEffect, createContext, useContext } from 'react';

// Define interface for the mouse effect context
interface GlobalMouseEffectContextType {
  globalMousePosition: { x: number; y: number };
  visibleSection: string | null;
  lastVisibleSection: string | null;
  setGlobalVisibleSection: (sectionId: string | null) => void;
  isScrolling: boolean;
}

// Create context with default values
const GlobalMouseEffectContext = createContext<GlobalMouseEffectContextType>({
  globalMousePosition: { x: 0, y: 0 },
  visibleSection: null,
  lastVisibleSection: null,
  setGlobalVisibleSection: () => {},
  isScrolling: false,
});

// Hook to access the global mouse effect context
export function useGlobalMouseEffect() {
  return useContext(GlobalMouseEffectContext);
}

// Provider component to wrap your app
export function GlobalMouseEffectProvider({ children }: { children: React.ReactNode }) {
  const [globalMousePosition, setGlobalMousePosition] = useState({ x: 0, y: 0 });
  const [visibleSection, setVisibleSection] = useState<string | null>(null);
  const [lastVisibleSection, setLastVisibleSection] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  // Track global mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setGlobalMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Track scrolling state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      
      // Clear any existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      // Set a new timeout to turn off scrolling state after scrolling stops
      const timeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150); // Adjust timing as needed
      
      setScrollTimeout(timeout);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [scrollTimeout]);

  // Handle section visibility changes
  const setGlobalVisibleSection = (sectionId: string | null) => {
    if (isScrolling) return; // Ignore section changes during scrolling
    
    if (sectionId !== visibleSection) {
      // Store the last visible section before updating
      if (visibleSection) {
        setLastVisibleSection(visibleSection);
      }
      setVisibleSection(sectionId);
    }
  };

  const value = {
    globalMousePosition,
    visibleSection,
    lastVisibleSection,
    setGlobalVisibleSection,
    isScrolling,
  };

  return (
    <GlobalMouseEffectContext.Provider value={value}>
      {children}
    </GlobalMouseEffectContext.Provider>
  );
} 