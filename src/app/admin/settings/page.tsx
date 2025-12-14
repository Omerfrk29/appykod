'use client';

import SettingsPanel from '@/components/admin/SettingsPanel';

export default function SettingsPage() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Ayarlar
        </h1>
        <p className="text-gray-500 mt-1">
          Site ayarlarını yönetin
        </p>
      </header>
      <SettingsPanel />
    </div>
  );
}
