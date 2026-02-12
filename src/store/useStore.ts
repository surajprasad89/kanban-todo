import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../lib/api';
import type { Task, User, Status } from '../lib/types';
import { toast } from 'sonner';

export interface KanbanState {
    user: User | null;
    tasks: Task[];
    isLoading: boolean;
    error: string | null;

    login: (username: string) => void;
    logout: () => void;

    loadTasks: () => Promise<void>;
    addTask: (title: string, status: Status) => Promise<void>;
    updateTaskStatus: (id: string, newStatus: Status) => Promise<void>;
    deleteTask: (id: string) => Promise<void>;
}

export const useStore = create<KanbanState>()(
    persist(
        (set, get) => ({
            user: null,
            tasks: [],
            isLoading: false,
            error: null,

            login: (username) => set({ user: { username } }),
            logout: () => set({ user: null, tasks: [] }),

            loadTasks: async () => {
                set({ isLoading: true, error: null });
                try {
                    const tasks = await api.getTasks();
                    set({ tasks, isLoading: false });
                } catch (err) {
                    const message = err instanceof Error ? err.message : 'Unknown error';
                    set({ error: message, isLoading: false });
                    toast.error('Failed to load tasks');
                }
            },

            addTask: async (title, status) => {
                const tempId = crypto.randomUUID();
                const optimisticTask: Task = {
                    id: tempId,
                    title,
                    status,
                    createdAt: Date.now(),
                };

                // Optimistic Update
                set((state) => ({ tasks: [...state.tasks, optimisticTask] }));

                try {
                    const newTask = await api.addTask({
                        title,
                        status,
                    });

                    // Update the optimistic task with the real one from server
                    set((state) => ({
                        tasks: state.tasks.map((t) => (t.id === tempId ? newTask : t)),
                    }));
                } catch {
                    // Rollback
                    set((state) => ({
                        tasks: state.tasks.filter((t) => t.id !== tempId),
                    }));
                    toast.error('Failed to add task');
                }
            },

            updateTaskStatus: async (id, newStatus) => {
                const previousTasks = get().tasks;
                const taskToUpdate = previousTasks.find((t) => t.id === id);

                if (!taskToUpdate) return;

                // Optimistic Update
                set((state) => ({
                    tasks: state.tasks.map((t) =>
                        t.id === id ? { ...t, status: newStatus } : t
                    ),
                }));

                try {
                    await api.updateTask(id, { status: newStatus });
                } catch {
                    // Rollback
                    set({ tasks: previousTasks });
                    toast.error('Failed to update task status');
                }
            },

            deleteTask: async (id) => {
                const previousTasks = get().tasks;

                // Optimistic Update
                set((state) => ({
                    tasks: state.tasks.filter((t) => t.id !== id),
                }));

                try {
                    await api.deleteTask(id);
                } catch {
                    // Rollback
                    set({ tasks: previousTasks });
                    toast.error('Failed to delete task');
                }
            },
        }),
        {
            name: 'kanban-storage', // Persistence key
            partialize: (state) => ({ user: state.user }), // Only persist user
        }
    )
);
