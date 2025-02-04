<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Employer;
use App\Models\JobSeeker;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function employerRegister(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'email' => 'required|string|email:rfc,dns|max:255|unique:employers',
            'password' => 'required|string|min:8|confirmed',
            'company_description' => 'required|string',
            'industry' => 'required|string',
            'location' => 'required|string',
            'website' => 'nullable|url',
            'remember' => 'boolean'
        ]);

        $employer = Employer::create([
            'company_name' => $validated['company_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'company_description' => $validated['company_description'],
            'industry' => $validated['industry'],
            'location' => $validated['location'],
            'website' => $validated['website'] ?? null,
        ]);

        $token = $employer->createToken('auth_token', ['employer'])->plainTextToken;

        $remember_token = null;
        if ($request->boolean('remember')) {
            $remember_token = Str::random(60);
            $employer->remember_token = $remember_token;
            $employer->save();
        }

        return response()->json([
            'employer' => $employer,
            'token' => $token,
            'token_type' => 'Bearer',
            'remember_token' => $remember_token
        ], 201);
    }

    public function jobSeekerRegister(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email:rfc,dns|max:255|unique:job_seekers',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string',
            'education_level' => 'required|string',
            'location' => 'required|string',
            'remember' => 'boolean'
        ]);

        $jobSeeker = JobSeeker::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'phone' => $validated['phone'] ?? null,
            'education_level' => $validated['education_level'],
            'location' => $validated['location'],
        ]);

        $token = $jobSeeker->createToken('auth_token', ['job_seeker'])->plainTextToken;

        $remember_token = null;
        if ($request->boolean('remember')) {
            $remember_token = Str::random(60);
            $jobSeeker->remember_token = $remember_token;
            $jobSeeker->save();
        }

        return response()->json([
            'job_seeker' => $jobSeeker,
            'token' => $token,
            'token_type' => 'Bearer',
            'remember_token' => $remember_token
        ], 201);
    }

    public function jobSeekerLogin(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'remember' => 'boolean'
        ]);

        // Find the job seeker
        $jobSeeker = JobSeeker::where('email', $validated['email'])->first();

        // Check credentials manually
        if (!$jobSeeker || !Hash::check($validated['password'], $jobSeeker->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        // Create token with proper abilities
        $token = $jobSeeker->createToken('auth_token', ['job-seeker'])->plainTextToken;

        // Handle remember me functionality
        $remember_token = null;
        if ($request->boolean('remember')) {
            $remember_token = Str::random(60);
            $jobSeeker->remember_token = $remember_token;
            $jobSeeker->save();
        }

        return response()->json([
            'token' => $token,
            'job_seeker' => $jobSeeker,
            'remember_token' => $remember_token
        ]);
    }

    public function employerLogin(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'remember' => 'boolean'
        ]);

        $employer = Employer::where('email', $request->email)->first();

        if (!$employer || !Hash::check($request->password, $employer->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $token = $employer->createToken('auth_token', ['employer'])->plainTextToken;

        $remember_token = null;
        if ($request->boolean('remember')) {
            $remember_token = Str::random(60);
            $employer->remember_token = $remember_token;
            $employer->save();
        }

        return response()->json([
            'employer' => $employer,
            'token' => $token,
            'token_type' => 'Bearer',
            'remember_token' => $remember_token
        ]);
    }

    public function logout(Request $request)
    {
        try {
            if ($request->user()) {
                $request->user()->currentAccessToken()->delete();
                return response()->json(['message' => 'Successfully logged out']);
            }
            return response()->json(['message' => 'No active session found'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error during logout', 'error' => $e->getMessage()], 500);
        }
    }
}
