<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RoadmapItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => [$this->isMethod('patch') ? 'sometimes' : 'required', 'string', 'max:255'],
            'status' => ['sometimes', 'string', 'max:50'],
        ];
    }
}
