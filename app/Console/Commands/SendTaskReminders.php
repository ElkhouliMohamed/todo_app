<?php

namespace App\Console\Commands;

use App\Models\Reminder;
use App\Notifications\TaskReminderNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class SendTaskReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-task-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send notifications for due task reminders';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $reminders = Reminder::query()
            ->with(['task', 'user'])
            ->where('remind_at', '<=', now())
            ->where('is_sent', false)
            ->where('is_snoozed', false)
            ->get();

        $this->info("Found {$reminders->count()} reminders due.");

        foreach ($reminders as $reminder) {
            if (!$reminder->task || !$reminder->user) {
                // Orphaned reminder, mark as sent to avoid loop? Or delete?
                // For now, mark as sent to stop processing
                $reminder->markAsSent();
                continue;
            }

            try {
                $reminder->user->notify(new TaskReminderNotification($reminder->task));

                $reminder->markAsSent();

                $this->info("Sent reminder for Task ID: {$reminder->task_id}");
            } catch (\Exception $e) {
                Log::error("Failed to send reminder ID {$reminder->id}: " . $e->getMessage());
                $this->error("Failed to send reminder ID {$reminder->id}");
            }
        }
    }
}
