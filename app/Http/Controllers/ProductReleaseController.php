<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductReleaseRequest;
use App\Models\ProductRelease;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductReleaseController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', ProductRelease::class);

        return Inertia::render('Releases', [
            'items' => ProductRelease::query()
                ->latest()
                ->get()
                ->map(fn (ProductRelease $release) => [
                    'id' => $release->id,
                    'version' => $release->version,
                    'date' => $release->release_date?->toDateString() ?? '',
                    'features' => $release->features ?? [],
                ]),
        ]);
    }

    public function store(ProductReleaseRequest $request): RedirectResponse
    {
        $this->authorize('create', ProductRelease::class);

        ProductRelease::create($request->validated());

        return redirect()->route('releases');
    }

    public function update(ProductReleaseRequest $request, ProductRelease $productRelease): RedirectResponse
    {
        $this->authorize('update', $productRelease);

        $productRelease->update($request->validated());

        return redirect()->route('releases');
    }

    public function destroy(ProductRelease $productRelease): RedirectResponse
    {
        $this->authorize('delete', $productRelease);

        $productRelease->delete();

        return redirect()->route('releases');
    }
}
