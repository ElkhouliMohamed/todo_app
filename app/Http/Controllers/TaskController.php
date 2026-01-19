<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Task::with(['recurringTask', 'reminders'])
            ->where('user_id', auth()->id());

        // Apply filters
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        if ($request->has('date_from')) {
            $query->whereDate('due_date', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('due_date', '<=', $request->date_to);
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Sort
        $sortBy = $request->get('sort_by', 'due_date');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 20);
        $tasks = $query->paginate($perPage)->withQueryString();

        // Get statistics
        $stats = [
            'total' => Task::where('user_id', auth()->id())->count(),
            'pending' => Task::where('user_id', auth()->id())->pending()->count(),
            'completed' => Task::where('user_id', auth()->id())->completed()->count(),
            'overdue' => Task::where('user_id', auth()->id())->overdue()->count(),
        ];

        return Inertia::render('Tasks/Index', [
            'tasks' => $tasks,
            'stats' => $stats,
            'filters' => $request->only(['status', 'priority', 'date_from', 'date_to', 'search', 'sort_by', 'sort_order']),
        ]);
    }

    /**
     * Display the calendar view.
     */
    public function calendar(Request $request)
    {
        // Get all tasks with due dates for the calendar
        // We can optimize this later to only fetch tasks for the current month view if needed
        $tasks = Task::where('user_id', auth()->id())
            ->whereNotNull('due_date')
            ->get();

        return Inertia::render('Tasks/Calendar', [
            'tasks' => $tasks
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Tasks/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        // Handle Recurring Task creation
        $recurringTaskId = $request->recurring_task_id;

        if ($request->boolean('is_recurring')) {
            $recurringTask = \App\Models\RecurringTask::create([
                'user_id' => auth()->id(),
                'title' => $request->title,
                'description' => $request->description,
                'priority' => $request->priority,
                'tags' => $request->tags,
                'color' => $request->color,
                'recurrence_type' => $request->recurrence_type,
                'recurrence_interval' => $request->recurrence_interval,
                'recurrence_days' => $request->recurrence_days,
                'recurrence_day_of_month' => $request->recurrence_day_of_month,
                'end_type' => $request->end_type,
                'end_date' => $request->end_date,
                'end_after_occurrences' => $request->end_after_occurrences,
                'start_date' => $request->due_date ?? now(),
                'is_all_day' => $request->boolean('is_all_day'),
                'is_active' => true,
                'occurrences_created' => 1, // The initial task counts as one
                'last_generated_date' => $request->due_date ?? now(),
            ]);
            $recurringTaskId = $recurringTask->id;

            // Generate future instances immediately
            $service = app(\App\Services\RecurringTaskService::class);
            $service->generateTasksForRecurringTask($recurringTask);
        }

        $task = Task::create([
            'user_id' => auth()->id(),
            'title' => $request->title,
            'description' => $request->description,
            'due_date' => $request->due_date,
            'due_time' => $request->due_time,
            'is_all_day' => $request->boolean('is_all_day'),
            'priority' => $request->priority,
            'status' => $request->get('status', 'pending'),
            'tags' => $request->tags,
            'color' => $request->color,
            'recurring_task_id' => $recurringTaskId,
        ]);

        if ($request->has('reminders')) {
            foreach ($request->reminders as $reminder) {
                // Calculate remind_at based on due_date and minutes_before
                // Assuming due_date includes time or we default to 9AM if not? 
                // For now, assume due_date is a full Carbon object
                $dueDate = \Carbon\Carbon::parse($request->due_date);
                if ($request->due_time) {
                    $time = \Carbon\Carbon::parse($request->due_time);
                    $dueDate->setTime($time->hour, $time->minute);
                }

                $remindAt = $dueDate->copy()->subMinutes($reminder['minutes_before']);

                $task->reminders()->create([
                    'user_id' => auth()->id(),
                    'remind_at' => $remindAt,
                    'minutes_before' => $reminder['minutes_before'],
                    // Default to true for now as UI doesn't allow granular control yet
                    'send_email' => true,
                    'send_browser' => true,
                ]);
            }
        }

        return redirect()->route('tasks.index')
            ->with('success', 'Task created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        Gate::authorize('view', $task);

        $task->load(['recurringTask', 'reminders', 'notifications']);

        return Inertia::render('Tasks/Show', [
            'task' => $task,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        Gate::authorize('update', $task);

        $task->load('reminders');

        return Inertia::render('Tasks/Edit', [
            'task' => $task,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        Gate::authorize('update', $task);

        $task->update($request->validated());

        // Update Reminders
        if ($request->has('reminders')) {
            // Simple strategy: Delete pending reminders and recreate
            // This avoids complex diffing for now
            $task->reminders()->pending()->delete();

            foreach ($request->reminders as $reminder) {
                $dueDate = $task->due_date; // Model casts should have handled this
                if ($task->due_time) {
                    // If due_time is a string, parse it. If casted, use it.
                    // The migration has due_time as 'time' column, often cast as string or Carbon depending on accessor
                    // Let's assume standard behavior or parse explicitely
                    $time = \Carbon\Carbon::parse($task->due_time);
                    $dueDate->setTime($time->hour, $time->minute);
                }

                $remindAt = $dueDate->copy()->subMinutes($reminder['minutes_before']);

                $task->reminders()->create([
                    'user_id' => auth()->id(),
                    'remind_at' => $remindAt,
                    'minutes_before' => $reminder['minutes_before'],
                    'send_email' => true,
                    'send_browser' => true,
                ]);
            }
        }

        return back()->with('success', 'Task updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        Gate::authorize('delete', $task);

        if ($task->recurring_task_id) {
            $recurringTask = \App\Models\RecurringTask::find($task->recurring_task_id);
            if ($recurringTask) {
                // Delete all tasks associated with this recurring series
                Task::where('recurring_task_id', $recurringTask->id)->delete();
                // Delete the recurring task definition
                $recurringTask->delete();

                return redirect()->route('tasks.index')
                    ->with('success', 'Recurring task series deleted successfully!');
            }
        }

        $task->delete();

        return redirect()->route('tasks.index')
            ->with('success', 'Task deleted successfully!');
    }

    /**
     * Remove multiple resources from storage.
     */
    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:tasks,id',
        ]);

        $count = 0;
        foreach ($request->ids as $id) {
            $task = Task::find($id);
            if ($task && $task->user_id === auth()->id()) {
                $task->delete();
                $count++;
            }
        }

        return back()->with('success', "$count tasks deleted successfully!");
    }

    /**
     * Mark task as completed
     */
    public function complete(Task $task)
    {
        Gate::authorize('update', $task);

        $task->markAsCompleted();

        return back()->with('success', 'Task marked as completed!');
    }

    /**
     * Restore soft-deleted task
     */
    public function restore($id)
    {
        $task = Task::withTrashed()->findOrFail($id);

        Gate::authorize('restore', $task);

        $task->restore();

        return back()->with('success', 'Task restored successfully!');
    }

    /**
     * Reorder tasks
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:tasks,id',
            'items.*.order' => 'required|integer',
        ]);

        foreach ($request->items as $item) {
            Task::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return back();
    }
}
