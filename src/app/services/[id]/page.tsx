import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLocalizedText } from '@/lib/db';
import type { Service } from '@/lib/db';
import ServiceDetailClient from './ServiceDetailClient';

type Props = {
  params: Promise<{ id: string }>;
};

async function fetchService(id: string): Promise<Service | null> {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/services/${id}`, {
      cache: 'no-store', // Always fetch fresh data
    });
    if (!res.ok) {
      if (res.status === 404) return null;
      console.error('Failed to fetch service:', res.statusText);
      return null;
    }
    const data = await res.json();
    return data.success && data.data ? data.data : null;
  } catch (error) {
    console.error('Error fetching service:', error);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const service = await fetchService(id);
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
  const service = await fetchService(id);
  if (!service) notFound();
  return <ServiceDetailClient service={service} />;
}
