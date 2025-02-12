<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Employer;
use App\Models\Application;
use Carbon\Carbon;

class Job extends Model
{
    use HasFactory;

    protected $table = 'job_listings';

    protected $fillable = [
        'employer_id',
        'title',
        'description',
        'location',
        'type',
        'salary',
        'experience_level',
        'requirements',
        'responsibilities',
        'is_active',
        'is_featured',
        'deadline'
    ];

    protected $casts = [
        'requirements' => 'array',
        'responsibilities' => 'array',
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'deadline' => 'date',
        'salary' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    protected $appends = ['created_date', 'deadline_date'];

    /**
     * Get the employer that owns the job.
     */
    public function employer()
    {
        return $this->belongsTo(Employer::class);
    }

    /**
     * Get the applications for the job.
     */
    public function applications()
    {
        return $this->hasMany(Application::class, 'job_id');
    }

    /**
     * Get formatted created date
     */
    public function getCreatedDateAttribute()
    {
        return $this->created_at ? Carbon::parse($this->created_at)->format('M d, Y') : null;
    }

    /**
     * Get formatted deadline date
     */
    public function getDeadlineDateAttribute()
    {
        return $this->deadline ? Carbon::parse($this->deadline)->format('M d, Y') : null;
    }
}
