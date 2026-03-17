'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle,
    Sparkles,
    Layout,
    Globe,
    Type,
    Zap,
    Key,
    Rocket,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    X,
    MessageSquare,
    BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/context/AppContext';

interface OnboardingModalProps {
    isOpen: boolean;
    onComplete: () => void;
}

export function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
    const supabase = createClient();
    const { updatePreferences, updateApiConfig } = useAppContext();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    interface OnboardingFormData {
        mode: 'managed' | 'api_key';
        apiKey: string;
        model: string;
        country: string;
        tone: string;
        wordCount: number;
        niche: string;
    }

    // Preferences state
    const [formData, setFormData] = useState<OnboardingFormData>({
        mode: 'managed',
        apiKey: '',
        model: 'gpt-4o',
        country: 'India',
        tone: 'Professional',
        wordCount: 1500,
        niche: ''
    });

    const totalSteps = 4;
    const progress = (step / totalSteps) * 100;

    useEffect(() => {
        if (step === 4) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#e8ff47', '#ffffff', '#050505']
            });
        }
    }, [step]);

    const handleNext = () => setStep(s => Math.min(s + 1, totalSteps));
    const handleBack = () => setStep(s => Math.max(s - 1, 1));

    const handleComplete = async () => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Save to database
                const typedSupabase = supabase as any;
                await typedSupabase.from('profiles').update({
                    onboarding_completed: true,
                    onboarding_step: totalSteps,
                    primary_country: formData.country,
                    default_tone: formData.tone,
                    typical_word_count: formData.wordCount,
                    primary_niche: formData.niche || null
                }).eq('id', user.id);

                // Update context
                updatePreferences({
                    defaultCountry: formData.country,
                    defaultTone: formData.tone,
                    defaultWordCount: formData.wordCount,
                });

                if (formData.mode === 'api_key' && formData.apiKey) {
                    updateApiConfig({
                        apiKey: formData.apiKey,
                        selectedModel: formData.model as any
                    });
                }
            }

            localStorage.setItem('recuvix_onboarded', 'true');
            onComplete();
        } catch (error) {
            console.error('Onboarding update failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]/95 backdrop-blur-md p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-[#0d0d0d] border border-white/5 w-full max-w-2xl rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] relative"
            >
                {/* Close/Skip for early steps */}
                {step < 4 && (
                    <button
                        onClick={() => onComplete()}
                        className="absolute top-6 right-6 text-white/20 hover:text-white/60 transition-colors z-10"
                    >
                        <X size={20} />
                    </button>
                )}

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 w-full">
                    <Progress value={progress} className="h-1 rounded-none bg-white/5" />
                </div>

                <div className="p-8 md:p-12">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <Badge className="bg-accent/10 text-accent border-accent/20 px-3 py-1 mb-2">🎁 New User Bonus</Badge>
                                    <h2 className="text-4xl font-syne font-bold text-white tracking-tight leading-[1.1]">
                                        Welcome to <span className="text-accent italic">Recuvix.</span>
                                    </h2>
                                    <p className="text-lg text-white/60 font-outfit max-w-md">
                                        We&apos;ve credited <span className="text-white font-bold">5 free credits</span> to your account to get you started.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                                        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                                            <Zap size={20} className="text-accent" />
                                        </div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-white/40">Speed</p>
                                        <p className="text-sm text-white/80">Blogs in under 3 minutes.</p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                                        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                                            <Globe size={20} className="text-accent" />
                                        </div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-white/40">Global</p>
                                        <p className="text-sm text-white/80">Support for 50+ languages.</p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-3">
                                        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                                            <Layout size={20} className="text-accent" />
                                        </div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-white/40">SEO</p>
                                        <p className="text-sm text-white/80">Built-in optimization engine.</p>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleNext}
                                    className="w-full h-14 bg-accent text-black font-bold text-lg rounded-2xl hover:bg-accent/90"
                                >
                                    Let&apos;s Start →
                                </Button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-syne font-bold text-white tracking-tight">Generation Mode</h2>
                                    <p className="text-white/60 font-outfit">Choose how you want to power your AI engines.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setFormData({ ...formData, mode: 'managed' })}
                                        className={cn(
                                            "p-6 rounded-2xl border transition-all text-left space-y-4",
                                            formData.mode === 'managed' ? "bg-accent/10 border-accent/40" : "bg-white/5 border-white/5 hover:border-white/10"
                                        )}
                                    >
                                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", formData.mode === 'managed' ? "bg-accent/20" : "bg-white/10")}>
                                            <Sparkles className={cn(formData.mode === 'managed' ? "text-accent" : "text-white/40")} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">Managed Mode</h3>
                                            <p className="text-xs text-white/40 mt-1 leading-relaxed">Use our high-compute infrastructure. 5 credits available.</p>
                                        </div>
                                        {formData.mode === 'managed' && <CheckCircle size={20} className="text-accent absolute top-4 right-4" />}
                                    </button>

                                    <button
                                        onClick={() => setFormData({ ...formData, mode: 'api_key' })}
                                        className={cn(
                                            "p-6 rounded-2xl border transition-all text-left space-y-4 relative overflow-hidden",
                                            formData.mode === 'api_key' ? "bg-accent/10 border-accent/40" : "bg-white/5 border-white/5 hover:border-white/10"
                                        )}
                                    >
                                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", formData.mode === 'api_key' ? "bg-accent/20" : "bg-white/10")}>
                                            <Key className={cn(formData.mode === 'api_key' ? "text-accent" : "text-white/40")} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">Own API Key</h3>
                                            <p className="text-xs text-white/40 mt-1 leading-relaxed">Connect OpenAI/Anthropic. Unlimited generations.</p>
                                        </div>
                                        {formData.mode === 'api_key' && <CheckCircle size={20} className="text-accent absolute top-4 right-4" />}
                                    </button>
                                </div>

                                {formData.mode === 'api_key' && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        className="space-y-4 pt-2"
                                    >
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">OpenAI API Key</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="password"
                                                    value={formData.apiKey}
                                                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                                                    placeholder="sk-..."
                                                    className="flex-1 h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-accent"
                                                />
                                                <Button variant="outline" className="h-12 border-white/10 hover:bg-white/5">Test</Button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Preferred Model</label>
                                            <Select value={formData.model} onValueChange={(v: string | null) => v && setFormData(prev => ({ ...prev, model: v }))}>
                                                <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white rounded-xl">
                                                    <SelectValue placeholder="Select model" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#0d0d0d] border-white/10">
                                                    <SelectItem value="gpt-4o">GPT-4o (Recommended)</SelectItem>
                                                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                                                    <SelectItem value="claude-3-5-sonnet">Claude 3.5 Sonnet</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="flex gap-3 pt-4">
                                    <Button variant="outline" onClick={handleBack} className="h-14 w-14 rounded-2xl border-white/10 hover:bg-white/5">
                                        <ChevronLeft />
                                    </Button>
                                    <Button onClick={handleNext} className="flex-1 h-14 bg-accent text-black font-bold text-lg rounded-2xl hover:bg-accent/90">
                                        Next Component →
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-syne font-bold text-white tracking-tight">Content Preferences</h2>
                                    <p className="text-white/60 font-outfit">Set your default workspace settings.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Primary Country</label>
                                            <input
                                                value={formData.country}
                                                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                                className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-accent"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Default Tone</label>
                                            <Select value={formData.tone} onValueChange={(v: string | null) => v && setFormData(prev => ({ ...prev, tone: v }))}>
                                                <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white rounded-xl">
                                                    <SelectValue placeholder="Select tone" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-[#0d0d0d] border-white/10">
                                                    <SelectItem value="Professional">Professional</SelectItem>
                                                    <SelectItem value="Conversational">Conversational</SelectItem>
                                                    <SelectItem value="Creative">Creative</SelectItem>
                                                    <SelectItem value="Academic">Academic</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Typical Word Count</label>
                                            <span className="text-accent font-bold font-syne italic">{formData.wordCount} words</span>
                                        </div>
                                        <Slider
                                            defaultValue={[formData.wordCount]}
                                            min={500}
                                            max={3000}
                                            step={100}
                                            onValueChange={(v) => setFormData({ ...formData, wordCount: (v as any)[0] as number })}
                                            className="py-4"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold tracking-widest text-white/40">Primary Niche (Optional)</label>
                                        <input
                                            value={formData.niche}
                                            onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                                            placeholder="e.g. SaaS, Healthcare, Real Estate"
                                            className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-accent"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button variant="outline" onClick={handleBack} className="h-14 w-14 rounded-2xl border-white/10 hover:bg-white/5">
                                        <ChevronLeft />
                                    </Button>
                                    <Button onClick={handleNext} className="flex-1 h-14 bg-accent text-black font-bold text-lg rounded-2xl hover:bg-accent/90">
                                        Finalize Setup →
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-4 space-y-10"
                            >
                                <div className="space-y-4">
                                    <div className="w-24 h-24 rounded-3xl bg-accent/20 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(232,255,71,0.2)]">
                                        <Rocket size={48} className="text-accent" />
                                    </div>
                                    <h2 className="text-4xl font-syne font-bold text-white tracking-tight">You&apos;re all set.</h2>
                                    <p className="text-white/60 font-outfit max-w-sm mx-auto italic">
                                        Everything is configured. Let&apos;s generate your first SEO-optimized masterwork.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button onClick={handleComplete} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/40 hover:bg-accent/[0.03] transition-all group">
                                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <Sparkles size={24} className="text-accent" />
                                        </div>
                                        <h3 className="font-bold text-sm text-white">Generate Blog</h3>
                                    </button>
                                    <button onClick={handleComplete} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/40 hover:bg-accent/[0.03] transition-all group">
                                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <Key size={24} className="text-white/60" />
                                        </div>
                                        <h3 className="font-bold text-sm text-white">API Keys</h3>
                                    </button>
                                    <button onClick={handleComplete} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/40 hover:bg-accent/[0.03] transition-all group">
                                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                            <BookOpen size={24} className="text-white/60" />
                                        </div>
                                        <h3 className="font-bold text-sm text-white">Quick Guide</h3>
                                    </button>
                                </div>

                                <Button
                                    onClick={handleComplete}
                                    disabled={isLoading}
                                    className="w-full h-14 bg-accent text-black font-bold text-lg rounded-2xl hover:bg-accent/90"
                                >
                                    {isLoading ? <Zap className="animate-spin" /> : "Launch Dashboard"}
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
