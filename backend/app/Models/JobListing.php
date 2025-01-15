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
        'salary',
        'experience_level',
        'category',
        'is_active',
        'is_featured',
        'deadline'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'deadline' => 'date'
    ];

    public function employer()
    {
        return $this->belongsTo(Employer::class);
    }
}
