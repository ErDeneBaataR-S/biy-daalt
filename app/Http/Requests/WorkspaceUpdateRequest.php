<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class WorkspaceUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => [$this->isMethod('patch') ? 'sometimes' : 'required', 'string', 'max:255'],
            'body' => ['nullable', 'string'],
            'status' => ['sometimes', 'string', 'max:50'],
            'audience' => ['sometimes', 'string', 'max:50'],
        ];
    }
}
