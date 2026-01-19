import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import TaskSpaceLayout from '@/Layouts/TaskSpaceLayout';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';

export default function Edit({ auth, user, roles }) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        role: user.roles?.[0]?.name || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    return (
        <TaskSpaceLayout>
            <Head title="Edit User" />

            <div className="flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className="p-4 sm:p-6 shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark">
                    <div className="flex items-center gap-4">
                        <Link href={route('users.index')}>
                            <Button variant="ghost" size="sm">
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                            </Button>
                        </Link>
                        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Edit User</h1>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-4 sm:p-6">
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white dark:bg-panel-dark rounded-lg shadow-sm p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Name <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className={errors.name ? 'border-red-500' : ''}
                                        required
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className={errors.email ? 'border-red-500' : ''}
                                        required
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                                </div>

                                {/* Password */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Password <span className="text-gray-500 text-xs">(Leave blank to keep current)</span>
                                    </label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={errors.password ? 'border-red-500' : ''}
                                    />
                                    {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                                </div>

                                {/* Confirm Password */}
                                {data.password && (
                                    <div>
                                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Confirm Password <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            id="password_confirmation"
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                        />
                                    </div>
                                )}

                                {/* Role */}
                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Role
                                    </label>
                                    <select
                                        id="role"
                                        value={data.role}
                                        onChange={(e) => setData('role', e.target.value)}
                                        className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-primary focus:border-primary"
                                    >
                                        <option value="">Select a role...</option>
                                        {roles.map((role) => (
                                            <option key={role.id} value={role.name}>
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end gap-3 pt-4">
                                    <Link href={route('users.index')}>
                                        <Button type="button" variant="ghost">
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Updating...' : 'Update User'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </TaskSpaceLayout>
    );
}
