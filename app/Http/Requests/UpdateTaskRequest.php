<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTaskRequest extends FormRequest
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
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
            'due_time' => ['nullable', 'date_format:H:i'],
            'is_all_day' => ['boolean'],
            'priority' => ['sometimes', 'in:low,medium,high,urgent'],
            'status' => ['sometimes', 'in:pending,in_progress,completed,cancelled'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
            'color' => ['nullable', 'string', 'max:7'],
            'completion_percentage' => ['nullable', 'integer', 'min:0', 'max:100'],
            'reminders' => ['nullable', 'array'],
            'reminders.*.minutes_before' => ['required', 'integer', 'min:0'],
        ];
    }
}
