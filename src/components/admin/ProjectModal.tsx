'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import ImageUploader from './ImageUploader';
import type { Project, LocalizedText } from '@/lib/db';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Partial<Project>) => Promise<void>;
  project?: Project | null;
}

type Lang = 'tr' | 'en';

export default function ProjectModal({ isOpen, onClose, onSave, project }: ProjectModalProps) {
  const [activeLang, setActiveLang] = useState<Lang>('tr');
  const [saving, setSaving] = useState(false);
  
  const [title, setTitle] = useState<LocalizedText>({ tr: '', en: '' });
  const [description, setDescription] = useState<LocalizedText>({ tr: '', en: '' });
  const [fullDescription, setFullDescription] = useState<LocalizedText>({ tr: '', en: '' });
  const [imageUrl, setImageUrl] = useState('');
  const [link, setLink] = useState('');
  const [technologies, setTechnologies] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<LocalizedText>({ tr: '', en: '' });
  const [solutions, setSolutions] = useState<LocalizedText>({ tr: '', en: '' });
  const [gallery, setGallery] = useState<string[]>([]);
  const [newTech, setNewTech] = useState('');

  useEffect(() => {
    if (project) {
      setTitle(project.title || { tr: '', en: '' });
      setDescription(project.description || { tr: '', en: '' });
      setFullDescription(project.fullDescription || { tr: '', en: '' });
      setImageUrl(project.imageUrl || '');
      setLink(project.link || '');
      setTechnologies(project.technologies || []);
      setChallenges(project.challenges || { tr: '', en: '' });
      setSolutions(project.solutions || { tr: '', en: '' });
      setGallery(project.gallery || []);
    } else {
      resetForm();
    }
  }, [project, isOpen]);

  function resetForm() {
    setTitle({ tr: '', en: '' });
    setDescription({ tr: '', en: '' });
    setFullDescription({ tr: '', en: '' });
    setImageUrl('');
    setLink('');
    setTechnologies([]);
    setChallenges({ tr: '', en: '' });
    setSolutions({ tr: '', en: '' });
    setGallery([]);
    setNewTech('');
    setActiveLang('tr');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      await onSave({
        title,
        description,
        imageUrl,
        link: link || '#',
        fullDescription: fullDescription.tr || fullDescription.en ? fullDescription : undefined,
        technologies: technologies.length > 0 ? technologies : undefined,
        challenges: challenges.tr || challenges.en ? challenges : undefined,
        solutions: solutions.tr || solutions.en ? solutions : undefined,
        gallery: gallery.length > 0 ? gallery : undefined,
      });
      onClose();
      resetForm();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setSaving(false);
    }
  }

  function addTechnology() {
    if (newTech.trim() && !technologies.includes(newTech.trim())) {
      setTechnologies([...technologies, newTech.trim()]);
      setNewTech('');
    }
  }

  function removeTechnology(index: number) {
    setTechnologies(technologies.filter((_, i) => i !== index));
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {project ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}
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
                  Proje Linki
                </label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                  placeholder="https://example.com"
                />
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

            {/* Main Image */}
            <ImageUploader
              value={imageUrl}
              onChange={(val) => setImageUrl(val as string)}
              label="Ana Görsel"
            />

            {/* Technologies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Teknolojiler
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newTech}
                  onChange={(e) => setNewTech(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
                  placeholder="React, Node.js, vb."
                />
                <button
                  type="button"
                  onClick={addTechnology}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(index)}
                      className="hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Challenges */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Karşılaşılan Zorluklar ({activeLang.toUpperCase()})
              </label>
              <textarea
                value={challenges[activeLang]}
                onChange={(e) => setChallenges({ ...challenges, [activeLang]: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none resize-none"
              />
            </div>

            {/* Solutions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Uygulanan Çözümler ({activeLang.toUpperCase()})
              </label>
              <textarea
                value={solutions[activeLang]}
                onChange={(e) => setSolutions({ ...solutions, [activeLang]: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none resize-none"
              />
            </div>

            {/* Gallery */}
            <ImageUploader
              value={gallery}
              onChange={(val) => setGallery(val as string[])}
              multiple
              label="Galeri"
            />
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

