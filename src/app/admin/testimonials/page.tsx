'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Quote } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';
import TestimonialModal from '@/components/admin/TestimonialModal';
import { testimonialsApi } from '@/lib/api/client';
import type { Testimonial, LocalizedText } from '@/lib/db';

const defaultImages = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
];

// Helper to get localized text
function getLocalizedText(text: LocalizedText | string | undefined, lang: 'tr' | 'en'): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[lang] || text.tr || '';
}

export default function TestimonialsPage() {
  const { language } = useLanguage();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    setLoading(true);
    setError(null);
    try {
      const response = await testimonialsApi.getAll();
      if (response.success && response.data) {
        setTestimonials(response.data);
      } else {
        setError('Yorumlar yüklenirken bir sorun oluştu');
      }
    } catch (err) {
      setError('Yorumlar yüklenirken bir hata oluştu');
      console.error('Error fetching testimonials:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteTestimonial(id: string) {
    if (!confirm('Bu yorumu silmek istediğinize emin misiniz?')) return;
    setLoading(true);
    setError(null);
    try {
      const response = await testimonialsApi.delete(id);
      if (response.success) {
        await fetchTestimonials();
      } else {
        setError(response.error || 'Yorum silinirken bir sorun oluştu');
      }
    } catch (err) {
      setError('Yorum silinirken bir sorun oluştu');
      console.error('Error deleting testimonial:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveTestimonial(testimonialData: Partial<Testimonial>) {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (editingTestimonial) {
        response = await testimonialsApi.update(editingTestimonial.id, testimonialData);
      } else {
        response = await testimonialsApi.create(testimonialData as Omit<Testimonial, 'id'>);
      }
      if (response.success) {
        setTestimonialModalOpen(false);
        setEditingTestimonial(null);
        await fetchTestimonials();
      } else {
        setError(response.error || 'Yorum kaydedilirken bir sorun oluştu');
      }
    } catch (err) {
      setError('Yorum kaydedilirken bir sorun oluştu');
      console.error('Error saving testimonial:', err);
    } finally {
      setLoading(false);
    }
  }

  function openAddTestimonial() {
    setEditingTestimonial(null);
    setTestimonialModalOpen(true);
  }

  function openEditTestimonial(testimonial: Testimonial) {
    setEditingTestimonial(testimonial);
    setTestimonialModalOpen(true);
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
            Müşteri Yorumları
          </h1>
          <p className="text-gray-500 mt-1">
            {testimonials.length} yorum
          </p>
        </div>
        <button
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-0.5"
          onClick={openAddTestimonial}
        >
          <Plus size={20} /> <span>Yeni Ekle</span>
        </button>
      </header>

      <div className="grid gap-4">
        {testimonials.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <Quote className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Henüz müşteri yorumu eklenmemiş</p>
            <button
              onClick={openAddTestimonial}
              className="mt-4 text-primary hover:underline"
            >
              İlk yorumu ekleyin
            </button>
          </div>
        ) : (
          testimonials.map((t, index) => (
            <div
              key={t.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-start hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4 flex-1">
                <div className="relative w-12 h-12 flex-shrink-0">
                  <Image
                    src={t.imageUrl || defaultImages[index % defaultImages.length]}
                    alt={getLocalizedText(t.name, language)}
                    fill
                    sizes="48px"
                    className="rounded-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {getLocalizedText(t.name, language)}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {getLocalizedText(t.role, language)}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-2 italic">
                    &ldquo;{getLocalizedText(t.content, language)}&rdquo;
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => openEditTestimonial(t)}
                  className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                  title="Düzenle"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDeleteTestimonial(t.id)}
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

      <TestimonialModal
        isOpen={testimonialModalOpen}
        onClose={() => {
          setTestimonialModalOpen(false);
          setEditingTestimonial(null);
        }}
        onSave={handleSaveTestimonial}
        testimonial={editingTestimonial}
      />
    </div>
  );
}
