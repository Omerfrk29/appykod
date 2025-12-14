import type { Service, Project, Message, SiteSettings, Testimonial } from '@/lib/db';

export interface Stats {
  services: {
    total: number;
  };
  projects: {
    total: number;
  };
  messages: {
    total: number;
    unread: number;
    read: number;
  };
  testimonials: {
    total: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: any;
}

export type ServiceResponse = ApiResponse<Service>;
export type ServicesResponse = ApiResponse<Service[]>;
export type ProjectResponse = ApiResponse<Project>;
export type ProjectsResponse = ApiResponse<Project[]>;
export type MessageResponse = ApiResponse<Message>;
export type MessagesResponse = ApiResponse<Message[]>;
export type SettingsResponse = ApiResponse<SiteSettings>;
export type StatsResponse = ApiResponse<Stats>;
export type TestimonialResponse = ApiResponse<Testimonial>;
export type TestimonialsResponse = ApiResponse<Testimonial[]>;
