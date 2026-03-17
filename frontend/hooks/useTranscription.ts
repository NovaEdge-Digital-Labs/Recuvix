import { useState, useCallback, useRef, useEffect } from 'react';

export type TranscriptionStatus = 'idle' | 'uploading' | 'processing' | 'chunking' | 'complete' | 'failed';

export function useTranscription() {
    const [recordingId, setRecordingId] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'complete' | 'error'>('idle');
    const [transcriptionStatus, setTranscriptionStatus] = useState<TranscriptionStatus>('idle');
    const [transcript, setTranscript] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPolling, setIsPolling] = useState(false);
    const [isCleaning, setIsCleaning] = useState(false);

    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const uploadAudio = async (blob: Blob | File, sourceType: string, workspaceId?: string) => {
        setUploadStatus('uploading');
        setUploadProgress(10); // Start progress
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', blob);
            formData.append('sourceType', sourceType);
            if (workspaceId) formData.append('workspaceId', workspaceId);

            // In a real implementation with progress, we'd use XMLHttpRequest or similar
            // For now, we'll simulate it with fetch
            setUploadProgress(30);
            const res = await fetch('/api/voice/upload', {
                method: 'POST',
                headers: {
                    // Token will be handled by interceptors if any, or we pass it here
                    'Authorization': `Bearer ${localStorage.getItem('supabase-auth-token')}`
                },
                body: formData,
            });

            setUploadProgress(80);
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Upload failed');

            setRecordingId(data.recordingId);
            setUploadStatus('complete');
            setUploadProgress(100);
            return data.recordingId;

        } catch (err: any) {
            setUploadStatus('error');
            setError(err.message);
            throw err;
        }
    };

    const startTranscription = async (options: {
        recordingId: string;
        language?: string;
        niche?: string;
        useOwnKey?: boolean;
        openAiKey?: string;
    }) => {
        setTranscriptionStatus('processing');
        setError(null);

        try {
            const res = await fetch('/api/voice/transcribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('supabase-auth-token')}`
                },
                body: JSON.stringify(options),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Transcription trigger failed');

            startPolling(options.recordingId);
        } catch (err: any) {
            setTranscriptionStatus('failed');
            setError(err.message);
        }
    };

    const startPolling = useCallback((id: string) => {
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        setIsPolling(true);

        pollingIntervalRef.current = setInterval(async () => {
            try {
                const res = await fetch(`/api/voice/status/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('supabase-auth-token')}`
                    }
                });
                const data = await res.json();

                if (data.status === 'complete') {
                    setTranscriptionStatus('complete');
                    setTranscript(data.transcript);
                    stopPolling();
                } else if (data.status === 'failed') {
                    setTranscriptionStatus('failed');
                    setError(data.error);
                    stopPolling();
                } else {
                    setTranscriptionStatus(data.status);
                    setTranscript(data.transcript); // Might have partial transcript during chunking
                }
            } catch (err: any) {
                console.error('Polling error:', err);
            }
        }, 2000);
    }, []);

    const stopPolling = useCallback(() => {
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
        setIsPolling(false);
    }, []);

    const cleanTranscript = async (options: {
        recordingId: string;
        llmProvider: string;
        apiKey: string;
        targetBlogTopic?: string;
        country: string;
        cleaningLevel: string;
    }) => {
        setIsCleaning(true);
        setError(null);

        try {
            const res = await fetch('/api/voice/clean-transcript', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('supabase-auth-token')}`
                },
                body: JSON.stringify(options),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Cleaning failed');

            setAnalysis(data.analysis);
            setTranscript(data.analysis.cleanedTranscript);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsCleaning(false);
        }
    };

    const updateTranscript = (newText: string) => {
        setTranscript(newText);
    };

    const reset = () => {
        setRecordingId(null);
        setUploadStatus('idle');
        setUploadProgress(0);
        setTranscriptionStatus('idle');
        setTranscript(null);
        setAnalysis(null);
        setError(null);
        stopPolling();
    };

    useEffect(() => {
        return () => stopPolling();
    }, [stopPolling]);

    return {
        recordingId,
        uploadProgress,
        uploadStatus,
        transcriptionStatus,
        transcript,
        analysis,
        isPolling,
        isCleaning,
        error,
        uploadAudio,
        startTranscription,
        cleanTranscript,
        updateTranscript,
        reset
    };
}
