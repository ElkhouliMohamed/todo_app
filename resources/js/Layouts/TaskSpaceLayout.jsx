import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Dropdown from '@/Components/Dropdown';
import NotificationBell from '@/Components/notifications/NotificationBell';

export default function TaskSpaceLayout({ children }) {
    const user = usePage().props.auth.user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar Navigation */}
            <aside className={`
                fixed lg:static inset-y-0 left-0 z-50
                w-64 flex-shrink-0 
                border-r border-slate-200 dark:border-slate-800 
                bg-white dark:bg-background-dark 
                flex flex-col h-full
                transform transition-transform duration-300 ease-in-out
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                    {/* Mobile Close Button */}
                    <div className="flex items-center justify-between mb-6 lg:mb-8">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="material-symbols-outlined text-white">bolt</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold leading-none">Smart Task</h1>
                                <p className="text-xs text-slate-500 font-medium">Productivity Pro</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>

                    <nav className="space-y-1">
                        <Link
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${route().current('dashboard') ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            href={route('dashboard')}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="material-symbols-outlined">dashboard</span>
                            <span className="text-sm font-semibold">Dashboard</span>
                        </Link>
                        <Link
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${route().current('tasks.*') ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            href={route('tasks.index')}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="material-symbols-outlined">check_circle</span>
                            <span className="text-sm font-medium">Tasks</span>
                        </Link>
                        <Link
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${route().current('tasks.calendar') ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            href={route('tasks.calendar')}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="material-symbols-outlined">calendar_today</span>
                            <span className="text-sm font-medium">Calendar</span>
                        </Link>
                        <Link
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${route().current('recurring-tasks.*') ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            href={route('recurring-tasks.index')}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="material-symbols-outlined">repeat</span>
                            <span className="text-sm font-medium">Recurring Tasks</span>
                        </Link>

                        {/* Admin Only - Users Link */}
                        {user.permissions?.includes('manage app') && (
                            <Link
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${route().current('users.*') ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                href={route('users.index')}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="material-symbols-outlined">group</span>
                                <span className="text-sm font-medium">Users</span>
                            </Link>
                        )}

                        <Link
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors mt-8 ${route().current('profile.edit') ? 'bg-primary/10 text-primary border-l-2 border-primary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                            href={route('profile.edit')}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <span className="material-symbols-outlined">settings</span>
                            <span className="text-sm font-medium">Settings</span>
                        </Link>
                    </nav>
                </div>
                <div className="mt-auto p-4 sm:p-6 border-t border-slate-200 dark:border-slate-800">
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
                <header className="h-14 sm:h-16 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 shrink-0">
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Mobile Hamburger Menu */}
                        <button
                            onClick={() => setMobileMenuOpen(true)}
                            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <h2 className="text-base sm:text-xl font-bold tracking-tight truncate">Good Morning, {user.name.split(' ')[0]}</h2>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Search - Hidden on mobile */}
                        <div className="relative w-48 lg:w-64 group hidden md:block">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary text-xl">search</span>
                            <input className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm focus:ring-2 focus:ring-primary transition-all" placeholder="Search tasks..." type="text" />
                        </div>
                        <Link href={route('tasks.create')}>
                            <button className="flex items-center gap-2 bg-primary text-white px-3 sm:px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                                <span className="material-symbols-outlined text-lg">add</span>
                                <span className="hidden sm:inline">Quick Add Task</span>
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
