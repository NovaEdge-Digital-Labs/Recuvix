"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { BulkTopic, BulkSettings, BulkGenerateSingleRequest } from '@/lib/validators/bulkSchemas';
import { sendBrowserNotification, playNotificationSound } from '@/lib/bulk/notificationManager';
import { nanoid } from 'nanoid';
import { toast } from 'sonner';

const STORAGE_KEY = 'recuvix_bulk_queue';
const HISTORY_KEY = 'recuvix_bulk_history';

export type BulkPhase = 'builder' | 'running' | 'complete';

export interface BulkOptions {
    tone: string;
    wordCount: number;
    format: string;
}

export function useBulkGeneration() {
    const [phase, setPhase] = useState<BulkPhase>('builder');
    const [topics, setTopics] = useState<BulkTopic[]>([]);
    const [settings, setSettings] = useState<BulkSettings>({
        country: "United States (US)",
        tone: "Professional & Authoritative",
        wordCount: 1500,
        outputFormat: "Markdown",
        includeOutlinePreview: true,
        includeAiImages: true,
        includeStockImages: false,
        includeThumbnail: true,
        includeSeoPack: true,
        delayBetweenBlogs: 5,
        autoRetryFailed: true,
        maxRetries: 2,
        notifyOnComplete: true,
    });
    const [isPaused, setIsPaused] = useState(false);
    const [currentJobId, setCurrentJobId] = useState<string | null>(null);

    const processingRef = useRef(false);

    // Persistence: Load from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                setTopics(data.topics || []);
                setSettings(data.settings || {});
                setPhase(data.phase || 'builder');
                setCurrentJobId(data.jobId || null);
                setIsPaused(data.isPaused || false);
            } catch (e) {
                console.error("Failed to load bulk queue", e);
            }
        }
    }, []);

    // Persistence: Save to LocalStorage
    useEffect(() => {
        const data = { topics, settings, phase, jobId: currentJobId, isPaused };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [topics, settings, phase, currentJobId, isPaused]);

    const addTopic = useCallback((topicName: string, source: 'manual' | 'research' = 'manual') => {
        if (topics.length >= 50) {
            toast.error("Maximum 50 topics allowed in bulk queue.");
            return;
        }
        const newTopic: BulkTopic = {
            id: nanoid(),
            position: topics.length + 1,
            topic: topicName,
            status: 'queued',
            retryCount: 0,
            steps: {
                outline: { status: 'pending', startedAt: null, completedAt: null, error: null },
                writing: { status: 'pending', startedAt: null, completedAt: null, error: null },
                images: { status: 'pending', startedAt: null, completedAt: null, error: null },
                thumbnail: { status: 'pending', startedAt: null, completedAt: null, error: null },
                seoPack: { status: 'pending', startedAt: null, completedAt: null, error: null },
                packaging: { status: 'pending', startedAt: null, completedAt: null, error: null },
            },
            approvedOutline: null,
            blogHtml: "",
            blogMarkdown: "",
            thumbnailUrl: "",
            seoMeta: null,
            durationSeconds: null,
            startedAt: null,
            completedAt: null,
            lastError: null,
            lastErrorStep: null,
            secondaryKeywords: [],
            sourceType: source
        };
        setTopics(prev => [...prev, newTopic]);
    }, [topics]);

    const removeTopic = useCallback((id: string) => {
        setTopics(prev => prev.filter(t => t.id !== id).map((t, i) => ({ ...t, position: i + 1 })));
    }, []);

    const updateTopic = useCallback((id: string, updates: Partial<BulkTopic>) => {
        setTopics(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    }, []);

    const startGeneration = useCallback(() => {
        if (topics.length === 0) {
            toast.error("Add at least one topic to start.");
            return;
        }
        setPhase('running');
        setCurrentJobId(nanoid());
        setIsPaused(false);
    }, [topics]);

    const startQueue = useCallback((topicsToProcess: any[], options: BulkOptions) => {
        const newBulkTopics: BulkTopic[] = topicsToProcess.map((t, i) => ({
            id: nanoid(),
            position: i + 1,
            topic: t.title || t.topic,
            status: 'queued',
            retryCount: 0,
            steps: {
                outline: { status: 'pending', startedAt: null, completedAt: null, error: null },
                writing: { status: 'pending', startedAt: null, completedAt: null, error: null },
                images: { status: 'pending', startedAt: null, completedAt: null, error: null },
                thumbnail: { status: 'pending', startedAt: null, completedAt: null, error: null },
                seoPack: { status: 'pending', startedAt: null, completedAt: null, error: null },
                packaging: { status: 'pending', startedAt: null, completedAt: null, error: null },
            },
            approvedOutline: null,
            blogHtml: "",
            blogMarkdown: "",
            thumbnailUrl: "",
            seoMeta: null,
            durationSeconds: null,
            startedAt: null,
            completedAt: null,
            lastError: null,
            lastErrorStep: null,
            secondaryKeywords: t.secondaryKeywords || [],
            sourceType: 'research'
        }));

        setTopics(newBulkTopics);
        setSettings(prev => ({
            ...prev,
            tone: options.tone,
            wordCount: options.wordCount
        }));
        setPhase('running');
        setCurrentJobId(nanoid());
        setIsPaused(false);
    }, []);

    const pauseGeneration = useCallback(() => setIsPaused(true), []);
    const resumeGeneration = useCallback(() => setIsPaused(false), []);

    const cancelGeneration = useCallback(() => {
        if (confirm("Are you sure you want to cancel the bulk job? Progress on completed blogs will be saved.")) {
            setPhase('builder');
            setCurrentJobId(null);
            setTopics(prev => prev.map(t => t.status === 'generating' ? { ...t, status: 'queued' } : t));
        }
    }, []);

    const downloadAll = useCallback(async () => {
        const { buildBulkZip } = await import('@/lib/bulk/bulkZipBuilder');
        const blob = await buildBulkZip(topics);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `recuvix-bulk-${new Date().toISOString().split('T')[0]}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [topics]);

    // Core Loop
    useEffect(() => {
        if (phase !== 'running' || isPaused || processingRef.current) return;

        const nextTopic = topics.find(t => t.status === 'queued');
        if (!nextTopic) {
            if (topics.every(t => t.status === 'complete' || t.status === 'failed' || t.status === 'skipped')) {
                setPhase('complete');
                if (settings.notifyOnComplete) {
                    sendBrowserNotification("Bulk Job Complete", `Finished processing ${topics.length} topics.`);
                    playNotificationSound();
                }
            }
            return;
        }

        const processTopic = async (topic: BulkTopic) => {
            processingRef.current = true;

            // Mark as generating
            updateTopic(topic.id, { status: 'generating', startedAt: new Date().toISOString() });

            try {
                // Get API key and other global state from context (needs to be passed or accessed)
                // For now, let's assume they are stored in localStorage by other parts of the app
                const llmKey = localStorage.getItem('recuvix_api_key') || "";
                const provider = localStorage.getItem('recuvix_llm_provider') || "openai";

                const request: BulkGenerateSingleRequest = {
                    llmProvider: provider as any,
                    apiKey: llmKey,
                    topic: topic,
                    settings: settings,
                    // authorDetails, etc. - should be loaded from settings
                };

                const response = await fetch('/api/bulk/generate-single', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(request)
                });

                const result = await response.json();

                if (result.success) {
                    updateTopic(topic.id, {
                        status: 'complete',
                        blogHtml: result.blogHtml,
                        blogMarkdown: result.blogMarkdown,
                        thumbnailUrl: result.thumbnailUrl,
                        seoMeta: result.seoMeta,
                        durationSeconds: result.durationSeconds,
                        completedAt: new Date().toISOString()
                    });
                } else {
                    if (result.error === "RATE_LIMIT" && settings.autoRetryFailed && topic.retryCount < settings.maxRetries) {
                        toast.warning(`Rate limited. Pausing for 60s and retrying topic: ${topic.topic}`);
                        setIsPaused(true);
                        setTimeout(() => setIsPaused(false), 60000);
                        updateTopic(topic.id, {
                            status: 'queued',
                            retryCount: topic.retryCount + 1,
                            lastError: "Rate limited"
                        });
                    } else {
                        updateTopic(topic.id, {
                            status: 'failed',
                            lastError: result.error,
                            lastErrorStep: result.errorStep
                        });
                    }
                }
            } catch (e: any) {
                updateTopic(topic.id, { status: 'failed', lastError: e.message || "Unknown error" });
            } finally {
                processingRef.current = false;
            }
        };

        processTopic(nextTopic);

    }, [phase, isPaused, topics, settings, updateTopic]);

    const isRunning = phase === 'running';
    const completedCount = topics.filter(t => t.status === 'complete').length;
    const failedCount = topics.filter(t => t.status === 'failed').length;
    const currentIndex = topics.findIndex(t => t.status === 'generating');

    return {
        phase,
        setPhase,
        topics,
        queue: topics,
        setTopics,
        settings,
        setSettings,
        isPaused,
        isRunning,
        startGeneration,
        startQueue,
        pauseGeneration,
        resumeGeneration,
        cancelGeneration,
        cancelQueue: cancelGeneration,
        addTopic,
        removeTopic,
        updateTopic,
        currentJobId,
        completedCount,
        failedCount,
        currentIndex,
        downloadAll
    };
}
