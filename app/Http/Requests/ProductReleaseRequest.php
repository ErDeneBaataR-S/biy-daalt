<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProductReleaseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'version' => [$this->isMethod('patch') ? 'sometimes' : 'required', 'string', 'max:255'],
            'release_date' => ['nullable', 'date'],
            'features' => ['sometimes', 'array'],
            'features.*' => ['string', 'max:255'],
        ];
    }
}
