<?php

namespace App\Services;

use App\Models\RecurringTask;
use App\Models\Task;
use Carbon\Carbon;

class RecurringTaskService
{
    /**
     * Generate tasks for all active recurring tasks
     */
    public function generateTasksForAllRecurringTasks(): int
    {
        $recurringTasks = RecurringTask::active()
            ->dueForGeneration()
            ->get();

        $tasksCreated = 0;

        foreach ($recurringTasks as $recurringTask) {
            $tasksCreated += $this->generateTasksForRecurringTask($recurringTask);
        }

        return $tasksCreated;
    }

    /**
     * Generate tasks for a specific recurring task
     */
    public function generateTasksForRecurringTask(RecurringTask $recurringTask, int $daysAhead = 7): int
    {
        if (!$recurringTask->shouldGenerateTask()) {
            return 0;
        }

        $tasksCreated = 0;
        $currentDate = $recurringTask->last_generated_date
            ? $recurringTask->last_generated_date->copy()->addDay()
            : $recurringTask->start_date->copy();

        $endDate = now()->addDays($daysAhead);

        while ($currentDate->lte($endDate)) {
            // Check if we should generate a task for this date
            if ($this->shouldGenerateTaskForDate($recurringTask, $currentDate)) {
                // Check if task already exists for this date
                $exists = Task::where('recurring_task_id', $recurringTask->id)
                    ->whereDate('due_date', $currentDate)
                    ->exists();

                if (!$exists) {
                    $this->createTaskFromRecurringTask($recurringTask, $currentDate);
                    $tasksCreated++;

                    // Update recurring task
                    $recurringTask->increment('occurrences_created');
                    $recurringTask->update(['last_generated_date' => $currentDate]);

                    // Check if we've reached the end
                    if (!$recurringTask->fresh()->shouldGenerateTask()) {
                        break;
                    }
                }
            }

            // Move to next occurrence
            $currentDate = $this->getNextOccurrenceDate($recurringTask, $currentDate);

            if (!$currentDate) {
                break;
            }
        }

        return $tasksCreated;
    }

    /**
     * Calculate next N occurrences for preview
     */
    public function calculateNextOccurrences(RecurringTask $recurringTask, int $count = 5): array
    {
        $occurrences = [];
        $currentDate = $recurringTask->last_generated_date
            ? $recurringTask->last_generated_date->copy()->addDay()
            : $recurringTask->start_date->copy();

        for ($i = 0; $i < $count; $i++) {
            if (!$this->shouldGenerateTaskForDate($recurringTask, $currentDate)) {
                $currentDate = $this->getNextOccurrenceDate($recurringTask, $currentDate);
                if (!$currentDate)
                    break;
                continue;
            }

            $occurrences[] = $currentDate->copy();
            $currentDate = $this->getNextOccurrenceDate($recurringTask, $currentDate);

            if (!$currentDate) {
                break;
            }
        }

        return $occurrences;
    }

    /**
     * Check if task should be generated for a specific date
     */
    protected function shouldGenerateTaskForDate(RecurringTask $recurringTask, Carbon $date): bool
    {
        // Check if date is before start date
        if ($date->lt($recurringTask->start_date)) {
            return false;
        }

        // Check end conditions
        if (
            $recurringTask->end_type === 'on_date' &&
            $recurringTask->end_date &&
            $date->gt($recurringTask->end_date)
        ) {
            return false;
        }

        if (
            $recurringTask->end_type === 'after_occurrences' &&
            $recurringTask->occurrences_created >= $recurringTask->end_after_occurrences
        ) {
            return false;
        }

        // Check recurrence pattern
        switch ($recurringTask->recurrence_type) {
            case 'daily':
                return $this->matchesDailyPattern($recurringTask, $date);

            case 'weekly':
                return $this->matchesWeeklyPattern($recurringTask, $date);

            case 'monthly':
                return $this->matchesMonthlyPattern($recurringTask, $date);

            default:
                return false;
        }
    }

    /**
     * Check if date matches daily pattern
     */
    protected function matchesDailyPattern(RecurringTask $recurringTask, Carbon $date): bool
    {
        $daysDiff = $recurringTask->start_date->diffInDays($date);
        return $daysDiff % $recurringTask->recurrence_interval === 0;
    }

    /**
     * Check if date matches weekly pattern
     */
    protected function matchesWeeklyPattern(RecurringTask $recurringTask, Carbon $date): bool
    {
        // Check if day of week matches
        if ($recurringTask->recurrence_days && !in_array($date->dayOfWeek, $recurringTask->recurrence_days)) {
            return false;
        }

        // Check interval
        $weeksDiff = $recurringTask->start_date->diffInWeeks($date);
        return $weeksDiff % $recurringTask->recurrence_interval === 0;
    }

    /**
     * Check if date matches monthly pattern
     */
    protected function matchesMonthlyPattern(RecurringTask $recurringTask, Carbon $date): bool
    {
        // Check if day of month matches
        if (
            $recurringTask->recurrence_day_of_month &&
            $date->day !== $recurringTask->recurrence_day_of_month
        ) {
            return false;
        }

        // Check interval
        $monthsDiff = $recurringTask->start_date->diffInMonths($date);
        return $monthsDiff % $recurringTask->recurrence_interval === 0;
    }

    /**
     * Get next occurrence date based on recurrence pattern
     */
    protected function getNextOccurrenceDate(RecurringTask $recurringTask, Carbon $currentDate): ?Carbon
    {
        return match ($recurringTask->recurrence_type) {
            'daily' => $currentDate->copy()->addDays($recurringTask->recurrence_interval),
            'weekly' => $currentDate->copy()->addWeeks($recurringTask->recurrence_interval),
            'monthly' => $currentDate->copy()->addMonths($recurringTask->recurrence_interval),
            default => null,
        };
    }

    /**
     * Create a task instance from recurring task template
     */
    protected function createTaskFromRecurringTask(RecurringTask $recurringTask, Carbon $date): Task
    {
        $dueDateTime = $date->copy();

        if ($recurringTask->recurrence_time && !$recurringTask->is_all_day) {
            $time = Carbon::parse($recurringTask->recurrence_time);
            $dueDateTime->setTime($time->hour, $time->minute);
        }

        return Task::create([
            'user_id' => $recurringTask->user_id,
            'recurring_task_id' => $recurringTask->id,
            'title' => $recurringTask->title,
            'description' => $recurringTask->description,
            'due_date' => $dueDateTime,
            'due_time' => $recurringTask->recurrence_time,
            'is_all_day' => $recurringTask->is_all_day,
            'priority' => $recurringTask->priority,
            'status' => 'pending',
            'tags' => $recurringTask->tags,
            'color' => $recurringTask->color,
        ]);
    }
}
