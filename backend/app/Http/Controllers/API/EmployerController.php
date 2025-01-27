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
    public function index(Request $request)
    {
        try {
            $employer = $request->user();

            $jobs = Job::where('employer_id', $employer->id)
                ->withCount([
                    'applications as total_applications',
                    'applications as pending_applications' => function ($query) {
                        $query->where('status', 'pending');
                    },
                    'applications as accepted_applications' => function ($query) {
                        $query->where('status', 'accepted');
                    }
                ])
                ->with('applications') // Load the applications relationship
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($job) {
                    return [
                        'id' => $job->id,
                        'title' => $job->title,
                        'location' => $job->location,
                        'type' => ucfirst(str_replace('-', ' ', $job->type)),
                        'experience_level' => $job->experience_level,
                        'deadline' => $job->deadline ? date('M d, Y', strtotime($job->deadline)) : null,
                        'is_active' => $job->is_active,
                        'created_at' => date('M d, Y', strtotime($job->created_at)),
                        'applications' => [
                            'total' => $job->applications->count(),
                            'pending' => $job->applications->where('status', 'pending')->count(),
                            'accepted' => $job->applications->where('status', 'accepted')->count()
                        ]
                    ];
                });

            return response()->json([
                'status' => 'success',
                'data' => $jobs
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching employer jobs',
                'error' => $e->getMessage()
            ], 500);
        }
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
            
            // Get rejected applications count
            $rejectedApplications = Application::whereHas('job', function($query) use ($employer) {
                $query->where('employer_id', $employer->id);
            })->where('status', 'rejected')->count();
           
            $response = [
                'status' => 'success',
                'data' => [
                    'totalJobs' => (int)$totalJobs,
                    'activeJobs' => (int)$activeJobs,
                    'totalApplications' => (int)$totalApplications,
                    'pendingApplications' => (int)$pendingApplications,
                    'acceptedApplications' => (int)$acceptedApplications,
                    'rejectedApplications' => (int)$rejectedApplications
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
