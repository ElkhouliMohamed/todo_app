import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Bell, Trash2 } from 'lucide-react';
import { Input } from '@/Components/ui/Input';

export default function Edit({ auth, task }) {
    const { data, setData, put, processing, errors } = useForm({
        title: task.title || '',
        description: task.description || '',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        due_time: task.due_time || '',
        is_all_day: task.is_all_day || false,
        priority: task.priority || 'medium',
        status: task.status || 'pending',
        tags: task.tags || [],
        color: task.color || '#3B82F6',
        status: task.status || 'pending',
        tags: task.tags || [],
        color: task.color || '#3B82F6',
        reminders: task.reminders || [],
    });

    const addReminder = () => {
        setData('reminders', [...data.reminders, { minutes_before: 30 }]);
    };

    const removeReminder = (index) => {
        const newReminders = [...data.reminders];
        newReminders.splice(index, 1);
        setData('reminders', newReminders);
    };

    const updateReminder = (index, field, value) => {
        const newReminders = [...data.reminders];
        newReminders[index][field] = parseInt(value);
        setData('reminders', newReminders);
    };

    const [tagInput, setTagInput] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('tasks.update', task.id));
    };

    const addTag = () => {
        if (tagInput.trim() && !data.tags.includes(tagInput.trim())) {
            setData('tags', [...data.tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setData('tags', data.tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Edit Task
                </h2>
            }
        >
            <Head title="Edit Task" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Task Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Enter task title"
                                        className={errors.title ? 'border-red-500' : ''}
                                    />
                                    {errors.title && (
                                        <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Description</label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder="Enter task description"
                                        rows="4"
                                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950"
                                    />
                                </div>

                                {/* Due Date and Time */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Due Date</label>
                                        <Input
                                            type="date"
                                            value={data.due_date}
                                            onChange={(e) => setData('due_date', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Due Time</label>
                                        <Input
                                            type="time"
                                            value={data.due_time}
                                            onChange={(e) => setData('due_time', e.target.value)}
                                            disabled={data.is_all_day}
                                        />
                                    </div>
                                </div>

                                {/* All Day */}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_all_day"
                                        checked={data.is_all_day}
                                        onChange={(e) => setData('is_all_day', e.target.checked)}
                                        className="rounded border-gray-300"
                                    />
                                    <label htmlFor="is_all_day" className="text-sm font-medium">
                                        All day task
                                    </label>
                                </div>

                                {/* Priority and Status */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Priority <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={data.priority}
                                            onChange={(e) => setData('priority', e.target.value)}
                                            className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950"
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="urgent">Urgent</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Status</label>
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-950"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Tags</label>
                                    <div className="flex gap-2 mb-2">
                                        <Input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                            placeholder="Add a tag"
                                        />
                                        <Button type="button" onClick={addTag} variant="outline">
                                            Add
                                        </Button>
                                    </div>
                                    {data.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {data.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm dark:bg-blue-900/30 dark:text-blue-400"
                                                >
                                                    #{tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTag(tag)}
                                                        className="hover:text-red-600"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Color */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Color</label>
                                    <input
                                        type="color"
                                        value={data.color}
                                        onChange={(e) => setData('color', e.target.value)}
                                        className="h-10 w-20 rounded border border-gray-300"
                                    />
                                </div>

                                {/* Reminders */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-sm font-medium flex items-center gap-2">
                                            <Bell className="w-4 h-4 text-indigo-500" /> Reminders
                                        </label>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addReminder}
                                            className="text-xs h-7"
                                        >
                                            + Add
                                        </Button>
                                    </div>
                                    <div className="space-y-2">
                                        {data.reminders.length === 0 && (
                                            <p className="text-xs text-gray-500 italic">No reminders set.</p>
                                        )}
                                        {data.reminders.map((reminder, index) => (
                                            <div key={index} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 p-2 rounded border border-gray-100 dark:border-gray-700">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Remind me</span>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={reminder.minutes_before}
                                                    onChange={(e) => updateReminder(index, 'minutes_before', e.target.value)}
                                                    className="w-20 h-8"
                                                />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">minutes before</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeReminder(index)}
                                                    className="ml-auto text-red-500 hover:text-red-700 p-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4 pt-4">
                                    <Button type="submit" disabled={processing} className="flex-1">
                                        {processing ? 'Updating...' : 'Update Task'}
                                    </Button>
                                    <Link href={route('tasks.show', task.id)}>
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
