import { useState, useEffect } from 'react';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    type DragStartEvent,
    type DragOverEvent,
    defaultDropAnimationSideEffects,
    type DropAnimation,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useStore } from '../store/useStore';
import type { Status } from '../lib/types';
import { Column } from '../components/ui/Column';
import { TaskCard } from '../components/ui/TaskCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LogOut, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'sonner';

const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.5',
            },
        },
    }),
};

export default function KanbanBoard() {
    const { tasks, addTask, updateTaskStatus, deleteTask, logout, user, loadTasks } = useStore();
    const navigate = useNavigate();
    const [activeId, setActiveId] = useState<string | null>(null);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    useEffect(() => {
        loadTasks();
    }, [loadTasks]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const columns: Status[] = ['TODO', 'IN_PROGRESS', 'DONE'];

    // Helper to find container (status) of a task id
    const findContainer = (id: string): Status | undefined => {
        if (columns.includes(id as Status)) return id as Status;
        const task = tasks.find((t: { id: string; status: Status }) => t.id === id);
        return task?.status;
    };

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        // Logic for visual placeholder updates can go here if we were managing
        // a local state separately from the store for drag operations.
        // However, since we rely on `tasks` from store, updating it on drag over 
        // might trigger API calls prematurely or complicating rollbacks.
        // Standard approach: Use drag overlay for visual feedback, 
        // and only commit changes on DragEnd.
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeContainer = findContainer(activeId);
        const overContainer = findContainer(overId);

        if (
            !activeContainer ||
            !overContainer ||
            activeContainer === overContainer
        ) {
            // If moving within same container, we might want to reorder.
            // But since API doesn't support order persistence, we skip reordering logic 
            // that affects API. We COULD visually reorder if we want.
            // For this assignment, "Move tasks between columns" is key.
            return;
        }

        // Moved to strict different column
        await updateTaskStatus(activeId, overContainer);
    };

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        await addTask(newTaskTitle, 'TODO');
        setNewTaskTitle('');
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    // Filter tasks for each column
    const getTasksByStatus = (status: Status) => {
        return tasks.filter((task: { status: Status }) => task.status === status);
    };

    const activeTask = activeId ? tasks.find((t: { id: string }) => t.id === activeId) : null;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Toaster position="top-right" richColors />

            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h1 className="text-2xl font-bold text-gray-900">Kanban Board</h1>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {user?.username}
                    </span>
                </div>
                <Button variant="ghost" onClick={handleLogout} className="text-gray-500 hover:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-x-auto">
                {/* Add Task Input */}
                <div className="max-w-md mb-8">
                    <form onSubmit={handleAddTask} className="flex gap-2">
                        <Input
                            placeholder="Add new task..."
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                        />
                        <Button type="submit" disabled={!newTaskTitle.trim()}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add
                        </Button>
                    </form>
                </div>

                {/* Board Columns */}
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full items-start">
                        {columns.map((col) => (
                            <Column
                                key={col}
                                id={col}
                                tasks={getTasksByStatus(col)}
                                onDeleteTask={deleteTask}
                            />
                        ))}
                    </div>

                    <DragOverlay dropAnimation={dropAnimation}>
                        {activeTask ? <TaskCard task={activeTask} onDelete={() => { }} /> : null}
                    </DragOverlay>
                </DndContext>
            </main>
        </div>
    );
}
