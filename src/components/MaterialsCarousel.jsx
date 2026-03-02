import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MaterialCard from "./MaterialCard";
import { cn } from "@/lib/utils";

const MaterialsCarousel = ({ onEdit }) => {
  const materials = useSelector((state) => state.materials.filteredItems) || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const carouselRef = useRef(null);
  const autoRotateTimerRef = useRef(null);

  useEffect(() => {
    if (isAutoRotating && materials.length > 0) {
      autoRotateTimerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % materials.length);
      }, 4000);
    }

    return () => {
      if (autoRotateTimerRef.current) {
        clearInterval(autoRotateTimerRef.current);
      }
    };
  }, [isAutoRotating, materials.length]);

  const handleMouseEnter = () => setIsAutoRotating(false);
  const handleMouseLeave = () => setIsAutoRotating(true);

  const handleNext = () => {
    if (materials.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % materials.length);
  };

  const handlePrevious = () => {
    if (materials.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + materials.length) % materials.length);
  };

  const getVisibleItems = () => {
    if (materials.length === 0) return [];

    const visible = [];
    const totalVisible = Math.min(5, materials.length);
    const offset = Math.floor(totalVisible / 2);

    for (let i = -offset; i <= offset; i++) {
      const index = (currentIndex + i + materials.length) % materials.length;
      visible.push({
        material: materials[index],
        position: i,
        isCenter: i === 0,
      });
    }

    return visible;
  };

  if (materials.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="w-24 h-24 mx-auto rounded-full bg-secondary flex items-center justify-center">
            <span className="text-4xl">📚</span>
          </div>
          <h3 className="text-2xl font-bold text-foreground">Material topilmadi</h3>
          <p className="text-muted-foreground">
            Qidiruv so&apos;rovingizni o&apos;zgartiring yoki filtrlani tozalang
          </p>
        </div>
      </div>
    );
  }

  const visibleItems = getVisibleItems();

  return (
    <div
      className="relative py-12 px-4 w-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={carouselRef}
   >
      <button
        onClick={handlePrevious}
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 z-[999]",
          "w-14 h-14 rounded-full",
          "bg-background/80 backdrop-blur-lg",
          "border-2 border-primary/20",
          "hover:bg-primary hover:border-primary",
          "text-foreground hover:text-primary-foreground",
          "transition-all duration-300",
          "shadow-xl hover:shadow-2xl",
          "active:scale-95",
          "group"
        )}
      >
        <ChevronLeft
          size={28}
          className="mx-auto transition-transform group-hover:-translate-x-1"
        />
      </button>

      <button
        onClick={handleNext}
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 z-[999]",
          "w-14 h-14 rounded-full",
          "bg-background/80 backdrop-blur-lg",
          "border-2 border-primary/20",
          "hover:bg-primary hover:border-primary",
          "text-foreground hover:text-primary-foreground",
          "transition-all duration-300",
          "shadow-xl hover:shadow-2xl",
          "active:scale-95",
          "group"
        )}
      >
        <ChevronRight
          size={28}
          className="mx-auto transition-transform group-hover:translate-x-1"
        />
      </button>

      <div className="relative h-[750px] flex items-center justify-center pointer-events-none">
        {visibleItems.map(({ material, position, isCenter }) => {
          const offset = position * 380;
          const scale = isCenter ? 1 : 0.85;
          const zIndex = 50 - Math.abs(position);
          const opacity = isCenter ? 1 : 0.6;

          return (
            <div
              key={material.id}
              className="absolute transition-all duration-700 ease-out pointer-events-auto"
              style={{
                transform: `translateX(${offset}px) scale(${scale})`,
                zIndex,
                opacity,
                width: "350px",
              }}
            >
              <MaterialCard material={material} isCenter={isCenter} onEdit={onEdit} />
            </div>
          );
        })}
      </div>

      <div className="flex justify-center gap-2 mt-8">
        {materials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              idx === currentIndex
                ? "w-8 bg-primary"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            )}
          />
        ))}
      </div>

      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground font-medium">
          {currentIndex + 1} / {materials.length}
        </p>
      </div>
    </div>
  );
};

export default MaterialsCarousel;