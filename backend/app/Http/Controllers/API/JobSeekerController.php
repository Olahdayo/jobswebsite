<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class JobSeekerController extends Controller
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
     * Get the authenticated user's profile.
     */
    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * Update the authenticated user's profile.
     */
    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string',
            'bio' => 'nullable|string',
            'resume_url' => 'nullable|url',
            'skills' => 'nullable|array',
            'education_level' => 'sometimes|string',
            'field_of_study' => 'nullable|string',
            'years_of_experience' => 'sometimes|integer',
            'current_job_title' => 'nullable|string',
            'location' => 'sometimes|string',
        ]);

        $user = $request->user();
        $user->update($validated);

        return response()->json($user);
    }

    /**
     * Upload profile picture for the authenticated user.
     */
    public function uploadProfilePicture(Request $request)
    {
        try {
            
            
            if (!$request->hasFile('profile_picture')) {
              
                return response()->json([
                    'message' => 'No file uploaded',
                    'error' => 'Please select a file to upload'
                ], 400);
            }

            $file = $request->file('profile_picture');
            

            // Validate file
            $validated = $request->validate([
                'profile_picture' => 'required|image|mimes:jpeg,png,gif|max:10240', // 10MB max
            ]);

            $user = $request->user();

            // Delete old profile picture if it exists
            if ($user->profile_picture && !str_starts_with($user->profile_picture, 'http')) {
               
                Storage::disk('public')->delete($user->profile_picture);
            }

            // Generate a unique filename
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            
            // Store the new profile picture with the unique filename
            $path = $file->storeAs('profile-pictures', $filename, 'public');
            
            
            // Update user profile with new image path
            $user->profile_picture = $path;
            $user->save();

            Log::info('Profile picture updated successfully');

            return response()->json([
                'message' => 'Profile picture uploaded successfully',
                'user' => $user
            ]);
        } catch (\Exception $e) {
          
            return response()->json([
                'message' => 'Failed to upload profile picture',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get the authenticated user's job applications.
     */
    public function applications(Request $request)
    {
        $applications = $request->user()
            ->applications()
            ->with(['job.employer'])
            ->latest()
            ->paginate(10);

        return response()->json($applications);
    }

    /**
     * Apply for a job.
     */
    public function apply(Request $request, Job $job)
    {
        $validated = $request->validate([
            'cover_letter' => 'nullable|string',
            'resume_url' => 'required|url',
        ]);

        // Check if already applied
        $existingApplication = $request->user()
            ->applications()
            ->where('job_id', $job->id)
            ->first();

        if ($existingApplication) {
            return response()->json([
                'message' => 'You have already applied for this job'
            ], 422);
        }

        $application = $request->user()->applications()->create([
            'job_id' => $job->id,
            'cover_letter' => $validated['cover_letter'],
            'resume_url' => $validated['resume_url'],
        ]);

        return response()->json($application->load('job.employer'), 201);
    }

    /**
     * Withdraw a job application.
     */
    public function withdrawApplication(Application $application)
    {
        $this->authorize('delete', $application);

        $application->delete();

        return response()->json(null, 204);
    }

    /**
     * Get the authenticated user's saved jobs.
     */
    public function savedJobs(Request $request)
    {
        $savedJobs = $request->user()
            ->savedJobs()
            ->with('employer')
            ->latest()
            ->paginate(10);

        return response()->json($savedJobs);
    }

    /**
     * Save a job.
     */
    public function saveJob(Request $request, Job $job)
    {
        $request->user()->savedJobs()->attach($job->id);

        return response()->json([
            'message' => 'Job saved successfully'
        ]);
    }

    /**
     * Unsave a job.
     */
    public function unsaveJob(Request $request, Job $job)
    {
        $request->user()->savedJobs()->detach($job->id);

        return response()->json([
            'message' => 'Job removed from saved jobs'
        ]);
    }
}
