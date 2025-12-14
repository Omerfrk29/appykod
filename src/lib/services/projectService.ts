import connectDB from '@/lib/db/mongodb';
import ProjectModel, { IProject } from '@/lib/db/models/Project';
import { v4 as uuidv4 } from 'uuid';
import type { Project } from '@/lib/db';

export async function getAllProjects(): Promise<Project[]> {
  await connectDB();
  const projects = await ProjectModel.find({}).lean();
  return projects.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    imageUrl: p.imageUrl,
    link: p.link,
    fullDescription: p.fullDescription,
    technologies: p.technologies,
    challenges: p.challenges,
    solutions: p.solutions,
    gallery: p.gallery,
  }));
}

export async function getProjectById(id: string): Promise<Project | null> {
  await connectDB();
  const project = await ProjectModel.findOne({ id }).lean();
  if (!project) return null;
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    imageUrl: project.imageUrl,
    link: project.link,
    fullDescription: project.fullDescription,
    technologies: project.technologies,
    challenges: project.challenges,
    solutions: project.solutions,
    gallery: project.gallery,
  };
}

export async function createProject(projectData: Omit<Project, 'id'>): Promise<Project> {
  await connectDB();
  const id = uuidv4();
  const project = new ProjectModel({
    id,
    ...projectData,
  });
  await project.save();
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    imageUrl: project.imageUrl,
    link: project.link,
    fullDescription: project.fullDescription,
    technologies: project.technologies,
    challenges: project.challenges,
    solutions: project.solutions,
    gallery: project.gallery,
  };
}

export async function updateProject(
  id: string,
  updateData: Partial<Omit<Project, 'id'>>
): Promise<Project | null> {
  await connectDB();
  const project = await ProjectModel.findOneAndUpdate(
    { id },
    { $set: updateData },
    { new: true, runValidators: true }
  ).lean();
  if (!project) return null;
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    imageUrl: project.imageUrl,
    link: project.link,
    fullDescription: project.fullDescription,
    technologies: project.technologies,
    challenges: project.challenges,
    solutions: project.solutions,
    gallery: project.gallery,
  };
}

export async function deleteProject(id: string): Promise<boolean> {
  await connectDB();
  const result = await ProjectModel.deleteOne({ id });
  return result.deletedCount > 0;
}
