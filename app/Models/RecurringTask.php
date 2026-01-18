<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class RecurringTask extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'priority',
        'tags',
        'color',
        'recurrence_type',
        'recurrence_interval',
        'recurrence_days',
        'recurrence_day_of_month',
        'recurrence_time',
        'is_all_day',
        'start_date',
        'end_type',
        'end_after_occurrences',
        'end_date',
        'occurrences_created',
        'last_generated_date',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'tags' => 'array',
            'recurrence_days' => 'array',
            'recurrence_interval' => 'integer',
            'recurrence_day_of_month' => 'integer',
            'is_all_day' => 'boolean',
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'end_after_occurrences' => 'integer',
            'occurrences_created' => 'integer',
            'last_generated_date' => 'datetime',
            'is_active' => 'boolean',
        ];
    }

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeDueForGeneration($query)
    {
        return $query->active()
            ->where(function ($q) {
                $q->whereNull('last_generated_date')
                    ->orWhere('last_generated_date', '<', today());
            });
    }

    // Helpers
    public function shouldGenerateTask(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        // Check if we've reached the end
        if (
            $this->end_type === 'after_occurrences' &&
            $this->occurrences_created >= $this->end_after_occurrences
        ) {
            return false;
        }

        if (
            $this->end_type === 'on_date' &&
            $this->end_date &&
            today()->isAfter($this->end_date)
        ) {
            return false;
        }

        return true;
    }

    public function getNextOccurrenceDate(): ?\Carbon\Carbon
    {
        $baseDate = $this->last_generated_date ?? $this->start_date;

        return match ($this->recurrence_type) {
            'daily' => $baseDate->copy()->addDays($this->recurrence_interval),
            'weekly' => $baseDate->copy()->addWeeks($this->recurrence_interval),
            'monthly' => $baseDate->copy()->addMonths($this->recurrence_interval),
            default => null,
        };
    }
}
