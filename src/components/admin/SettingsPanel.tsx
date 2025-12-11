'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import ImageUploader from './ImageUploader';
import type { SiteSettings, LocalizedText } from '@/lib/db';

type Lang = 'tr' | 'en';

export default function SettingsPanel() {
  const [activeLang, setActiveLang] = useState<Lang>('tr');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [siteName, setSiteName] = useState<LocalizedText>({ tr: '', en: '' });
  const [siteDescription, setSiteDescription] = useState<LocalizedText>({ tr: '', en: '' });
  const [logo, setLogo] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState<LocalizedText>({ tr: '', en: '' });
  const [twitter, setTwitter] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [instagram, setInstagram] = useState('');
  const [github, setGithub] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      
      if (data) {
        setSiteName(data.siteName || { tr: '', en: '' });
        setSiteDescription(data.siteDescription || { tr: '', en: '' });
        setLogo(data.logo || '');
        setPhone(data.contact?.phone || '');
        setEmail(data.contact?.email || '');
        setAddress(data.contact?.address || { tr: '', en: '' });
        setTwitter(data.social?.twitter || '');
        setLinkedin(data.social?.linkedin || '');
        setInstagram(data.social?.instagram || '');
        setGithub(data.social?.github || '');
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    try {
      const settings: Partial<SiteSettings> = {
        siteName,
        siteDescription,
        logo,
        contact: {
          phone,
          email,
          address,
        },
        social: {
          twitter: twitter || undefined,
          linkedin: linkedin || undefined,
          instagram: instagram || undefined,
          github: github || undefined,
        },
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Language Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
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

      {/* Site Info */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Site Bilgileri
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Site Adı ({activeLang.toUpperCase()})
            </label>
            <input
              type="text"
              value={siteName[activeLang]}
              onChange={(e) => setSiteName({ ...siteName, [activeLang]: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              placeholder="Site adı"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Site Açıklaması ({activeLang.toUpperCase()})
            </label>
            <textarea
              value={siteDescription[activeLang]}
              onChange={(e) => setSiteDescription({ ...siteDescription, [activeLang]: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none resize-none"
              placeholder="Site açıklaması"
            />
          </div>

          <ImageUploader
            value={logo}
            onChange={(val) => setLogo(val as string)}
            label="Logo"
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          İletişim Bilgileri
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Telefon
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              placeholder="+90 555 123 4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              E-posta
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              placeholder="info@example.com"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Adres ({activeLang.toUpperCase()})
            </label>
            <input
              type="text"
              value={address[activeLang]}
              onChange={(e) => setAddress({ ...address, [activeLang]: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              placeholder="Adres"
            />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Sosyal Medya
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Twitter / X
            </label>
            <input
              type="text"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              placeholder="https://twitter.com/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              LinkedIn
            </label>
            <input
              type="text"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              placeholder="https://linkedin.com/company/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Instagram
            </label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              placeholder="https://instagram.com/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              GitHub
            </label>
            <input
              type="text"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              placeholder="https://github.com/username"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-gradient-to-r from-primary to-primary/80 text-white hover:shadow-lg hover:shadow-primary/30 transform hover:-translate-y-0.5'
          } disabled:opacity-50`}
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Kaydediliyor...</span>
            </>
          ) : saved ? (
            <>
              <Save className="w-5 h-5" />
              <span>Kaydedildi!</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>Kaydet</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

