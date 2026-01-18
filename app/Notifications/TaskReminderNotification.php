<?php

namespace App\Notifications;

use App\Models\Task;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskReminderNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Task $task
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $url = route('tasks.show', $this->task);

        return (new MailMessage)
            ->subject('Reminder: ' . $this->task->title)
            ->line('This is a reminder for your task.')
            ->line('Task: ' . $this->task->title)
            ->line('Due: ' . $this->task->due_date?->format('F j, Y g:i A'))
            ->action('View Task', $url)
            ->line('Thank you for using our application!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'task_id' => $this->task->id,
            'title' => 'Reminder: ' . $this->task->title,
            'message' => 'You have a task due soon: ' . $this->task->title,
            'url' => route('tasks.show', $this->task),
            'type' => 'reminder',
        ];
    }
}
