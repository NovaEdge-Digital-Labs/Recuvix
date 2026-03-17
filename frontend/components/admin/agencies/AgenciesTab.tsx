import React from 'react';
import { AgencyTable } from './AgencyTable';

export const AgenciesTab = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Agency Partners</h1>
                    <p className="text-zinc-500 text-sm">Monitor white-label tenant health, revenue performance, and licence status.</p>
                </div>
            </div>

            <AgencyTable />
        </div>
    );
};
