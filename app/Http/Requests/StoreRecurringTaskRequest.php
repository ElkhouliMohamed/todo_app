<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreRecurringTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
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
            'priority' => ['required', 'in:low,medium,high,urgent'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
            'color' => ['nullable', 'string', 'max:7'],

            // Recurrence settings
            'recurrence_type' => ['required', 'in:daily,weekly,monthly,custom'],
            'recurrence_interval' => ['required', 'integer', 'min:1', 'max:365'],
            'recurrence_days' => ['nullable', 'array', 'required_if:recurrence_type,weekly'],
            'recurrence_days.*' => ['integer', 'min:0', 'max:6'], // 0=Sunday, 6=Saturday
            'recurrence_day_of_month' => ['nullable', 'integer', 'min:1', 'max:31', 'required_if:recurrence_type,monthly'],
            'recurrence_time' => ['nullable', 'date_format:H:i'],
            'is_all_day' => ['boolean'],

            // Start and end
            'start_date' => ['required', 'date', 'after_or_equal:today'],
            'end_type' => ['required', 'in:never,after_occurrences,on_date'],
            'end_after_occurrences' => ['nullable', 'integer', 'min:1', 'required_if:end_type,after_occurrences'],
            'end_date' => ['nullable', 'date', 'after:start_date', 'required_if:end_type,on_date'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Task title is required.',
            'recurrence_type.required' => 'Please select a recurrence pattern.',
            'recurrence_days.required_if' => 'Please select at least one day for weekly recurrence.',
            'recurrence_day_of_month.required_if' => 'Please select a day of the month.',
            'start_date.after_or_equal' => 'Start date must be today or in the future.',
            'end_date.after' => 'End date must be after start date.',
        ];
    }
}
