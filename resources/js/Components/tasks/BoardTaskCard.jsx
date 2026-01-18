import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link, router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import PriorityBadge from './PriorityBadge';
import { getFriendlyDate, isOverdue } from '@/lib/dateUtils';
import { Check, MoreHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/DropdownMenu';

export default function BoardTaskCard({ task }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task,
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: 'none', // Critical for dnd-kit on touch devices/some browsers
    };

    const dueDate = task.due_date ? new Date(task.due_date) : null;
    const isTaskOverdue = dueDate && isOverdue(dueDate) && task.status !== 'completed';

    const handleStatusChange = (newStatus) => {
        router.patch(route('tasks.update', task.id), {
            status: newStatus,
        }, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="bg-gray-100 dark:bg-gray-800 opacity-50 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl h-[150px] w-full"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "group bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-lg transition-all duration-200 cursor-grab active:cursor-grabbing border-0 ring-1 ring-gray-100 dark:ring-gray-700",
                task.status === 'completed' && "opacity-75"
            )}
        >
            {/* Color Strip Indicator (optional but nice) */}
            {task.color && (
                <div
                    className="h-1.5 w-8 rounded-full mb-3"
                    style={{ backgroundColor: task.color }}
                />
            )}

            {/* Header: Title and Menu */}
            <div className="flex justify-between items-start mb-2 gap-2">
                <Link
                    href={route('tasks.show', task.id)}
                    className={cn(
                        "text-base font-bold text-gray-800 dark:text-gray-100 leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2",
                        task.status === 'completed' && "line-through text-gray-400"
                    )}
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    {task.title}
                </Link>

                <div className="flex-shrink-0" onPointerDown={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-md transition-colors">
                            <MoreHorizontal className="h-5 w-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleStatusChange('pending')}>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-gray-400" />
                                    <span>To Do</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange('in_progress')}>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                                    <span>In Progress</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                    <span>Completed</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleStatusChange('cancelled')}>
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-red-500" />
                                    <span>Cancelled</span>
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => router.get(route('tasks.edit', task.id))}>
                                <div className="flex items-center gap-2 w-full">
                                    <span>Edit Task</span>
                                </div>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Description Preview (if any) */}
            {task.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                    {task.description}
                </p>
            )}

            {/* Footer: Meta Info */}
            <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-50 dark:border-gray-700/50">
                <div className="flex items-center gap-2">
                    <PriorityBadge priority={task.priority} className="shadow-none border-0 bg-gray-100 dark:bg-gray-700/50" />
                    {task.tags && task.tags.length > 0 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            #{task.tags[0]}
                            {task.tags.length > 1 && ` +${task.tags.length - 1}`}
                        </span>
                    )}
                </div>

                {dueDate && (
                    <div className={cn(
                        "text-xs font-semibold flex items-center gap-1.5",
                        isTaskOverdue ? "text-red-500" : "text-gray-400 dark:text-gray-500"
                    )}>
                        {getFriendlyDate(dueDate)}
                    </div>
                )}
            </div>
        </div>
    );
}
