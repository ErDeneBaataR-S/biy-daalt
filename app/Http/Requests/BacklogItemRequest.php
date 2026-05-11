<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BacklogItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => [$this->isMethod('patch') ? 'sometimes' : 'required', 'string', 'max:255'],
            'kind' => ['sometimes', 'string', 'max:50'],
            'status' => ['sometimes', 'string', 'max:50'],
            'priority' => ['sometimes', 'string', 'max:50'],
            'owner' => ['nullable', 'string', 'max:255'],
            'team' => ['nullable', 'string', 'max:255'],
            'sprint_label' => ['nullable', 'string', 'max:255'],
            'estimate_label' => ['nullable', 'string', 'max:255'],
            'sprintLabel' => ['nullable', 'string', 'max:255'],
            'estimateLabel' => ['nullable', 'string', 'max:255'],
        ];
    }
}
