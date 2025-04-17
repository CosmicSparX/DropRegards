'use client';

import { useEffect, useRef, useState, useMemo } from 'react';
import { useMousePosition } from '../components/GlobalMouseEffect';

interface MouseFollowEffectProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  glowSize?: number;
  glowOpacity?: number;
  speed?: number;
  disabled?: boolean;
  pulse?: boolean;
  useGradient?: boolean;
  secondaryColor?: string;
  sectionId?: string;
}

export default function MouseFollowEffect({
  children,
  className = '',
  glowColor = 'rgba(79, 156, 255, 0.3)',
  glowSize = 180,
  glowOpacity = 0.5,
  speed = 0.2,
  disabled = false,
  pulse = false,
  useGradient = false,
  secondaryColor,
  sectionId
}: MouseFollowEffectProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const lastUpdateRef = useRef(0);
  const { globalMousePosition, setGlobalVisibleSection, visibleSection, previousSection, isScrolling } = useMousePosition();
  
  const isActive = visibleSection === sectionId;

  // Handle mouse interaction
  const handleMouseEnter = () => {
    if (!disabled && sectionId) {
      setIsHovering(true);
      setGlobalVisibleSection(sectionId);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setIsHovering(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled || isScrolling) return;
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  // Update mouse position for active section
  useEffect(() => {
    if (disabled || !containerRef.current || !isActive) return;
    
    // Reduce updates during scroll for better performance
    const now = Date.now();
    if (isScrolling && now - lastUpdateRef.current < 100) return;
    lastUpdateRef.current = now;
    
    // Calculate position relative to container when mouse is outside but section is active
    const rect = containerRef.current.getBoundingClientRect();
    
    // Check if mouse is inside viewport but outside container
    const isOutside = 
      globalMousePosition.x >= 0 && 
      globalMousePosition.x <= window.innerWidth &&
      globalMousePosition.y >= 0 && 
      globalMousePosition.y <= window.innerHeight &&
      (
        globalMousePosition.x < rect.left ||
        globalMousePosition.x > rect.right ||
        globalMousePosition.y < rect.top ||
        globalMousePosition.y > rect.bottom
      );
    
    if (isOutside) {
      // Calculate closest position on container boundary
      let closestX = globalMousePosition.x;
      let closestY = globalMousePosition.y;
      
      // Clamp to container bounds
      if (closestX < rect.left) closestX = rect.left;
      else if (closestX > rect.right) closestX = rect.right;
      
      if (closestY < rect.top) closestY = rect.top;
      else if (closestY > rect.bottom) closestY = rect.bottom;
      
      // Convert to container-relative coordinates
      setMousePosition({
        x: closestX - rect.left,
        y: closestY - rect.top
      });
    } else {
      // Mouse is inside container
      setMousePosition({
        x: globalMousePosition.x - rect.left,
        y: globalMousePosition.y - rect.top
      });
    }
  }, [globalMousePosition, isActive, disabled, isScrolling]);

  // Handle active section state
  useEffect(() => {
    if (isActive && !isHovering) {
      setIsHovering(true);
    } else if (!isActive && isHovering) {
      setIsHovering(false);
    }
  }, [isActive, isHovering]);
  
  // Generate the glow style
  const backgroundValue = useGradient 
    ? `radial-gradient(circle, ${glowColor} 0%, ${secondaryColor || 'rgba(56, 128, 255, 0.1)'} 40%, transparent 70%)`
    : `radial-gradient(circle, ${glowColor} 0%, rgba(56, 128, 255, 0.1) 40%, transparent 70%)`;

  // Add classes for pulse effect if enabled
  const animationClass = pulse ? 'animate-pulse-slow' : '';

  // Determine opacity - reduce it during scrolling
  const currentOpacity = isScrolling ? glowOpacity * 0.6 : glowOpacity;

  return (
    <div 
      ref={containerRef}
      id={sectionId || ''}
      data-section-id={sectionId}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* Only render glow when hovering or section is active */}
      {!disabled && (isHovering || isActive) && (
        <div 
          ref={glowRef}
          className={`pointer-events-none absolute blur-2xl rounded-full ${animationClass}`}
          style={{ 
            left: `${mousePosition.x}px`, 
            top: `${mousePosition.y}px`,
            width: `${glowSize}px`,
            height: `${glowSize}px`,
            backgroundImage: backgroundValue,
            transform: 'translate(-50%, -50%)',
            opacity: currentOpacity,
            zIndex: -1,
            willChange: 'left, top, opacity',
          }}
        />
      )}
      {children}
    </div>
  );
} 