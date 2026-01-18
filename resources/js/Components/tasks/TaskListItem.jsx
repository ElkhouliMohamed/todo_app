import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format } from 'date-fns';

export default function TaskListItem({ task, isSelected, onClick }) {
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
            <div className="flex size-6 items-center justify-center shrink-0" {...attributes} {...listeners}>
                {/* Drag Handle implicitly on the checkbox area or create a specific handle. For now, entire row is clickable, so maybe handle is specific? 
                     Actually, using the checkbox as "complete" action and row as "select" action. 
                     Let's make the checkbox functional first or just visual. 
                     The design has a checkbox. */}
                <input
                    type="checkbox"
                    readOnly
                    checked={task.status === 'completed'}
                    className={`task-checkbox h-5 w-5 rounded-md border-2 bg-transparent focus:ring-0 focus:outline-none 
                        ${task.status === 'completed' ? 'text-primary checked:bg-primary checked:border-primary' : 'border-slate-300 dark:border-border-dark text-primary'}`}
                />
            </div>
            <div className="flex flex-col flex-1">
                <p className={`text-sm font-semibold leading-tight line-clamp-1 ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                    {task.title}
                </p>
                <div className="flex items-center gap-3 mt-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase
                         ${task.priority === 'high' ? 'bg-rose-500/10 text-rose-500' :
                            task.priority === 'medium' ? 'bg-amber-500/10 text-amber-500' :
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
            {isSelected ? (
                <span className="material-symbols-outlined text-primary">chevron_right</span>
            ) : (
                <span className="material-symbols-outlined text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">more_vert</span>
            )}
        </div>
    );
}
