'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const { globalMousePosition, setGlobalVisibleSection, visibleSection, previousSection } = useMousePosition();
  
  const isActive = visibleSection === sectionId;
  const wasActive = previousSection === sectionId;

  // Handle mouse interaction
  const handleMouseEnter = () => {
    if (!disabled && sectionId) {
      setIsHovering(true);
      setGlobalVisibleSection(sectionId);
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 500);
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setIsHovering(false);
      // Don't immediately set section to null - this will be handled globally
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!disabled && containerRef.current) {
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
  }, [globalMousePosition, isActive, disabled]);

  // Handle section transitions
  useEffect(() => {
    if (isActive && !isHovering) {
      setIsHovering(true);
      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 500);
    } else if (!isActive && isHovering && wasActive) {
      setIsTransitioning(true);
      setTimeout(() => {
        setIsHovering(false);
        setIsTransitioning(false);
      }, 500);
    }
  }, [isActive, isHovering, wasActive]);
  
  // Generate the glow style
  const backgroundValue = useGradient 
    ? `radial-gradient(circle, ${glowColor} 0%, ${secondaryColor || 'rgba(56, 128, 255, 0.1)'} 40%, transparent 70%)`
    : `radial-gradient(circle, ${glowColor} 0%, rgba(56, 128, 255, 0.1) 40%, transparent 70%)`;
  
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
          className={`pointer-events-none absolute blur-2xl rounded-full transition-opacity ${
            isTransitioning ? (isActive ? "animate-glow-enter" : "animate-glow-exit") : ""
          }`}
          style={{ 
            left: `${mousePosition.x}px`, 
            top: `${mousePosition.y}px`,
            width: `${glowSize}px`,
            height: `${glowSize}px`,
            backgroundImage: backgroundValue,
            transform: 'translate(-50%, -50%)',
            opacity: isHovering || isActive ? glowOpacity : 0,
            transition: "opacity 0.5s ease-in-out",
            zIndex: 1,
          }}
        />
      )}
      {children}
    </div>
  );
} 