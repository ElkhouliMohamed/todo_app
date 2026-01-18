import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import TaskSpaceLayout from '@/Layouts/TaskSpaceLayout'; // Use the new shared layout
import { Card, CardContent } from '@/Components/ui/Card';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { parseISO } from 'date-fns';
import { Button } from '@/Components/ui/Button'; // Assuming you have a Button component

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const CustomToolbar = (toolbar) => {
    const goToBack = () => {
        toolbar.onNavigate('PREV');
    };

    const goToNext = () => {
        toolbar.onNavigate('NEXT');
    };

    const goToCurrent = () => {
        toolbar.onNavigate('TODAY');
    };

    const label = () => {
        const date = toolbar.date;
        return (
            <span className="text-xl font-bold text-gray-800 dark:text-gray-100 capitalize">
                {format(date, 'MMMM yyyy')}
            </span>
        );
    };

    return (
        <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-4">
                {label()}
            </div>

            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                <button
                    onClick={goToBack}
                    className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-all text-gray-500 hover:text-primary dark:text-gray-400"
                >
                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                </button>
                <button
                    onClick={goToCurrent}
                    className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-all"
                >
                    Today
                </button>
                <button
                    onClick={goToNext}
                    className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-md transition-all text-gray-500 hover:text-primary dark:text-gray-400"
                >
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                </button>
            </div>

            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                {['month', 'week', 'day'].map(view => (
                    <button
                        key={view}
                        onClick={() => toolbar.onView(view)}
                        className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${toolbar.view === view
                                ? 'bg-white dark:bg-gray-700 shadow-sm text-primary dark:text-white'
                                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                            }`}
                    >
                        {view}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default function Calendar({ auth, tasks }) {
    // Transform tasks to calendar events
    const events = tasks.map(task => {
        const startDate = parseISO(task.due_date);
        let endDate = startDate;

        if (task.due_time) {
            // If time exists, set specific time
            const [hours, minutes] = task.due_time.split(':');
            startDate.setHours(parseInt(hours), parseInt(minutes));
            // Default check duration 1 hour
            endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
        }

        return {
            id: task.id,
            title: task.title,
            start: startDate,
            end: endDate,
            allDay: task.is_all_day,
            resource: task,
        };
    });

    const eventStyleGetter = (event) => {
        const priorityColors = {
            low: '#10B981',    // Green
            medium: '#F59E0B', // Amber
            high: '#EF4444',   // Red
        };

        const backgroundColor = event.resource.color || priorityColors[event.resource.priority] || '#3B82F6';

        return {
            style: {
                backgroundColor: `${backgroundColor}20`, // 20% opacity for soft background
                color: backgroundColor, // Text color matches background base
                borderLeft: `3px solid ${backgroundColor}`,
                borderRadius: '4px',
                borderTop: 'none',
                borderRight: 'none',
                borderBottom: 'none',
                display: 'block',
                fontWeight: '500',
                fontSize: '0.85rem',
                padding: '2px 5px'
            }
        };
    };

    return (
        <TaskSpaceLayout>
            <Head title="Calendar" />

            <div className="flex flex-col h-full overflow-hidden">
                {/* Header / Tabs - Matching Index.jsx */}
                <div className="p-6 shrink-0 flex flex-col gap-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark z-10 transition-all">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
                        <div className="flex h-9 items-center justify-center rounded-lg bg-gray-200 dark:bg-border-dark p-1">
                            <Link
                                href={route('tasks.index')}
                                className="flex cursor-pointer px-3 py-1 items-center justify-center rounded-md text-xs font-semibold uppercase tracking-wider transition-all text-slate-500 hover:text-slate-700"
                            >
                                List
                            </Link>
                            <Link
                                href={route('tasks.index', { view: 'board' })} // Assuming you handle this query param or just link to index and user switches
                                className="flex cursor-pointer px-3 py-1 items-center justify-center rounded-md text-xs font-semibold uppercase tracking-wider transition-all text-slate-500 hover:text-slate-700"
                            >
                                Board
                            </Link>
                            <button className="flex cursor-pointer px-3 py-1 items-center justify-center rounded-md text-xs font-semibold uppercase tracking-wider transition-all bg-white dark:bg-background-dark shadow-sm text-primary dark:text-white">
                                Calendar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Calendar Content */}
                <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-4">
                    <Card className="h-full shadow-sm border-none bg-transparent">
                        <CardContent className="h-full p-0">
                            <div className="h-[calc(100vh-220px)] bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm calendar-wrapper">
                                <BigCalendar
                                    localizer={localizer}
                                    events={events}
                                    startAccessor="start"
                                    endAccessor="end"
                                    style={{ height: '100%' }}
                                    eventPropGetter={eventStyleGetter}
                                    views={['month', 'week', 'day']}
                                    defaultView="month"
                                    components={{
                                        toolbar: CustomToolbar
                                    }}
                                    className="soft-calendar"
                                />

                                <style>{`
                                    .soft-calendar .rbc-month-view {
                                        border: none;
                                    }
                                    .soft-calendar .rbc-header {
                                        border-bottom: 1px solid #f3f4f6; /* gray-100 */
                                        padding: 10px 0;
                                        font-size: 0.875rem;
                                        font-weight: 600;
                                        color: #6b7280; /* gray-500 */
                                        text-transform: uppercase;
                                        letter-spacing: 0.05em;
                                    }
                                    .dark .soft-calendar .rbc-header {
                                        border-bottom-color: #374151; /* gray-700 */
                                        color: #9ca3af; /* gray-400 */
                                    }
                                    .soft-calendar .rbc-month-row {
                                        border-bottom: 1px solid #f3f4f6;
                                    }
                                    .dark .soft-calendar .rbc-month-row {
                                        border-bottom-color: #374151;
                                    }
                                    .soft-calendar .rbc-day-bg { /* Vertical grid lines */
                                        border-left: 1px solid #f3f4f6;
                                    }
                                    .dark .soft-calendar .rbc-day-bg {
                                        border-left-color: #374151;
                                    }
                                    .soft-calendar .rbc-off-range-bg {
                                        background-color: #f9fafb; /* gray-50 */
                                    }
                                    .dark .soft-calendar .rbc-off-range-bg {
                                        background-color: #1f2937; /* gray-800 (darker) */
                                        opacity: 0.5;
                                    }
                                    .soft-calendar .rbc-today {
                                        background-color: #eff6ff !important; /* blue-50 */
                                    }
                                    .dark .soft-calendar .rbc-today {
                                        background-color: rgba(59, 130, 246, 0.1) !important; /* blue-500 with opacity */
                                    }
                                    .soft-calendar .rbc-date-cell {
                                        padding: 8px;
                                        font-size: 0.875rem;
                                        color: #4b5563;
                                    }
                                    .dark .soft-calendar .rbc-date-cell {
                                        color: #d1d5db;
                                    }
                                    /* Hiding default borders that look ugly */
                                    .rbc-month-view, .rbc-time-view, .rbc-agenda-view {
                                        border: 1px solid #e5e7eb !important;
                                        border-radius: 12px;
                                        overflow: hidden;
                                    }
                                    .dark .rbc-month-view, .dark .rbc-time-view, .dark .rbc-agenda-view {
                                        border-color: #374151 !important;
                                    }
                                `}</style>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </TaskSpaceLayout>
    );
}
