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
  const [isMouseActive, setIsMouseActive] = useState(false);
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const lastUpdateRef = useRef(0);
  const mouseActivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const { globalMousePosition, setGlobalVisibleSection, visibleSection, previousSection, isScrolling } = useMousePosition();
  
  const isActive = visibleSection === sectionId;

  // Handle animation state to ensure smooth transition
  const handleAnimationState = (active: boolean) => {
    if (active && !isMouseActive) {
      // Start the appearance animation
      setIsAnimatingIn(true);
      setIsMouseActive(true);
      
      // Clear any existing animation timeout
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    } else if (!active && isMouseActive) {
      // Start the disappearance animation
      setIsAnimatingIn(false);
      setIsMouseActive(false);
    }
  };

  // Track mouse activity
  const resetMouseActivityTimer = () => {
    if (mouseActivityTimeoutRef.current) {
      clearTimeout(mouseActivityTimeoutRef.current);
    }
    
    // If it was inactive, animate back in
    if (!isMouseActive) {
      handleAnimationState(true);
    }
    
    mouseActivityTimeoutRef.current = setTimeout(() => {
      handleAnimationState(false);
    }, 600); // Slightly longer for smoother experience
  };

  // Handle mouse interaction
  const handleMouseEnter = () => {
    if (!disabled && sectionId) {
      setIsHovering(true);
      setGlobalVisibleSection(sectionId);
      handleAnimationState(true);
      resetMouseActivityTimer();
    }
  };

  const handleMouseLeave = () => {
    if (!disabled) {
      setIsHovering(false);
      handleAnimationState(false); // Smoothly animate out
    }
  };

  // Handle mouse move event
  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabled) return;
    
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      // Only update if mouse position has changed significantly
      const distance = Math.sqrt(
        Math.pow(newPos.x - lastMousePosRef.current.x, 2) + 
        Math.pow(newPos.y - lastMousePosRef.current.y, 2)
      );
      
      // Check if we need to animate back in
      if (!isMouseActive) {
        handleAnimationState(true);
      }
      
      // More responsive - lower threshold but smoothed
      if (distance > 1.5) {
        // Apply a slight smoothing to the mouse position
        const smoothedPos = {
          x: lastMousePosRef.current.x + (newPos.x - lastMousePosRef.current.x) * 0.5,
          y: lastMousePosRef.current.y + (newPos.y - lastMousePosRef.current.y) * 0.5
        };
        
        setMousePosition(smoothedPos);
        lastMousePosRef.current = smoothedPos;
        resetMouseActivityTimer();
      }
    }
  };

  // Set up and clean up the mouse activity timer
  useEffect(() => {
    return () => {
      if (mouseActivityTimeoutRef.current) {
        clearTimeout(mouseActivityTimeoutRef.current);
      }
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  // Update mouse position for active section
  useEffect(() => {
    if (disabled || !containerRef.current || !isActive) return;
    
    // Smoother updates
    const now = Date.now();
    if (isScrolling && now - lastUpdateRef.current < 60) return;
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
      const newPos = {
        x: closestX - rect.left,
        y: closestY - rect.top
      };
      
      // Check if position has changed significantly
      const distance = Math.sqrt(
        Math.pow(newPos.x - lastMousePosRef.current.x, 2) + 
        Math.pow(newPos.y - lastMousePosRef.current.y, 2)
      );
      
      if (distance > 1.5) {
        // Apply smoothing
        const smoothedPos = {
          x: lastMousePosRef.current.x + (newPos.x - lastMousePosRef.current.x) * 0.6,
          y: lastMousePosRef.current.y + (newPos.y - lastMousePosRef.current.y) * 0.6
        };
        
        setMousePosition(smoothedPos);
        lastMousePosRef.current = smoothedPos;
        resetMouseActivityTimer();
      }
    } else {
      // Mouse is inside container
      const newPos = {
        x: globalMousePosition.x - rect.left,
        y: globalMousePosition.y - rect.top
      };
      
      // Check if position has changed significantly
      const distance = Math.sqrt(
        Math.pow(newPos.x - lastMousePosRef.current.x, 2) + 
        Math.pow(newPos.y - lastMousePosRef.current.y, 2)
      );
      
      if (distance > 1.5) {
        // Apply smoothing for more elegant movement
        const smoothedPos = {
          x: lastMousePosRef.current.x + (newPos.x - lastMousePosRef.current.x) * 0.7,
          y: lastMousePosRef.current.y + (newPos.y - lastMousePosRef.current.y) * 0.7
        };
        
        setMousePosition(smoothedPos);
        lastMousePosRef.current = smoothedPos;
        resetMouseActivityTimer();
      }
    }
  }, [globalMousePosition, isActive, disabled, isScrolling]);

  // Handle active section state
  useEffect(() => {
    if (isActive && !isHovering) {
      setIsHovering(true);
    } else if (!isActive && isHovering) {
      setIsHovering(false);
      handleAnimationState(false);
    }
  }, [isActive, isHovering]);
  
  // Generate the glow style
  const backgroundValue = useGradient 
    ? `radial-gradient(circle, ${glowColor} 0%, ${secondaryColor || 'rgba(56, 128, 255, 0.1)'} 40%, transparent 70%)`
    : `radial-gradient(circle, ${glowColor} 0%, rgba(56, 128, 255, 0.1) 40%, transparent 70%)`;

  // Add classes for pulse effect if enabled
  const animationClass = pulse ? 'animate-pulse-slow' : '';

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
          className={`pointer-events-none absolute blur-2xl rounded-full ${animationClass} ${isMouseActive ? 'animate-glow-in' : 'animate-glow-out'}`}
          style={{ 
            left: `${mousePosition.x}px`, 
            top: `${mousePosition.y}px`,
            width: `${glowSize}px`,
            height: `${glowSize}px`,
            backgroundImage: backgroundValue,
            transform: 'translate(-50%, -50%)',
            opacity: isMouseActive ? glowOpacity : 0,
            zIndex: -1,
            willChange: 'left, top, opacity, transform, filter',
          }}
        />
      )}
      {children}
    </div>
  );
} 