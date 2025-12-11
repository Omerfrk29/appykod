'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  Settings,
  LogOut,
  Home,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'services', label: 'Hizmetler', icon: LayoutDashboard },
  { id: 'projects', label: 'Projeler', icon: Briefcase },
  { id: 'messages', label: 'Mesajlar', icon: MessageSquare },
  { id: 'settings', label: 'Ayarlar', icon: Settings },
];

export default function Sidebar({ activeTab, onTabChange, onLogout }: SidebarProps) {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col fixed h-full z-10 transition-colors duration-300">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === item.id
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => onTabChange(item.id)}
            >
              <Icon size={20} /> <span>{item.label}</span>
            </button>
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

