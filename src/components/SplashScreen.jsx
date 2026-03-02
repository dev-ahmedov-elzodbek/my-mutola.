import React, { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { FadeText } from "@/components/ui/fade-text";

const SplashScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  const title = useMemo(() => "Chizmachilik", []);
  const subtitle = useMemo(() => "Materiallari Platformasi", []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
              onLoadingComplete();
            }, 600);
          }, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-primary/80",
        "transition-opacity duration-600",
        fadeOut && "opacity-0"
      )}
   >
      <div className="mb-12 animate-fade-in">
        <FadeText
          text={title}
          direction="in"
          wordDelay={0.15}
          className="text-white text-5xl md:text-7xl font-bold"
        />
        <FadeText
          text={subtitle}
          direction="up"
          staggerDelay={0.15}
          className="text-white/90 text-xl md:text-2xl font-light mt-3"
        />
      </div>

     
      <div className="w-80 md:w-96 animate-slide-up">
        <div className="relative h-2 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
          <div
            className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          </div>
        </div>

        <div className="mt-4 text-center">
          <span className="text-2xl font-semibold text-white">{progress}%</span>
        </div>

        <div className="mt-2 text-center">
          <span className="text-sm text-white/80">
            {progress < 30 && "Ma'lumotlar yuklanmoqda..."}
            {progress >= 30 && progress < 70 && "Resurslar tayyorlanmoqda..."}
            {progress >= 70 && progress < 100 && "Deyarli tayyor..."}
            {progress === 100 && "Tayyor!"}
          </span>
        </div>
      </div>

   
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-700" />
      </div>
    </div>
  );
};

export default SplashScreen;