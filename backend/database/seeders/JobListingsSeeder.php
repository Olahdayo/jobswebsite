<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Job;
use App\Models\Employer;
use App\Models\JobListing;
use Illuminate\Support\Facades\DB;

class JobListingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get all employer IDs
        $employerIds = Employer::pluck('id')->toArray();
        
        if (empty($employerIds)) {
            echo "No employers found. Please run EmployerSeeder first.\n";
            return;
        }

        // Create 50 random jobs using factory
        JobListing::factory()->count(50)->create([
            'employer_id' => fn() => $employerIds[array_rand($employerIds)],
            'is_active' => true,
            'is_featured' => fn() => rand(0, 1),
            'category' => fn() => collect([
                'Technology',
                'Healthcare',
                'Education',
                'Finance',
                'Manufacturing',
                'Marketing',
                'Sales',
                'Engineering',
                'Customer Service',
                'Human Resources'
            ])->random(),
            'deadline' => fn() => now()->addDays(rand(7, 60))->format('Y-m-d')
        ]);
    }
}
