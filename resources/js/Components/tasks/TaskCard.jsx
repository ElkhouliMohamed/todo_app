import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Card, CardContent, CardFooter } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import PriorityBadge from './PriorityBadge';
import StatusBadge from './StatusBadge';
import { formatDate, getFriendlyDate, isOverdue } from '@/lib/dateUtils';
import { cn } from '@/lib/utils';

export default function TaskCard({ task, onComplete, onDelete }) {
    const handleComplete = (e) => {
        e.preventDefault();
        if (onComplete) {
            onComplete(task.id);
        } else {
            router.post(route('tasks.complete', task.id));
        }
    };

    const handleDelete = (e) => {
        e.preventDefault();
        if (confirm('Are you sure you want to delete this task?')) {
            if (onDelete) {
                onDelete(task.id);
            } else {
                router.delete(route('tasks.destroy', task.id));
            }
        }
    };

    const dueDate = task.due_date ? new Date(task.due_date) : null;
    const isTaskOverdue = dueDate && isOverdue(dueDate) && task.status !== 'completed';

    return (
        <Card className={cn(
            'transition-all hover:shadow-md',
            task.status === 'completed' && 'opacity-60',
            isTaskOverdue && 'border-red-300 dark:border-red-800'
        )}>
            <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <Link
                            href={route('tasks.show', task.id)}
                            className="block group"
                        >
                            <h3 className={cn(
                                'font-semibold text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors',
                                task.status === 'completed' && 'line-through'
                            )}>
                                {task.title}
                            </h3>
                        </Link>

                        {task.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                {task.description}
                            </p>
                        )}

                        <div className="flex flex-wrap gap-2 items-center">
                            <PriorityBadge priority={task.priority} />
                            <StatusBadge status={task.status} />

                            {dueDate && (
                                <span className={cn(
                                    'text-xs px-2 py-1 rounded-full',
                                    isTaskOverdue
                                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                                )}>
                                    📅 {getFriendlyDate(dueDate)}
                                </span>
                            )}

                            {task.tags && task.tags.length > 0 && (
                                <div className="flex gap-1">
                                    {task.tags.slice(0, 3).map((tag, index) => (
                                        <span
                                            key={index}
                                            className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                    {task.tags.length > 3 && (
                                        <span className="text-xs px-2 py-1 text-gray-500">
                                            +{task.tags.length - 3}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {task.color && (
                        <div
                            className="w-1 h-full rounded-full flex-shrink-0"
                            style={{ backgroundColor: task.color }}
                        />
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex gap-2">
                {task.status !== 'completed' && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleComplete}
                        className="flex-1"
                    >
                        ✓ Complete
                    </Button>
                )}

                <Link href={route('tasks.edit', task.id)}>
                    <Button size="sm" variant="secondary">
                        ✏️ Edit
                    </Button>
                </Link>

                <Button
                    size="sm"
                    variant="destructive"
                    onClick={handleDelete}
                >
                    🗑️
                </Button>
            </CardFooter>
        </Card>
    );
}
