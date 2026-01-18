import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NotificationBell from '@/Components/notifications/NotificationBell';

import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <nav className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md dark:border-gray-700/50">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <Link
                                    href={route('dashboard')}
                                    className={`inline-flex items-center gap-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ${route().current('dashboard')
                                        ? 'border-b-2 border-indigo-400 text-gray-900 focus:border-indigo-700 dark:border-indigo-600 dark:text-gray-100'
                                        : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-300'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[20px]">dashboard</span>
                                    <span>Dashboard</span>
                                </Link>
                                <Link
                                    href={route('tasks.index')}
                                    className={`inline-flex items-center gap-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ${route().current('tasks.index')
                                        ? 'border-b-2 border-indigo-400 text-gray-900 focus:border-indigo-700 dark:border-indigo-600 dark:text-gray-100'
                                        : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-300'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                    <span>Tasks</span>
                                </Link>
                                <Link
                                    href={route('tasks.calendar')}
                                    className={`inline-flex items-center gap-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ${route().current('tasks.calendar')
                                        ? 'border-b-2 border-indigo-400 text-gray-900 focus:border-indigo-700 dark:border-indigo-600 dark:text-gray-100'
                                        : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-gray-300'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                                    <span>Calendar</span>
                                </Link>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <NotificationBell />
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-2 rounded-md border border-transparent bg-transparent px-3 py-2 text-sm font-medium leading-4 text-gray-500 dark:text-gray-400 transition duration-150 ease-in-out hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                                            >
                                                <span>{user.name}</span>
                                                <span className="material-symbols-outlined text-[20px]">expand_more</span>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                            className="flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">person</span>
                                            <span>Profile</span>
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex items-center gap-2 w-full text-left"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">logout</span>
                                            <span>Log Out</span>
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 focus:bg-gray-100 focus:text-gray-500 dark:focus:bg-gray-900 dark:focus:text-gray-400 focus:outline-none"
                            >
                                <span className="material-symbols-outlined text-[24px]">
                                    {showingNavigationDropdown ? 'close' : 'menu'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            <span className="flex items-center gap-2">
                                <span className="material-symbols-outlined">dashboard</span>
                                <span>Dashboard</span>
                            </span>
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('tasks.index')}
                            active={route().current('tasks.index')}
                        >
                            <span className="flex items-center gap-2">
                                <span className="material-symbols-outlined">check_circle</span>
                                <span>Tasks</span>
                            </span>
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('tasks.calendar')}
                            active={route().current('tasks.calendar')}
                        >
                            <span className="flex items-center gap-2">
                                <span className="material-symbols-outlined">calendar_today</span>
                                <span>Calendar</span>
                            </span>
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-600 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                <span className="flex items-center gap-2">
                                    <span className="material-symbols-outlined">person</span>
                                    <span>Profile</span>
                                </span>
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                <span className="flex items-center gap-2">
                                    <span className="material-symbols-outlined">logout</span>
                                    <span>Log Out</span>
                                </span>
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white dark:bg-gray-800 shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
