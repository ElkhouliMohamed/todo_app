import React from 'react';
import { format } from 'date-fns';
import { router } from '@inertiajs/react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/Components/ui/DropdownMenu';
import { Edit, Trash2, MoreHorizontal } from 'lucide-react';
import Swal from 'sweetalert2';

export default function TaskDetailPane({ task, onClose }) {
    if (!task) return (
        <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
                <span className="material-symbols-outlined text-4xl mb-2">assignment</span>
                <p>Select a task to view details</p>
            </div>
        </div>
    );

    const handleStatusToggle = () => {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';
        router.post(route('tasks.complete', task.id), {}, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const handleDelete = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('tasks.destroy', task.id), {
                    preserveScroll: true,
                    onSuccess: () => onClose(),
                });
            }
        });
    };

    return (
        <div className="w-full h-full flex flex-col bg-white dark:bg-panel-dark overflow-y-auto border-l border-border-dark/50">
            {/* Detail Header */}
            <div className="p-6 border-b border-border-dark/50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={onClose} className="flex items-center justify-center size-8 rounded-lg hover:bg-gray-100 dark:hover:bg-border-dark text-slate-500 lg:hidden">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </button>
                    <button onClick={onClose} className="hidden lg:flex items-center justify-center size-8 rounded-lg hover:bg-gray-100 dark:hover:bg-border-dark text-slate-500">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Task Details</span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-dark text-xs font-bold hover:bg-gray-100 dark:hover:bg-border-dark transition-colors">
                        <span className="material-symbols-outlined text-base">share</span> Share
                    </button>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center justify-center size-8 rounded-lg hover:bg-gray-100 dark:hover:bg-border-dark text-slate-500 transition-colors">
                            <MoreHorizontal className="h-5 w-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.get(route('tasks.edit', task.id))}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit Task</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete Task</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Detail Content */}
            <div className="p-8 flex-1">
                <div className="flex items-start gap-4 mb-8">
                    <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        onChange={handleStatusToggle}
                        className="task-checkbox mt-1 h-6 w-6 rounded-md border-primary/30 border-2 bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:outline-none cursor-pointer"
                    />
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold leading-tight mb-2 outline-none" contentEditable suppressContentEditableWarning={true}>{task.title}</h2>
                        <p className="text-sm text-slate-500">Created {task.created_at ? format(new Date(task.created_at), 'PPP p') : 'recently'} <span className="text-primary font-semibold"></span></p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-y-6 gap-x-12 mb-10">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Assignee</label>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-background-dark/50 border border-border-dark cursor-pointer hover:border-primary/50 transition-colors">
                            <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-primary">ME</span>
                            </div>
                            <span className="text-sm font-medium">Me</span>
                            <span className="material-symbols-outlined text-sm ml-auto text-slate-400">expand_more</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Due Date</label>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-background-dark/50 border border-border-dark cursor-pointer hover:border-primary/50 transition-colors">
                            <span className="material-symbols-outlined text-primary text-lg">calendar_today</span>
                            <span className="text-sm font-medium">{task.due_date ? format(new Date(task.due_date), 'MMM d, h:mm a') : 'No Due Date'}</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Priority</label>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-background-dark/50 border border-border-dark cursor-pointer hover:border-primary/50 transition-colors">
                            <div className={`size-2 rounded-full 
                                ${task.priority === 'High' ? 'bg-rose-500' :
                                    task.priority === 'Medium' ? 'bg-amber-500' : 'bg-blue-500'}
                            `}></div>
                            <span className={`text-sm font-medium
                                 ${task.priority === 'High' ? 'text-rose-500' :
                                    task.priority === 'Medium' ? 'text-amber-500' : 'text-blue-500'}
                            `}>{task.priority || 'Low'} Priority</span>
                            <span className="material-symbols-outlined text-sm ml-auto text-slate-400">expand_more</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        {/* Placeholder for Project/Category */}
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Project</label>
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-background-dark/50 border border-border-dark cursor-pointer hover:border-primary/50 transition-colors">
                            <div className="size-2 rounded-full bg-purple-500"></div>
                            <span className="text-sm font-medium">General</span>
                            <span className="material-symbols-outlined text-sm ml-auto text-slate-400">expand_more</span>
                        </div>
                    </div>
                </div>

                <div className="mb-10">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3 block">Description</label>
                    <div className="min-h-[120px] p-4 rounded-xl bg-gray-50 dark:bg-background-dark/50 border border-border-dark text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {task.description || <span className="text-slate-400 italic">No description provided. Click to add details...</span>}
                    </div>
                </div>

                {/* Subtasks Placeholder */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Subtasks</label>
                        <button className="text-xs font-bold text-primary hover:underline">Add subtask</button>
                    </div>
                    <div className="text-sm text-slate-400 italic">Subtasks functionality coming soon...</div>
                </div>
            </div>

            {/* Detail Footer / Comments */}
            <div className="mt-auto p-6 border-t border-border-dark/50 bg-gray-50 dark:bg-panel-dark">
                <div className="flex gap-4">
                    <div className="size-8 rounded-full bg-slate-200 dark:bg-border-dark flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold">ME</span>
                    </div>
                    <div className="flex-1 relative">
                        <input className="w-full h-10 px-4 py-2 rounded-lg border border-border-dark bg-white dark:bg-background-dark text-sm placeholder:text-slate-500 focus:ring-1 focus:ring-primary focus:outline-none" placeholder="Add a comment or attachment..." type="text" />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400">
                            <button className="p-1 hover:text-primary"><span className="material-symbols-outlined text-lg">attach_file</span></button>
                            <button className="p-1 hover:text-primary"><span className="material-symbols-outlined text-lg">mood</span></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
