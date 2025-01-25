<?php

namespace App\Policies;

use App\Models\Employer;
use App\Models\JobListing;
use Illuminate\Auth\Access\HandlesAuthorization;
use Illuminate\Support\Facades\Log;

class JobListingPolicy
{
    use HandlesAuthorization;

    /**
     * Determine if the user can view job applications
     */
    public function viewApplications($user, $job)
    {
        // Log the user details for debugging with more context
        // Log::info('Job Applications Authorization Check', [
        //     'user_id' => $user->id,
        //     'user_type' => $user->user_type ?? 'unknown',
        //     'user_email' => $user->email,
        //     'job_id' => $job->id,
        //     'job_employer_id' => $job->employer_id,
        //     'is_employer_match' => $user->id === $job->employer_id,
        //     'is_admin' => $user->user_type === 'admin'
        // ]);

        // Explicit type casting and null checks
        $userType = $user->user_type ?? null;
        $userId = $user->id ?? null;
        $jobEmployerId = $job->employer_id ?? null;

        // Detailed authorization logic with explicit logging
        if ($userType === 'employer' && $userId === $jobEmployerId) {
            Log::info('Job Applications Access Granted', [
                'reason' => 'User is employer of the job',
                'user_id' => $userId,
                'job_id' => $job->id
            ]);
            return true;
        }

        // Allow admins to view all job applications
        if ($userType === 'admin') {
            Log::info('Job Applications Access Granted', [
                'reason' => 'User is admin',
                'user_id' => $userId,
                'job_id' => $job->id
            ]);
            return true;
        }

        // Log denial with detailed context
        Log::warning('Job Applications Access Denied', [
            'user_id' => $userId,
            'user_type' => $userType,
            'job_id' => $job->id,
            'job_employer_id' => $jobEmployerId,
            'reason' => 'User does not have required permissions'
        ]);

        // Deny access by default
        return false;
    }

    /**
     * Determine if the user can update application status
     */
    public function updateApplicationStatus($user, $application)
    {
        // Log the user details for debugging
        Log::info('Job Application Status Update Authorization Check', [
            'user_id' => $user->id,
            'user_type' => $user->user_type ?? 'unknown',
            'job_employer_id' => $application->jobListing->employer_id
        ]);

        // Allow employers and admins to update application status
        // For employers, ensure they own the job
        if ($user->user_type === 'employer' && $user->id === $application->jobListing->employer_id) {
            return true;
        }

        // Allow admins to update all application statuses
        if ($user->user_type === 'admin') {
            return true;
        }

        // Deny access by default
        return false;
    }
}
