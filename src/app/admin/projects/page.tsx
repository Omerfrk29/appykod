'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Briefcase } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ProjectModal from '@/components/admin/ProjectModal';
import { projectsApi } from '@/lib/api/client';
import type { Project, LocalizedText } from '@/lib/db';

// Helper to get localized text
function getLocalizedText(text: LocalizedText | string | undefined, lang: 'tr' | 'en'): string {
  if (!text) return '';
  if (typeof text === 'string') return text;
  return text[lang] || text.tr || '';
}

export default function ProjectsPage() {
  const { language } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    setError(null);
    try {
      const response = await projectsApi.getAll();
      if (response.success && response.data) {
        setProjects(response.data);
      } else {
        setError('Projeler yüklenirken bir sorun oluştu');
      }
    } catch (err) {
      setError('Projeler yüklenirken bir hata oluştu');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteProject(id: string) {
    if (!confirm('Bu projeyi silmek istediğinize emin misiniz?')) return;
    setLoading(true);
    setError(null);
    try {
      const response = await projectsApi.delete(id);
      if (response.success) {
        await fetchProjects();
      } else {
        setError(response.error || 'Proje silinirken bir sorun oluştu');
      }
    } catch (err) {
      setError('Proje silinirken bir sorun oluştu');
      console.error('Error deleting project:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProject(projectData: Partial<Project>) {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (editingProject) {
        response = await projectsApi.update(editingProject.id, projectData);
      } else {
        response = await projectsApi.create(projectData as Omit<Project, 'id'>);
      }
      if (response.success) {
        setProjectModalOpen(false);
        setEditingProject(null);
        await fetchProjects();
      } else {
        setError(response.error || 'Proje kaydedilirken bir sorun oluştu');
      }
    } catch (err) {
      setError('Proje kaydedilirken bir sorun oluştu');
      console.error('Error saving project:', err);
    } finally {
      setLoading(false);
    }
  }

  function openAddProject() {
    setEditingProject(null);
    setProjectModalOpen(true);
  }

  function openEditProject(project: Project) {
    setEditingProject(project);
    setProjectModalOpen(true);
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
            Projeler
          </h1>
          <p className="text-gray-500 mt-1">
            {projects.length} proje
          </p>
        </div>
        <button
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:-translate-y-0.5"
          onClick={openAddProject}
        >
          <Plus size={20} /> <span>Yeni Ekle</span>
        </button>
      </header>

      <div className="grid gap-4">
        {projects.length === 0 ? (
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
          projects.map((p) => (
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
