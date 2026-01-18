import React, { useState, useEffect } from 'react';
import {
    DndContext,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    useDroppable,
    defaultDropAnimationSideEffects,
} from '@dnd-kit/core';

function DroppableContainer({ children, id }) {
    const { setNodeRef } = useDroppable({
        id
    });

    return (
        <div ref={setNodeRef} className="h-full w-full">
            {children}
        </div>
    );
}
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import BoardTaskCard from '@/Components/tasks/BoardTaskCard';
import { router } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/Card';

const COLUMNS = [
    { id: 'pending', title: 'To Do' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'completed', title: 'Completed' },
    { id: 'cancelled', title: 'Cancelled' },
];

export default function BoardView({ tasks = [] }) {
    const [items, setItems] = useState({
        pending: [],
        in_progress: [],
        completed: [],
        cancelled: [],
    });
    const [activeId, setActiveId] = useState(null);
    const [startingContainer, setStartingContainer] = useState(null);

    useEffect(() => {
        // ... (keep existing useEffect logic) ...
        // Group tasks by status
        const grouped = {
            pending: [],
            in_progress: [],
            completed: [],
            cancelled: [],
        };

        tasks.forEach(task => {
            if (grouped[task.status]) {
                grouped[task.status].push(task);
            } else {
                // Fallback for unknown status
                grouped.pending.push(task);
            }
        });

        // specific for sorting, if tasks have an 'order' field, sort by it
        Object.keys(grouped).forEach(key => {
            grouped[key].sort((a, b) => (a.order || 0) - (b.order || 0));
        });

        setItems(grouped);
    }, [tasks]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const findContainer = (id) => {
        if (id in items) {
            return id;
        }

        // Handle case where id is collision with the column droppable itself
        if (COLUMNS.map(c => c.id).includes(id)) {
            return id;
        }

        return Object.keys(items).find((key) =>
            items[key].find((item) => item.id === id)
        );
    };

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveId(active.id);
        const container = findContainer(active.id);
        setStartingContainer(container);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        const overId = over?.id;

        if (!overId || active.id === overId) {
            return;
        }

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(overId);

        if (
            !activeContainer ||
            !overContainer ||
            activeContainer === overContainer
        ) {
            return;
        }

        setItems((prev) => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];
            const activeIndex = activeItems.findIndex((item) => item.id === active.id);
            const overIndex = overItems.findIndex((item) => item.id === overId);

            let newIndex;

            if (overId in prev) {
                newIndex = overItems.length + 1;
            } else {
                const isBelowOverItem =
                    over &&
                    active.rect.current.translated &&
                    active.rect.current.translated.top >
                    over.rect.top + over.rect.height;

                const modifier = isBelowOverItem ? 1 : 0;

                newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
            }

            return {
                ...prev,
                [activeContainer]: [
                    ...prev[activeContainer].filter((item) => item.id !== active.id),
                ],
                [overContainer]: [
                    ...prev[overContainer].slice(0, newIndex),
                    items[activeContainer][activeIndex],
                    ...prev[overContainer].slice(newIndex, prev[overContainer].length),
                ],
            };
        });
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) {
            setActiveId(null);
            setStartingContainer(null);
            return;
        }

        const activeContainer = startingContainer;
        const overContainer = findContainer(over.id);

        if (
            activeContainer &&
            overContainer &&
            (activeContainer !== overContainer ||
                active.id !== over.id)
        ) {
            // Don't rely on findContainer(active.id) here because items is already updated by DragOver
            // We use the startingContainer we captured at start

            // If container changed, we're updating status
            if (activeContainer !== overContainer) {
                // Optimistic update is already done visually by DragOver/SetItems, 
                // but we need to ensure local state is consistent if dragEnd fires?
                // Actually DragOver handles the move. DragEnd just persists it.
                // However, dnd-kit examples often do final arrayMove in DragEnd if same container.

                // Persist Status Change causes reload usually via Inertia, 
                // but we rely on onSuccess to keep state sync or let Inertia handle it.

                router.patch(route('tasks.update', active.id), {
                    status: overContainer,
                }, {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => console.log('Status updated successfully'),
                    onError: (errors) => console.error('Status update failed:', errors),
                });
            } else {
                // Reordering within same column
                const activeIndex = items[activeContainer].findIndex((item) => item.id === active.id);
                const overIndex = items[overContainer].findIndex((item) => item.id === over.id);

                if (activeIndex !== overIndex) {
                    const newItems = {
                        ...items,
                        [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex),
                    };

                    setItems(newItems);

                    const reorderedItems = newItems[overContainer].map((item, index) => ({
                        id: item.id,
                        order: index,
                    }));

                    router.post(route('tasks.reorder'), { items: reorderedItems }, {
                        preserveScroll: true,
                        preserveState: true,
                    });
                }
            }
        }

        setActiveId(null);
        setStartingContainer(null);
    };

    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    // Helper to find task object for overlay
    const getActiveTask = () => {
        if (!activeId) return null;
        for (const key of Object.keys(items)) {
            const found = items[key].find(t => t.id === activeId);
            if (found) return found;
        }
        return null;
    };

    const activeTask = getActiveTask();

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full items-start overflow-x-auto pb-4">
                {COLUMNS.map((col) => (
                    <div key={col.id} className="flex flex-col h-full min-w-[300px]">
                        {/* Column Header Card */}
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm mb-4 flex items-center justify-between border border-gray-100 dark:border-gray-700/50">
                            <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm">{col.title}</h3>
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                                <span className="sr-only">Add Task</span>
                                <span className="text-lg leading-none block transform -translate-y-[1px]">+</span>
                            </button>
                        </div>

                        {/* Droppable Area */}
                        <div className="flex-1 min-h-[500px]">
                            <DroppableContainer id={col.id}>
                                <SortableContext
                                    id={col.id}
                                    items={items[col.id].map((t) => t.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="space-y-4 pb-4">
                                        {items[col.id].map((task) => (
                                            <BoardTaskCard key={task.id} task={task} />
                                        ))}
                                        {/* Empty state placeholder / drop target indicator */}
                                        {items[col.id].length === 0 && (
                                            <div className="h-24 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                                                Drop task here
                                            </div>
                                        )}
                                    </div>
                                </SortableContext>
                            </DroppableContainer>
                        </div>
                    </div>
                ))}
            </div>

            <DragOverlay dropAnimation={dropAnimation}>
                {activeTask ? <BoardTaskCard task={activeTask} /> : null}
            </DragOverlay>
        </DndContext>
    );
}
