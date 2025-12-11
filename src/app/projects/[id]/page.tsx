import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDB, getLocalizedText } from '@/lib/db';
import ProjectDetailClient from './ProjectDetailClient';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const db = await getDB();
  const project = db.projects.find((p) => p.id === id);
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
  const db = await getDB();
  const project = db.projects.find((p) => p.id === id);
  if (!project) notFound();
  return <ProjectDetailClient project={project} />;
}
