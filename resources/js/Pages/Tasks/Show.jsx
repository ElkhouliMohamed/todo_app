import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Badge } from '@/Components/ui/Badge';
import PriorityBadge from '@/Components/tasks/PriorityBadge';
import StatusBadge from '@/Components/tasks/StatusBadge';
import { formatDate, formatDateTime, getFriendlyDate } from '@/lib/dateUtils';

export default function Show({ auth, task }) {
    const handleComplete = () => {
        router.post(route('tasks.complete', task.id));
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this task?')) {
            router.delete(route('tasks.destroy', task.id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Task Details
                    </h2>
                    <div className="flex gap-2">
                        <Link href={route('tasks.edit', task.id)}>
                            <Button variant="outline">Edit</Button>
                        </Link>
                        <Link href={route('tasks.index')}>
                            <Button variant="secondary">Back to List</Button>
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={task.title} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Main Task Info */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <CardTitle className="text-3xl mb-2">{task.title}</CardTitle>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <PriorityBadge priority={task.priority} />
                                        <StatusBadge status={task.status} />
                                        {task.is_all_day && (
                                            <Badge variant="secondary">All Day</Badge>
                                        )}
                                    </div>
                                </div>
                                {task.color && (
                                    <div
                                        className="w-4 h-24 rounded-full"
                                        style={{ backgroundColor: task.color }}
                                    />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Description */}
                            {task.description && (
                                <div>
                                    <h3 className="font-semibold mb-2">Description</h3>
                                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                        {task.description}
                                    </p>
                                </div>
                            )}

                            {/* Due Date */}
                            {task.due_date && (
                                <div>
                                    <h3 className="font-semibold mb-2">Due Date</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">📅</span>
                                        <div>
                                            <p className="font-medium">
                                                {getFriendlyDate(task.due_date)}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {formatDateTime(task.due_date)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tags */}
                            {task.tags && task.tags.length > 0 && (
                                <div>
                                    <h3 className="font-semibold mb-2">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {task.tags.map((tag, index) => (
                                            <Badge key={index} variant="default">
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Completion */}
                            {task.completed_at && (
                                <div>
                                    <h3 className="font-semibold mb-2">Completed</h3>
                                    <p className="text-green-600 dark:text-green-400">
                                        ✓ Completed on {formatDateTime(task.completed_at)}
                                    </p>
                                </div>
                            )}

                            {/* Metadata */}
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                                    <div>
                                        <span className="font-medium">Created:</span>{' '}
                                        {formatDateTime(task.created_at)}
                                    </div>
                                    <div>
                                        <span className="font-medium">Updated:</span>{' '}
                                        {formatDateTime(task.updated_at)}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-4">
                                {task.status !== 'completed' && (
                                    <Button onClick={handleComplete} className="flex-1">
                                        ✓ Mark as Completed
                                    </Button>
                                )}
                                <Link href={route('tasks.edit', task.id)} className="flex-1">
                                    <Button variant="outline" className="w-full">
                                        ✏️ Edit Task
                                    </Button>
                                </Link>
                                <Button
                                    onClick={handleDelete}
                                    variant="destructive"
                                    className="flex-1"
                                >
                                    🗑️ Delete Task
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Reminders Section (Placeholder) */}
                    {task.reminders && task.reminders.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Reminders</CardTitle>
                                <CardDescription>
                                    {task.reminders.length} reminder{task.reminders.length !== 1 ? 's' : ''} set
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {task.reminders.map((reminder) => (
                                        <div key={reminder.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                            <div>
                                                <p className="font-medium">
                                                    {formatDateTime(reminder.remind_at)}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {reminder.send_email && '📧 Email'}
                                                    {reminder.send_browser && ' 🔔 Browser'}
                                                </p>
                                            </div>
                                            {reminder.is_sent && (
                                                <Badge variant="success">Sent</Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
