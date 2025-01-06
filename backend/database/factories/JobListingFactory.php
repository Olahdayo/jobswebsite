<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\JobListing;

class JobListingFactory extends Factory
{
    protected $model = JobListing::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $jobTitles = [
            'Software Engineer', 'Product Manager', 'Data Scientist', 'UI/UX Designer',
            'Marketing Manager', 'Sales Representative', 'HR Manager', 'Financial Analyst',
            'Project Manager', 'Business Analyst', 'DevOps Engineer', 'Quality Assurance Engineer',
            'Content Writer', 'Graphic Designer', 'Account Manager'
        ];

        $locations = [
            'Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Kaduna', 
            'Enugu', 'Benin City', 'Calabar', 'Remote'
        ];

        $categories = [
            'Technology', 'Healthcare', 'Education', 'Finance',
            'Manufacturing', 'Marketing', 'Sales', 'Engineering',
            'Human Resources', 'Design', 'Operations'
        ];

        $experienceLevels = ['Entry Level', 'Mid-Level', 'Senior', 'Lead', 'Manager'];
        $jobTypes = ['full-time', 'part-time', 'contract'];

        $minSalary = fake()->numberBetween(15, 80) * 10000;
        $maxSalary = $minSalary + (fake()->numberBetween(10, 40) * 10000);

        return [
            'title' => fake()->randomElement($jobTitles) . ' ' . fake()->jobTitle(),
            'description' => fake()->paragraph(3),
            'requirements' => fake()->paragraph(2),
            'responsibilities' => fake()->paragraph(2),
            'location' => fake()->randomElement($locations),
            'type' => fake()->randomElement($jobTypes),
            'min_salary' => $minSalary,
            'max_salary' => $maxSalary,
            'experience_level' => fake()->randomElement($experienceLevels),
            'is_active' => true,
            'is_featured' => fake()->boolean(20), // 20% chance of being featured
            'deadline' => fake()->dateTimeBetween('now', '+2 months')->format('Y-m-d'),
            'category' => fake()->randomElement($categories),
        ];
    }
}
