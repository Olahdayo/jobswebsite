<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    use HasFactory;

    protected $table = 'applications';

    protected $fillable = [
        'job_id',
        'job_seeker_id',
        'resume_url',
        'status',
        'cover_letter',
        'employer_notes'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The model's default values for attributes.
     *
     * @var array
     */
    protected $attributes = [
        'status' => 'pending'
    ];

    /**
     * Get the job listing that owns the application.
     */
    public function jobListing()
    {
        return $this->belongsTo(JobListing::class, 'job_id');
    }

    /**
     * Get the job seeker that owns the application.
     */
    public function jobSeeker()
    {
        return $this->belongsTo(JobSeeker::class, 'job_seeker_id');
    }
}
