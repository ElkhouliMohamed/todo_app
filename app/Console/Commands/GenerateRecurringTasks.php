<?php

namespace App\Console\Commands;

use App\Models\RecurringTask;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Console\Command;

class GenerateRecurringTasks extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'generate:recurring-tasks {--dry-run : Run without creating tasks}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate task instances from active recurring task templates';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $dryRun = $this->option('dry-run');

        if ($dryRun) {
            $this->info('Running in DRY RUN mode - no tasks will be created');
        }

        $recurringTasks = RecurringTask::active()
            ->where(function ($query) {
                $query->whereNull('last_generated_date')
                    ->orWhere('last_generated_date', '<', today());
            })
            ->get();

        $this->info("Found {$recurringTasks->count()} recurring tasks to process");

        $tasksCreated = 0;

        foreach ($recurringTasks as $recurringTask) {
            if (!$recurringTask->shouldGenerateTask()) {
                $this->warn("Skipping recurring task #{$recurringTask->id} - end condition met");
                continue;
            }

            $nextDate = $this->calculateNextOccurrence($recurringTask);

            if (!$nextDate) {
                $this->warn("Could not calculate next occurrence for recurring task #{$recurringTask->id}");
                continue;
            }

            // Only generate if the next occurrence is today or in the past
            if ($nextDate->isAfter(today())) {
                continue;
            }

            $this->info("Generating task for recurring task #{$recurringTask->id} with due date {$nextDate->toDateString()}");

            if (!$dryRun) {
                $task = Task::create([
                    'user_id' => $recurringTask->user_id,
                    'recurring_task_id' => $recurringTask->id,
                    'title' => $recurringTask->title,
                    'description' => $recurringTask->description,
                    'due_date' => $nextDate,
                    'due_time' => $recurringTask->recurrence_time,
                    'is_all_day' => $recurringTask->is_all_day,
                    'priority' => $recurringTask->priority,
                    'status' => 'pending',
                    'tags' => $recurringTask->tags,
                    'color' => $recurringTask->color,
                ]);

                $recurringTask->update([
                    'last_generated_date' => $nextDate,
                    'occurrences_created' => $recurringTask->occurrences_created + 1,
                ]);

                $tasksCreated++;
            }
        }

        $this->info("Successfully created {$tasksCreated} tasks");

        return Command::SUCCESS;
    }

    /**
     * Calculate the next occurrence date for a recurring task
     */
    private function calculateNextOccurrence(RecurringTask $recurringTask): ?Carbon
    {
        $baseDate = $recurringTask->last_generated_date
            ? Carbon::parse($recurringTask->last_generated_date)
            : Carbon::parse($recurringTask->start_date);

        $interval = $recurringTask->recurrence_interval ?? 1;

        return match ($recurringTask->recurrence_type) {
            'daily' => $baseDate->copy()->addDays($interval),
            'weekly' => $this->calculateWeeklyOccurrence($baseDate, $recurringTask),
            'monthly' => $this->calculateMonthlyOccurrence($baseDate, $recurringTask),
            default => null,
        };
    }

    /**
     * Calculate next weekly occurrence
     */
    private function calculateWeeklyOccurrence(Carbon $baseDate, RecurringTask $recurringTask): Carbon
    {
        $interval = $recurringTask->recurrence_interval ?? 1;
        $days = $recurringTask->recurrence_days ?? [1]; // Default to Monday

        // If no last generated date, start from start_date
        if (!$recurringTask->last_generated_date) {
            $startDate = Carbon::parse($recurringTask->start_date);

            // Find the first matching day
            foreach ($days as $dayOfWeek) {
                $nextDate = $startDate->copy()->next($this->getDayName($dayOfWeek));
                if ($nextDate->isSameDay($startDate)) {
                    return $startDate;
                }
            }

            return $startDate->copy()->next($this->getDayName($days[0]));
        }

        // Find next occurrence after base date
        $currentDayOfWeek = $baseDate->dayOfWeek;
        $nextDay = null;

        // Look for next day in the same week
        foreach ($days as $day) {
            if ($day > $currentDayOfWeek) {
                $nextDay = $day;
                break;
            }
        }

        if ($nextDay !== null) {
            return $baseDate->copy()->next($this->getDayName($nextDay));
        }

        // No more days this week, move to next interval and use first day
        return $baseDate->copy()
            ->addWeeks($interval)
            ->next($this->getDayName($days[0]));
    }

    /**
     * Calculate next monthly occurrence
     */
    private function calculateMonthlyOccurrence(Carbon $baseDate, RecurringTask $recurringTask): Carbon
    {
        $interval = $recurringTask->recurrence_interval ?? 1;
        $dayOfMonth = $recurringTask->recurrence_day_of_month ?? 1;

        $nextDate = $baseDate->copy()->addMonths($interval);

        // Handle months with fewer days (e.g., Feb 30 -> Feb 28/29)
        $daysInMonth = $nextDate->daysInMonth;
        $day = min($dayOfMonth, $daysInMonth);

        $nextDate->day = $day;

        return $nextDate;
    }

    /**
     * Get day name from day number (0 = Sunday, 1 = Monday, etc.)
     */
    private function getDayName(int $day): string
    {
        return match ($day) {
            0 => 'Sunday',
            1 => 'Monday',
            2 => 'Tuesday',
            3 => 'Wednesday',
            4 => 'Thursday',
            5 => 'Friday',
            6 => 'Saturday',
            default => 'Monday',
        };
    }
}
