import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Calendar,
    Clock,
    Flag,
    Tag,
    Repeat,
    Save,
    X,
    ArrowLeft,
    CheckCircle2,
    Palette,
    Bell,
    Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/Components/ui/Button';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        due_date: '',
        due_time: '',
        is_all_day: false,
        priority: 'medium',
        status: 'pending',
        tags: [],
        color: '#6366f1', // Default to Indigo
        is_recurring: false,
        recurrence_type: 'daily',
        recurrence_interval: 1,
        end_type: 'never',
        end_date: '',
        end_occurrences: '',
        reminders: [], // Array of { minutes_before: 30, type: 'email' }
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
        post(route('tasks.store'));
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

    const priorityColors = {
        low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        high: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        urgent: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={false} // Custom header inside component
        >
            <Head title="Create Task" />

            <div className="min-h-[calc(100vh-65px)] py-6 lg:py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/20 overflow-x-hidden">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <Link
                                href={route('tasks.index')}
                                className="inline-flex items-center text-sm text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors mb-2"
                            >
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back to Tasks
                            </Link>
                            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
                                Create New Task
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                Plan your work and stay organized.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Title & Description Card */}
                                <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-800 rounded-2xl shadow-xl p-6 md:p-8 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <CheckCircle2 className="w-24 h-24 transform rotate-12 text-indigo-500" />
                                    </div>

                                    <div className="space-y-6 relative z-10">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Task Title
                                            </label>
                                            <input
                                                type="text"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                placeholder="What needs to be done?"
                                                className={cn(
                                                    "w-full px-4 py-3 rounded-xl border-0 ring-1 ring-gray-200 dark:ring-gray-800 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 transition-all text-lg placeholder:text-gray-400 dark:text-white",
                                                    errors.title && "ring-red-500 focus:ring-red-500"
                                                )}
                                            />
                                            {errors.title && (
                                                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                placeholder="Add details about this task..."
                                                rows="6"
                                                className="w-full px-4 py-3 rounded-xl border-0 ring-1 ring-gray-200 dark:ring-gray-800 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 transition-all resize-none dark:text-white"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Schedule & Recurrence */}
                                <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-indigo-500" /> Due Date
                                            </label>
                                            <input
                                                type="date"
                                                value={data.due_date}
                                                onChange={(e) => setData('due_date', e.target.value)}
                                                className="w-full px-4 py-2.5 rounded-xl border-0 ring-1 ring-gray-200 dark:ring-gray-800 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-indigo-500" /> Due Time
                                            </label>
                                            <input
                                                type="time"
                                                value={data.due_time}
                                                onChange={(e) => setData('due_time', e.target.value)}
                                                disabled={data.is_all_day}
                                                className="w-full px-4 py-2.5 rounded-xl border-0 ring-1 ring-gray-200 dark:ring-gray-800 bg-white/50 dark:bg-gray-800/50 focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="is_all_day"
                                            checked={data.is_all_day}
                                            onChange={(e) => setData('is_all_day', e.target.checked)}
                                            className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-700 dark:bg-gray-800"
                                        />
                                        <label htmlFor="is_all_day" className="text-sm text-gray-700 dark:text-gray-300">
                                            This is an all-day task
                                        </label>
                                    </div>

                                    {/* Recurrence Toggle */}
                                    <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`p-2 rounded-lg ${data.is_recurring ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                                                    <Repeat className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <label htmlFor="is_recurring" className="block text-sm font-semibold text-gray-900 dark:text-gray-100 cursor-pointer">
                                                        Recurring Task
                                                    </label>
                                                    <p className="text-xs text-gray-500">Repeat this task periodically</p>
                                                </div>
                                            </div>
                                            <div
                                                onClick={() => setData('is_recurring', !data.is_recurring)}
                                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${data.is_recurring ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${data.is_recurring ? 'translate-x-6' : 'translate-x-0'}`} />
                                            </div>
                                        </div>

                                        {data.is_recurring && (
                                            <div className="mt-6 p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-xs font-semibold uppercase text-gray-500 mb-1.5 block">Frequency</label>
                                                        <select
                                                            value={data.recurrence_type}
                                                            onChange={(e) => setData('recurrence_type', e.target.value)}
                                                            className="w-full rounded-lg border-gray-200 dark:border-gray-700 text-sm focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                                                        >
                                                            <option value="daily">Daily</option>
                                                            <option value="weekly">Weekly</option>
                                                            <option value="monthly">Monthly</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-semibold uppercase text-gray-500 mb-1.5 block">Interval</label>
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={data.recurrence_interval}
                                                                onChange={(e) => setData('recurrence_interval', e.target.value)}
                                                                className="w-20 rounded-lg border-gray-200 dark:border-gray-700 text-sm focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
                                                            />
                                                            <span className="text-sm text-gray-500">
                                                                {data.recurrence_type === 'daily' ? 'days' : data.recurrence_type === 'weekly' ? 'weeks' : 'months'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar Options */}
                            <div className="space-y-6">
                                {/* Actions Card */}
                                <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-800 rounded-2xl shadow-xl p-6">
                                    <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
                                        Actions
                                    </h3>
                                    <div className="space-y-3">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/30 border-0 h-11"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {processing ? 'Creating...' : 'Create Task'}
                                        </Button>
                                        <Link href={route('tasks.index')} className="block">
                                            <Button type="button" variant="outline" className="w-full border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 h-11">
                                                Cancel
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                {/* Settings Card */}
                                <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-800 rounded-2xl shadow-xl p-6 space-y-6">
                                    {/* Priority */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                            <Flag className="w-4 h-4 text-indigo-500" /> Priority
                                        </label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['low', 'medium', 'high', 'urgent'].map((p) => (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    onClick={() => setData('priority', p)}
                                                    className={cn(
                                                        "px-3 py-2 rounded-lg text-sm font-medium capitalize transition-all border",
                                                        data.priority === p
                                                            ? `${priorityColors[p]} border-transparent ring-2 ring-offset-1 ring-indigo-500/20`
                                                            : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50"
                                                    )}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            Initial Status
                                        </label>
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-sm focus:ring-indigo-500 dark:text-white"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="in_progress">In Progress</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                    </div>

                                    {/* Color Picker */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                            <Palette className="w-4 h-4 text-indigo-500" /> Task Color
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="color"
                                                value={data.color}
                                                onChange={(e) => setData('color', e.target.value)}
                                                className="h-10 w-10 rounded-lg border-0 p-0 overflow-hidden cursor-pointer ring-2 ring-white shadow-md"
                                            />
                                            <span className="text-sm text-gray-500 font-mono bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">
                                                {data.color}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tags Card */}
                                <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/20 dark:border-gray-800 rounded-2xl shadow-xl p-6">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-indigo-500" /> Tags
                                    </label>
                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={tagInput}
                                                onChange={(e) => setTagInput(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                                placeholder="Add tag..."
                                                className="flex-1 rounded-lg border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 text-sm focus:ring-indigo-500 dark:text-white"
                                            />
                                            <button
                                                type="button"
                                                onClick={addTag}
                                                className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <div className="w-5 h-5 flex items-center justify-center font-bold">+</div>
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-2 min-h-[2rem]">
                                            {data.tags.length === 0 && (
                                                <p className="text-sm text-gray-400 italic">No tags added yet</p>
                                            )}
                                            {data.tags.map((tag, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-sm font-medium border border-indigo-100 dark:border-indigo-800"
                                                >
                                                    #{tag}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTag(tag)}
                                                        className="hover:text-red-500 transition-colors"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

