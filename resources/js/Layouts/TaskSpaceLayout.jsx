import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import NotificationBell from '@/Components/notifications/NotificationBell';

export default function TaskSpaceLayout({ children }) {
    const user = usePage().props.auth.user;

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            {/* Sidebar Navigation */}
            <aside className="w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark flex flex-col h-full">
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="material-symbols-outlined text-white">bolt</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold leading-none">Smart Task</h1>
                            <p className="text-xs text-slate-500 font-medium">Productivity Pro</p>
                        </div>
                    </div>
                    <nav className="space-y-1">
                        <Link
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${route().current('dashboard') ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            href={route('dashboard')}
                        >
                            <span className="material-symbols-outlined">dashboard</span>
                            <span className="text-sm font-semibold">Dashboard</span>
                        </Link>
                        <Link
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${route().current('tasks.*') ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            href={route('tasks.index')}
                        >
                            <span className="material-symbols-outlined">check_circle</span>
                            <span className="text-sm font-medium">Tasks</span>
                        </Link>
                        <Link
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${route().current('tasks.calendar') ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            href={route('tasks.calendar')}
                        >
                            <span className="material-symbols-outlined">calendar_today</span>
                            <span className="text-sm font-medium">Calendar</span>
                        </Link>
                        {/* Placeholder links */}
                        <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" href="#">
                            <span className="material-symbols-outlined">bar_chart</span>
                            <span className="text-sm font-medium">Insights</span>
                        </a>
                        <Link
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors mt-8 ${route().current('profile.edit') ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            href={route('profile.edit')}
                        >
                            <span className="material-symbols-outlined">settings</span>
                            <span className="text-sm font-medium">Settings</span>
                        </Link>
                    </nav>
                </div>
                <div className="mt-auto p-6 border-t border-slate-200 dark:border-slate-800">
                    <Dropdown>
                        <Dropdown.Trigger>
                            <div className="flex items-center gap-3 cursor-pointer">
                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                                    <span className="text-lg font-bold text-slate-600 dark:text-slate-300">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold truncate">{user.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                </div>
                                <span className="material-symbols-outlined text-slate-400 text-lg">more_vert</span>
                            </div>
                        </Dropdown.Trigger>
                        <Dropdown.Content align="right" width="48">
                            <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>

                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navbar */}
                <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md flex items-center justify-between px-8 z-10 shrink-0">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold tracking-tight">Good Morning, {user.name.split(' ')[0]}</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative w-64 group">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary text-xl">search</span>
                            <input className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary transition-all" placeholder="Search tasks..." type="text" />
                        </div>
                        <Link href={route('tasks.create')}>
                            <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                                <span className="material-symbols-outlined text-lg">add</span>
                                <span>Quick Add Task</span>
                            </button>
                        </Link>
                        <NotificationBell />
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
                    {children}
                </div>
            </main>
        </div>
    );
}
