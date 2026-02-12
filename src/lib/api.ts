import type { Task } from './types';

const DELAY_MIN = 1000;
const DELAY_MAX = 2000;
const FAILURE_RATE = 0.2;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const randomDelay = () => {
    const delay = Math.floor(Math.random() * (DELAY_MAX - DELAY_MIN + 1)) + DELAY_MIN;
    return wait(delay);
};

const shouldFail = () => Math.random() < FAILURE_RATE;

const STORAGE_KEY = 'kanban-mock-db';

const getStoredTasks = (): Task[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
};

const setStoredTasks = (tasks: Task[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

// In-memory storage synced with local storage for the "server"
let serverTasks: Task[] = getStoredTasks();

// Seed if empty
if (serverTasks.length === 0) {
    serverTasks = [
        { id: '1', title: 'Task 1', status: 'TODO', createdAt: Date.now() },
        { id: '2', title: 'Task 2', status: 'IN_PROGRESS', createdAt: Date.now() },
        { id: '3', title: 'Task 3', status: 'DONE', createdAt: Date.now() },
    ];
    setStoredTasks(serverTasks);
}

export const api = {
    getTasks: async (): Promise<Task[]> => {
        await randomDelay();
        if (shouldFail()) throw new Error('Failed to fetch tasks');
        return [...serverTasks];
    },

    addTask: async (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
        await randomDelay();
        if (shouldFail()) throw new Error('Failed to add task');

        const newTask: Task = {
            ...task,
            id: crypto.randomUUID(),
            createdAt: Date.now(),
        };
        serverTasks.push(newTask);
        setStoredTasks(serverTasks);
        return newTask;
    },

    updateTask: async (id: string, updates: Partial<Task>): Promise<Task> => {
        await randomDelay();
        if (shouldFail()) throw new Error('Failed to update task');

        const index = serverTasks.findIndex((t) => t.id === id);
        if (index === -1) throw new Error('Task not found');

        serverTasks[index] = { ...serverTasks[index], ...updates };
        setStoredTasks(serverTasks);
        return serverTasks[index];
    },

    deleteTask: async (id: string): Promise<void> => {
        await randomDelay();
        if (shouldFail()) throw new Error('Failed to delete task');

        const index = serverTasks.findIndex((t) => t.id === id);
        if (index === -1) throw new Error('Task not found');

        serverTasks.splice(index, 1);
        setStoredTasks(serverTasks);
    },
};
