import React, { useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { cn } from '@/lib/utils';


const STORY_GRADIENTS = [
  'from-pink-500 via-red-500 to-yellow-500',
  'from-purple-500 via-pink-500 to-red-500',
  'from-blue-500 via-cyan-400 to-teal-400',
  'from-green-400 via-emerald-500 to-cyan-500',
  'from-orange-400 via-pink-500 to-purple-600',
  'from-yellow-400 via-orange-500 to-red-500',
  'from-indigo-500 via-purple-500 to-pink-500',
  'from-teal-400 via-blue-500 to-indigo-600',
  'from-rose-400 via-fuchsia-500 to-indigo-500',
  'from-amber-400 via-orange-500 to-pink-500',
];

function getGradient(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return STORY_GRADIENTS[Math.abs(hash) % STORY_GRADIENTS.length];
}

function getInitials(name) {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

const AuthorStories = ({ onAuthorClick, viewedAuthors = new Set() }) => {
  const items = useSelector((state) => state.materials.items);
  const scrollRef = useRef(null);

  
  const authors = useMemo(() => {
    const authorMap = new Map();
    for (const item of items) {
      const authorList = item?.authors || [];
      for (const author of authorList) {
        if (!author?.trim()) continue;
        const key = author.trim();
        if (!authorMap.has(key)) {
          authorMap.set(key, { name: key, materials: [] });
        }
        authorMap.get(key).materials.push(item);
      }
    }
    return Array.from(authorMap.values());
  }, [items]);

  if (authors.length === 0) return null;

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full">
  
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-2 px-2 scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {authors.map((author) => {
          const gradient = getGradient(author.name);
          const initials = getInitials(author.name);
          const isViewed = viewedAuthors.has(author.name);

          return (
            <button
              key={author.name}
              onClick={() => onAuthorClick(author)}
              className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer"
              style={{ minWidth: '72px' }}
            >
            
              <div
                className={cn(
                  'relative w-16 h-16 rounded-full p-[2.5px] transition-transform duration-200 group-hover:scale-110 group-active:scale-95',
                  isViewed
                    ? 'bg-gradient-to-tr from-gray-400 to-gray-500'
                    : `bg-gradient-to-tr ${gradient}`
                )}
              >
               
                <div className="w-full h-full rounded-full bg-background p-[2px]">
                 
                  <div
                    className={cn(
                      'w-full h-full rounded-full flex items-center justify-center text-white font-bold text-sm shadow-inner',
                      `bg-gradient-to-br ${gradient}`
                    )}
                  >
                    {initials}
                  </div>
                </div>

                {author.materials.length > 1 && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-md border-2 border-background z-10">
                    {author.materials.length}
                  </div>
                )}
              </div>

          
              <span className="text-xs text-center text-foreground/80 font-medium leading-tight max-w-[72px] line-clamp-2">
                {author.name.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

    
      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default AuthorStories;
