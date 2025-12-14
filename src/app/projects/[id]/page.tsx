import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLocalizedText } from '@/lib/db';
import type { Project } from '@/lib/db';
import ProjectDetailClient from './ProjectDetailClient';

type Props = {
  params: Promise<{ id: string }>;
};

async function fetchProject(id: string): Promise<Project | null> {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/projects/${id}`, {
      cache: 'no-store', // Always fetch fresh data
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      console.error('Failed to fetch project:', res.statusText);
      return null;
    }
    const data = await res.json();
    return data.success && data.data ? data.data : null;
  } catch (error) {
    console.error('Error fetching project:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await fetchProject(id);
  if (!project) return { title: 'Proje bulunamadı' };

  const title = getLocalizedText(project.title, 'tr');
  const description = getLocalizedText(project.description, 'tr');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      images: project.imageUrl ? [{ url: project.imageUrl }] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const project = await fetchProject(id);
  if (!project) notFound();
  return <ProjectDetailClient project={project} />;
}
