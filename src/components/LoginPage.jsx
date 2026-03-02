import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTheme } from '@/hooks/useTheme';
import { loginUser, registerUser, setAuthMode, clearAuthError } from '@/store/authSlice';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MagicCard } from '@/registry/magicui/magic-card';
import { HackerBackground } from '@/components/ui/hacker-background';
import { Loader2, User, Lock, LogIn, UserPlus } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { loading, error, authMode } = useSelector((s) => s.auth);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const isRegister = authMode === 'register';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;
    if (isRegister) {
      dispatch(registerUser({ username, password }));
    } else {
      dispatch(loginUser({ username, password }));
    }
  };

  const switchMode = () => {
    dispatch(setAuthMode(isRegister ? 'login' : 'register'));
    setUsername('');
    setPassword('');
  };

  const loginAsAdmin = () => {
    dispatch(clearAuthError());
    dispatch(loginUser({ username: 'admin', password: 'admin123' }));
  };

  const gradientColor = theme === 'dark' ? '#3b82f620' : '#0ea5e920';

  return (
    <div className="relative min-h-screen overflow-hidden bg-background flex items-center justify-center">
      
      <HackerBackground
        color={theme === 'dark' ? '#22d3ee' : '#0ea5e9'}
        fontSize={8}
        speed={1.2}
        className="opacity-20"
      />

      <div className="relative z-10 w-full max-w-sm px-4">
        
        <div className="flex flex-col items-center mb-8 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-xl mb-4">
            <span className="text-white font-bold text-3xl">C</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Chizmachilik</h1>
          <p className="text-sm text-muted-foreground mt-1">Materiallar kutubxonasi</p>
        </div>

        
        <div className="animate-slide-up">
          <Card className="w-full border-none p-0 shadow-2xl">
            <MagicCard
              gradientColor={gradientColor}
              gradientSize={280}
              className="p-0"
            >
              
              <CardHeader className="border-b border-border p-6">
                <CardTitle className="text-xl">
                  {isRegister ? "Ro'yxatdan o'tish" : 'Kirish'}
                </CardTitle>
                <CardDescription>
                  {isRegister
                    ? 'Yangi hisob yaratish uchun ma\'lumotlarni kiriting'
                    : 'Hisobingizga kirish uchun ma\'lumotlarni kiriting'}
                </CardDescription>
              </CardHeader>

             
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} id="auth-form">
                  <div className="grid gap-5">
                    
                    <div className="grid gap-2">
                      <Label htmlFor="username">Foydalanuvchi nomi</Label>
                      <div className="relative">
                        <User
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                        />
                        <Input
                          id="username"
                          type="text"
                          placeholder="username"
                          value={username}
                          onChange={(e) => {
                            setUsername(e.target.value);
                            if (error) dispatch(clearAuthError());
                          }}
                          className="pl-9"
                          autoComplete="username"
                          required
                        />
                      </div>
                    </div>

                    
                    <div className="grid gap-2">
                      <Label htmlFor="password">Parol</Label>
                      <div className="relative">
                        <Lock
                          size={16}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                        />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (error) dispatch(clearAuthError());
                          }}
                          className="pl-9"
                          autoComplete={isRegister ? 'new-password' : 'current-password'}
                          required
                        />
                      </div>
                    </div>

                    
                    {error && (
                      <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 animate-fade-in">
                        <p className="text-sm text-destructive font-medium">⚠️ {error}</p>
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>

              
              <CardFooter className="border-t border-border p-6 flex-col gap-3">
                <button
                  type="submit"
                  form="auth-form"
                  disabled={loading || !username.trim() || !password.trim()}
                  className={cn(
                    'w-full inline-flex items-center justify-center gap-2',
                    'h-11 rounded-xl font-semibold text-sm',
                    'bg-primary text-primary-foreground',
                    'hover:bg-primary/90 active:scale-[0.98]',
                    'transition-all duration-200 shadow-lg hover:shadow-xl',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : isRegister ? (
                    <UserPlus size={18} />
                  ) : (
                    <LogIn size={18} />
                  )}
                  {loading
                    ? 'Yuklanmoqda...'
                    : isRegister
                    ? "Ro'yxatdan o'tish"
                    : 'Kirish'}
                </button>


                
                <p className="text-sm text-muted-foreground text-center">
                  {isRegister ? 'Hisobingiz bormi?' : 'Hisobingiz yo\'qmi?'}{' '}
                  <button
                    type="button"
                    onClick={switchMode}
                    className="font-semibold text-primary hover:underline transition-colors"
                  >
                    {isRegister ? 'Kirish' : "Ro'yxatdan o'tish"}
                  </button>
                </p>
              </CardFooter>
            </MagicCard>
          </Card>
        </div>
      </div>
    </div>
  );
}
