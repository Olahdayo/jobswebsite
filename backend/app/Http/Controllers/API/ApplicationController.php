<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\JobSeeker;
use App\Models\Job;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class ApplicationController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware(function ($request, $next) {
            if (!$request->user() || !($request->user() instanceof \App\Models\JobSeeker)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Unauthorized. This endpoint is only for job seekers.'
                ], 403);
            }
            return $next($request);
        })->only(['index', 'store', 'show', 'update', 'cancel']);
    }

    /**
     * Store a newly created application in storage.
     */
    public function store(Request $request)
    {
        try {
            // Get authenticated user
            $jobSeeker = $request->user();

            // Validate request first
            $validator = Validator::make($request->all(), [
                'job_id' => ['required', 'exists:job_listings,id'],
                'cover_letter' => ['required', 'string', 'min:50'],
                'resume' => ['required', 'file', 'mimes:pdf,doc,docx', 'max:5120'], // 5MB max
            ], [
                'job_id.exists' => 'The selected job is no longer available.',
                'job_id.required' => 'No job was selected for application.',
                'cover_letter.min' => 'The cover letter must be at least 50 characters.',
                'resume.required' => 'Please upload your resume.',
                'resume.mimes' => 'The resume must be a PDF, DOC, or DOCX file.',
                'resume.max' => 'The resume must not be larger than 5MB.'
            ]);

            if ($validator->fails()) {
                // Log::warning('Application validation failed', [
                //     'errors' => $validator->errors()->toArray(),
                //     'request_data' => $request->except(['resume']),
                // ]);
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if job exists
            $job = Job::find($request->job_id);
            if (!$job) {
                // Log::warning('Job not found after validation', ['job_id' => $request->job_id]);
                return response()->json([
                    'message' => 'The selected job is no longer available'
                ], 404);
            }

            // Check if user has already applied
            $existingApplication = Application::where('job_id', $request->job_id)
                ->where('job_seeker_id', $jobSeeker->id)
                ->first();

            if ($existingApplication) {
               
                return response()->json([
                    'status' => 'error',
                    'message' => 'You have already applied for this job.',
                    'errors' => [
                        'job_id' => ['You have already submitted an application for this position.']
                    ]
                ], 422);
            }

            // Handle file upload
            if ($request->hasFile('resume')) {
                try {
                    $file = $request->file('resume');
                    $filename = time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();
                    
                    // Store file in public/resumes directory
                    $path = $request->file('resume')->storeAs(
                        'resumes',
                        $filename,
                        'public'
                    );

                    if (!$path) {
                        throw new \Exception('Failed to store resume file');
                    }

                    // Create application
                    $application = Application::create([
                        'job_id' => $request->job_id,
                        'job_seeker_id' => $jobSeeker->id,
                        'cover_letter' => $request->cover_letter,
                        'resume_url' => $path,
                        'status' => 'pending'
                    ]);

                    Log::info('Application created successfully', [
                        'application_id' => $application->id,
                        'resume_path' => $path
                    ]);

                    return response()->json([
                        'message' => 'Application submitted successfully',
                        'data' => $application
                    ], 201);
                } catch (\Exception $e) {
                    return response()->json([
                        'message' => 'Failed to upload resume file',
                        'error' => $e->getMessage()
                    ], 500);
                }
            }

            return response()->json([
                'message' => 'Resume file is required'
            ], 422);
        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Failed to submit application',
                'error' => config('app.debug') ? $e->getMessage() : 'An unexpected error occurred'
            ], 500);
        }
    }

    /**
     * Display a listing of applications for the authenticated job seeker.
     */
    public function index()
    {
        try {
            $user = request()->user();

            // Get all applications for the job seeker with related data
            $applications = Application::where('job_seeker_id', $user->id)
                ->with([
                    'job:id,title,location,type,employer_id',
                    'job.employer:id,company_name,logo_url'
                ])
                ->latest()
                ->get();

            // Return structured response
            return response()->json([
                'status' => 'success',
                'data' => $applications->map(function ($application) {
                    return [
                        'id' => $application->id,
                        'status' => $application->status,
                        'created_at' => $application->created_at,
                        'job' => $application->job ? [
                            'id' => $application->job->id,
                            'title' => $application->job->title,
                            'location' => $application->job->location,
                            'type' => $application->job->type,
                            'employer' => $application->job->employer ? [
                                'id' => $application->job->employer->id,
                                'company_name' => $application->job->employer->company_name,
                                'logo_url' => $application->job->employer->logo_url,
                            ] : null
                        ] : null
                    ];
                }),
                'meta' => [
                    'total' => $applications->count()
                ]
            ]);
        } catch (\Exception $e) {
           
            // Return a generic error response
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to retrieve applications',
                'debug_message' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Display the specified application.
     */
    public function show(string $id)
    {
        try {
            $application = Application::with(['job', 'job.employer', 'jobSeeker'])
                ->findOrFail($id);

            return response()->json($application);
        } catch (\Exception $e) {
           
            return response()->json([
                'message' => 'Failed to fetch application details',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the application status.
     */
    public function update(Request $request, string $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,accepted,rejected',
            'employer_notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            Log::warning('Application status update validation failed', [
                'errors' => $validator->errors()->toArray()
            ]);
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $application = Application::findOrFail($id);
            $application->update($request->only(['status', 'employer_notes']));

            Log::info('Application status updated successfully', [
                'application_id' => $application->id,
                'new_status' => $application->status
            ]);

            return response()->json([
                'message' => 'Application status updated',
                'data' => $application
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update application status', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Failed to update application status',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancel a specific application.
     */
    public function cancel($applicationId)
    {
        try {
            // Log the incoming request details
            Log::info('Cancel application request received', [
                'application_id' => $applicationId,
                'request_method' => request()->method(),
                'user_id' => request()->user()->id
            ]);

            $jobSeeker = request()->user();

            // Find the application
            $application = Application::where('id', $applicationId)
                ->where('job_seeker_id', $jobSeeker->id)
                ->first();

            // Log application lookup details
            Log::info('Application lookup details', [
                'application_found' => $application ? true : false,
                'application_details' => $application ? $application->toArray() : null
            ]);

            if (!$application) {
                Log::warning('Application not found or unauthorized', [
                    'application_id' => $applicationId,
                    'user_id' => $jobSeeker->id
                ]);

                return response()->json([
                    'message' => 'Application not found or you do not have permission to cancel this application'
                ], 404);
            }

            // Check if application is in a state that can be cancelled
            if (in_array($application->status, ['accepted', 'rejected'])) {
                Log::warning('Attempt to cancel processed application', [
                    'application_id' => $applicationId,
                    'current_status' => $application->status
                ]);

                return response()->json([
                    'message' => 'This application cannot be cancelled as it has already been processed'
                ], 400);
            }

            // Update application status to withdrawn
            $application->status = 'withdrawn';
            $application->save();

            // Log successful cancellation
            Log::info('Application cancelled successfully', [
                'application_id' => $applicationId,
                'user_id' => $jobSeeker->id
            ]);

            return response()->json([
                'message' => 'Application cancelled successfully',
                'data' => $application
            ]);
        } catch (\Exception $e) {
            // Log the full error details
            Log::error('Failed to cancel application', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'application_id' => $applicationId
            ]);

            return response()->json([
                'message' => 'Failed to cancel application',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
