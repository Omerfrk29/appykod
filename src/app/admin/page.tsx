'use client';

import { useState, useEffect } from 'react';
import { LayoutDashboard, Briefcase, MessageSquare, Mail, Loader2 } from 'lucide-react';
import { adminApi } from '@/lib/api/client';
import type { Stats } from '@/lib/api/types';

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    setError(null);
    try {
      const response = await adminApi.stats.get();
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError('İstatistikler yüklenirken bir sorun oluştu');
      }
    } catch (err) {
      setError('İstatistikler yüklenirken bir hata oluştu');
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="animate-spin text-orange-500 w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 flex items-center justify-between">
        <span className="text-red-400">{error}</span>
        <button
          onClick={() => setError(null)}
          className="text-red-400 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-400">
          Sitenizin genel durumunu buradan takip edebilirsiniz.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {/* Services Card */}
        <div className="bg-[#1E2330] p-6 rounded-3xl shadow-xl border border-white/5 hover:border-white/10 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <LayoutDashboard className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">
            Toplam Hizmet
          </h3>
          <p className="text-3xl font-bold text-white">
            {stats?.services.total || 0}
          </p>
        </div>

        {/* Projects Card */}
        <div className="bg-[#1E2330] p-6 rounded-3xl shadow-xl border border-white/5 hover:border-white/10 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Briefcase className="w-6 h-6 text-orange-500" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">
            Toplam Proje
          </h3>
          <p className="text-3xl font-bold text-white">
            {stats?.projects.total || 0}
          </p>
        </div>

        {/* Messages Card */}
        <div className="bg-[#1E2330] p-6 rounded-3xl shadow-xl border border-white/5 hover:border-white/10 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-teal-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="w-6 h-6 text-teal-400" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">
            Toplam Mesaj
          </h3>
          <p className="text-3xl font-bold text-white">
            {stats?.messages.total || 0}
          </p>
        </div>

        {/* Unread Messages Card */}
        <div className="bg-[#1E2330] p-6 rounded-3xl shadow-xl border border-white/5 hover:border-white/10 transition-all duration-300 group">
          <div className="flex items-center justify-between mb-6">
            <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Mail className="w-6 h-6 text-red-500" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-400 mb-1">
            Okunmamış Mesaj
          </h3>
          <p className="text-3xl font-bold text-white">
            {stats?.messages.unread || 0}
          </p>
          {stats?.messages.unread && stats.messages.unread > 0 ? (
            <p className="text-xs font-semibold text-red-400 mt-2 bg-red-500/10 inline-block px-2 py-1 rounded">
              Dikkat: {stats.messages.unread} yeni mesaj
            </p>
          ) : null}
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#1E2330] p-8 rounded-3xl shadow-xl border border-white/5">
          <h3 className="text-xl font-bold text-white mb-6">
            Mesaj Durumu
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-black/20 p-4 rounded-xl">
              <span className="text-gray-400">Okunmuş</span>
              <span className="font-bold text-white text-lg">
                {stats?.messages.read || 0}
              </span>
            </div>
            <div className="flex justify-between items-center bg-black/20 p-4 rounded-xl">
              <span className="text-gray-400">Okunmamış</span>
              <span className="font-bold text-red-400 text-lg">
                {stats?.messages.unread || 0}
              </span>
            </div>

            <div className="w-full bg-black/30 rounded-full h-3 mt-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-purple-500 h-full rounded-full transition-all duration-1000"
                style={{
                  width: stats?.messages.total
                    ? `${((stats.messages.read || 0) / stats.messages.total) * 100}%`
                    : '0%',
                }}
              />
            </div>
            <p className="text-right text-xs text-gray-500">
              Yeşil bar okunma oranını temsil eder
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
