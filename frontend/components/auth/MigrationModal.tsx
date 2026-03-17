'use client';

import { useState, useEffect } from 'react';
import { X, Loader2, CheckCircle, AlertCircle, Database, Key, Globe, Microscope } from 'lucide-react';
import { detectLocalData, migrateLocalDataToSupabase, clearLocalData, type LocalDataSummary, type MigrationResult } from '@/lib/migration/localStorageMigrator';
import { useAuth } from '@/context/AuthContext';

interface MigrationModalProps {
    onDismiss: () => void;
}

export function MigrationModal({ onDismiss }: MigrationModalProps) {
    const { user } = useAuth();
    const [summary, setSummary] = useState<LocalDataSummary | null>(null);
    const [options, setOptions] = useState({ blogs: true, apiKeys: true, wpConnections: true, research: true });
    const [isMigrating, setIsMigrating] = useState(false);
    const [progress, setProgress] = useState('');
    const [result, setResult] = useState<MigrationResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const localSummary = detectLocalData();
        setSummary(localSummary);
    }, []);

    if (!summary) return null;

    // Nothing to migrate
    const nothingToMigrate = summary.blogCount === 0 && !summary.hasApiKeys && summary.wpConnectionCount === 0 && summary.researchCount === 0;
    if (nothingToMigrate) return null;

    const handleMigrate = async () => {
        if (!user) return;
        setIsMigrating(true);
        setError(null);
        try {
            const migrationResult = await migrateLocalDataToSupabase(
                user.id,
                options,
                (msg) => setProgress(msg),
            );
            setResult(migrationResult);
            // Only clear localStorage if all items succeeded
            const allSucceeded =
                migrationResult.blogs.failed === 0 &&
                migrationResult.apiKeys.failed === 0 &&
                migrationResult.wpConnections.failed === 0 &&
                migrationResult.research.failed === 0;
            if (allSucceeded) clearLocalData();
        } catch {
            setError('Migration encountered an unexpected error. Your local data is safe.');
        }
        setIsMigrating(false);
    };

    if (result) {
        const totalSuccess = result.blogs.success + result.apiKeys.success + result.wpConnections.success + result.research.success;
        const totalFailed = result.blogs.failed + result.apiKeys.failed + result.wpConnections.failed + result.research.failed;
        return (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
                <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-md shadow-2xl">
                    <div className="text-center space-y-4">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto ${totalFailed === 0 ? 'bg-[#e8ff47]/10 border border-[#e8ff47]/20' : 'bg-yellow-500/10 border border-yellow-500/20'}`}>
                            {totalFailed === 0 ? <CheckCircle size={24} className="text-[#e8ff47]" /> : <AlertCircle size={24} className="text-yellow-400" />}
                        </div>
                        <h3 className="text-xl font-bold">
                            {totalFailed === 0 ? `✓ Import complete!` : 'Partial import'}
                        </h3>
                        <div className="text-sm text-muted-foreground space-y-1">
                            {result.blogs.success > 0 && <p>✓ {result.blogs.success} blogs imported</p>}
                            {result.apiKeys.success > 0 && <p>✓ API keys imported</p>}
                            {result.wpConnections.success > 0 && <p>✓ {result.wpConnections.success} WordPress connection(s) imported</p>}
                            {result.research.success > 0 && <p>✓ {result.research.success} research session(s) imported</p>}
                            {totalFailed > 0 && <p className="text-red-400">✗ {totalFailed} item(s) failed — local data preserved</p>}
                        </div>
                        <button onClick={onDismiss} className="w-full h-11 bg-[#e8ff47] text-black font-bold rounded-xl hover:bg-[#d4e840] transition-colors text-sm">
                            {totalSuccess > 0 ? 'Start using Recuvix →' : 'Close'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
            <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-md shadow-2xl">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-foreground">Import Your Existing Data</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            We found data saved locally on this device. Import it to your account.
                        </p>
                    </div>
                    <button onClick={onDismiss} className="text-muted-foreground hover:text-foreground p-1">
                        <X size={18} />
                    </button>
                </div>

                <div className="space-y-3 mb-6">
                    {summary.blogCount > 0 && (
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={options.blogs} onChange={(e) => setOptions({ ...options, blogs: e.target.checked })} className="w-4 h-4 rounded accent-[#e8ff47]" />
                            <Database size={16} className="text-muted-foreground" />
                            <span className="text-sm text-foreground">{summary.blogCount} generated blog{summary.blogCount !== 1 ? 's' : ''}</span>
                        </label>
                    )}
                    {summary.hasApiKeys && (
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={options.apiKeys} onChange={(e) => setOptions({ ...options, apiKeys: e.target.checked })} className="w-4 h-4 rounded accent-[#e8ff47]" />
                            <Key size={16} className="text-muted-foreground" />
                            <span className="text-sm text-foreground">API key configuration</span>
                        </label>
                    )}
                    {summary.wpConnectionCount > 0 && (
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={options.wpConnections} onChange={(e) => setOptions({ ...options, wpConnections: e.target.checked })} className="w-4 h-4 rounded accent-[#e8ff47]" />
                            <Globe size={16} className="text-muted-foreground" />
                            <span className="text-sm text-foreground">{summary.wpConnectionCount} WordPress connection{summary.wpConnectionCount !== 1 ? 's' : ''}</span>
                        </label>
                    )}
                    {summary.researchCount > 0 && (
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={options.research} onChange={(e) => setOptions({ ...options, research: e.target.checked })} className="w-4 h-4 rounded accent-[#e8ff47]" />
                            <Microscope size={16} className="text-muted-foreground" />
                            <span className="text-sm text-foreground">{summary.researchCount} research session{summary.researchCount !== 1 ? 's' : ''}</span>
                        </label>
                    )}
                </div>

                {isMigrating && (
                    <div className="mb-4 p-3 bg-background border border-border rounded-xl">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 size={14} className="animate-spin" />
                            <span className="truncate">{progress || 'Importing...'}</span>
                        </div>
                    </div>
                )}

                {error && (
                    <p className="mb-4 text-sm text-red-400 bg-red-500/10 rounded-xl px-4 py-3">{error}</p>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={onDismiss}
                        disabled={isMigrating}
                        className="flex-1 h-11 border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
                    >
                        Skip
                    </button>
                    <button
                        onClick={handleMigrate}
                        disabled={isMigrating}
                        className="flex-1 h-11 bg-[#e8ff47] text-black font-bold rounded-xl hover:bg-[#d4e840] transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        {isMigrating ? <><Loader2 size={14} className="animate-spin" /> Importing...</> : 'Import to Account'}
                    </button>
                </div>
            </div>
        </div>
    );
}
