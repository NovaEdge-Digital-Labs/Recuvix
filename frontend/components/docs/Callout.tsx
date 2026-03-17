import React from 'react';
import { Info, AlertTriangle, XCircle, CheckCircle } from 'lucide-react';

interface CalloutProps {
    children: React.ReactNode;
    type?: 'info' | 'warning' | 'danger' | 'tip';
}

const Callout: React.FC<CalloutProps> = ({ children, type = 'info' }) => {
    const styles = {
        info: {
            border: 'border-blue-500',
            bg: 'bg-blue-500/5',
            icon: <Info className="w-5 h-5 text-blue-500" />,
        },
        warning: {
            border: 'border-yellow-500',
            bg: 'bg-yellow-500/5',
            icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
        },
        danger: {
            border: 'border-red-500',
            bg: 'bg-red-500/5',
            icon: <XCircle className="w-5 h-5 text-red-500" />,
        },
        tip: {
            border: 'border-green-500',
            bg: 'bg-green-500/5',
            icon: <CheckCircle className="w-5 h-5 text-green-500" />,
        },
    };

    const { border, bg, icon } = styles[type];

    return (
        <div className={`flex gap-4 p-4 my-6 border-l-4 rounded-r-lg ${border} ${bg}`}>
            <div className="flex-shrink-0 mt-1">{icon}</div>
            <div className="text-sm leading-relaxed text-gray-300 [&>p]:m-0">
                {children}
            </div>
        </div>
    );
};

export default Callout;
