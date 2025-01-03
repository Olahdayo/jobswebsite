<?php

namespace Database\Factories;

use App\Models\Employer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Job>
 */
class JobFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $jobTypes = ['full-time', 'part-time', 'contract'];
        $experienceLevels = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive'];

        $requirements = [
            'Education requirements',
            'Technical skills',
            'Soft skills',
            'Years of experience',
            'Certifications',
        ];

        $responsibilities = [
            'Project management',
            'Team collaboration',
            'Client communication',
            'Code development',
            'Quality assurance',
            'Documentation',
        ];

        return [
            'employer_id' => Employer::factory(),
            'title' => fake()->jobTitle(),
            'description' => fake()->paragraphs(3, true),
            'location' => fake()->city() . ', ' . fake()->country(),
            'type' => fake()->randomElement($jobTypes),
            'salary' => fake()->numberBetween(30000, 150000),
            'experience_level' => fake()->randomElement($experienceLevels),
            'requirements' => fake()->randomElements($requirements, random_int(3, 5)),
            'responsibilities' => fake()->randomElements($responsibilities, random_int(4, 6)),
            'is_active' => fake()->boolean(90), // 90% chance of being active
            'deadline' => fake()->dateTimeBetween('+1 week', '+2 months'),
        ];
    }
}
