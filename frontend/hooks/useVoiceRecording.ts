import { useState, useRef, useCallback, useEffect } from 'react';

export type RecordingPhase = 'idle' | 'requesting_permission' | 'recording' | 'paused' | 'stopped' | 'error';

export function useVoiceRecording() {
    const [phase, setPhase] = useState<RecordingPhase>('idle');
    const [duration, setDuration] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [audioLevel, setAudioLevel] = useState(0);
    const [permissionError, setPermissionError] = useState<string | null>(null);
    const [recordingError, setRecordingError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const rafRef = useRef<number | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const requestPermission = async () => {
        setPhase('requesting_permission');
        setPermissionError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            setPhase('idle');
            return true;
        } catch (err: any) {
            setPermissionError(err.message || 'Microphone access denied');
            setPhase('error');
            return false;
        }
    };

    const startRecording = async () => {
        try {
            let stream = streamRef.current;
            if (!stream) {
                stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                streamRef.current = stream;
            }

            const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
                ? 'audio/webm;codecs=opus'
                : MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')
                    ? 'audio/ogg;codecs=opus'
                    : 'audio/mp4';

            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: mimeType });
                setAudioBlob(blob);
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                setPhase('stopped');
            };

            mediaRecorderRef.current.start(1000);
            setPhase('recording');
            setDuration(0);

            // Start timer
            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);

            // Start visualization
            setupVisualization(stream);

        } catch (err: any) {
            setRecordingError(err.message || 'Failed to start recording');
            setPhase('error');
        }
    };

    const setupVisualization = (stream: MediaStream) => {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 256;

        audioCtxRef.current = audioCtx;
        analyserRef.current = analyser;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const update = () => {
            if (mediaRecorderRef.current?.state === 'recording') {
                analyser.getByteFrequencyData(dataArray);

                // Calculate average level
                let sum = 0;
                for (let i = 0; i < bufferLength; i++) {
                    sum += dataArray[i];
                }
                setAudioLevel(sum / bufferLength / 255);

                rafRef.current = requestAnimationFrame(update);
            }
        };
        update();
    };

    const pauseRecording = () => {
        if (mediaRecorderRef.current?.state === 'recording') {
            mediaRecorderRef.current.pause();
            setPhase('paused');
            if (timerRef.current) clearInterval(timerRef.current);
        }
    };

    const resumeRecording = () => {
        if (mediaRecorderRef.current?.state === 'paused') {
            mediaRecorderRef.current.resume();
            setPhase('recording');
            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            if (timerRef.current) clearInterval(timerRef.current);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);

            // Stop tracks to release microphone
            streamRef.current?.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    };

    const discardRecording = () => {
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        setAudioBlob(null);
        setAudioUrl(null);
        setDuration(0);
        setPhase('idle');
        setRecordingError(null);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            if (audioUrl) URL.revokeObjectURL(audioUrl);
            streamRef.current?.getTracks().forEach(track => track.stop());
        };
    }, [audioUrl]);

    return {
        phase,
        duration,
        audioBlob,
        audioUrl,
        audioLevel,
        permissionError,
        recordingError,
        requestPermission,
        startRecording,
        pauseRecording,
        resumeRecording,
        stopRecording,
        discardRecording
    };
}
