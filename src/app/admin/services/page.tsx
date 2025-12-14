'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, LayoutDashboard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ServiceModal from '@/components/admin/ServiceModal';
import { servicesApi } from '@/lib/api/client';
import type { Service, LocalizedText } from '@/lib/db';

// Helper to get localized text
function getLocalizedText(text: LocalizedText | string | undefined, lang: 'tr' | 'en'): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[lang] || text.tr || '';
}

export default function ServicesPage() {
  const { language } = useLanguage();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    setError(null);
    try {
      const response = await servicesApi.getAll();
      if (response.success && response.data) {
        setServices(response.data);
      } else {
        setError('Hizmetler yüklenirken bir hata oluştu');
      }
    } catch (err) {
      setError('Hizmetler yüklenirken bir hata oluştu');
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteService(id: string) {
    if (!confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) return;
    setLoading(true);
    setError(null);
    try {
      const response = await servicesApi.delete(id);
      if (response.success) {
        await fetchServices();
      } else {
        setError(response.error || 'Hizmet silinirken bir hata oluştu');
      }
    } catch (err) {
      setError('Hizmet silinirken bir hata oluştu');
      console.error('Error deleting service:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveService(serviceData: Partial<Service>) {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (editingService) {
        response = await servicesApi.update(editingService.id, serviceData);
      } else {
        response = await servicesApi.create(serviceData as Omit<Service, 'id'>);
      }
      if (response.success) {
        setServiceModalOpen(false);
        setEditingService(null);
        await fetchServices();
      } else {
        setError(response.error || 'Hizmet kaydedilirken bir hata oluştu');
      }
    } catch (err) {
      setError('Hizmet kaydedilirken bir hata oluştu');
      console.error('Error saving service:', err);
    } finally {
      setLoading(false);
    }
  }

  function openAddService() {
    setEditingService(null);
    setServiceModalOpen(true);
  }

  function openEditService(service: Service) {
    setEditingService(service);
    setServiceModalOpen(true);
  }

  return (
    <div className="p-8">
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center justify-between">
          <span className="text-red-800 dark:text-red-200">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
          >
            ✕
          </button>
        </div>
      )}
      {loading && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <span className="text-blue-800 dark:text-blue-200">Yükleniyor...</span>
        </div>
      )}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hizmetler
          </h1>
          <p className="text-gray-500 mt-1">
            {services.length} hizmet
          </p>
        </div>
        <button
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-0.5"
          onClick={openAddService}
        >
          <Plus size={20} /> <span>Yeni Ekle</span>
        </button>
      </header>

      <div className="grid gap-4">
        {services.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <LayoutDashboard className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Henüz hizmet eklenmemiş</p>
            <button
              onClick={openAddService}
              className="mt-4 text-primary hover:underline"
            >
              İlk hizmeti ekleyin
            </button>
          </div>
        ) : (
          services.map((s) => (
            <div
              key={s.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {getLocalizedText(s.title, language)}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {getLocalizedText(s.description, language)}
                </p>
                {s.pricing?.startingFrom && (
                  <span className="inline-block mt-2 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">
                    {s.pricing.currency}{s.pricing.startingFrom}'dan başlayan
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => openEditService(s)}
                  className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  title="Düzenle"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDeleteService(s.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Sil"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ServiceModal
        isOpen={serviceModalOpen}
        onClose={() => {
          setServiceModalOpen(false);
          setEditingService(null);
        }}
        onSave={handleSaveService}
        service={editingService}
      />
    </div>
  );
}
