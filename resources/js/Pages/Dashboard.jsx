import TaskSpaceLayout from '@/Layouts/TaskSpaceLayout';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';

export default function Dashboard({ auth, stats, recentTasks, upcomingTasks }) {
    const today = new Date();
    const formattedDate = format(today, 'EEEE, MMMM do');
    const pendingCount = stats?.pending || 0;

    // Calculate productivity score (example logic: completed / total)
    const totalTasks = stats?.total || 1; // Avoid division by zero
    const completedTasks = stats?.completed || 0;
    const productivityScore = Math.round((completedTasks / totalTasks) * 100);

    // SVG Circle params
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (productivityScore / 100) * circumference;

    return (
        <TaskSpaceLayout>
            <Head title="Dashboard" />

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
                {/* Page Heading & Date */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Dashboard Overview</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm sm:text-base">{formattedDate} • You have {pendingCount} pending tasks</p>
                    </div>
                </div>

                {/* 3-Column Layout - Stacks on mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
                    {/* Column 1: Productivity Stats */}
                    <div className="lg:col-span-4 space-y-4 sm:space-y-6">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 rounded-xl shadow-sm">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 sm:mb-6">Productivity Score</h3>
                            <div className="flex flex-col items-center">
                                <div className="relative w-32 h-32 sm:w-40 sm:h-40">
                                    {/* Simple Circular Progress SVG */}
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle className="text-slate-100 dark:text-slate-800" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="8"></circle>
                                        <circle
                                            className="text-primary transition-all duration-1000 ease-out"
                                            cx="80"
                                            cy="80"
                                            fill="transparent"
                                            r="70"
                                            stroke="currentColor"
                                            strokeDasharray={circumference}
                                            strokeDashoffset={strokeDashoffset}
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                        ></circle>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl sm:text-3xl font-black">{productivityScore}%</span>
                                        <span className="text-xs text-slate-500 font-bold tracking-widest">DONE</span>
                                    </div>
                                </div>
                                <div className="mt-4 sm:mt-6 text-center">
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                        {productivityScore > 50 ? "Great progress! Keep it up." : "Let's get some tasks done!"}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-xl">
                                <p className="text-xs font-bold text-slate-400 mb-1">TOTAL</p>
                                <p className="text-xl sm:text-2xl font-black">{stats?.total || 0}</p>
                                <span className="text-xs font-bold text-slate-500">Tasks</span>
                            </div>
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-xl">
                                <p className="text-xs font-bold text-slate-400 mb-1">COMPLETED</p>
                                <p className="text-xl sm:text-2xl font-black">{stats?.completed || 0}</p>
                                <span className="text-xs font-bold text-primary">Done</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Today's Priorities (Recent Tasks) */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 rounded-xl h-full shadow-sm flex flex-col">
                            <div className="flex items-center justify-between mb-4 sm:mb-6">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Recent Tasks</h3>
                                <Link href={route('tasks.index')} className="text-primary text-xs font-bold hover:underline">View All</Link>
                            </div>
                            <div className="space-y-2 sm:space-y-3 flex-1">
                                {recentTasks && recentTasks.map(task => (
                                    <div key={task.id} className="group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all cursor-pointer">
                                        <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${task.status === 'completed' ? 'border-primary bg-primary' : 'border-slate-300 dark:border-slate-600 group-hover:border-primary'}`}>
                                            {task.status === 'completed' && <span className="material-symbols-outlined text-white text-sm sm:text-base">check</span>}
                                            {task.status !== 'completed' && <span className="material-symbols-outlined text-primary text-sm sm:text-base opacity-0 group-hover:opacity-100">check</span>}
                                        </div>
                                        <div className={`flex-1 min-w-0 ${task.status === 'completed' ? 'line-through opacity-50' : ''}`}>
                                            <p className="text-sm font-bold truncate">{task.title}</p>
                                            <p className="text-xs text-slate-500 font-medium truncate">{task.due_date ? format(new Date(task.due_date), 'MMM d, h:mm a') : 'No due date'}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter flex-shrink-0
                                            ${task.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                                task.priority === 'medium' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                                                    'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
                                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                        </span>
                                    </div>
                                ))}
                                {(!recentTasks || recentTasks.length === 0) && (
                                    <p className="text-sm text-slate-500 text-center py-4">No recent tasks found.</p>
                                )}
                            </div>
                            <Link href={route('tasks.create')}>
                                <button className="w-full mt-4 sm:mt-6 py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 text-sm font-bold hover:border-primary hover:text-primary transition-all">
                                    + Add another task
                                </button>
                            </Link>
                        </div>
                    </div>

                    {/* Column 3: Upcoming Reminders */}
                    <div className="lg:col-span-3 space-y-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-6 rounded-xl h-full shadow-sm">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 sm:mb-6">Upcoming</h3>
                            <div className="relative pl-6 space-y-6 sm:space-y-8 before:content-[''] before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-800">
                                {upcomingTasks && upcomingTasks.map((task, index) => (
                                    <div key={task.id} className="relative">
                                        <span className={`absolute -left-[27px] top-1 w-2.5 h-2.5 rounded-full border-4 border-white dark:border-slate-900 ${index === 0 ? 'bg-primary shadow-[0_0_0_4px_rgba(43,108,238,0.1)]' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
                                        <p className={`text-xs font-black uppercase tracking-wider mb-1 ${index === 0 ? 'text-primary' : 'text-slate-400'}`}>
                                            {task.due_date ? format(new Date(task.due_date), 'h:mm a') : 'Soon'}
                                        </p>
                                        <p className="text-sm font-bold line-clamp-2">{task.title}</p>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{task.description ? task.description.substring(0, 30) + '...' : 'No description'}</p>
                                    </div>
                                ))}
                                {(!upcomingTasks || upcomingTasks.length === 0) && (
                                    <p className="text-sm text-slate-500 text-center">No upcoming tasks.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </TaskSpaceLayout>
    );
}
