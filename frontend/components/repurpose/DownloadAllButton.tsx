"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileArchive } from 'lucide-react';

interface DownloadAllButtonProps {
    onDownload: () => void;
    disabled: boolean;
}

export const DownloadAllButton: React.FC<DownloadAllButtonProps> = ({
    onDownload,
    disabled,
}) => {
    return (
        <Button
            variant="outline"
            size="sm"
            onClick={onDownload}
            disabled={disabled}
            className="h-9 border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white"
        >
            <Download className="w-4 h-4 mr-2" />
            Download All (ZIP)
        </Button>
    );
};
