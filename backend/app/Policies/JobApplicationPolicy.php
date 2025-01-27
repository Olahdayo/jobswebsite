<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Employer;
use App\Models\JobApplication;
use Illuminate\Support\Facades\Log;
use Illuminate\Auth\Access\HandlesAuthorization;

class JobApplicationPolicy
{
    use HandlesAuthorization;

    /**
     * Determine if the user can update the job application status
     * 
     * @param User|Employer $user The authenticated user or employer
     * @param JobApplication $jobApplication The job application to update
     * @return bool
     */
    public function updateStatus($user, JobApplication $jobApplication)
    {
        // Log authorization attempt
        Log::info('Job Application Status Update Authorization Check', [
            'user_id' => $user->id,
            'user_type' => $user instanceof Employer ? 'employer' : get_class($user),
            'application_id' => $jobApplication->id,
            'job_listing_id' => $jobApplication->job_listing_id,
            'employer_id' => $jobApplication->jobListing->employer_id ?? null
        ]);

        // Check if user is an employer
        if (!($user instanceof Employer)) {
            Log::warning('Unauthorized user type attempting to update application status', [
                'user_id' => $user->id,
                'user_type' => get_class($user)
            ]);
            return false;
        }

        // Check if the employer owns the job listing
        $isAuthorized = $user->id === $jobApplication->jobListing->employer_id;

        // Log authorization result
        Log::info('Job Application Status Update Authorization Result', [
            'is_authorized' => $isAuthorized,
            'user_id' => $user->id,
            'employer_id' => $jobApplication->jobListing->employer_id
        ]);

        return $isAuthorized;
    }
}
