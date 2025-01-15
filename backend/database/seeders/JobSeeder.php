<?php

namespace Database\Seeders;

use App\Models\Employer;
use App\Models\JobListing;
use Illuminate\Database\Seeder;

class JobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Each employer creates 1-5 jobs
        Employer::all()->each(function ($employer) {
            JobListing::factory()
                ->count(rand(1, 5))
                ->create([
                    'employer_id' => $employer->id
                ]);
        });
    }
}
