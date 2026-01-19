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
import Swal from 'sweetalert2';

export default function Index({ auth, tasks, stats, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [status, setStatus] = useState(filters?.status || 'all');
    const [taskList, setTaskList] = useState(tasks?.data || []);
    const [activeId, setActiveId] = useState(null);
    const [viewMode, setViewMode] = useState(filters?.view || 'monthly'); // 'list', 'board', 'calendar', 'monthly'
    const [selectedTask, setSelectedTask] = useState(null);

    // Multi-select state
    const [selectedTaskIds, setSelectedTaskIds] = useState([]);

    // Initialize date from filters or default to today
    const [selectedMonth, setSelectedMonth] = useState(() => {
        if (filters?.date_from) return new Date(filters.date_from).getMonth();
        return new Date().getMonth();
    });
    const [selectedYear, setSelectedYear] = useState(() => {
        if (filters?.date_from) return new Date(filters.date_from).getFullYear();
        return new Date().getFullYear();
    });

    useEffect(() => {
        setTaskList(tasks?.data || []);
        // Clear selection when tasks (page) changes
        setSelectedTaskIds([]);
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


    const handleToggleMultiSelect = (id) => {
        setSelectedTaskIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter(taskId => taskId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedTaskIds.length === taskList.length && taskList.length > 0) {
            setSelectedTaskIds([]);
        } else {
            setSelectedTaskIds(taskList.map(t => t.id));
        }
    };

    const handleBulkDelete = () => {
        Swal.fire({
            title: `Delete ${selectedTaskIds.length} tasks?`,
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete them!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.post(route('tasks.bulk-destroy'), { ids: selectedTaskIds }, {
                    preserveScroll: true,
                    onSuccess: () => {
                        setSelectedTaskIds([]);
                        Swal.fire(
                            'Deleted!',
                            'Your files have been deleted.',
                            'success'
                        );
                    }
                });
            }
        });
    };


    // Filter Logic (Debounced search ideally, but keeping simple for now)
    const handleSearch = (e) => {
        setSearch(e.target.value);
        if (e.key === 'Enter') {
            router.get(route('tasks.index'), { search: e.target.value, status, view: viewMode }, { preserveState: true, preserveScroll: true });
        }
    };

    // We rely on server side filtering for monthly view now

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const updateMonth = (newMonth, newYear) => {
        setSelectedMonth(newMonth);
        setSelectedYear(newYear);

        // Calculate date range for the new month
        // We need 1st day of month to Last day of month
        // Format YYYY-MM-DD
        const formatDate = (d) => {
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        const startDate = new Date(newYear, newMonth, 1);
        const endDate = new Date(newYear, newMonth + 1, 0);

        router.get(route('tasks.index'), {
            ...filters,
            date_from: formatDate(startDate),
            date_to: formatDate(endDate),
            view: viewMode,
            per_page: 100
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handlePrevMonth = () => {
        let newMonth = selectedMonth - 1;
        let newYear = selectedYear;
        if (newMonth < 0) {
            newMonth = 11;
            newYear -= 1;
        }
        updateMonth(newMonth, newYear);
    };

    const handleNextMonth = () => {
        let newMonth = selectedMonth + 1;
        let newYear = selectedYear;
        if (newMonth > 11) {
            newMonth = 0;
            newYear += 1;
        }
        updateMonth(newMonth, newYear);
    };


    // Group tasks for list view (Overdue, Today, Upcoming) - Simplified for now to just one list
    // The provided design shows specific grouping. We can implement that if we have date logic.
    // For now, simple list.

    useEffect(() => {
        // If in monthly view but no date filters are active (initial load), apply them
        if (viewMode === 'monthly' && !filters?.date_from) {
            const now = new Date();
            // Use updateMonth logic but we need to ensure updateMonth is stable or defined
            // Since updateMonth depends on state, we might trigger it here
            updateMonth(now.getMonth(), now.getFullYear());
        }
    }, []); // Run once on mount

    return (
        <TaskSpaceLayout>
            <Head title="Tasks" />

            {/* Split View Container - Full height, no outer scroll */}
            <div className={`flex flex-1 overflow-hidden h-full ${viewMode === 'board' ? 'flex-col' : ''}`}>

                {/* LEFT PANE: Task List / Board Wrapper */}
                <div className={`${viewMode === 'list' ? 'w-full lg:w-1/2 flex flex-col border-r border-border-dark bg-background-light dark:bg-background-dark min-w-[320px]' : 'w-full flex-col flex overflow-hidden'}`}>

                    {/* Header / Filters */}
                    <div className="p-4 sm:p-6 shrink-0 flex flex-col gap-3 sm:gap-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark z-10">

                        {/* Contextual Header when items selected */}
                        {selectedTaskIds.length > 0 ? (
                            <div className="flex items-center justify-between bg-primary/10 -m-2 p-2 rounded-lg border border-primary/20">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={selectedTaskIds.length === taskList.length && taskList.length > 0}
                                        onChange={handleSelectAll}
                                        className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer ml-2"
                                    />
                                    <span className="font-semibold text-primary">{selectedTaskIds.length} Selected</span>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="sm" onClick={() => setSelectedTaskIds([])} className="text-slate-500 hover:text-slate-700">
                                        Cancel
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                                        <span className="material-symbols-outlined text-sm mr-1">delete</span>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Tasks</h1>
                                <div className="flex h-9 items-center justify-center rounded-lg bg-gray-200 dark:bg-border-dark p-1 overflow-x-auto">
                                    <button onClick={() => setViewMode('list')} className={`flex cursor-pointer px-2 sm:px-3 py-1 items-center justify-center rounded-md text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${viewMode === 'list' ? 'bg-white dark:bg-background-dark shadow-sm text-primary dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}>List</button>
                                    <button onClick={() => setViewMode('monthly')} className={`flex cursor-pointer px-2 sm:px-3 py-1 items-center justify-center rounded-md text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${viewMode === 'monthly' ? 'bg-white dark:bg-background-dark shadow-sm text-primary dark:text-white' : 'text-slate-500 hover:text-slate-700'}`}>Monthly</button>
                                    <Link
                                        href={route('tasks.calendar')}
                                        className={`flex cursor-pointer px-2 sm:px-3 py-1 items-center justify-center rounded-md text-xs font-semibold uppercase tracking-wider transition-all text-slate-500 hover:text-slate-700 whitespace-nowrap`}
                                    >
                                        Calendar
                                    </Link>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
                            <div className="relative flex-1">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                                <input
                                    className="w-full h-9 pl-10 pr-3 rounded-lg border-none bg-gray-100 dark:bg-gray-800 text-sm placeholder:text-slate-500 focus:ring-1 focus:ring-primary"
                                    placeholder="Search tasks..."
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    onKeyDown={handleSearch}
                                />
                            </div>
                            <Link href={route('tasks.create')} className="shrink-0">
                                <Button className="shadow-lg shadow-primary/20 w-full sm:w-auto">
                                    <span className="material-symbols-outlined text-lg mr-2">add</span>
                                    <span>New Task</span>
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
                                                    isMultiSelected={selectedTaskIds.includes(task.id)}
                                                    onToggleMultiSelect={handleToggleMultiSelect}
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
                                                isMultiSelected={selectedTaskIds.includes(activeId)}
                                                onToggleMultiSelect={() => { }}
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

                        {viewMode === 'monthly' && (
                            <div className="h-full w-full flex flex-col">
                                {/* Month Selector */}
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-background-dark">
                                    <button
                                        onClick={handlePrevMonth}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                    >
                                        <span className="material-symbols-outlined">chevron_left</span>
                                    </button>
                                    <h2 className="text-xl font-bold">
                                        {monthNames[selectedMonth]} {selectedYear}
                                    </h2>
                                    <button
                                        onClick={handleNextMonth}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                    >
                                        <span className="material-symbols-outlined">chevron_right</span>
                                    </button>
                                </div>
                                {/* Monthly Board View */}
                                <div className="flex-1 p-4 overflow-x-auto">
                                    <BoardView tasks={taskList} />
                                </div>
                            </div>
                        )}


                    </div>
                </div>

                {/* RIGHT PANE: Details (Only visible in List mode) */}
                {viewMode === 'list' && (
                    <div className={`fixed inset-0 lg:static lg:flex lg:w-1/2 flex-col bg-white dark:bg-panel-dark z-30 transition-transform duration-300 ease-in-out ${selectedTask ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}`}>
                        <TaskDetailPane task={selectedTask} onClose={() => setSelectedTask(null)} />
                    </div>
                )}
            </div>
        </TaskSpaceLayout>
    );
}
