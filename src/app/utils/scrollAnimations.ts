'use client';

export const initScrollAnimations = () => {
  // Check if the browser environment is available
  if (typeof window === 'undefined') return;
  
  // Get all elements with the scroll-animate class
  const animatedElements = document.querySelectorAll('.scroll-animate');
  
  // Function to set initial animations for sequential groups
  const initSequentialGroups = () => {
    const sequentialGroups = document.querySelectorAll('.sequential-animate');
    
    sequentialGroups.forEach((group) => {
      const children = Array.from(group.children);
      children.forEach((child, index) => {
        // Add sequential animation delay based on index
        (child as HTMLElement).style.transitionDelay = `${0.1 + (index * 0.1)}s`;
        
        // Add the scroll-animate class if not already present
        if (!child.classList.contains('scroll-animate')) {
          child.classList.add('scroll-animate', 'fade-up');
        }
      });
    });
  };
  
  // Call the function to initialize sequential groups
  initSequentialGroups();
  
  // Create a more sophisticated intersection observer with options
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.target.classList.contains('scroll-animate')) return;
        
        // Add the visible class when the element is in view
        if (entry.isIntersecting) {
          // Get custom animation speed if specified
          const speedAttr = entry.target.getAttribute('data-animation-speed');
          const speed = speedAttr ? parseFloat(speedAttr) : null;
          
          if (speed) {
            (entry.target as HTMLElement).style.transitionDuration = `${speed}s`;
          }
          
          // Add visible class after a tiny delay for performance
          requestAnimationFrame(() => {
            entry.target.classList.add('visible');
            
            // Check if this is a one-time animation
            if (entry.target.hasAttribute('data-animate-once')) {
              observer.unobserve(entry.target);
            }
          });
        } else if (!entry.target.hasAttribute('data-animate-once')) {
          // Only remove the class for elements that should animate again
          // Add some buffer before removing the class
          const rect = entry.target.getBoundingClientRect();
          const isWayOutOfView = 
            rect.bottom < -100 || // Way above viewport
            rect.top > window.innerHeight + 100; // Way below viewport
          
          if (isWayOutOfView) {
            entry.target.classList.remove('visible');
          }
        }
      });
    },
    {
      root: null, // Use viewport as the root
      rootMargin: '0px',
      threshold: 0.1, // Trigger when 10% of the element is visible
    }
  );
  
  // Observe each element
  animatedElements.forEach((element) => {
    observer.observe(element);
  });
  
  // Handle page navigation and hash changes
  const handleHashChange = () => {
    // Short delay to allow for any layout shifts
    setTimeout(() => {
      // If there's a hash in the URL, trigger animations for all visible elements
      if (window.location.hash) {
        const visibleElements = document.querySelectorAll('.scroll-animate');
        visibleElements.forEach((element) => {
          const rect = element.getBoundingClientRect();
          if (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= window.innerHeight &&
            rect.right <= window.innerWidth
          ) {
            element.classList.add('visible');
          }
        });
      }
    }, 100);
  };
  
  // Listen for hash changes and handle initial hash
  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();
  
  // Create a scroll-based parallax effect for elements with parallax class
  const updateParallax = () => {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach((element) => {
      const scrollPosition = window.scrollY;
      const speedFactor = parseFloat(
        element.getAttribute('data-parallax-speed') || '0.1'
      );
      const elementTop = element.getBoundingClientRect().top + scrollPosition;
      const distanceFromTop = scrollPosition - elementTop;
      
      const translateY = distanceFromTop * speedFactor;
      (element as HTMLElement).style.transform = `translateY(${translateY}px)`;
    });
  };
  
  // Initial call and event listener for parallax
  updateParallax();
  window.addEventListener('scroll', updateParallax);
  
  // Return a cleanup function
  return () => {
    animatedElements.forEach((element) => {
      observer.unobserve(element);
    });
    window.removeEventListener('hashchange', handleHashChange);
    window.removeEventListener('scroll', updateParallax);
  };
}; 