<?php

namespace App\Policies;

use App\Models\Employer;
use App\Models\JobListing;
use Illuminate\Auth\Access\HandlesAuthorization;
use App\Models\User;

class JobListingPolicy
{
    use HandlesAuthorization;

    /**
     * Determine if the user can view job applications
     */
    public function viewApplications($user, $job)
    {


        // Explicit type casting and null checks
        $userType = $user->user_type ?? null;
        $userId = $user->id ?? null;
        $jobEmployerId = $job->employer_id ?? null;

        // Detailed authorization logic with explicit logging
        if ($userType === 'employer' && $userId === $jobEmployerId) {
            return true;
        }

        // Allow admins to view all job applications
        if ($userType === 'admin') {
           
            return true;
        }
        // Deny access by default
        return false;
    }

    /**
     * Determine if the user can update application status
     */
    public function updateApplicationStatus($user, $application)
    {
     

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

    public function update($user, JobListing $job)
    {
        // Handle both User and Employer models
        $userId = $user instanceof \App\Models\Employer ? $user->id : $user->employer_id;

        // Log for debugging
        info('Authorization check', [
            'user_type' => get_class($user),
            'user_id' => $userId,
            'job_employer_id' => $job->employer_id
        ]);

        // Allow if user is the employer who created the job
        return $userId === $job->employer_id;
    }
}
