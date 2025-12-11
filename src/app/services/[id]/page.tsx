import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDB, getLocalizedText } from '@/lib/db';
import ServiceDetailClient from './ServiceDetailClient';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const db = await getDB();
  const service = db.services.find((s) => s.id === id);
  if (!service) return { title: 'Hizmet bulunamadı' };

  const title = getLocalizedText(service.title, 'tr');
  const description = getLocalizedText(service.description, 'tr');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { id } = await params;
  const db = await getDB();
  const service = db.services.find((s) => s.id === id);
  if (!service) notFound();
  return <ServiceDetailClient service={service} />;
}
