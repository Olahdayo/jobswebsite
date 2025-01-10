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
    /**
     * Store a newly created application in storage.
     */
    public function store(Request $request)
    {
        try {
            Log::info('Starting application submission', [
                'job_id' => $request->job_id,
                'job_seeker_id' => $request->job_seeker_id
            ]);

            // Validate request
            $validator = Validator::make($request->all(), [
                'job_id' => 'required|exists:jobs,id',
                'job_seeker_id' => 'required|exists:job_seekers,id',
                'cover_letter' => 'required|string|min:100',
                'resume' => 'required|file|mimes:pdf,doc,docx|max:5120', // 5MB max
            ]);

            if ($validator->fails()) {
                Log::warning('Application validation failed', [
                    'errors' => $validator->errors()->toArray()
                ]);
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check if user has already applied
            $existingApplication = Application::where('job_id', $request->job_id)
                ->where('job_seeker_id', $request->job_seeker_id)
                ->first();

            if ($existingApplication) {
                Log::info('Duplicate application attempt', [
                    'job_id' => $request->job_id,
                    'job_seeker_id' => $request->job_seeker_id
                ]);
                return response()->json([
                    'message' => 'You have already applied for this job'
                ], 422);
            }

            // Get the job and check if it's still open
            $job = Job::find($request->job_id);
            if (!$job) {
                Log::warning('Job not found', ['job_id' => $request->job_id]);
                return response()->json([
                    'message' => 'Job not found'
                ], 404);
            }

            if ($job->deadline && now()->isAfter($job->deadline)) {
                Log::info('Application attempt for expired job', [
                    'job_id' => $request->job_id,
                    'deadline' => $job->deadline
                ]);
                return response()->json([
                    'message' => 'This job posting has expired'
                ], 422);
            }

            // Handle file upload
            if (!$request->hasFile('resume')) {
                Log::warning('Resume file missing in request');
                return response()->json([
                    'message' => 'Resume file is required'
                ], 422);
            }

            try {
                $file = $request->file('resume');
                Log::info('Processing resume file', [
                    'original_name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'mime_type' => $file->getMimeType()
                ]);

                // Create resumes directory if it doesn't exist
                $resumesPath = storage_path('app/public/resumes');
                if (!file_exists($resumesPath)) {
                    mkdir($resumesPath, 0755, true);
                }

                $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('resumes', $filename, 'public');

                if (!$path) {
                    throw new \Exception('Failed to store resume file');
                }

                Log::info('Resume file stored successfully', ['path' => $path]);
            } catch (\Exception $e) {
                Log::error('File upload failed', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                return response()->json([
                    'message' => 'Failed to upload resume file'
                ], 500);
            }

            // Create application
            $application = Application::create([
                'job_id' => $request->job_id,
                'job_seeker_id' => $request->job_seeker_id,
                'cover_letter' => $request->cover_letter,
                'resume_url' => $path,
                'status' => 'pending'
            ]);

            Log::info('Application created successfully', [
                'application_id' => $application->id
            ]);

            return response()->json([
                'message' => 'Application submitted successfully',
                'data' => $application
            ], 201);

        } catch (\Exception $e) {
            // Delete uploaded file if application creation fails
            if (isset($path)) {
                try {
                    Storage::disk('public')->delete($path);
                    Log::info('Cleaned up resume file after error', ['path' => $path]);
                } catch (\Exception $deleteError) {
                    Log::error('Failed to clean up resume file', [
                        'path' => $path,
                        'error' => $deleteError->getMessage()
                    ]);
                }
            }

            Log::error('Application submission failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->except(['resume'])
            ]);

            return response()->json([
                'message' => 'Failed to submit application',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display a listing of applications for the authenticated job seeker.
     */
    public function index(Request $request)
    {
        try {
            $applications = Application::where('job_seeker_id', $request->user()->id)
                ->with(['job', 'job.employer'])
                ->latest()
                ->get();

            return response()->json($applications);
        } catch (\Exception $e) {
            Log::error('Failed to fetch applications', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Failed to fetch applications',
                'error' => $e->getMessage()
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
            Log::error('Failed to fetch application details', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
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
}
