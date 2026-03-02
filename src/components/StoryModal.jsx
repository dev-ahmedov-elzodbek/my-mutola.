import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, BookOpen, Calendar, Users, FileText, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const STORY_GRADIENTS = [
  ['#ec4899', '#ef4444', '#eab308'],
  ['#a855f7', '#ec4899', '#ef4444'],
  ['#3b82f6', '#22d3ee', '#2dd4bf'],
  ['#4ade80', '#10b981', '#22d3ee'],
  ['#fb923c', '#ec4899', '#9333ea'],
  ['#facc15', '#f97316', '#ef4444'],
  ['#6366f1', '#a855f7', '#ec4899'],
  ['#2dd4bf', '#3b82f6', '#6366f1'],
  ['#fb7185', '#e879f9', '#6366f1'],
  ['#fbbf24', '#f97316', '#ec4899'],
];

function normalizeList(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

function getGradientColors(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return STORY_GRADIENTS[Math.abs(hash) % STORY_GRADIENTS.length];
}

function getInitials(name) {
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

const PROGRESS_DURATION = 8000;
const StoryModal = ({ author, onClose, onMarkViewed }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const materials = author?.materials || [];
  const total = materials.length;
  const current = materials[currentIdx];
  const currentAuthors = normalizeList(current?.authors);
  const currentKeywords = normalizeList(current?.keywords);
  const colors = getGradientColors(author?.name || '');

  useEffect(() => {
    if (paused || total === 0) return;
    setProgress(0);
    setImgLoaded(false);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min((elapsed / PROGRESS_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        if (currentIdx < total - 1) {
          setCurrentIdx((p) => p + 1);
        } else {
          onClose();
        }
      }
    }, 50);
    return () => clearInterval(interval);
  }, [currentIdx, paused, total]);

  
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [currentIdx, total]);


  useEffect(() => {
    if (author?.name) onMarkViewed?.(author.name);
  }, [author?.name]);

  const goNext = useCallback(() => {
    if (currentIdx < total - 1) setCurrentIdx((p) => p + 1);
    else onClose();
  }, [currentIdx, total, onClose]);

  const goPrev = useCallback(() => {
    if (currentIdx > 0) setCurrentIdx((p) => p - 1);
  }, [currentIdx]);

  if (!author || !current) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
    
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />

     
      <div
        className="relative w-full max-w-sm mx-4 rounded-3xl overflow-hidden shadow-2xl"
        style={{ maxHeight: '90vh' }}
        onMouseDown={() => setPaused(true)}
        onMouseUp={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
    >
        <div className="absolute top-0 left-0 right-0 z-50 flex gap-1 p-3">
          {materials.map((_, idx) => (
            <div key={idx} className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden">
              <div
                className="h-full rounded-full bg-white transition-none"
                style={{
                  width: idx < currentIdx ? '100%' : idx === currentIdx ? `${progress}%` : '0%',
                  transition: idx === currentIdx ? 'none' : undefined,
                }}
              />
            </div>
          ))}
        </div>

        
        <div
          className="absolute top-6 left-0 right-0 z-50 flex items-center justify-between px-4"
        >
          <div className="flex items-center gap-3">
           
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white/80 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
              }}
            >
              {getInitials(author.name)}
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">{author.name}</p>
              <p className="text-white/70 text-xs">{currentIdx + 1} / {total} material</p>
            </div>
          </div>

       
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

       
        <div
          className="relative w-full overflow-y-auto"
          style={{
            maxHeight: '90vh',
            background: `linear-gradient(160deg, ${colors[0]}22, ${colors[1]}22, ${colors[2]}22)`,
            backgroundColor: 'hsl(var(--card))',
          }}
        >
          <div
            className="relative w-full overflow-hidden"
            style={{ height: '320px' }}
          >
            {current.cover ? (
              <img
                src={current.cover}
                alt={current.title}
                className={cn(
                  'w-full h-full object-cover transition-opacity duration-500',
                  imgLoaded ? 'opacity-100' : 'opacity-0'
                )}
                onLoad={() => setImgLoaded(true)}
                loading="lazy"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${colors[0]}44, ${colors[1]}44, ${colors[2]}44)`,
                }}
              >
                <BookOpen size={80} style={{ color: colors[0] }} />
              </div>
            )}

            
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--card))] via-[hsl(var(--card))/40%] to-transparent" />

            
            {current.resourceType && (
              <div className="absolute bottom-4 right-4">
                <span
                  className="px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                  }}
                >
                  {current.resourceType}
                </span>
              </div>
            )}

            
            <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/30 to-transparent" />
          </div>

         
          <div className="px-5 pb-6 pt-2 space-y-4">
            
            <h2
              className="text-xl font-bold text-foreground leading-snug"
              style={{ paddingTop: '4px' }}
            >
              {current.title}
            </h2>

            
            {currentAuthors.length > 0 && (
              <div className="flex items-start gap-2">
                <Users size={15} className="text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground">{currentAuthors.join(', ')}</p>
              </div>
            )}

           
            {current.summary && (
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">
                {current.summary}
              </p>
            )}

            
            <div className="flex items-center gap-4 flex-wrap">
              {current.publishedAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} style={{ color: colors[0] }} />
                  <span className="text-sm font-medium text-foreground">{current.publishedAt}</span>
                </div>
              )}
              {current.size && (
                <div className="flex items-center gap-1.5">
                  <FileText size={14} style={{ color: colors[1] }} />
                  <span className="text-sm font-medium text-foreground">{current.size} bet</span>
                </div>
              )}
            </div>

            
            {currentKeywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentKeywords.slice(0, 5).map((kw, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full text-xs font-medium border"
                    style={{
                      backgroundColor: `${colors[i % 3]}22`,
                      borderColor: `${colors[i % 3]}55`,
                      color: 'hsl(var(--foreground))',
                    }}
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}

            
            {current.source && (
              <a
                href={current.source}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center gap-2 w-full py-3 px-6 rounded-2xl text-white font-semibold text-sm transition-all duration-300 hover:opacity-90 active:scale-95 shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]}, ${colors[2]})`,
                }}
              >
                <ExternalLink size={16} />
                Kitobni Ko'rish
              </a>
            )}
          </div>
        </div>

        
        <div className="absolute inset-y-0 left-0 w-1/3 z-40" onClick={goPrev} />
        <div className="absolute inset-y-0 right-0 w-1/3 z-40" onClick={goNext} />

        
        {currentIdx > 0 && (
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-50 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
        )}
        {currentIdx < total - 1 && (
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-50 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      
    </div>
  );
};

export default StoryModal;
