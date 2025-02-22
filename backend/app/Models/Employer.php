<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Employer extends Authenticatable
{
    use HasFactory;
    use HasApiTokens;

    protected $fillable = [
        'company_name',
        'email',
        'password',
        'phone',
        'company_description',
        'website',
        'industry',
        'location',
        'logo_url',
        'is_verified'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'password' => 'hashed',
    ];

    protected $appends = [
        'user_type'
    ];

    public function jobs()
    {
        return $this->hasMany(Job::class);
    }

    /**
     * Get the user type for the employer
     *
     * @return string
     */
    public function getUserTypeAttribute()
    {
        return 'employer';
    }

    /**
     * Scope a query to find an employer by email
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param string $email
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeFindByEmail($query, $email)
    {
        return $query->where('email', $email);
    }
}
