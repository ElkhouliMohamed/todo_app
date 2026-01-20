<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // create permissions
        Permission::firstOrCreate(['name' => 'manage app']);
        Permission::firstOrCreate(['name' => 'view logs']);

        // create roles and assign created permissions
        $role = Role::firstOrCreate(['name' => 'admin']);
        $role->givePermissionTo('manage app');
        $role->givePermissionTo('view logs');

        // Assign admin role to both admin users
        $adminEmails = ['elkhoulimohameddev@gmail.com'];

        foreach ($adminEmails as $email) {
            $user = User::where('email', $email)->first();
            if ($user && !$user->hasRole('admin')) {
                $user->assignRole('admin');
            }
        }
    }
}
