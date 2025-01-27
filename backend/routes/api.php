<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\JobController;
use App\Http\Controllers\API\EmployerController;
use App\Http\Controllers\API\JobSeekerController;
use App\Http\Controllers\API\ApplicationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/jobseeker/register', [AuthController::class, 'jobSeekerRegister']);
Route::post('/employer/register', [AuthController::class, 'employerRegister']);
Route::post('/jobseeker/login', [AuthController::class, 'jobSeekerLogin']);
Route::post('/employer/login', [AuthController::class, 'employerLogin']);

// Job routes (public)
Route::prefix('jobs')->group(function () {
    Route::get('/', [JobController::class, 'index']);
    Route::get('/stats', [JobController::class, 'getStats']);
    Route::get('/search', [JobController::class, 'search']);
    Route::get('/recent', [JobController::class, 'recent']);
    Route::get('/featured', [JobController::class, 'getFeaturedJobs']);
    Route::get('/by-state', [JobController::class, 'byState']);
    Route::get('/by-category', [JobController::class, 'byCategory']);
    Route::get('/locations', [JobController::class, 'getLocations']);
    Route::get('/categories', [JobController::class, 'getCategories']);
    Route::get('/location/{location}', [JobController::class, 'getJobsByLocation']);
    Route::get('/category/{category}', [JobController::class, 'getJobsByCategory']);
    Route::get('/{jobListing}', [JobController::class, 'show'])->where('jobListing', '[0-9]+');
});

// Protected routes for employers
Route::middleware(['auth:sanctum,employer'])->group(function () {
    Route::post('/employer/logout', [AuthController::class, 'logout']);

    // Profile management
    Route::get('/employer/profile', [EmployerController::class, 'profile']);
    Route::put('/employer/profile', [EmployerController::class, 'updateProfile']);

    // Job management
    Route::get('/employer/jobs', [EmployerController::class, 'jobs']);
    Route::get('/employer/stats', [EmployerController::class, 'stats']); 
    Route::post('/jobs', [JobController::class, 'store']);
    Route::put('/jobs/{job}', [JobController::class, 'update']);
    Route::delete('/jobs/{job}', [JobController::class, 'destroy']);

    // Job Applications Routes
    Route::get('/jobs/{job}/applications', [JobController::class, 'getJobApplications']);
    Route::patch('/job-applications/{applicationId}/status', [JobController::class, 'updateApplicationStatus']);
    Route::get('/job-applications/{application}/download-resume', 
        [JobController::class, 'downloadResume']
    )->name('job-applications.download-resume');

});

// Protected routes for job seekers
Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/jobseeker/logout', [AuthController::class, 'logout']);
    Route::get('/jobseeker/profile', [JobSeekerController::class, 'profile']);
    Route::put('/jobseeker/profile', [JobSeekerController::class, 'updateProfile']);
    
    // Application routes
    Route::prefix('applications')->group(function () {
        Route::get('/', [ApplicationController::class, 'index']);
        Route::post('/', [ApplicationController::class, 'store']);
        Route::get('/{application}', [ApplicationController::class, 'show']);
        Route::put('/{application}', [ApplicationController::class, 'update']);
        Route::post('/{application}/cancel', [ApplicationController::class, 'cancel']);
    });
});
