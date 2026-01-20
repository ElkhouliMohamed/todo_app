<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create main admin user
        User::factory()->create([
            'name' => 'Mohamed Elkhouli',
            'email' => 'elkhoulimohameddev@gmail.com',
            'email_verified_at' => now(), // Admin accounts are pre-verified
        ]);

        $this->call(RolesAndPermissionsSeeder::class);
    }
}
