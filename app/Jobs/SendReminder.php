<?php

namespace App\Jobs;

use App\Models\Reminder;
use App\Models\TaskNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendReminder implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Reminder $reminder
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Skip if already sent
        if ($this->reminder->is_sent) {
            return;
        }

        // Skip if snoozed
        if ($this->reminder->is_snoozed && $this->reminder->snoozed_until > now()) {
            return;
        }

        $task = $this->reminder->task;
        $user = $this->reminder->user;

        // Create notification record
        $notification = TaskNotification::create([
            'user_id' => $user->id,
            'task_id' => $task->id,
            'reminder_id' => $this->reminder->id,
            'type' => 'reminder',
            'channel' => $this->getChannel(),
            'title' => 'Task Reminder: ' . $task->title,
            'message' => $this->buildMessage($task),
            'sent_at' => now(),
        ]);

        // Send email if enabled
        if ($this->reminder->send_email) {
            try {
                // TODO: Implement email sending
                // Mail::to($user->email)->send(new TaskReminderMail($task, $this->reminder));
                Log::info("Email reminder sent for task: {$task->title}");
            } catch (\Exception $e) {
                Log::error("Failed to send email reminder: " . $e->getMessage());
            }
        }

        // Send browser notification if enabled
        if ($this->reminder->send_browser) {
            try {
                // TODO: Implement browser notification (Pusher, WebSockets, etc.)
                Log::info("Browser notification sent for task: {$task->title}");
            } catch (\Exception $e) {
                Log::error("Failed to send browser notification: " . $e->getMessage());
            }
        }

        // Mark reminder as sent
        $this->reminder->markAsSent();

        Log::info("Reminder sent successfully for task: {$task->title}");
    }

    /**
     * Get notification channel
     */
    protected function getChannel(): string
    {
        if ($this->reminder->send_email && $this->reminder->send_browser) {
            return 'both';
        }

        return $this->reminder->send_email ? 'email' : 'browser';
    }

    /**
     * Build reminder message
     */
    protected function buildMessage($task): string
    {
        $message = "Your task '{$task->title}' is due ";

        if ($task->due_date) {
            $dueDate = $task->due_date;

            if ($dueDate->isToday()) {
                $message .= 'today';
            } elseif ($dueDate->isTomorrow()) {
                $message .= 'tomorrow';
            } else {
                $message .= 'on ' . $dueDate->format('M d, Y');
            }

            if ($task->due_time && !$task->is_all_day) {
                $message .= ' at ' . $task->due_time;
            }
        }

        return $message;
    }
}
