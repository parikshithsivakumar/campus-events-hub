import { useMemo, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
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
        // Normalize _id to id for consistency
        const events = Array.isArray(res.data) ? res.data : res.data?.data || [];
        
        // If no events received from API, use mock data
        if (!events || events.length === 0) {
          return mockEvents;
        }
        
        return events.map((event: any) => {
          // Handle organizerId: if it's an object with _id, extract it
          let organizerId = event.organizerId;
          if (typeof organizerId === 'object' && organizerId?._id) {
            organizerId = organizerId._id;
          } else if (typeof organizerId === 'object' && organizerId?.id) {
            organizerId = organizerId.id;
          }
          
          // Handle venue: if it's a populated object, extract the name
          let venue = event.venue || '';
          if (typeof event.venueId === 'object' && event.venueId?.name) {
            venue = event.venueId.name;
          }
          
          return {
            ...event,
            id: event._id || event.id,
            organizerId: organizerId || event.organizerId,
            venue: venue,
          };
        });
      } catch (error) {
        console.error('Error fetching events:', error);
        return mockEvents;
      }
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
  });
}

export function useApprovalsData() {
  return useQuery({
    queryKey: ['approvals'],
    queryFn: async () => mockApprovals,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: 'always',
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
    staleTime: 60000,
    refetchOnWindowFocus: true,
  });
}

export function useTasksData() {
  const [tasks, setTasks] = useState(mockTasks);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync with backend on mount
  useEffect(() => {
    const syncTasks = async () => {
      try {
        setIsSyncing(true);
        const token = localStorage.getItem('access_token');
        const response = await fetch('http://localhost:4000/api/tasks', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        }
      } catch (error) {
        console.error('Failed to sync tasks:', error);
        // Use mock data as fallback
      } finally {
        setIsSyncing(false);
      }
    };

    syncTasks();
  }, []);

  const grouped = useMemo(
    () => ({
      TODO: tasks.filter(task => task.status === 'TODO'),
      IN_PROGRESS: tasks.filter(task => task.status === 'IN_PROGRESS'),
      DONE: tasks.filter(task => task.status === 'DONE'),
    }),
    [tasks],
  );

  const updateStatus = async (id: string, status: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    // Update local state immediately
    setTasks(prev => prev.map(task => (task.id === id ? { ...task, status } : task)));

    // Sync with backend
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`http://localhost:4000/api/tasks/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const addTask = async (newTask: { title: string; team: 'Media' | 'Logistics' | 'Tech' | 'Hospitality'; assignee: string; priority: 'Low' | 'Medium' | 'High' }) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:4000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const task = await response.json();
        setTasks(prev => [...prev, task]);
        return task;
      }
    } catch (error) {
      console.error('Failed to create task:', error);
      // Fallback to local state
      const task = {
        id: Date.now().toString(),
        ...newTask,
        status: 'TODO' as const,
        dueDate: new Date().toISOString().split('T')[0],
      };
      setTasks(prev => [...prev, task]);
      return task;
    }
  };

  return { tasks, grouped, updateStatus, addTask, setTasks, isSyncing };
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
