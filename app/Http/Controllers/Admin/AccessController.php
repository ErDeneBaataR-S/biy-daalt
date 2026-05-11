<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class AccessController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('admin/access', [
            'roles' => [
                [
                    'role' => User::ROLE_ADMIN,
                    'capabilities' => [
                        'Admin overview',
                        'User management',
                        'Access overview',
                        'Projects',
                        'Analytics',
                        'Docs',
                        'Settings',
                    ],
                ],
                [
                    'role' => User::ROLE_MANAGER,
                    'capabilities' => [
                        'Dashboard',
                        'Projects',
                        'Backlog',
                        'Roadmap',
                        'Feedback',
                        'Releases',
                        'Analytics',
                        'Docs',
                        'Settings',
                    ],
                ],
                [
                    'role' => User::ROLE_EMPLOYEE,
                    'capabilities' => [
                        'My dashboard',
                        'My tasks',
                        'Personal tasks',
                        'Updates',
                        'Docs',
                        'Settings',
                    ],
                ],
            ],
        ]);
    }
}
