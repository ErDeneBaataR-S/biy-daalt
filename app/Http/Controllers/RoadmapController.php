<?php

namespace App\Http\Controllers;

use App\Models\RoadmapItem;
use Inertia\Inertia;
use Illuminate\Http\Request;

class RoadmapController extends Controller
{
    public function index()
    {
        return Inertia::render('roadmap', [
            'items' => RoadmapItem::all()
        ]);
    }

    public function store(Request $request)
    {
        RoadmapItem::create([
            'title' => $request->title,
            'status' => $request->status ?? 'now',
        ]);

        return redirect()->route('roadmap');
    }

    public function update(Request $request, RoadmapItem $roadmap)
    {
        $roadmap->update([
            'title' => $request->title ?? $roadmap->title,
            'status' => $request->status ?? $roadmap->status,
        ]);

        return redirect()->route('roadmap');
    }

    public function destroy(RoadmapItem $roadmap)
    {
        $roadmap->delete();

        return redirect()->route('roadmap');
    }
}