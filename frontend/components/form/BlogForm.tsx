"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ImageUpload } from "./ImageUpload";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronRight, Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LanguageSelector } from "@/components/multilingual/LanguageSelector";
import { Globe } from "lucide-react";
import { TopicInput } from "./TopicInput";
import { CountryInput } from "./CountryInput";
import { GenerationModeSelector } from "../credits/GenerationModeSelector";
import { CreditDeductionWarning } from "../credits/CreditDeductionWarning";
import { useCredits } from "@/hooks/useCredits";

export interface BlogFormData {
    // ... existing interface
    topic: string;
    focusKeyword: string;
    country: string;
    tone: string;
    customTone: string;
    wordCount: number;
    authorName: string;
    authorBio: string;
    userPhotoUrl: string | null;
    logoUrl: string | null;
    colorThemeUrl: string | null;
    outputFormat: "HTML" | "Markdown" | "XML";
    websiteUrl: string;
    companyName: string;
    isMultilingual: boolean;
    targetLanguages: string[];
    additionalContext?: string;
    workspaceId?: string;
    calendarEntryId?: string;
}

interface BlogFormProps {
    onGenerate: (data: BlogFormData) => void;
    isGenerating?: boolean;
    isOutlineLoading?: boolean;
    calendarPrefillKey?: string;
}

export function BlogForm({
    onGenerate,
    isGenerating = false,
    isOutlineLoading = false,
    calendarPrefillKey
}: BlogFormProps) {
    const searchParams = useSearchParams();
    const { isManagedMode, balance } = useCredits();
    const [formData, setFormData] = useState<BlogFormData>({
        topic: "",
        country: "United States (US)",
        tone: "Professional & Authoritative",
        customTone: "",
        wordCount: 1500,
        authorName: "",
        authorBio: "",
        userPhotoUrl: null,
        logoUrl: null,
        colorThemeUrl: null,
        outputFormat: "Markdown",
        websiteUrl: "https://recuvix.in",
        companyName: "",
        isMultilingual: false,
        targetLanguages: ["en"],
        focusKeyword: "",
    });

    useEffect(() => {
        const queryTopic = searchParams.get("topic");
        const queryKeyword = searchParams.get("keyword");
        const urlPrefillKey = searchParams.get("calendarPrefillKey");

        if (queryTopic || queryKeyword) {
            setFormData(prev => ({
                ...prev,
                topic: queryTopic || queryKeyword || prev.topic
            }));
        }

        // Calendar Prefill
        const effectiveKey = urlPrefillKey || calendarPrefillKey;
        if (effectiveKey) {
            const stored = localStorage.getItem(effectiveKey);
            if (stored) {
                try {
                    const data = JSON.parse(stored);
                    setFormData(prev => ({
                        ...prev,
                        topic: data.topic || data.title || prev.topic,
                        focusKeyword: data.focusKeyword || prev.focusKeyword || "",
                        country: data.country || prev.country,
                        wordCount: data.targetWordCount || data.wordCount || prev.wordCount,
                        tone: data.targetTone || prev.tone,
                        calendarEntryId: data.calendarEntryId,
                    }));
                    // Clear the prefill after use
                    localStorage.removeItem(effectiveKey);
                } catch (e) {
                    console.error("Failed to parse calendar prefill", e);
                }
            }
        }
    }, [searchParams, calendarPrefillKey]);

    const [expandedSections, setExpandedSections] = useState({
        author: false,
        media: false,
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const updateField = (field: keyof BlogFormData, value: unknown) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const tones = ["Professional & Authoritative", "Conversational & Approachable", "Data-Driven & Analytical", "Bold & Direct", "Custom"];

    const handleGenerate = () => {
        if (!formData.topic.trim()) {
            alert("Please enter a topic.");
            return;
        }
        if (formData.isMultilingual && formData.targetLanguages.length <= 1) {
            alert("Please select at least one additional language for multilingual generation.");
            return;
        }
        onGenerate(formData);
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300 pb-20">
            <GenerationModeSelector />
            <CreditDeductionWarning />

            {/* 1. Core Blog Details */}
            <section className="space-y-6 bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm">
                <h2 className="font-heading text-xl font-bold flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded bg-primary/10 text-primary text-sm">1</span>
                    Blog Details
                </h2>

                <div className="space-y-4">
                    <div>
                        <TopicInput
                            value={formData.topic}
                            onChange={(val: string) => setFormData({ ...formData, topic: val })}
                            country={formData.country}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CountryInput
                            value={formData.country}
                            onChange={(val) => updateField("country", val)}
                        />

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Tone of Voice</label>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.tone}
                                onChange={(e) => updateField("tone", e.target.value)}
                            >
                                {tones.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {formData.tone === "Custom" && (
                        <div className="animate-in slide-in-from-top-2">
                            <label className="block text-sm font-medium mb-1.5">Custom Tone Instructions</label>
                            <Input
                                placeholder="e.g., Witty, technical, using pop culture references"
                                value={formData.customTone}
                                onChange={(e) => updateField("customTone", e.target.value)}
                                className="bg-background"
                            />
                        </div>
                    )}

                    <div className="pt-2">
                        <label className="block text-sm font-medium mb-1.5">Your Website URL</label>
                        <Input
                            placeholder="e.g., https://yourblog.com"
                            value={formData.websiteUrl}
                            onChange={(e) => updateField("websiteUrl", e.target.value)}
                            className="bg-background"
                        />
                    </div>

                    <div className="pt-2">
                        <div className="flex items-center justify-between mb-3">
                            <label className="text-sm font-medium">Target Word Count</label>
                            <span className="text-xs font-mono px-2 py-1 bg-background border border-border rounded text-muted-foreground">
                                ~{formData.wordCount} words
                            </span>
                        </div>
                        <Slider
                            defaultValue={[1500]}
                            max={3000}
                            min={500}
                            step={100}
                            value={[formData.wordCount]}
                            onValueChange={(val) => updateField("wordCount", Array.isArray(val) ? val[0] : val)}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>500 (Short)</span>
                            <span>1500 (Standard)</span>
                            <span>3000 (Long-form)</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Multilingual Settings */}
            <section className="space-y-6 bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <Globe className="w-24 h-24" />
                </div>

                <div className="flex items-center justify-between">
                    <h2 className="font-heading text-xl font-bold flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded bg-primary/10 text-primary text-sm">2</span>
                        Multilingual SEO
                    </h2>
                    <div className="flex items-center space-x-2 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/20">
                        <Switch
                            id="multilingual-mode"
                            checked={formData.isMultilingual}
                            onCheckedChange={(checked) => updateField("isMultilingual", checked)}
                        />
                        <Label htmlFor="multilingual-mode" className="text-[10px] font-black uppercase tracking-widest cursor-pointer">
                            Enable
                        </Label>
                    </div>
                </div>

                {formData.isMultilingual ? (
                    <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                        <LanguageSelector
                            selectedLanguages={formData.targetLanguages}
                            onChange={(langs) => updateField("targetLanguages", langs)}
                        />
                    </div>
                ) : (
                    <div className="p-8 border-2 border-dashed rounded-xl bg-muted/5 flex flex-col items-center justify-center text-center space-y-2">
                        <Globe className="w-8 h-8 text-muted-foreground/30" />
                        <p className="text-xs text-muted-foreground font-medium max-w-[280px]">
                            Enable multilingual mode to generate native-level localized versions of this blog simultaneously.
                        </p>
                    </div>
                )}
            </section>

            {/* 2. Author & Brand Details */}
            <section className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <button
                    onClick={() => toggleSection("author")}
                    className="w-full flex items-center justify-between p-6 md:p-8 hover:bg-white/5 transition-colors text-left"
                >
                    <h2 className="font-heading text-xl font-bold flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded bg-secondary text-muted-foreground text-sm">3</span>
                        Author & Brand Context <span className="text-sm font-normal text-muted-foreground ml-2">(Optional)</span>
                    </h2>
                    {expandedSections.author ? <ChevronDown size={20} className="text-muted-foreground" /> : <ChevronRight size={20} className="text-muted-foreground" />}
                </button>

                {expandedSections.author && (
                    <div className="p-6 md:p-8 pt-0 border-t border-border space-y-6 animate-in slide-in-from-top-4 duration-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Company / Brand Name</label>
                                    <Input
                                        placeholder="e.g., NovaEdge Labs"
                                        value={formData.companyName}
                                        onChange={(e) => updateField("companyName", e.target.value)}
                                        className="bg-background"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Author Name</label>
                                    <Input
                                        placeholder="John Doe"
                                        value={formData.authorName}
                                        onChange={(e) => updateField("authorName", e.target.value)}
                                        className="bg-background"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Author Bio (for context)</label>
                                    <Textarea
                                        placeholder="Founder, expert in tech..."
                                        className="resize-none h-24 bg-background"
                                        value={formData.authorBio}
                                        onChange={(e) => updateField("authorBio", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <ImageUpload
                                    label="Author Photo"
                                    description="Used to humanize E-E-A-T signals"
                                    value={formData.userPhotoUrl}
                                    type="userImage"
                                    onChange={(url) => updateField("userPhotoUrl", url)}
                                />
                            </div>
                        </div>

                        <div className="pt-2 border-t border-border/50">
                            <ImageUpload
                                label="Company Logo"
                                description="Will be watermarked on the generated thumbnail"
                                value={formData.logoUrl}
                                type="logo"
                                onChange={(url) => updateField("logoUrl", url)}
                            />
                        </div>
                    </div>
                )}
            </section>

            {/* 3. Media & Formatting */}
            <section className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <button
                    onClick={() => toggleSection("media")}
                    className="w-full flex items-center justify-between p-6 md:p-8 hover:bg-white/5 transition-colors text-left"
                >
                    <h2 className="font-heading text-xl font-bold flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded bg-secondary text-muted-foreground text-sm">4</span>
                        Media & Output Settings
                    </h2>
                    {expandedSections.media ? <ChevronDown size={20} className="text-muted-foreground" /> : <ChevronRight size={20} className="text-muted-foreground" />}
                </button>

                {expandedSections.media && (
                    <div className="p-6 md:p-8 pt-0 border-t border-border space-y-6 animate-in slide-in-from-top-4 duration-200">
                        <div>
                            <ImageUpload
                                label="Brand Color Theme Image"
                                description="Upload an image to extract its primary colors for the generated thumbnail gradient."
                                value={formData.colorThemeUrl}
                                type="colorTheme"
                                onChange={(url) => updateField("colorThemeUrl", url)}
                            />
                        </div>

                        <div className="pt-4 border-t border-border/50">
                            <label className="block text-sm font-medium mb-3">Export Format</label>
                            <div className="flex gap-3">
                                {["Markdown", "HTML", "XML"].map((fmt) => (
                                    <button
                                        key={fmt}
                                        onClick={() => updateField("outputFormat", fmt)}
                                        className={cn(
                                            "flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors cursor-pointer",
                                            formData.outputFormat === fmt
                                                ? "bg-accent/10 border-accent text-accent-foreground"
                                                : "bg-background border-border text-muted-foreground hover:border-accent/50"
                                        )}
                                    >
                                        {fmt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </section>

            <Button
                onClick={handleGenerate}
                disabled={
                    isGenerating ||
                    isOutlineLoading ||
                    !formData.topic.trim() ||
                    (isManagedMode && balance === 0)
                }
                className="w-full h-14 text-lg font-heading font-bold shadow-[0_0_20px_rgba(232,255,71,0.15)] bg-accent text-accent-foreground fixed bottom-6 left-1/2 -translate-x-1/2 max-w-[calc(100%-2rem)] md:relative md:translate-x-0 md:left-0 md:bottom-0 hover:bg-accent/90"
            >
                {isOutlineLoading || isGenerating ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                    <Wand2 className="w-5 h-5 mr-2" />
                )}
                {isOutlineLoading ? "Generating outline..." : isGenerating ? "Initializing Engine..." : "Generate SEO Blog"}
            </Button>

            {/* Spacer for fixed mobile button safety */}
            <div className="h-14 md:hidden"></div>
        </div>
    );
}
