<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'recurring_task_id',
        'title',
        'description',
        'due_date',
        'due_time',
        'is_all_day',
        'priority',
        'status',
        'completed_at',
        'completion_percentage',
        'tags',
        'color',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'due_date' => 'datetime',
            'due_time' => 'string', // Ensure this is treated as string (H:i)
            'completed_at' => 'datetime',
            'is_all_day' => 'boolean',
            'tags' => 'array',
            'completion_percentage' => 'integer',
            'order' => 'integer',
        ];
    }

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function recurringTask(): BelongsTo
    {
        return $this->belongsTo(RecurringTask::class);
    }

    public function reminders(): HasMany
    {
        return $this->hasMany(Reminder::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(TaskNotification::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeDueToday($query)
    {
        return $query->whereDate('due_date', today());
    }

    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())
            ->where('status', '!=', 'completed');
    }

    public function scopeByPriority($query, $priority)
    {
        return $query->where('priority', $priority);
    }

    // Helpers
    public function markAsCompleted(): void
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
            'completion_percentage' => 100,
        ]);
    }

    public function isOverdue(): bool
    {
        return $this->due_date &&
            $this->due_date->isPast() &&
            $this->status !== 'completed';
    }
}
