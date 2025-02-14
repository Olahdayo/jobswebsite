<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\JobListing;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\ModelNotFoundException;

/**
 * Class JobController
 * @package App\Http\Controllers\API
 */
class JobController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $jobs = JobListing::with('employer')
                ->where('is_active', true)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'data' => $jobs,
                'meta' => [
                    'total' => $jobs->count(),
                    'current_page' => 1,
                    'last_page' => 1,
                    'per_page' => $jobs->count()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch jobs',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            // Define valid education levels
            $validEducationLevels = [
                'Secondary School',
                'OND',
                'HND', 
                "Bachelor's Degree",
                "Master's Degree",
                'PhD',
                'Professional Certification',
                'Not Required'
            ];

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'location' => 'required|string',
                'type' => 'required|string|in:full-time,part-time,contract',
                'salary' => 'nullable|array',
                'salary.min' => 'nullable|numeric',
                'salary.max' => 'nullable|numeric',
                'experience_level' => 'required|string',
                'requirements' => 'required|array',
                'responsibilities' => 'required|array',
                'deadline' => 'required|date|after:today',
                'category' => 'sometimes|string',
                'education_level' => 'sometimes|string|in:' . implode(',', $validEducationLevels)
            ]);


            // Add employer_id to the validated data
            $validated['employer_id'] = $request->user()->id;

            // Handle salary
            if (isset($validated['salary'])) {
                $validated['min_salary'] = $validated['salary']['min'] ?? null;
                $validated['max_salary'] = $validated['salary']['max'] ?? null;
                unset($validated['salary']);
            }

            // Convert arrays to JSON strings for storage
            if (isset($validated['requirements'])) {
                $validated['requirements'] = json_encode($validated['requirements']);
            }
            if (isset($validated['responsibilities'])) {
                $validated['responsibilities'] = json_encode($validated['responsibilities']);
            }

            // Set default values
            $validated['is_active'] = true;
            $validated['is_featured'] = false;
            $validated['category'] = $validated['category'] ?? 'Other';

            

            $job = JobListing::create($validated);

           

            return response()->json([
                'message' => 'Job created successfully',
                'data' => $job
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            

            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
           

            return response()->json([
                'message' => 'An unexpected error occurred',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(JobListing $jobListing)
    {
        $jobListing->load('employer');
        
        return response()->json([
            'data' => [
                'id' => $jobListing->id,
                'title' => $jobListing->title,
                'description' => $jobListing->description,
                'location' => $jobListing->location,
                'type' => $jobListing->type,
                'min_salary' => $jobListing->min_salary,
                'max_salary' => $jobListing->max_salary,
                'experience_level' => $jobListing->experience_level,
                'requirements' => $jobListing->requirements,
                'responsibilities' => $jobListing->responsibilities,
                'is_active' => $jobListing->is_active,
                'is_featured' => $jobListing->is_featured,
                'category' => $jobListing->category,
                'deadline' => $jobListing->deadline,
                'created_at' => $jobListing->created_at,
                'updated_at' => $jobListing->updated_at,
                'created_date' => $jobListing->created_at ? $jobListing->created_at->format('M d, Y') : null,
                'deadline_date' => $jobListing->deadline ? $jobListing->deadline->format('M d, Y') : null,
                'employer' => $jobListing->employer ? [
                    'id' => $jobListing->employer->id,
                    'name' => $jobListing->employer->name,
                    'email' => $jobListing->employer->email,
                    'company_name' => $jobListing->employer->company_name,
                    'company_description' => $jobListing->employer->company_description,
                    'website' => $jobListing->employer->website,
                    'industry' => $jobListing->employer->industry,
                    'location' => $jobListing->employer->location,
                    'logo_url' => $jobListing->employer->logo_url,
                ] : null
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, JobListing $job)
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
    public function destroy(JobListing $job)
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
        $query = JobListing::with('employer')->where('is_active', true);

        // Filter by keyword (search in title and description)
        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->where(function($q) use ($keyword) {
                $q->where('title', 'LIKE', '%' . $keyword . '%')
                  ->orWhere('description', 'LIKE', '%' . $keyword . '%');
            });
        }

        // Filter by location
        if ($request->filled('location')) {
            $query->where('location', 'LIKE', '%' . $request->location . '%');
        }

        // Filter by category
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Filter by job type
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Filter by experience level
        if ($request->filled('experience_level')) {
            $query->where('experience_level', $request->experience_level);
        }

        // Filter featured jobs only if is_featured is true
        if ($request->boolean('is_featured')) {
            $query->where('is_featured', true);
        }

        // Get paginated results
        $jobs = $query->latest()->paginate($request->input('per_page', 10));

        return response()->json([
            'data' => $jobs->items(),
            'total' => $jobs->total(),
            'current_page' => $jobs->currentPage(),
            'per_page' => $jobs->perPage(),
            'last_page' => $jobs->lastPage()
        ]);
    }

    /**
     * Get recent jobs
     */
    public function recent()
    {
        $jobs = JobListing::with('employer')
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
        $states = JobListing::select('location')
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
        $categories = JobListing::select('category')
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
        $jobs = JobListing::with('employer')
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
        $locations = JobListing::select('location')
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
        $categories = JobListing::select('category')
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
        $jobs = JobListing::with('employer')
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
        $jobs = JobListing::with('employer')
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
                'activeJobs' => JobListing::where('is_active', true)->count(),
                'totalLocations' => JobListing::where('is_active', true)->distinct('location')->count('location'),
                'totalCategories' => JobListing::where('is_active', true)->distinct('category')->count('category'),
                'featuredJobs' => JobListing::where('is_active', true)->where('is_featured', true)->count()
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
           
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

    /**
     * Fetch job applications for a specific job
     */
    public function getJobApplications(JobListing $job)
    {
        // Get the authenticated user
        $user = Auth::user();

        // Authorize that only the job's employer or admin can view the applications
        $this->authorize('viewApplications', $job);

        // Fetch applications with related job seeker details
        $applications = $job->applications()->with('jobSeeker')->get();


        // Return the job and its applications
        return response()->json([
            'job' => $job,
            'applications' => $applications
        ]);
    }

    /**
     * Update job application status
     */
    public function updateApplicationStatus(Request $request, $applicationId)
    {
        try {
           

            // Validate request
            $validated = $request->validate([
                'status' => 'required|in:pending,reviewed,shortlisted,rejected,accepted,cancelled,withdrawn'
            ]);

            // Find the application
            $application = JobApplication::with('jobListing')->findOrFail($applicationId);

            // Authorize that only the job's employer can update application status
            $this->authorize('updateStatus', $application);

            // Update the status
            $application->update([
                'status' => $validated['status']
            ]);


            // Return success response
            return response()->json([
                'message' => 'Application status updated successfully',
                'application' => $application
            ]);

        } catch (ModelNotFoundException $e) {
            
            return response()->json([
                'message' => 'Job application not found',
                'error' => $e->getMessage()
            ], 404);

        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            
            return response()->json([
                'message' => 'This action is unauthorized',
                'error' => $e->getMessage()
            ], 403);

        } catch (\Illuminate\Validation\ValidationException $e) {
           
            return response()->json([
                'message' => 'Invalid status value',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
           
            return response()->json([
                'message' => 'An error occurred while updating the application status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Download resume for a job application
     */
    public function downloadResume(JobApplication $application)
    {
     
        // Authorize the user to view this application
        $this->authorize('view', $application);

        // Get the resume path (either from application or associated job seeker)
        $resumePath = $application->resume_url ?? 
                      ($application->jobSeeker ? $application->jobSeeker->resume_url : null);

        

        // Check if resume exists
        if (!$resumePath) {
            

            return response()->json([
                'message' => 'No resume found for this application',
                'details' => [
                    'application_resume_url' => $application->resume_url,
                    'job_seeker_resume_url' => $application->jobSeeker ? $application->jobSeeker->resume_url : null
                ]
            ], 404);
        }

        // Normalize the path for local files
        $fullLocalPath = storage_path('app/' . $resumePath);

        // Check if file exists
        if (!file_exists($fullLocalPath)) {
          

            return response()->json([
                'message' => 'Resume file not found',
                'details' => [
                    'attempted_path' => $fullLocalPath,
                    'original_path' => $resumePath
                ]
            ], 404);
        }

        // If it's a full URL, attempt to download from external source
        if (filter_var($resumePath, FILTER_VALIDATE_URL)) {
            try {
                $fileContents = file_get_contents($resumePath);
                
                if ($fileContents === false) {
                    

                    return response()->json([
                        'message' => 'Unable to download resume from provided URL',
                        'url' => $resumePath
                    ], 404);
                }

                // Generate a filename
                $applicantName = $application->jobSeeker ? 
                    Str::slug($application->jobSeeker->first_name . '-' . $application->jobSeeker->last_name) : 
                    'applicant-' . $application->id;
            
                $fileExtension = pathinfo(parse_url($resumePath, PHP_URL_PATH), PATHINFO_EXTENSION) ?: 'pdf';
                $filename = "{$applicantName}-resume.{$fileExtension}";

                // Return file download
                return response($fileContents, 200, [
                    'Content-Type' => 'application/octet-stream',
                    'Content-Disposition' => "attachment; filename={$filename}"
                ]);
            } catch (\Exception $e) {
               

                return response()->json([
                    'message' => 'Error downloading resume',
                    'error' => $e->getMessage()
                ], 500);
            }
        }

        // For local files, use the full local path
        try {
            // Generate a filename
            $applicantName = $application->jobSeeker ? 
                Str::slug($application->jobSeeker->first_name . '-' . $application->jobSeeker->last_name) : 
                'applicant-' . $application->id;
        
            $fileExtension = pathinfo($resumePath, PATHINFO_EXTENSION);
            $filename = "{$applicantName}-resume.{$fileExtension}";

            // Return file download
            return response()->download($fullLocalPath, $filename);
        } catch (\Exception $e) {
           

            return response()->json([
                'message' => 'Error downloading local resume',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Check if the authenticated user has already applied for a specific job
     *
     * @param int $jobId
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkUserJobApplication($jobId)
    {
        try {
            // Validate job ID is numeric
            if (!is_numeric($jobId)) {
                throw new \InvalidArgumentException('Invalid job ID');
            }

            // Validate the job ID exists and get job details
            $job = JobListing::findOrFail($jobId);
            
            // Check if job has exceeded application deadline
            $currentDate = now();
            $hasDeadlinePassed = $job->deadline && $currentDate > $job->deadline;

            // If deadline has passed, return early with error
            if ($hasDeadlinePassed) {
                return response()->json([
                    'error' => 'Application Deadline Passed',
                    'message' => 'Sorry, the application deadline for this job has passed.',
                    'deadlineDate' => $job->deadline ? $job->deadline->toIso8601String() : null,
                    'hasApplied' => false,
                    'applicationStatus' => null
                ], 400);
            }
            
            // Ensure user is authenticated
            $user = Auth::user();
            if (!$user) {
                return response()->json([
                    'error' => 'User not authenticated',
                    'message' => 'Please log in to check job applications'
                ], 401);
            }

            // Check if the user has already applied for this job
            $existingApplication = JobApplication::where('job_id', $jobId)
                ->where('job_seeker_id', $user->id)
                ->first();

            return response()->json([
                'hasApplied' => $existingApplication !== null,
                'applicationStatus' => $existingApplication ? $existingApplication->status : null,
                'deadlineDate' => $job->deadline ? $job->deadline->toIso8601String() : null,
                'error' => null,
                'message' => null
            ]);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'error' => 'Invalid Input',
                'message' => 'The provided job ID is invalid',
                'hasApplied' => false,
                'applicationStatus' => null,
                'deadlineDate' => null
            ], 400);
        } catch (ModelNotFoundException $e) {
            return response()->json([
                'error' => 'Job not found',
                'message' => "Job with ID {$jobId} does not exist",
                'hasApplied' => false,
                'applicationStatus' => null,
                'deadlineDate' => null
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Server Error',
                'message' => 'An unexpected error occurred while checking job application',
                'hasApplied' => false,
                'applicationStatus' => null,
                'deadlineDate' => null
            ], 500);
        }
    }
}
