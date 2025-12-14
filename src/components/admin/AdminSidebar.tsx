'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  Settings,
  LogOut,
  Home,
  BarChart3,
  Quote,
} from 'lucide-react';
import { messagesApi } from '@/lib/api/client';

const menuItems = [
  { id: 'dashboard', path: '/admin', label: 'Dashboard', icon: BarChart3 },
  { id: 'services', path: '/admin/services', label: 'Hizmetler', icon: LayoutDashboard },
  { id: 'projects', path: '/admin/projects', label: 'Projeler', icon: Briefcase },
  { id: 'testimonials', path: '/admin/testimonials', label: 'Yorumlar', icon: Quote },
  { id: 'messages', path: '/admin/messages', label: 'Mesajlar', icon: MessageSquare },
  { id: 'settings', path: '/admin/settings', label: 'Ayarlar', icon: Settings },
];

interface AdminSidebarProps {
  onLogout: () => void;
}

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch unread messages count
    messagesApi.getAll().then((res) => {
      if (res.success && res.data) {
        const unread = res.data.filter((m) => !m.read).length;
        setUnreadCount(unread);
      }
    });
  }, []);

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col fixed h-full z-10 transition-colors duration-300">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Admin Panel
        </h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (item.path === '/admin' && pathname === '/admin');
          return (
            <Link
              key={item.id}
              href={item.path}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-primary' : ''} />
              <span className="font-medium">{item.label}</span>
              {item.id === 'messages' && unreadCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/"
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Home size={20} /> <span>Siteye Git</span>
        </Link>
        <button
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          onClick={onLogout}
        >
          <LogOut size={20} /> <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}
