'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  servicesApi,
  projectsApi,
  messagesApi,
  settingsApi,
  adminApi,
} from './client';
import type { Stats } from './types';
import type { Service, Project, Message, SiteSettings } from '@/lib/db';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useApiState<T>(): [
  UseApiState<T>,
  (state: Partial<UseApiState<T>>) => void
] {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const updateState = useCallback((updates: Partial<UseApiState<T>>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  return [state, updateState];
}

// Services hooks
export function useServices() {
  const [state, setState] = useApiState<Service[]>();

  const fetch = useCallback(async () => {
    setState({ loading: true, error: null });
    const response = await servicesApi.getAll();
    if (response.success && response.data) {
      setState({ data: response.data, loading: false });
    } else {
      setState({ error: response.error || 'Failed to fetch services', loading: false });
    }
  }, [setState]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { ...state, refetch: fetch };
}

export function useService(id: string | null) {
  const [state, setState] = useApiState<Service>();

  const fetch = useCallback(async () => {
    if (!id) return;
    setState({ loading: true, error: null });
    const response = await servicesApi.getById(id);
    if (response.success && response.data) {
      setState({ data: response.data, loading: false });
    } else {
      setState({ error: response.error || 'Failed to fetch service', loading: false });
    }
  }, [id, setState]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { ...state, refetch: fetch };
}

// Projects hooks
export function useProjects() {
  const [state, setState] = useApiState<Project[]>();

  const fetch = useCallback(async () => {
    setState({ loading: true, error: null });
    const response = await projectsApi.getAll();
    if (response.success && response.data) {
      setState({ data: response.data, loading: false });
    } else {
      setState({ error: response.error || 'Failed to fetch projects', loading: false });
    }
  }, [setState]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { ...state, refetch: fetch };
}

export function useProject(id: string | null) {
  const [state, setState] = useApiState<Project>();

  const fetch = useCallback(async () => {
    if (!id) return;
    setState({ loading: true, error: null });
    const response = await projectsApi.getById(id);
    if (response.success && response.data) {
      setState({ data: response.data, loading: false });
    } else {
      setState({ error: response.error || 'Failed to fetch project', loading: false });
    }
  }, [id, setState]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { ...state, refetch: fetch };
}

// Messages hooks
export function useMessages() {
  const [state, setState] = useApiState<Message[]>();

  const fetch = useCallback(async () => {
    setState({ loading: true, error: null });
    const response = await messagesApi.getAll();
    if (response.success && response.data) {
      setState({ data: response.data, loading: false });
    } else {
      setState({ error: response.error || 'Failed to fetch messages', loading: false });
    }
  }, [setState]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { ...state, refetch: fetch };
}

// Settings hooks
export function useSettings() {
  const [state, setState] = useApiState<SiteSettings>();

  const fetch = useCallback(async () => {
    setState({ loading: true, error: null });
    const response = await settingsApi.get();
    if (response.success && response.data) {
      setState({ data: response.data, loading: false });
    } else {
      setState({ error: response.error || 'Failed to fetch settings', loading: false });
    }
  }, [setState]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { ...state, refetch: fetch };
}

// Admin stats hook
export function useAdminStats() {
  const [state, setState] = useApiState<Stats>();

  const fetch = useCallback(async () => {
    setState({ loading: true, error: null });
    const response = await adminApi.stats.get();
    if (response.success && response.data) {
      setState({ data: response.data, loading: false });
    } else {
      setState({ error: response.error || 'Failed to fetch stats', loading: false });
    }
  }, [setState]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { ...state, refetch: fetch };
}
