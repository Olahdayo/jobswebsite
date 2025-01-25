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

    public function jobListing()
    {
        return $this->belongsTo(JobListing::class, 'job_id');
    }

    public function jobSeeker()
    {
        return $this->belongsTo(JobSeeker::class, 'job_seeker_id');
    }
}
