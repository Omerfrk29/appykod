'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, Globe, ChevronDown } from 'lucide-react';
import ImageUploader from './ImageUploader';
import type { Service, LocalizedText, FAQ, Pricing } from '@/lib/db';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Partial<Service>) => Promise<void>;
  service?: Service | null;
}

const iconOptions = [
  'globe', 'smartphone', 'code', 'database', 'cloud', 'shield', 
  'zap', 'layout', 'server', 'cpu', 'wifi', 'monitor'
];

type Lang = 'tr' | 'en';

export default function ServiceModal({ isOpen, onClose, onSave, service }: ServiceModalProps) {
  const [activeLang, setActiveLang] = useState<Lang>('tr');
  const [saving, setSaving] = useState(false);
  
  const [title, setTitle] = useState<LocalizedText>({ tr: '', en: '' });
  const [description, setDescription] = useState<LocalizedText>({ tr: '', en: '' });
  const [fullDescription, setFullDescription] = useState<LocalizedText>({ tr: '', en: '' });
  const [icon, setIcon] = useState('code');
  const [features, setFeatures] = useState<LocalizedText[]>([]);
  const [gallery, setGallery] = useState<string[]>([]);
  const [faq, setFaq] = useState<FAQ[]>([]);
  const [pricing, setPricing] = useState<Pricing>({ startingFrom: '', currency: '₺' });

  useEffect(() => {
    if (service) {
      setTitle(service.title || { tr: '', en: '' });
      setDescription(service.description || { tr: '', en: '' });
      setFullDescription(service.fullDescription || { tr: '', en: '' });
      setIcon(service.icon || 'code');
      setFeatures(service.features || []);
      setGallery(service.gallery || []);
      setFaq(service.faq || []);
      setPricing(service.pricing || { startingFrom: '', currency: '₺' });
    } else {
      resetForm();
    }
  }, [service, isOpen]);

  function resetForm() {
    setTitle({ tr: '', en: '' });
    setDescription({ tr: '', en: '' });
    setFullDescription({ tr: '', en: '' });
    setIcon('code');
    setFeatures([]);
    setGallery([]);
    setFaq([]);
    setPricing({ startingFrom: '', currency: '₺' });
    setActiveLang('tr');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      await onSave({
        title,
        description,
        fullDescription: fullDescription.tr || fullDescription.en ? fullDescription : undefined,
        icon,
        features: features.length > 0 ? features : undefined,
        gallery: gallery.length > 0 ? gallery : undefined,
        faq: faq.length > 0 ? faq : undefined,
        pricing: pricing.startingFrom ? pricing : undefined,
      });
      onClose();
      resetForm();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setSaving(false);
    }
  }

  function addFeature() {
    setFeatures([...features, { tr: '', en: '' }]);
  }

  function updateFeature(index: number, lang: Lang, value: string) {
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [lang]: value };
    setFeatures(newFeatures);
  }

  function removeFeature(index: number) {
    setFeatures(features.filter((_, i) => i !== index));
  }

  function addFaq() {
    setFaq([...faq, { question: { tr: '', en: '' }, answer: { tr: '', en: '' } }]);
  }

  function updateFaq(index: number, field: 'question' | 'answer', lang: Lang, value: string) {
    const newFaq = [...faq];
    newFaq[index] = {
      ...newFaq[index],
      [field]: { ...newFaq[index][field], [lang]: value }
    };
    setFaq(newFaq);
  }

  function removeFaq(index: number) {
    setFaq(faq.filter((_, i) => i !== index));
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {service ? 'Hizmeti Düzenle' : 'Yeni Hizmet'}
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
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Başlık ({activeLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={title[activeLang]}
                  onChange={(e) => setTitle({ ...title, [activeLang]: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  İkon
                </label>
                <div className="relative">
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none appearance-none"
                  >
                    {iconOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Kısa Açıklama ({activeLang.toUpperCase()})
              </label>
              <textarea
                value={description[activeLang]}
                onChange={(e) => setDescription({ ...description, [activeLang]: e.target.value })}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Detaylı Açıklama ({activeLang.toUpperCase()})
              </label>
              <textarea
                value={fullDescription[activeLang]}
                onChange={(e) => setFullDescription({ ...fullDescription, [activeLang]: e.target.value })}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none resize-none"
              />
            </div>

            {/* Features */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Özellikler ({activeLang.toUpperCase()})
                </label>
                <button
                  type="button"
                  onClick={addFeature}
                  className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
                >
                  <Plus className="w-4 h-4" /> Ekle
                </button>
              </div>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={feature[activeLang]}
                      onChange={(e) => updateFeature(index, activeLang, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                      placeholder={`Özellik ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery */}
            <ImageUploader
              value={gallery}
              onChange={(val) => setGallery(val as string[])}
              multiple
              label="Galeri"
            />

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Başlangıç Fiyatı
                </label>
                <input
                  type="text"
                  value={pricing.startingFrom}
                  onChange={(e) => setPricing({ ...pricing, startingFrom: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                  placeholder="15.000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Para Birimi
                </label>
                <input
                  type="text"
                  value={pricing.currency}
                  onChange={(e) => setPricing({ ...pricing, currency: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                  placeholder="₺"
                />
              </div>
            </div>

            {/* FAQ */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  SSS ({activeLang.toUpperCase()})
                </label>
                <button
                  type="button"
                  onClick={addFaq}
                  className="flex items-center gap-1 text-sm text-primary hover:text-primary/80"
                >
                  <Plus className="w-4 h-4" /> Ekle
                </button>
              </div>
              <div className="space-y-4">
                {faq.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={item.question[activeLang]}
                        onChange={(e) => updateFaq(index, 'question', activeLang, e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                        placeholder="Soru"
                      />
                      <button
                        type="button"
                        onClick={() => removeFaq(index)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      value={item.answer[activeLang]}
                      onChange={(e) => updateFaq(index, 'answer', activeLang, e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none resize-none"
                      placeholder="Cevap"
                    />
                  </div>
                ))}
              </div>
            </div>
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

