<?php

namespace Database\Seeders;

use App\Models\JobSeeker;
use Illuminate\Database\Seeder;

class JobSeekerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 20 job seekers
        JobSeeker::factory(20)->create();
    }
}
