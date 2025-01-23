<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Job;
use App\Models\Employer;
use App\Models\JobSeeker;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

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
    public function applications(Request $request, Job $job)
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
    public function stats(Request $request)
    {
        try {
            $employer = $request->user();
            
            if (!$employer) {
                return response()->json([
                    'message' => 'Unauthorized',
                    'error' => 'No authenticated user found'
                ], 401);
            }

            
            
            // Get total jobs count
            $totalJobs = Job::where('employer_id', $employer->id)->count();
            
            
            // Get active jobs count using is_active boolean field
            $activeJobs = Job::where('employer_id', $employer->id)
                            ->where('is_active', true)
                            ->count();
            
            
            // Get total applications count
            $totalApplications = Application::whereHas('job', function($query) use ($employer) {
                $query->where('employer_id', $employer->id);
            })->count();
            
            
            // Get pending applications count
            $pendingApplications = Application::whereHas('job', function($query) use ($employer) {
                $query->where('employer_id', $employer->id);
            })->where('status', 'pending')->count();
            
            
            // Get accepted applications count
            $acceptedApplications = Application::whereHas('job', function($query) use ($employer) {
                $query->where('employer_id', $employer->id);
            })->where('status', 'accepted')->count();
           
            
            $response = [
                'status' => 'success',
                'data' => [
                    'totalJobs' => (int)$totalJobs,
                    'activeJobs' => (int)$activeJobs,
                    'totalApplications' => (int)$totalApplications,
                    'pendingApplications' => (int)$pendingApplications,
                    'acceptedApplications' => (int)$acceptedApplications
                ]
            ];
            
           
            
            return response()->json($response);
        } catch (\Exception $e) {
          
            
            return response()->json([
                'message' => 'Error fetching employer stats',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
