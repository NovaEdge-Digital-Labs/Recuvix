'use client';

interface PasswordStrengthBarProps {
    password: string;
}

function getStrength(password: string): { score: number; label: string; color: string } {
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: '#ef4444' };
    if (score === 2) return { score: 2, label: 'Fair', color: '#f97316' };
    if (score === 3) return { score: 3, label: 'Good', color: '#eab308' };
    return { score: 4, label: 'Strong', color: '#22c55e' };
}

export function PasswordStrengthBar({ password }: PasswordStrengthBarProps) {
    const { score, label, color } = getStrength(password);

    if (!password) return null;

    return (
        <div className="mt-2 space-y-1.5">
            <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                            backgroundColor: i <= score ? color : '#27272a',
                        }}
                    />
                ))}
            </div>
            <p className="text-xs font-medium" style={{ color }}>
                {label}
            </p>
        </div>
    );
}
