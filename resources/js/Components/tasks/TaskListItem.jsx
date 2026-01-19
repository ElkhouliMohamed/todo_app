import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

export default function TaskListItem({ task, isSelected, onClick, isMultiSelected, onToggleMultiSelect }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleStatusToggle = (e) => {
        e.stopPropagation();
        const newStatus = task.status === 'completed' ? 'pending' : 'completed';

        // Optimistic update could be done here if we had the setter passed down, 
        // but for now we rely on Inertia reload
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
                });
            }
        });
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            onClick={() => onClick(task)}
            className={`group flex items-center gap-4 px-4 min-h-[64px] rounded-xl border border-transparent cursor-pointer transition-all
                ${isSelected
                    ? 'bg-primary/5 dark:bg-primary/10 border-primary/30'
                    : 'bg-white dark:bg-panel-dark hover:bg-slate-50 dark:hover:bg-border-dark hover:border-border-dark'
                }`}
        >
            {/* Multi-Select Checkbox */}
            <div className="flex items-center justify-center shrink-0" onPointerDown={(e) => e.stopPropagation()}>
                <input
                    type="checkbox"
                    checked={isMultiSelected || false}
                    onChange={(e) => {
                        e.stopPropagation();
                        onToggleMultiSelect(task.id);
                    }}
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer"
                />
            </div>

            <div className="flex size-6 items-center justify-center shrink-0" {...attributes} {...listeners}>
                <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={handleStatusToggle}
                    // Prevent drag start when clicking checkbox
                    onPointerDown={(e) => e.stopPropagation()}
                    className={`task-checkbox h-5 w-5 rounded-md border-2 bg-transparent focus:ring-0 focus:outline-none cursor-pointer
                        ${task.status === 'completed' ? 'text-primary checked:bg-primary checked:border-primary' : 'border-slate-300 dark:border-border-dark text-primary'}`}
                />
            </div>
            <div className="flex flex-col flex-1">
                <p className={`text-sm font-semibold leading-tight line-clamp-1 ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                    {task.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase
                         ${task.priority === 'High' ? 'bg-rose-500/10 text-rose-500' :
                            task.priority === 'Medium' ? 'bg-amber-500/10 text-amber-500' :
                                'bg-blue-500/10 text-blue-500'}
                    `}>
                        {task.priority || 'Low'}
                    </span>
                    {task.due_date && (
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">calendar_month</span> {format(new Date(task.due_date), 'MMM d')}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-center group-hover:opacity-100 opacity-0 transition-opacity" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu as="div" className="relative">
                    <DropdownMenuTrigger className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        {/* Use Lucide icon or keep existing material symbol if preferred, but switching to Dropdown requires a Trigger */}
                        <span className="material-symbols-outlined">more_vert</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.get(route('tasks.edit', task.id))}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}
