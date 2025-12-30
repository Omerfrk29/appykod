import type { ApiResponse, Stats } from './types';
import type { Service, Project, Message, SiteSettings, Testimonial } from '@/lib/db';
import { getCsrfToken } from './csrf';

const API_BASE = '/api';

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const data = await response.json();
  if (!response.ok) {
    return {
      success: false,
      error: data.error || 'An error occurred',
      details: data.details,
    };
  }
  return data as ApiResponse<T>;
}

async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    // Add CSRF token for non-GET requests
    const csrfToken = getCsrfToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (csrfToken && options?.method && !['GET', 'HEAD', 'OPTIONS'].includes(options.method.toUpperCase())) {
      headers['X-CSRF-Token'] = csrfToken;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
      credentials: 'include', // Ensure cookies are sent
    });
    return handleResponse<T>(response);
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Services API
export const servicesApi = {
  getAll: () => apiRequest<Service[]>('/services'),
  getById: (id: string) => apiRequest<Service>(`/services/${id}`),
  create: (data: Omit<Service, 'id'>) =>
    apiRequest<Service>('/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Omit<Service, 'id'>>) =>
    apiRequest<Service>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<void>(`/services/${id}`, {
      method: 'DELETE',
    }),
};

// Projects API
export const projectsApi = {
  getAll: () => apiRequest<Project[]>('/projects'),
  getById: (id: string) => apiRequest<Project>(`/projects/${id}`),
  create: (data: Omit<Project, 'id'>) =>
    apiRequest<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Omit<Project, 'id'>>) =>
    apiRequest<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<void>(`/projects/${id}`, {
      method: 'DELETE',
    }),
};

// Messages API
export const messagesApi = {
  getAll: () => apiRequest<Message[]>('/contact'),
  create: (data: Omit<Message, 'id' | 'date'>) =>
    apiRequest<void>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  markAsRead: (id: string) =>
    apiRequest<Message>(`/admin/messages/${id}`, {
      method: 'PUT',
    }),
  delete: (id: string) =>
    apiRequest<void>(`/admin/messages/${id}`, {
      method: 'DELETE',
    }),
};

// Settings API
export const settingsApi = {
  get: () => apiRequest<SiteSettings>('/settings'),
  update: (data: Partial<SiteSettings>) =>
    apiRequest<SiteSettings>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Testimonials API
export const testimonialsApi = {
  getAll: () => apiRequest<Testimonial[]>('/testimonials'),
  getById: (id: string) => apiRequest<Testimonial>(`/testimonials/${id}`),
  create: (data: Omit<Testimonial, 'id'>) =>
    apiRequest<Testimonial>('/testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Partial<Omit<Testimonial, 'id'>>) =>
    apiRequest<Testimonial>(`/testimonials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    apiRequest<void>(`/testimonials/${id}`, {
      method: 'DELETE',
    }),
};

// Admin API
export const adminApi = {
  services: {
    getAll: () => apiRequest<Service[]>('/admin/services'),
  },
  projects: {
    getAll: () => apiRequest<Project[]>('/admin/projects'),
  },
  messages: {
    getAll: () => apiRequest<Message[]>('/admin/messages'),
  },
  testimonials: {
    getAll: () => apiRequest<Testimonial[]>('/admin/testimonials'),
  },
  settings: {
    get: () => apiRequest<SiteSettings>('/admin/settings'),
  },
  stats: {
    get: () => apiRequest<Stats>('/admin/stats'),
  },
};
