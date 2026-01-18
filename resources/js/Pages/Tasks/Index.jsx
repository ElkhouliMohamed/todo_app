import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import TaskSpaceLayout from '@/Layouts/TaskSpaceLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import TaskListItem from '@/Components/tasks/TaskListItem';
import TaskDetailPane from '@/Components/tasks/TaskDetailPane';
import BoardView from '@/Pages/Tasks/BoardView';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TaskCard from '@/Components/tasks/TaskCard'; // For DND Overlay

export default function Index({ auth, tasks, stats, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || 'all');
    const [taskList, setTaskList] = useState(tasks?.data || []);
    const [activeId, setActiveId] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list', 'board', 'calendar'
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        setTaskList(tasks?.data || []);
    }, [tasks]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setTaskList((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                // Send update to backend
                const reorderedItems = newItems.map((item, index) => ({
                    id: item.id,
                    order: index,
                }));
                // Debounce or send immediately? Sending immediately for now but ideally debounce
                router.post(route('tasks.reorder'), { items: reorderedItems }, {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => console.log('Order saved')
                });

                return newItems;
            });
        }
        setActiveId(null);
    };

    // Filter Logic (Debounced search ideally, but keeping simple for now)
    const handleSearch = (e) => {
        setSearch(e.target.value);
        if (e.key === 'Enter') {
            router.get(route('tasks.index'), { search: e.target.value, status }, { preserveState: true, preserveScroll: true });
        }
    };

    // Group tasks for list view (Overdue, Today, Upcoming) - Simplified for now to just one list
    // The provided design shows specific grouping. We can implement that if we have date logic.
    // For now, simple list.

    return (
        <TaskSpaceLayout>
            <Head title="Tasks" />

            {/* Split View Container - Full height, no outer scroll */}
            <div className={`flex flex-1 overflow-hidden h-full ${viewMode === 'board' ? 'flex-col' : ''}`}>

                {/* LEFT PANE: Task List / Board Wrapper */}
                <div className={`${viewMode === 'list' ? 'w-full lg:w-1/2 flex flex-col border-r border-border-dark bg-background-light dark:bg-background-dark min-w-[320px]' : 'w-full flex-col flex overflow-hidden'}`}>

                    {/* Header / Filters */}
                    <div className="p-6 shrink-0 flex flex-col gap-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark z-10">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
                            <div className="flex h-9 items-center justify-center rounded-lg bg-gray-200 dark:bg-border-dark p-1">
                                <button onClick={() => setViewMode('list')} className={`flex cursor-pointer px-3 py-1 items-center justify-center rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${viewMode === 'list' ? 'bg-white dark:bg-background-dark shadow-sm text-primary dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}>List</button>
                                <button onClick={() => setViewMode('board')} className={`flex cursor-pointer px-3 py-1 items-center justify-center rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${viewMode === 'board' ? 'bg-white dark:bg-background-dark shadow-sm text-primary dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}>Board</button>
                                <Link
                                    href={route('tasks.calendar')}
                                    className={`flex cursor-pointer px-3 py-1 items-center justify-center rounded-md text-xs font-semibold uppercase tracking-wider transition-all text-slate-500 hover:text-slate-700`}
                                >
                                    Calendar
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                                <input
                                    className="w-full h-9 pl-10 rounded-lg border-none bg-gray-100 dark:bg-gray-800 text-sm placeholder:text-slate-500 focus:ring-1 focus:ring-primary"
                                    placeholder="Search tasks..."
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={handleSearch}
                                />
                            </div>
                            <Link href={route('tasks.create')}>
                                <Button className="shadow-lg shadow-primary/20">
                                    <span className="material-symbols-outlined text-lg mr-2">add</span>
                                    <span className="hidden sm:inline">New Task</span>
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark relative">
                        {viewMode === 'list' && (
                            <div className="px-4 py-6 space-y-2">
                                {/* DND Context */}
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragStart={handleDragStart}
                                    onDragEnd={handleDragEnd}
                                >
                                    <SortableContext
                                        items={taskList.map(t => t.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        {taskList.length > 0 ? (
                                            taskList.map((task) => (
                                                <TaskListItem
                                                    key={task.id}
                                                    task={task}
                                                    isSelected={selectedTask?.id === task.id}
                                                    onClick={setSelectedTask}
                                                />
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-slate-500">
                                                No tasks found.
                                            </div>
                                        )}
                                    </SortableContext>
                                    <DragOverlay>
                                        {activeId ? (
                                            <TaskListItem
                                                task={taskList.find(t => t.id === activeId)}
                                                isSelected={true}
                                                onClick={() => { }}
                                            />
                                        ) : null}
                                    </DragOverlay>
                                </DndContext>
                            </div>
                        )}

                        {viewMode === 'board' && (
                            <div className="h-full w-full p-4 overflow-x-auto">
                                <BoardView tasks={taskList} />
                            </div>
                        )}


                    </div>
                </div>

                {/* RIGHT PANE: Details (Only visible in List mode) */}
                {viewMode === 'list' && (
                    <div className={`fixed inset-0 lg:static lg:flex lg:w-1/2 flex-col bg-white dark:bg-panel-dark z-20 transition-transform duration-300 ease-in-out transform ${selectedTask ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
                        <TaskDetailPane task={selectedTask} onClose={() => setSelectedTask(null)} />
                    </div>
                )}
            </div>
        </TaskSpaceLayout>
    );
}
