<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobListing extends Model
{
    use HasFactory;

    protected $fillable = [
        'employer_id',
        'title',
        'description',
        'requirements',
        'responsibilities',
        'location',
        'type',
        'min_salary',
        'max_salary',
        'experience_level',
        'category',
        'education_level',
        'is_active',
        'is_featured',
        'deadline'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'deadline' => 'date',
        'requirements' => 'array',
        'responsibilities' => 'array'
    ];

    public function employer()
    {
        return $this->belongsTo(Employer::class);
    }
}
