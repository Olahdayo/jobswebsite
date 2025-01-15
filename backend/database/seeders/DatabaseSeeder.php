<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Database\Seeders\EmployerSeeder;
use Database\Seeders\JobSeekerSeeder;
use Database\Seeders\JobSeeder;
use Database\Seeders\ApplicationSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $this->call([
            EmployerSeeder::class,
            JobSeekerSeeder::class,
            JobSeeder::class,
            ApplicationSeeder::class,
        ]);
    }
}
