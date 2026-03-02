import React from 'react';
import { BookOpen, Calendar, Users, FileText, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import Button from './ui/Button';

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

const MaterialCard = ({ material, isCenter, style, onEdit }) => {
  const authors = normalizeList(material?.authors);
  const keywords = normalizeList(material?.keywords);

  return (
    <div
      className={cn(
        'relative rounded-3xl overflow-hidden transition-all duration-700 ease-out',
        'bg-card border-2 border-border shadow-xl',
        isCenter ? 'scale-100 opacity-100' : 'scale-90 opacity-60',
        'hover:shadow-2xl'
      )}
      style={style}
    >
   
      <div className="relative h-80 overflow-hidden bg-gradient-to-br from-primary/20 to-secondary">
        {material.cover ? (
          <img
            src={material.cover}
            alt={material.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen size={64} className="text-muted-foreground" />
          </div>
        )}
       
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
        
        <div className="absolute top-4 right-4">
          <span className="px-4 py-2 rounded-full text-xs font-semibold bg-primary text-primary-foreground backdrop-blur-sm">
            {material.resourceType || 'Material'}
          </span>
        </div>

        {!!onEdit && (
          <div className="absolute top-4 left-4">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={() => onEdit(material)}
              className="bg-background/80 backdrop-blur-lg border border-border shadow-lg"
              aria-label="Edit"
            >
              <Pencil size={18} />
            </Button>
          </div>
        )}
      </div>

    
      <div className="p-6 space-y-4">
       
        <h3 className="text-2xl font-bold text-foreground line-clamp-2 min-h-[3.5rem]">
          {material.title}
        </h3>

      
        {authors.length > 0 && (
          <div className="flex items-start gap-2">
            <Users size={18} className="text-muted-foreground mt-1 shrink-0" />
            <p className="text-sm text-muted-foreground line-clamp-2">
              {authors.join(', ')}
            </p>
          </div>
        )}

        
        {material.summary && (
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {material.summary}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3 pt-2">
        
          {material.publishedAt && (
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">
                {material.publishedAt}
              </span>
            </div>
          )}

       
          {material.size && (
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">
                {material.size} bet
              </span>
            </div>
          )}
        </div>


        {keywords.length > 0 && (
          <div className="pt-2">
            <div className="flex flex-wrap gap-2">
              {keywords.slice(0, 4).map((keyword, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border"
                >
                  {keyword}
                </span>
              ))}
              {keywords.length > 4 && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                  +{keywords.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

      
        <div className="pt-4">
          <a
            href={material.source}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'block w-full py-3 px-6 rounded-xl text-center font-semibold',
              'bg-primary text-primary-foreground',
              'hover:bg-primary/90 active:scale-95',
              'transition-all duration-300',
              'shadow-lg hover:shadow-xl'
            )}
          >
            Ko'rish
            
          </a>
        </div>
      </div>
    </div>
  );
};

export default MaterialCard;
