import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface GlobalMouseEffectContextType {
  globalMousePosition: { x: number; y: number };
  visibleSection: string | null;
  lastVisibleSection: string | null;
  setGlobalVisibleSection: (sectionId: string | null) => void;
  isScrolling: boolean;
}

export const GlobalMouseEffectContext = createContext<GlobalMouseEffectContextType>({
  globalMousePosition: { x: 0, y: 0 },
  visibleSection: null,
  lastVisibleSection: null,
  setGlobalVisibleSection: () => {},
  isScrolling: false,
});

export function useGlobalMouseEffect() {
  const context = useContext(GlobalMouseEffectContext);
  if (!context) {
    throw new Error('useGlobalMouseEffect must be used within a GlobalMouseEffectProvider');
  }
  return context;
}

export const GlobalMouseEffectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [globalMousePosition, setGlobalMousePosition] = useState({ x: 0, y: 0 });
  const [visibleSection, setVisibleSection] = useState<string | null>(null);
  const [lastVisibleSection, setLastVisibleSection] = useState<string | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setGlobalMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      const timeout = setTimeout(() => setIsScrolling(false), 150);
      setScrollTimeout(timeout);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [scrollTimeout]);

  const setGlobalVisibleSection = (sectionId: string | null) => {
    if (isScrolling) return;
    if (sectionId !== visibleSection) {
      if (visibleSection) setLastVisibleSection(visibleSection);
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
}; 