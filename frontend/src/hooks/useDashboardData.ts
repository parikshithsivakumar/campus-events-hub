import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import {
  mockApprovals,
  mockEvents,
  mockNotifications,
  mockReports,
  mockTasks,
  mockVenues,
} from '../utils/mockData';

export function useEventsData() {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      try {
        const res = await api.get('/events');
        return res.data;
      } catch {
        return mockEvents;
      }
    },
  });
}

export function useApprovalsData() {
  return useQuery({
    queryKey: ['approvals'],
    queryFn: async () => mockApprovals,
  });
}

export function useVenuesData() {
  return useQuery({
    queryKey: ['venues'],
    queryFn: async () => {
      try {
        const res = await api.get('/venues');
        return res.data;
      } catch {
        return mockVenues;
      }
    },
  });
}

export function useTasksData() {
  const [tasks, setTasks] = useState(mockTasks);

  const grouped = useMemo(
    () => ({
      TODO: tasks.filter(task => task.status === 'TODO'),
      IN_PROGRESS: tasks.filter(task => task.status === 'IN_PROGRESS'),
      DONE: tasks.filter(task => task.status === 'DONE'),
    }),
    [tasks],
  );

  const updateStatus = (id: string, status: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    setTasks(prev => prev.map(task => (task.id === id ? { ...task, status } : task)));
  };

  return { tasks, grouped, updateStatus };
}

export function useReportsData() {
  return useQuery({
    queryKey: ['reports'],
    queryFn: async () => mockReports,
  });
}

export function useNotificationsData() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => mockNotifications,
  });
}
