import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import TaskSpaceLayout from '@/Layouts/TaskSpaceLayout';
import { Button } from '@/Components/ui/Button';

export default function Index({ recurringTasks }) {
    const handleToggleActive = (id) => {
        router.post(route('recurring-tasks.toggle-active', id), {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this recurring task? This will not delete already generated tasks.')) {
            router.delete(route('recurring-tasks.destroy', id));
        }
    };

    const getRecurrenceDescription = (task) => {
        let desc = `Every ${task.recurrence_interval > 1 ? task.recurrence_interval + ' ' : ''}`;

        if (task.recurrence_type === 'daily') {
            desc += task.recurrence_interval > 1 ? 'days' : 'day';
        } else if (task.recurrence_type === 'weekly') {
            desc += task.recurrence_interval > 1 ? 'weeks' : 'week';
            if (task.recurrence_days && task.recurrence_days.length > 0) {
                const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const days = task.recurrence_days.map(d => dayNames[d]).join(', ');
                desc += ` on ${days}`;
            }
        } else if (task.recurrence_type === 'monthly') {
            desc += task.recurrence_interval > 1 ? 'months' : 'month';
            if (task.recurrence_day_of_month) {
                desc += ` on day ${task.recurrence_day_of_month}`;
            }
        }

        return desc;
    };

    const getEndDescription = (task) => {
        if (task.end_type === 'never') {
            return 'Never ends';
        } else if (task.end_type === 'after_occurrences') {
            return `Ends after ${task.end_after_occurrences} occurrences`;
        } else if (task.end_type === 'on_date') {
            return `Ends on ${new Date(task.end_date).toLocaleDateString()}`;
        }
        return '';
    };

    const priorityColors = {
        low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    return (
        <TaskSpaceLayout>
            <Head title="Recurring Tasks" />

            <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Recurring Tasks</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                Manage your recurring task templates
                            </p>
                        </div>
                        <Link href={route('tasks.create')}>
                            <Button className="shadow-lg shadow-primary/20">
                                <span className="material-symbols-outlined text-lg mr-2">add</span>
                                Create Recurring Task
                            </Button>
                        </Link>
                    </div>

                    {/* Recurring Tasks List */}
                    <div className="space-y-4">
                        {recurringTasks.data && recurringTasks.data.length > 0 ? (
                            recurringTasks.data.map((task) => (
                                <div
                                    key={task.id}
                                    className="bg-white dark:bg-panel-dark rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-shadow"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold">{task.title}</h3>
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${priorityColors[task.priority]}`}>
                                                    {task.priority}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${task.is_active ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                                                    {task.is_active ? 'Active' : 'Paused'}
                                                </span>
                                            </div>

                                            {task.description && (
                                                <p className="text-gray-600 dark:text-gray-400 mb-3">
                                                    {task.description}
                                                </p>
                                            )}

                                            <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">repeat</span>
                                                    <span>{getRecurrenceDescription(task)}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">event</span>
                                                    <span>{getEndDescription(task)}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-sm">check_circle</span>
                                                    <span>{task.occurrences_created} tasks created</span>
                                                </div>
                                                {task.last_generated_date && (
                                                    <div className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-sm">schedule</span>
                                                        <span>Last: {new Date(task.last_generated_date).toLocaleDateString()}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {task.tags && task.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mt-3">
                                                    {task.tags.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs font-medium"
                                                        >
                                                            #{tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 ml-4">
                                            <button
                                                onClick={() => handleToggleActive(task.id)}
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                                title={task.is_active ? 'Pause' : 'Resume'}
                                            >
                                                <span className="material-symbols-outlined text-lg">
                                                    {task.is_active ? 'pause' : 'play_arrow'}
                                                </span>
                                            </button>
                                            <Link
                                                href={route('recurring-tasks.edit', task.id)}
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-lg">edit</span>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(task.id)}
                                                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 bg-white dark:bg-panel-dark rounded-xl border border-gray-200 dark:border-gray-800">
                                <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-700 mb-4">repeat</span>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    No recurring tasks yet
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 mb-4">
                                    Create a recurring task to automatically generate tasks on a schedule
                                </p>
                                <Link href={route('tasks.create')}>
                                    <Button>
                                        <span className="material-symbols-outlined text-lg mr-2">add</span>
                                        Create Your First Recurring Task
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {recurringTasks.links && recurringTasks.links.length > 3 && (
                        <div className="flex justify-center gap-2 mt-6">
                            {recurringTasks.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${link.active
                                            ? 'bg-primary text-white'
                                            : 'bg-white dark:bg-panel-dark text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                        } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </TaskSpaceLayout>
    );
}
