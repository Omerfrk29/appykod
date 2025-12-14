import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLocalizedText } from '@/lib/db';
import type { Service } from '@/lib/db';
import ServiceDetailClient from './ServiceDetailClient';
import * as serviceService from '@/lib/services/serviceService';

// Force dynamic rendering to avoid build-time MongoDB connection issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { id } = await params;
    const service = await serviceService.getServiceById(id);
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
  } catch (error) {
    console.error('[generateMetadata] Error fetching service:', error);
    return { title: 'Hizmet bulunamadı' };
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  try {
    const { id } = await params;
    const service = await serviceService.getServiceById(id);
    if (!service) {
      notFound();
    }
    return <ServiceDetailClient service={service} />;
  } catch (error) {
    console.error('[ServiceDetailPage] Error fetching service:', error);
    notFound();
  }
}
