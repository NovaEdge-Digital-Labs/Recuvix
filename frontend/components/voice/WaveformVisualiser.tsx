import React, { useRef, useEffect } from 'react';

interface WaveformVisualiserProps {
    isRecording: boolean;
    audioLevel: number; // 0-1
}

export const WaveformVisualiser: React.FC<WaveformVisualiserProps> = ({ isRecording, audioLevel }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const barsRef = useRef<number[]>(new Array(40).fill(5));

    useEffect(() => {
        if (!isRecording) return;

        const interval = setInterval(() => {
            // Shift bars and add new one based on level
            const newLevel = 5 + (audioLevel * 70);
            barsRef.current = [...barsRef.current.slice(1), newLevel];

            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = 4;
            const gap = 2;
            const accentColor = '#e8ff47'; // Recuvix accent

            barsRef.current.forEach((height, i) => {
                const x = i * (barWidth + gap);
                const y = (canvas.height - height) / 2;

                ctx.fillStyle = i === barsRef.current.length - 1 ? accentColor : '#333';
                if (i > barsRef.current.length - 10) ctx.fillStyle = accentColor;

                ctx.beginPath();
                // Rounded rect for bars
                const radius = 2;
                ctx.roundRect(x, y, barWidth, height, radius);
                ctx.fill();
            });
        }, 50);

        return () => clearInterval(interval);
    }, [isRecording, audioLevel]);

    return (
        <canvas
            ref={canvasRef}
            width={240}
            height={80}
            className="mx-auto block"
        />
    );
};
