<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\JobListing;
use App\Models\Employer;
use App\Models\JobSeeker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class EmployerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Display the employer's profile.
     */
    public function profile(Request $request)
    {
        return response()->json($request->user()->load('jobs'));
    }

    /**
     * Update the employer's profile.
     */
    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string',
            'company_description' => 'sometimes|string',
            'website' => 'nullable|url',
            'industry' => 'sometimes|string',
            'location' => 'sometimes|string',
            'logo_url' => 'nullable|url',
        ]);

        $request->user()->update($validated);

        return response()->json($request->user());
    }

    /**
     * Display a listing of the employer's jobs.
     */
    public function jobs(Request $request)
    {
        $jobs = $request->user()->jobs()
            ->with('applications.jobSeeker')
            ->latest()
            ->paginate(10);

        return response()->json($jobs);
    }

    /**
     * Display a listing of the job's applications.
     */
    public function applications(Request $request, JobListing $job)
    {
        $this->authorize('viewApplications', $job);

        $applications = $job->applications()
            ->with('jobSeeker')
            ->latest()
            ->paginate(10);

        return response()->json($applications);
    }

    /**
     * Update the status of a job application.
     */
    public function updateApplicationStatus(Request $request, Application $application)
    {
        $this->authorize('updateStatus', $application);

        $validated = $request->validate([
            'status' => 'required|in:pending,reviewed,shortlisted,rejected,accepted',
            'employer_notes' => 'nullable|string',
        ]);

        $application->update($validated);

        return response()->json($application->load('jobSeeker'));
    }

    /**
     * Get employer statistics.
     */
    public function stats()
    {
        try {
            $employerId = Auth::id();
            
            // Get total jobs count
            $totalJobs = JobListing::where('employer_id', $employerId)->count();
            
            // Get active jobs count using is_active boolean field
            $activeJobs = JobListing::where('employer_id', $employerId)
                                  ->where('is_active', true)
                                  ->count();
            
            // Get total applications count
            $totalApplications = Application::whereHas('jobListing', function($query) use ($employerId) {
                $query->where('employer_id', $employerId);
            })->count();
            
            // Get pending applications count
            $pendingApplications = Application::whereHas('jobListing', function($query) use ($employerId) {
                $query->where('employer_id', $employerId);
            })->where('status', 'pending')->count();
            
            // Get accepted applications count
            $acceptedApplications = Application::whereHas('jobListing', function($query) use ($employerId) {
                $query->where('employer_id', $employerId);
            })->where('status', 'accepted')->count();
            
            return response()->json([
                'totalJobs' => $totalJobs,
                'activeJobs' => $activeJobs,
                'totalApplications' => $totalApplications,
                'pendingApplications' => $pendingApplications,
                'acceptedApplications' => $acceptedApplications
            ]);
        } catch (\Exception $e) {
            
            return response()->json([
                'message' => 'Error fetching employer stats',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
