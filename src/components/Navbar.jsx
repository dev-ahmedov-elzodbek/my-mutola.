import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Moon, Sun, X, Plus, LogOut } from 'lucide-react';
import { toggleTheme } from '@/store/themeSlice';
import { setSearchQuery } from '@/store/materialsSlice';
import { cn } from '@/lib/utils';
import Button from './ui/Button';

const Navbar = ({ onAddClick, onLogout, user }) => {
  const dispatch = useDispatch();

 
  const theme = useSelector((state) => state.theme.mode);
  const searchQuery = useSelector((state) => state.materials.searchQuery);
  const filteredItems = useSelector((state) => state.materials.filteredItems);

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredCount = useMemo(() => {
    return filteredItems?.length ?? 0;
  }, [filteredItems]);

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleClearSearch = () => {
    dispatch(setSearchQuery(''));
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">Chizmachilik</h1>
              <p className="text-xs text-muted-foreground">Materiallar kutubxonasi</p>
            </div>
          </div>

          <div className="flex-1 max-w-2xl">
            <div
              className={cn(
                'relative group transition-all duration-300',
                isSearchFocused && 'scale-[1.02]'
              )}
            >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                <Search size={20} />
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Kitob, muallif yoki kalit so'z qidiring..."
                className={cn(
                  'w-full pl-12 pr-12 py-3 rounded-2xl',
                  'bg-secondary/50 border-2 border-transparent',
                  'text-foreground placeholder:text-muted-foreground',
                  'focus:outline-none focus:border-primary focus:bg-background',
                  'transition-all duration-300',
                  'hover:bg-secondary'
                )}
              />

              {!!searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* User badge */}
            {user && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-secondary/60 px-3 py-1.5 rounded-full border border-border">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                {user.username || user.name || 'Foydalanuvchi'}
              </span>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onAddClick}
              className="hidden sm:inline-flex"
            >
              <Plus size={16} className="mr-2" />
              Qo&apos;shish
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onAddClick}
              className="sm:hidden"
              aria-label="Qo'shish"
            >
              <Plus size={18} />
            </Button>

            {/* Logout button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-3 rounded-xl bg-secondary hover:bg-red-500/10 border-2 border-transparent hover:border-red-500/30 transition-all duration-300 group"
                aria-label="Chiqish"
                title="Chiqish"
              >
                <LogOut size={20} className="text-foreground group-hover:text-red-500 transition-colors" />
              </button>
            )}

            <button
              onClick={handleThemeToggle}
              className={cn(
                'p-3 rounded-xl',
                'bg-secondary hover:bg-secondary/80',
                'border-2 border-transparent hover:border-primary/20',
                'transition-all duration-300',
                'group relative overflow-hidden'
              )}
              aria-label="Toggle theme"
            >
              <div className="relative z-10">
                {theme === 'light' ? (
                  <Moon size={20} className="text-foreground" />
                ) : (
                  <Sun size={20} className="text-foreground" />
                )}
              </div>
              <div className="absolute inset-0 bg-primary/10 scale-0 group-hover:scale-100 transition-transform duration-300 rounded-xl" />
            </button>
          </div>
        </div>

        {!!searchQuery && (
          <div className="mt-3 animate-slide-up">
            <p className="text-sm text-muted-foreground text-center">
              Qidiruv natijalari:{' '}
              <span className="font-semibold text-foreground">
                {filteredCount}
              </span>{' '}
              ta material topildi
            </p>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;