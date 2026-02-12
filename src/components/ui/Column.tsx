import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Task, Status } from '../../lib/types';
import { TaskCard } from './TaskCard';

interface ColumnProps {
    id: Status; // Status type for column ID
    tasks: Task[];
    onDeleteTask: (id: string) => void;
}

export function Column({ id, tasks, onDeleteTask }: ColumnProps) {
    const { setNodeRef } = useDroppable({
        id,
    });

    return (
        <div className="flex flex-col h-full bg-gray-100 rounded-lg w-full min-w-[300px] border border-gray-200">
            <div className="flex items-center justify-between p-4 bg-gray-200 rounded-t-lg">
                <h2 className="font-semibold text-gray-700 capitalize">
                    {id.replace('_', ' ')}
                </h2>
                <span className="bg-gray-300 text-gray-600 px-2.5 py-0.5 rounded-full text-sm font-medium">
                    {tasks.length}
                </span>
            </div>

            <div
                ref={setNodeRef}
                className="flex-1 p-3 overflow-y-auto space-y-3 min-h-[100px]"
            >
                <SortableContext
                    items={tasks.map((task) => task.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onDelete={onDeleteTask}
                        />
                    ))}
                    {tasks.length === 0 && (
                        <div className="h-24 w-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg text-gray-400 text-sm">
                            Drop tasks here
                        </div>
                    )}
                </SortableContext>
            </div>
        </div>
    );
}
