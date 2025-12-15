import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLocalizedText } from '@/lib/db';
import ProjectDetailClient from './ProjectDetailClient';
import * as projectService from '@/lib/services/projectService';

// Force dynamic rendering to avoid build-time MongoDB connection issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const project = await projectService.getProjectById(id);
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
  } catch (error) {
    console.error('[generateMetadata] Error fetching project:', error);
    return { title: 'Proje bulunamadı' };
  }
}

export default async function ProjectDetailPage({ params }: Props) {
  let project;
  try {
    const { id } = await params;
    project = await projectService.getProjectById(id);
  } catch (error) {
    console.error('[ProjectDetailPage] Error fetching project:', error);
    notFound();
  }

  if (!project) {
    notFound();
  }

  return <ProjectDetailClient project={project} />;
}
