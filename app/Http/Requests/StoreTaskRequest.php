<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled by middleware/policies
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'due_date' => ['nullable', 'date', 'after_or_equal:today'],
            'due_time' => ['nullable', 'date_format:H:i'],
            'is_all_day' => ['boolean'],
            'priority' => ['required', 'in:low,medium,high,urgent'],
            'status' => ['nullable', 'in:pending,in_progress,completed,cancelled'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
            'color' => ['nullable', 'string', 'max:7'], // Hex color
            'recurring_task_id' => ['nullable', 'exists:recurring_tasks,id'],
            'is_recurring' => ['boolean'],
            'recurrence_type' => ['required_if:is_recurring,true', 'in:daily,weekly,monthly'],
            'recurrence_interval' => ['required_if:is_recurring,true', 'integer', 'min:1'],
            'end_type' => ['required_if:is_recurring,true', 'in:never,on_date,after_occurrences'],
            'end_date' => ['nullable', 'required_if:end_type,on_date', 'date', 'after:today'],
            'end_occurrences' => ['nullable', 'required_if:end_type,after_occurrences', 'integer', 'min:1'],
            'reminders' => ['nullable', 'array'],
            'reminders.*.minutes_before' => ['required', 'integer', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Task title is required.',
            'due_date.after_or_equal' => 'Due date must be today or in the future.',
            'priority.in' => 'Priority must be low, medium, high, or urgent.',
        ];
    }
}
