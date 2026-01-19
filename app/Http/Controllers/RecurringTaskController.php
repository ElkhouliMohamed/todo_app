<?php

namespace App\Http\Controllers;

use App\Models\RecurringTask;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class RecurringTaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $recurringTasks = RecurringTask::where('user_id', auth()->id())
            ->with('tasks')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('RecurringTasks/Index', [
            'recurringTasks' => $recurringTasks,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('RecurringTasks/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high,urgent',
            'tags' => 'nullable|array',
            'color' => 'nullable|string',
            'recurrence_type' => 'required|in:daily,weekly,monthly',
            'recurrence_interval' => 'required|integer|min:1',
            'recurrence_days' => 'nullable|array',
            'recurrence_days.*' => 'integer|min:0|max:6',
            'recurrence_day_of_month' => 'nullable|integer|min:1|max:31',
            'recurrence_time' => 'nullable|date_format:H:i',
            'is_all_day' => 'boolean',
            'start_date' => 'required|date',
            'end_type' => 'required|in:never,after_occurrences,on_date',
            'end_after_occurrences' => 'nullable|required_if:end_type,after_occurrences|integer|min:1',
            'end_date' => 'nullable|required_if:end_type,on_date|date|after:start_date',
        ]);

        $recurringTask = RecurringTask::create([
            'user_id' => auth()->id(),
            ...$validated,
            'is_active' => true,
            'occurrences_created' => 0,
        ]);

        return redirect()->route('recurring-tasks.index')
            ->with('success', 'Recurring task created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(RecurringTask $recurringTask)
    {
        Gate::authorize('view', $recurringTask);

        $recurringTask->load('tasks');

        return Inertia::render('RecurringTasks/Show', [
            'recurringTask' => $recurringTask,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RecurringTask $recurringTask)
    {
        Gate::authorize('update', $recurringTask);

        return Inertia::render('RecurringTasks/Edit', [
            'recurringTask' => $recurringTask,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, RecurringTask $recurringTask)
    {
        Gate::authorize('update', $recurringTask);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high,urgent',
            'tags' => 'nullable|array',
            'color' => 'nullable|string',
            'recurrence_type' => 'required|in:daily,weekly,monthly',
            'recurrence_interval' => 'required|integer|min:1',
            'recurrence_days' => 'nullable|array',
            'recurrence_days.*' => 'integer|min:0|max:6',
            'recurrence_day_of_month' => 'nullable|integer|min:1|max:31',
            'recurrence_time' => 'nullable|date_format:H:i',
            'is_all_day' => 'boolean',
            'start_date' => 'required|date',
            'end_type' => 'required|in:never,after_occurrences,on_date',
            'end_after_occurrences' => 'nullable|required_if:end_type,after_occurrences|integer|min:1',
            'end_date' => 'nullable|required_if:end_type,on_date|date|after:start_date',
        ]);

        $recurringTask->update($validated);

        return back()->with('success', 'Recurring task updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RecurringTask $recurringTask)
    {
        Gate::authorize('delete', $recurringTask);

        $recurringTask->delete();

        return redirect()->route('recurring-tasks.index')
            ->with('success', 'Recurring task deleted successfully!');
    }

    /**
     * Toggle active status of recurring task
     */
    public function toggleActive(RecurringTask $recurringTask)
    {
        Gate::authorize('update', $recurringTask);

        $recurringTask->update([
            'is_active' => !$recurringTask->is_active,
        ]);

        $status = $recurringTask->is_active ? 'activated' : 'paused';

        return back()->with('success', "Recurring task {$status} successfully!");
    }
}
