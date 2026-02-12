import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../lib/types';
import { Trash2 } from 'lucide-react';

interface TaskCardProps {
    task: Task;
    onDelete: (id: string) => void;
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-30 bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-400 h-[100px]"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow group relative cursor-grab active:cursor-grabbing touch-none"
        >
            <div className="pr-8">
                <h3 className="font-medium text-gray-900 break-words">{task.title}</h3>
                <p className="text-xs text-gray-500 mt-2">
                    {new Date(task.createdAt).toLocaleDateString()}
                </p>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.id);
                }}
                className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    );
}
