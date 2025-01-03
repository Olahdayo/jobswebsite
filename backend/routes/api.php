<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\JobController;
use App\Http\Controllers\API\EmployerController;
use App\Http\Controllers\API\JobSeekerController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/employers/register', [AuthController::class, 'employerRegister']);
Route::post('/employers/login', [AuthController::class, 'employerLogin']);
Route::post('/jobseekers/register', [AuthController::class, 'jobSeekerRegister']);
Route::post('/jobseekers/login', [AuthController::class, 'jobSeekerLogin']);

// Job routes (public)
Route::prefix('jobs')->group(function () {
    Route::get('/', [JobController::class, 'index']);
    Route::get('/search', [JobController::class, 'search']);
    Route::get('/{job}', [JobController::class, 'show']);
});

// Protected routes for employers
Route::middleware(['auth:sanctum', 'ability:employer'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Profile management
    Route::get('/employer/profile', [EmployerController::class, 'profile']);
    Route::put('/employer/profile', [EmployerController::class, 'updateProfile']);
    
    // Job management
    Route::get('/employer/jobs', [EmployerController::class, 'jobs']);
    Route::post('/jobs', [JobController::class, 'store']);
    Route::put('/jobs/{job}', [JobController::class, 'update']);
    Route::delete('/jobs/{job}', [JobController::class, 'destroy']);
    
    // Application management
    Route::get('/jobs/{job}/applications', [EmployerController::class, 'applications']);
    Route::put('/applications/{application}/status', [EmployerController::class, 'updateApplicationStatus']);
});

// Protected routes for job seekers
Route::middleware(['auth:sanctum', 'ability:job_seeker'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Profile management
    Route::get('/jobseeker/profile', [JobSeekerController::class, 'profile']);
    Route::put('/jobseeker/profile', [JobSeekerController::class, 'updateProfile']);
    
    // Job applications
    Route::post('/jobs/{job}/apply', [JobSeekerController::class, 'applyForJob']);
    Route::get('/jobseeker/applications', [JobSeekerController::class, 'applications']);
});
