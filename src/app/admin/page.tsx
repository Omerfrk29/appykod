'use client';

import { useState, useEffect } from 'react';
import { LayoutDashboard, Briefcase, MessageSquare, Mail } from 'lucide-react';
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
      <div className="p-8">
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <span className="text-blue-800 dark:text-blue-200">Yükleniyor...</span>
            </div>
          </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center justify-between">
          <span className="text-red-800 dark:text-red-200">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Genel bakış ve istatistikler
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Services Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-primary" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Toplam Hizmet
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats?.services.total || 0}
          </p>
        </div>
        
        {/* Projects Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-500" />
        </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Toplam Proje
                      </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats?.projects.total || 0}
                      </p>
                    </div>

        {/* Messages Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-green-500" />
                    </div>
                  </div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Toplam Mesaj
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats?.messages.total || 0}
          </p>
        </div>

        {/* Unread Messages Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
              <Mail className="w-6 h-6 text-red-500" />
            </div>
                </div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            Okunmamış Mesaj
                        </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {stats?.messages.unread || 0}
          </p>
          {stats?.messages.unread && stats.messages.unread > 0 && (
            <p className="text-sm text-red-500 mt-2">
              Dikkat gerekiyor
            </p>
                        )}
                      </div>
                    </div>

      {/* Additional Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Mesaj Durumu
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Okunmuş</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {stats?.messages.read || 0}
              </span>
                    </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Okunmamış</span>
              <span className="font-semibold text-red-500">
                {stats?.messages.unread || 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{
                  width: stats?.messages.total
                    ? `${((stats.messages.read || 0) / stats.messages.total) * 100}%`
                    : '0%',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
