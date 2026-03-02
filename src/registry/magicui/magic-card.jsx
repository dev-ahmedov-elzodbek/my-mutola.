import React, { useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export function MagicCard({
  children,
  className,
  gradientColor = '#262626',
  gradientOpacity = 0.8,
  gradientSize = 200,
  gradientFrom = '#9E7AFF',
  gradientTo = '#FE8BBB',
}) {
  const cardRef = useRef(null);

  const handleMouseMove = useCallback(
    (e) => {
      if (!cardRef.current) return;
      const { left, top } = cardRef.current.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;
      cardRef.current.style.setProperty('--mouse-x', `${x}px`);
      cardRef.current.style.setProperty('--mouse-y', `${y}px`);
    },
    []
  );

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    card.addEventListener('mousemove', handleMouseMove);
    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div
      ref={cardRef}
      style={{
        '--gradient-color': gradientColor,
        '--gradient-opacity': gradientOpacity,
        '--gradient-size': `${gradientSize}px`,
        '--gradient-from': gradientFrom,
        '--gradient-to': gradientTo,
      }}
      className={cn(
        'relative overflow-hidden rounded-2xl',
       
        'bg-card',
        
        '[background:radial-gradient(var(--gradient-size)_circle_at_var(--mouse-x,50%)_var(--mouse-y,50%),var(--gradient-color),transparent_100%)]',
        className
      )}
    >
      
      <div className="relative z-10 h-full w-full rounded-2xl bg-card/90 dark:bg-card/85">
        {children}
      </div>
    </div>
  );
}
