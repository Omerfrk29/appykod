'use client';

import { useState, useEffect } from 'react';
import {
  Lock,
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Home,
  LogOut,
  Eye,
  EyeOff,
  Mail,
  Calendar,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ServiceModal from '@/components/admin/ServiceModal';
import ProjectModal from '@/components/admin/ProjectModal';
import SettingsPanel from '@/components/admin/SettingsPanel';
import type { Service, Project, Message, LocalizedText } from '@/lib/db';

const menuItems = [
  { id: 'services', label: 'Hizmetler', icon: LayoutDashboard },
  { id: 'projects', label: 'Projeler', icon: Briefcase },
  { id: 'messages', label: 'Mesajlar', icon: MessageSquare },
  { id: 'settings', label: 'Ayarlar', icon: Settings },
];

// Helper to get localized text
function getLocalizedText(text: LocalizedText | string | undefined, lang: 'tr' | 'en'): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[lang] || text.tr || '';
}

export default function AdminPage() {
  const { language } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('services');
  const [data, setData] = useState<{
    services: Service[];
    projects: Project[];
    messages: Message[];
  }>({
    services: [],
    projects: [],
    messages: [],
  });
  
  // Modal states
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/auth', { method: 'GET' });
        const json = (await res.json()) as { authenticated?: boolean };
        if (json.authenticated) {
          setIsLoggedIn(true);
          fetchData();
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  async function fetchData() {
    const [services, projects, messages] = await Promise.all([
      fetch('/api/services').then((res) => res.json()),
      fetch('/api/projects').then((res) => res.json()),
      fetch('/api/contact').then((res) => res.json()),
    ]);
    setData({ services, projects, messages });
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      setIsLoggedIn(true);
      fetchData();
    } else {
      alert('Geçersiz kimlik bilgileri');
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth', { method: 'DELETE' });
    } finally {
      setIsLoggedIn(false);
    }
  }

  async function handleDeleteService(id: string) {
    if (!confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) return;
    await fetch(`/api/services/${id}`, { method: 'DELETE' });
    fetchData();
  }

  async function handleDeleteProject(id: string) {
    if (!confirm('Bu projeyi silmek istediğinizden emin misiniz?')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    fetchData();
  }

  async function handleSaveService(serviceData: Partial<Service>) {
    if (editingService) {
      await fetch(`/api/services/${editingService.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData),
      });
    } else {
      await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData),
      });
    }
    fetchData();
  }

  async function handleSaveProject(projectData: Partial<Project>) {
    if (editingProject) {
      await fetch(`/api/projects/${editingProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
    } else {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
    }
    fetchData();
  }

  function openAddService() {
    setEditingService(null);
    setServiceModalOpen(true);
  }

  function openEditService(service: Service) {
    setEditingService(service);
    setServiceModalOpen(true);
  }

  function openAddProject() {
    setEditingProject(null);
    setProjectModalOpen(true);
  }

  function openEditProject(project: Project) {
    setEditingProject(project);
    setProjectModalOpen(true);
  }

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDIwMjAiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyem0tNiA2aC00djJoNHYtMnptMCAwdi00aC00djRoNHptMC02aC00di00aDR2NHptMCAwdi00aC00djRoNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20" />
        
        <form
          className="relative bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/20"
          onSubmit={handleLogin}
        >
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-center mb-2 text-white">
            Admin Girişi
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Yönetim paneline erişmek için giriş yapın
          </p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Kullanıcı Adı
              </label>
              <input
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Şifre
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full mt-8 bg-gradient-to-r from-primary to-primary/80 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col fixed h-full z-10 transition-colors duration-300">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Admin Panel
          </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon size={20} className={isActive ? 'text-primary' : ''} />
                <span className="font-medium">{item.label}</span>
                {item.id === 'messages' && data.messages.length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {data.messages.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
          <a
            href="/"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Home size={20} /> <span>Siteye Git</span>
          </a>
          <button
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            onClick={handleLogout}
          >
            <LogOut size={20} /> <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h1>
            <p className="text-gray-500 mt-1">
              {activeTab === 'services' && `${data.services.length} hizmet`}
              {activeTab === 'projects' && `${data.projects.length} proje`}
              {activeTab === 'messages' && `${data.messages.length} mesaj`}
              {activeTab === 'settings' && 'Site ayarlarını yönetin'}
            </p>
          </div>
          {(activeTab === 'services' || activeTab === 'projects') && (
            <button
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-0.5"
              onClick={activeTab === 'services' ? openAddService : openAddProject}
            >
              <Plus size={20} /> <span>Yeni Ekle</span>
            </button>
          )}
        </header>

        <div className="space-y-4">
          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="grid gap-4">
              {data.services.length === 0 ? (
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
                data.services.map((s) => (
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
          )}

          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="grid gap-4">
              {data.projects.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <Briefcase className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Henüz proje eklenmemiş</p>
                  <button
                    onClick={openAddProject}
                    className="mt-4 text-primary hover:underline"
                  >
                    İlk projeyi ekleyin
                  </button>
                </div>
              ) : (
                data.projects.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      {p.imageUrl && (
                        <img
                          src={p.imageUrl}
                          alt={getLocalizedText(p.title, language)}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {getLocalizedText(p.title, language)}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {getLocalizedText(p.description, language)}
                        </p>
                        {p.technologies && p.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {p.technologies.slice(0, 4).map((tech, i) => (
                              <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                                {tech}
                              </span>
                            ))}
                            {p.technologies.length > 4 && (
                              <span className="px-2 py-0.5 text-gray-400 text-xs">
                                +{p.technologies.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => openEditProject(p)}
                        className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(p.id)}
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
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="grid gap-4">
              {data.messages.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <MessageSquare className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Henüz mesaj yok</p>
                </div>
              ) : (
                data.messages.map((m) => (
                  <div
                    key={m.id}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold">
                          {m.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            {m.name}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Mail className="w-3 h-3" />
                            <span>{m.email}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-400">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(m.date).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
                      {m.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && <SettingsPanel />}
        </div>
      </main>

      {/* Modals */}
      <ServiceModal
        isOpen={serviceModalOpen}
        onClose={() => {
          setServiceModalOpen(false);
          setEditingService(null);
        }}
        onSave={handleSaveService}
        service={editingService}
      />

      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => {
          setProjectModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
        project={editingProject}
      />
    </div>
  );
}
