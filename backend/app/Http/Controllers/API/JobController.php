<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

/**
 * Class JobController
 * @package App\Http\Controllers\API
 */
class JobController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $jobs = Job::with('employer')
            ->where('is_active', true)
            ->latest()
            ->paginate(10);
            
        return response()->json([
            'data' => $jobs->items(),
            'total' => $jobs->total(),
            'per_page' => $jobs->perPage(),
            'current_page' => $jobs->currentPage(),
            'last_page' => $jobs->lastPage()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string',
            'type' => 'required|string|in:full-time,part-time,contract',
            'salary' => 'nullable|numeric',
            'experience_level' => 'required|string',
            'requirements' => 'required|array',
            'responsibilities' => 'required|array',
            'deadline' => 'required|date|after:today',
        ]);

        $job = $request->user()->jobs()->create($validated);

        return response()->json([
            'data' => $job
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Job $job)
    {
        return response()->json([
            'data' => $job->load('employer')
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Job $job)
    {
        $this->authorize('update', $job);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'location' => 'sometimes|string',
            'type' => 'sometimes|string|in:full-time,part-time,contract',
            'salary' => 'nullable|numeric',
            'experience_level' => 'sometimes|string',
            'requirements' => 'sometimes|array',
            'responsibilities' => 'sometimes|array',
            'deadline' => 'sometimes|date|after:today',
            'is_active' => 'sometimes|boolean',
            'is_featured' => 'sometimes|boolean',
        ]);

        $job->update($validated);

        return response()->json([
            'data' => $job
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Job $job)
    {
        $this->authorize('delete', $job);
        
        $job->delete();

        return response()->json(null, 204);
    }

    /**
     * Search jobs
     */
    public function search(Request $request)
    {
        $query = Job::with('employer');

        // Filter by category
        if ($request->has('category')) {
            $category = str_replace('-', ' ', $request->category);
            $query->where('category', 'LIKE', '%' . $category . '%');
        }

        // Filter by state/location
        if ($request->has('state')) {
            $query->where('location', 'LIKE', '%' . $request->state . '%');
        }

        // Get paginated results
        $jobs = $query->latest()->paginate(10);

        // Format each job
        $formattedJobs = collect($jobs->items())->map(function ($job) {
            return $this->formatJob($job);
        });

        return response()->json([
            'data' => $formattedJobs,
            'meta' => [
                'total' => $jobs->total(),
                'current_page' => $jobs->currentPage(),
                'last_page' => $jobs->lastPage(),
                'per_page' => $jobs->perPage()
            ]
        ]);
    }

    /**
     * Get recent jobs
     */
    public function recent()
    {
        $jobs = Job::with('employer')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($job) {
                return $this->formatJob($job);
            });

        return response()->json(['data' => $jobs]);
    }

    /**
     * Get job counts by state
     */
    public function byState()
    {
        $states = Job::select('location')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('location')
            ->orderBy('count', 'desc')
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item->location => $item->count];
            });

        return response()->json(['data' => $states]);
    }

    /**
     * Get job counts by category
     */
    public function byCategory()
    {
        $categories = Job::select('category')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('category')
            ->orderBy('count', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->category,
                    'count' => $item->count,
                    'slug' => Str::slug($item->category)
                ];
            });

        return response()->json([
            'data' => $categories
        ]);
    }

    /**
     * Get jobs by location
     */
    public function getJobsByLocation($location)
    {
        $jobs = Job::with('employer')
            ->where('location', 'LIKE', '%' . $location . '%')
            ->where('is_active', true)
            ->latest()
            ->get();

        return response()->json([
            'data' => $jobs
        ]);
    }

    /**
     * Get locations
     */
    public function getLocations()
    {
        $locations = Job::select('location')
            ->where('is_active', true)
            ->distinct()
            ->pluck('location');
        return response()->json($locations);
    }

    /**
     * Get categories
     */
    public function getCategories()
    {
        $categories = Job::select('category')
            ->where('is_active', true)
            ->distinct()
            ->pluck('category');
        return response()->json($categories);
    }

    /**
     * Get jobs by category
     */
    public function getJobsByCategory($category)
    {
        $jobs = Job::with('employer')
            ->where('category', $category)
            ->where('is_active', true)
            ->latest()
            ->get();
        return response()->json($jobs);
    }

    /**
     * Get featured jobs
     */
    public function getFeaturedJobs()
    {
        $jobs = Job::with('employer')
            ->where('is_active', true)
            ->where('is_featured', true)
            ->latest()
            ->take(6)
            ->get();

        return response()->json([
            'data' => $jobs
        ]);
    }

    /**
     * Get job statistics
     */
    public function getStats()
    {
        try {
            $stats = [
                'activeJobs' => Job::where('is_active', true)->count(),
                'totalLocations' => Job::where('is_active', true)->distinct('location')->count('location'),
                'totalCategories' => Job::where('is_active', true)->distinct('category')->count('category'),
                'featuredJobs' => Job::where('is_active', true)->where('is_featured', true)->count()
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            Log::error('Error getting job stats: ' . $e->getMessage());
            return response()->json([
                'activeJobs' => 0,
                'totalLocations' => 0,
                'totalCategories' => 0,
                'featuredJobs' => 0
            ]);
        }
    }

    /**
     * Format job data consistently
     */
    private function formatJob($job)
    {
        return [
            'id' => $job->id,
            'title' => $job->title,
            'description' => $job->description,
            'responsibilities' => $job->responsibilities,
            'location' => $job->location,
            'salary' => $job->salary,
            'type' => $job->type,
            'experience_level' => $job->experience_level,
            'category' => $job->category,
            'is_featured' => $job->is_featured,
            'created_date' => $job->created_at->format('M d, Y'),
            'deadline_date' => $job->deadline ? $job->deadline->format('M d, Y') : null,
            'employer' => $job->employer ? [
                'id' => $job->employer->id,
                'company_name' => $job->employer->company_name,
            ] : null,
        ];
    }
}
