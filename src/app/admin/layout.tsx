'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth', { method: 'GET' });
      const json = (await res.json()) as { authenticated?: boolean };
      if (json.authenticated) {
        setIsLoggedIn(true);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      setIsLoggedIn(true);
      router.refresh();
    } else {
      alert('Kullanıcı adı veya şifre hatalı');
    }
    setIsSubmitting(false);
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
    } finally {
      setIsLoggedIn(false);
      router.push('/admin');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#14161F]">
        <Loader2 className="animate-spin text-accent-primary w-8 h-8" />
      </div>
    );
  }

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#14161F] relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-accent-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-accent-secondary/10 rounded-full blur-[100px] pointer-events-none" />

        <form
          className="relative bg-[#1E2330]/80 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/5"
          onSubmit={handleLogin}
        >
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-[#14161F] rounded-2xl flex items-center justify-center border border-white/5 shadow-inner">
              <Lock className="w-8 h-8 text-accent-primary" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2 text-white">
            Admin Giriş
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Devam etmek için giriş yapın
          </p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                placeholder="yönetici"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#14161F] border border-white/5 text-white placeholder-gray-600 focus:border-accent-primary/50 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Şifre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#14161F] border border-white/5 text-white placeholder-gray-600 focus:border-accent-primary/50 outline-none transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-8 bg-accent-primary hover:bg-accent-primary-light text-white py-4 rounded-xl font-bold transition-all hover:shadow-lg hover:shadow-accent-primary/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : 'Giriş Yap'}
          </button>
        </form>
      </div>
    );
  }

  // Authenticated Layout
  return (
    <div className="min-h-screen flex bg-[#14161F]">
      <AdminSidebar onLogout={handleLogout} />
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
