'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ImageUploader from './ImageUploader';
import type { Testimonial, LocalizedText } from '@/lib/db';

interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (testimonial: Partial<Testimonial>) => Promise<void>;
  testimonial?: Testimonial | null;
}

type Lang = 'tr' | 'en';

export default function TestimonialModal({ isOpen, onClose, onSave, testimonial }: TestimonialModalProps) {
  const [activeLang, setActiveLang] = useState<Lang>('tr');
  const [saving, setSaving] = useState(false);
  
  const [name, setName] = useState<LocalizedText>({ tr: '', en: '' });
  const [role, setRole] = useState<LocalizedText>({ tr: '', en: '' });
  const [content, setContent] = useState<LocalizedText>({ tr: '', en: '' });
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    if (testimonial) {
      setName(testimonial.name || { tr: '', en: '' });
      setRole(testimonial.role || { tr: '', en: '' });
      setContent(testimonial.content || { tr: '', en: '' });
      setImageUrl(testimonial.imageUrl || '');
    } else {
      resetForm();
    }
  }, [testimonial, isOpen]);

  function resetForm() {
    setName({ tr: '', en: '' });
    setRole({ tr: '', en: '' });
    setContent({ tr: '', en: '' });
    setImageUrl('');
    setActiveLang('tr');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      await onSave({
        name,
        role,
        content,
        imageUrl: imageUrl || undefined,
      });
      onClose();
      resetForm();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setSaving(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {testimonial ? 'Yorumu Düzenle' : 'Yeni Yorum Ekle'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 px-6">
          <button
            type="button"
            onClick={() => setActiveLang('tr')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeLang === 'tr'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🇹🇷 Türkçe
          </button>
          <button
            type="button"
            onClick={() => setActiveLang('en')}
            className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
              activeLang === 'en'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🇬🇧 English
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Müşteri Adı ({activeLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={name[activeLang]}
                  onChange={(e) => setName({ ...name, [activeLang]: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Örnek: Ahmet Yılmaz"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pozisyon / Şirket ({activeLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={role[activeLang]}
                  onChange={(e) => setRole({ ...role, [activeLang]: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Örnek: CEO, ABC Şirketi"
                  required
                />
              </div>
            </div>

            {/* Testimonial Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Yorum ({activeLang.toUpperCase()})
              </label>
              <textarea
                value={content[activeLang]}
                onChange={(e) => setContent({ ...content, [activeLang]: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none resize-none"
                placeholder="Müşteri yorumunu buraya yazın..."
                required
              />
            </div>

            {/* Profile Image */}
            <ImageUploader
              value={imageUrl ? [imageUrl] : []}
              onChange={(val) => setImageUrl(Array.isArray(val) ? val[0] || '' : val)}
              multiple={false}
              label="Profil Fotoğrafı (İsteğe Bağlı)"
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 -mt-4">
              Fotoğraf yüklemezseniz varsayılan bir görsel kullanılır.
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
