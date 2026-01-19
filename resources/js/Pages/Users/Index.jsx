import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import TaskSpaceLayout from '@/Layouts/TaskSpaceLayout';
import { Button } from '@/Components/ui/Button';
import Swal from 'sweetalert2';

export default function Index({ auth, users, filters }) {
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e) => {
        setSearch(e.target.value);
        if (e.key === 'Enter') {
            router.get(route('users.index'), { search: e.target.value }, { preserveState: true, preserveScroll: true });
        }
    };

    const handleDelete = (user) => {
        Swal.fire({
            title: `Delete ${user.name}?`,
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('users.destroy', user.id), {
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire('Deleted!', 'User has been deleted.', 'success');
                    }
                });
            }
        });
    };

    return (
        <TaskSpaceLayout>
            <Head title="User Management" />

            <div className="flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className="p-4 sm:p-6 shrink-0 flex flex-col gap-3 sm:gap-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">User Management</h1>
                        <Link href={route('users.create')}>
                            <Button className="shadow-lg shadow-primary/20 w-full sm:w-auto">
                                <span className="material-symbols-outlined text-lg mr-2">person_add</span>
                                <span>New User</span>
                            </Button>
                        </Link>
                    </div>

                    <div className="relative flex-1">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input
                            className="w-full h-9 pl-10 pr-3 rounded-lg border-none bg-gray-100 dark:bg-gray-800 text-sm placeholder:text-slate-500 focus:ring-1 focus:ring-primary"
                            placeholder="Search users..."
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-4 sm:p-6">
                    <div className="bg-white dark:bg-panel-dark rounded-lg shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                            <thead className="bg-gray-50 dark:bg-background-dark">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Created
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-panel-dark divide-y divide-gray-200 dark:divide-gray-800">
                                {users.data.length > 0 ? (
                                    users.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-background-dark transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {user.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                                                    {user.roles?.[0]?.name || 'User'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={route('users.edit', user.id)}>
                                                        <Button variant="ghost" size="sm">
                                                            <span className="material-symbols-outlined text-sm">edit</span>
                                                        </Button>
                                                    </Link>
                                                    {user.id !== auth.user.id && (
                                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(user)} className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                            <span className="material-symbols-outlined text-sm">delete</span>
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.links && users.links.length > 3 && (
                        <div className="mt-4 flex justify-center gap-2">
                            {users.links.map((link, index) => (
                                <button
                                    key={index}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    className={`px-3 py-1 rounded-md text-sm ${link.active
                                            ? 'bg-primary text-white'
                                            : link.url
                                                ? 'bg-white dark:bg-panel-dark text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                                        }`}
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
