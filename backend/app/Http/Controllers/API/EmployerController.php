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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;

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
                    },
                    'applications as rejected_applications' => function ($query) {
                        $query->where('status', 'rejected');
                    },
                    'applications as withdrawn_applications' => function ($query) {
                        $query->where('status', 'withdrawn');
                    }
                ])
                ->with(['applications' => function ($query) {
                    $query->select('id', 'job_id', 'status');
                }])
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
                        'applications_count' => [
                            'total' => $job->total_applications,
                            'pending' => $job->pending_applications,
                            'accepted' => $job->accepted_applications,
                            'rejected' => $job->rejected_applications,
                            'withdrawn' => $job->withdrawn_applications
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
        try {
            $validated = $request->validate([
                'company_name' => 'required|string|max:255',
                'phone' => 'nullable|string',
                'company_description' => 'nullable|string',
                'website' => 'nullable|url',
                'industry' => 'required|string',
                'location' => 'required|string',
                'logo_url' => 'nullable|string', // Changed from url to string to accept file paths
            ]);

            $employer = $request->user();
            $employer->update($validated);

            return response()->json([
                'message' => 'Profile updated successfully',
                'employer' => $employer
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display a listing of the employer's jobs.
     */
    public function jobs(Request $request)
    {
        try {
            $employer = $request->user();

            $jobs = Job::where('employer_id', $employer->id)
                ->withCount('applications as total_applications')
                ->latest()
                ->get()
                ->map(function ($job) {
                    return [
                        'id' => $job->id,
                        'title' => $job->title,
                        'description' => $job->description,
                        'location' => $job->location,
                        'type' => $job->type,
                        'experience_level' => $job->experience_level,
                        'requirements' => $job->requirements,
                        'responsibilities' => $job->responsibilities,
                        'deadline' => $job->deadline ? date('M d, Y', strtotime($job->deadline)) : null,
                        'is_active' => $job->is_active,
                        'created_at' => date('M d, Y', strtotime($job->created_at)),
                        'applications_count' => [
                            'total' => $job->total_applications
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
            $totalApplications = Application::whereHas('job', function ($query) use ($employer) {
                $query->where('employer_id', $employer->id);
            })->count();

            // Get pending applications count
            $pendingApplications = Application::whereHas('job', function ($query) use ($employer) {
                $query->where('employer_id', $employer->id);
            })->where('status', 'pending')->count();

            // Get accepted applications count
            $acceptedApplications = Application::whereHas('job', function ($query) use ($employer) {
                $query->where('employer_id', $employer->id);
            })->where('status', 'accepted')->count();

            // Get rejected applications count
            $rejectedApplications = Application::whereHas('job', function ($query) use ($employer) {
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

    public function uploadLogo(Request $request)
    {
        try {
            if (!$request->hasFile('logo')) {
                return response()->json([
                    'message' => 'No file uploaded',
                    'error' => 'Please select a file to upload'
                ], 400);
            }

            $file = $request->file('logo');

            // Validate file
            $validated = $request->validate([
                'logo' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120', // 5MB max
            ]);

            $employer = $request->user();

            // Delete old logo if it exists
            if ($employer->logo_url && !str_starts_with($employer->logo_url, 'http')) {
                Storage::disk('public')->delete($employer->logo_url);
            }

            // Generate a unique filename
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

            // Store the new logo
            $path = $file->storeAs('company-logos', $filename, 'public');

            // Update employer profile with new logo path
            $employer->logo_url = $path;
            $employer->save();

            return response()->json([
                'message' => 'Company logo uploaded successfully',
                'employer' => $employer
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to upload company logo',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
