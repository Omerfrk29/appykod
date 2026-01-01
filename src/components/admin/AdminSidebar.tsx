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
    <aside className="w-64 bg-[#1E2330] border-r border-white/5 flex flex-col fixed h-full z-10">
      <div className="p-8 border-b border-white/5">
        <h2 className="text-2xl font-bold text-white tracking-tight">
          AppyKod
          <span className="text-accent-primary">.</span>
        </h2>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (item.path === '/admin' && pathname === '/admin');
          return (
            <Link
              key={item.id}
              href={item.path}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                  ? 'bg-accent-primary text-white shadow-lg shadow-accent-primary/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
              {item.id === 'messages' && unreadCount > 0 && (
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white text-accent-primary' : 'bg-accent-primary text-white'}`}>
                  {unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 space-y-2 border-t border-white/5 bg-[#1E2330]">
        <Link
          href="/"
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
        >
          <Home size={20} /> <span>Siteye Git</span>
        </Link>
        <button
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-accent-pink hover:bg-accent-pink/10 hover:text-accent-pink transition-colors"
          onClick={onLogout}
        >
          <LogOut size={20} /> <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}
