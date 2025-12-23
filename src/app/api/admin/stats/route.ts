import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { handleApiError } from '@/lib/errors';
import * as serviceService from '@/lib/services/serviceService';
import * as projectService from '@/lib/services/projectService';
import * as messageService from '@/lib/services/messageService';
import * as testimonialService from '@/lib/services/testimonialService';

export async function GET(request: Request) {
  try {
    const authRes = await requireAdmin(request);
    if (authRes) return authRes;

    const [services, projects, messages, testimonials] = await Promise.all([
      serviceService.getAllServices(),
      projectService.getAllProjects(),
      messageService.getAllMessages(),
      testimonialService.getAllTestimonials(),
    ]);

    const unreadMessages = messages.filter((m) => !m.read).length;
    const totalMessages = messages.length;

    const stats = {
      services: {
        total: services.length,
      },
      projects: {
        total: projects.length,
      },
      messages: {
        total: totalMessages,
        unread: unreadMessages,
        read: totalMessages - unreadMessages,
      },
      testimonials: {
        total: testimonials.length,
      },
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    return handleApiError(error);
  }
}
