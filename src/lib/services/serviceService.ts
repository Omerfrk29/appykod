import connectDB from '@/lib/db/mongodb';
import ServiceModel, { IService } from '@/lib/db/models/Service';
import { v4 as uuidv4 } from 'uuid';
import type { Service, LocalizedText } from '@/lib/db';

export async function getAllServices(): Promise<Service[]> {
  await connectDB();
  const services = await ServiceModel.find({}).lean();
  return services.map((s) => ({
    id: s.id,
    title: s.title,
    description: s.description,
    icon: s.icon,
    fullDescription: s.fullDescription,
    features: s.features,
    gallery: s.gallery,
    faq: s.faq,
    pricing: s.pricing,
  }));
}

export async function getServiceById(id: string): Promise<Service | null> {
  await connectDB();
  const service = await ServiceModel.findOne({ id }).lean();
  if (!service) return null;
  return {
    id: service.id,
    title: service.title,
    description: service.description,
    icon: service.icon,
    fullDescription: service.fullDescription,
    features: service.features,
    gallery: service.gallery,
    faq: service.faq,
    pricing: service.pricing,
  };
}

export async function createService(serviceData: Omit<Service, 'id'>): Promise<Service> {
  await connectDB();
  const id = uuidv4();
  const service = new ServiceModel({
    id,
    ...serviceData,
  });
  await service.save();
  return {
    id: service.id,
    title: service.title,
    description: service.description,
    icon: service.icon,
    fullDescription: service.fullDescription,
    features: service.features,
    gallery: service.gallery,
    faq: service.faq,
    pricing: service.pricing,
  };
}

export async function updateService(
  id: string,
  updateData: Partial<Omit<Service, 'id'>>
): Promise<Service | null> {
  await connectDB();
  const service = await ServiceModel.findOneAndUpdate(
    { id },
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean();
  if (!service) return null;
  return {
    id: service.id,
    title: service.title,
    description: service.description,
    icon: service.icon,
    fullDescription: service.fullDescription,
    features: service.features,
    gallery: service.gallery,
    faq: service.faq,
    pricing: service.pricing,
  };
}

export async function deleteService(id: string): Promise<boolean> {
  await connectDB();
  const result = await ServiceModel.deleteOne({ id });
  return result.deletedCount > 0;
}
