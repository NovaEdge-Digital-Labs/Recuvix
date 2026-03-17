import React from 'react';
import { UsersTable } from './UsersTable';

export const UsersTab = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">User Management</h1>
                    <p className="text-zinc-500 text-sm">Monitor activity, manage roles, and handle credit allocations.</p>
                </div>
            </div>

            <UsersTable />
        </div>
    );
};
