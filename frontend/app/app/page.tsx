"use client";

import { NavBar } from "@/components/navigation/NavBar";
import { BlogForm, BlogFormData } from "@/components/form/BlogForm";
import { Button } from '@/components/ui/button';
import { OutlinePreviewPanel } from "@/components/form/OutlinePreviewPanel";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { useEffect, useRef, useCallback } from "react";
import { useOutlineGeneration } from "@/hooks/useOutlineGeneration";
import { useCredits } from "@/hooks/useCredits";
import { ApprovedOutline } from "@/lib/types/outline";
import { toast } from "sonner";
import { Settings, Mic, Sparkles } from "lucide-react";
import { WorkspaceBanner } from "@/components/workspaces/WorkspaceBanner";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const { apiConfig, isHydrated, preferences } = useAppContext();
  const { balance, isManagedMode, isLoading: isCreditsLoading } = useCredits();
  const pendingDataRef = useRef<BlogFormData | null>(null);

  const {
    outline,
    outlineHistory,
    historyIndex,
    isLoading: isOutlineLoading,
    isVisible: isPanelVisible,
    error: outlineError,
    generateOutline,
    regenerateOutline,
    updateH1,
    updateH2,
    addH2,
    removeH2,
    restoreH2,
    reorderH2s,
    navigateHistory,
    approveOutline,
    closePanel,
    clearError,
  } = useOutlineGeneration();

  useEffect(() => {
    if (isHydrated && !isCreditsLoading) {
      const hasApiKey = !!apiConfig.apiKey;
      const hasManagedCredits = isManagedMode && (balance !== null && balance > 0);

      if (!hasApiKey && !hasManagedCredits) {
        router.push("/onboarding");
      }
    }
  }, [apiConfig.apiKey, isHydrated, isManagedMode, balance, isCreditsLoading, router]);

  // Handle H2 removal with undo toast
  const handleRemoveH2 = useCallback((id: string) => {
    removeH2(id);
  }, [removeH2]);

  const handleGenerate = async (data: BlogFormData) => {
    pendingDataRef.current = data;
    clearError();

    // Multilingual Flow check
    if (data.isMultilingual) {
      const params = new URLSearchParams({
        topic: data.topic,
        languages: data.targetLanguages.join(","),
        country: data.country,
        tone: data.tone === "Custom" ? data.customTone || data.tone : data.tone,
        wordCount: data.wordCount.toString(),
      });
      router.push(`/multilingual?${params.toString()}`);
      return;
    }

    // Standard Flow: Check preference for outline preview
    if (!preferences.showOutlinePreview) {
      // Skip outline, go directly to generation
      if (typeof window !== "undefined") {
        window.localStorage.setItem("recuvix_pending_task", JSON.stringify(data));
        router.push("/generating");
      }
      return;
    }

    // Generate outline first
    await generateOutline({
      topic: data.topic,
      country: data.country,
      tone: data.tone === "Custom" ? data.customTone || data.tone : data.tone,
      wordCount: data.wordCount,
    });
  };

  const handleConfirm = useCallback((approvedOutline: ApprovedOutline) => {
    const data = pendingDataRef.current;
    if (!data) return;

    // Save the approved outline so useBlogGeneration picks it up
    const stored = {
      h1: approvedOutline.h1,
      h2s: outline?.h2s || [],
      focusKeyword: approvedOutline.focusKeyword,
      generatedAt: new Date().toISOString(),
      generationInput: data,
    };
    localStorage.setItem("recuvix_approved_outline", JSON.stringify(stored));
    localStorage.setItem("recuvix_pending_task", JSON.stringify(data));

    toast.success("Outline approved! Generating your full blog post now…");

    setTimeout(() => router.push("/generating"), 300);
  }, [outline, router]);

  const handleSkipToGenerate = () => {
    const data = pendingDataRef.current;
    if (!data) return;
    closePanel();
    localStorage.setItem("recuvix_pending_task", JSON.stringify(data));
    router.push("/generating");
  };

  if (!isHydrated) return <div className="min-h-screen bg-background" />;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <NavBar />

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="mb-8">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Generate a New Blog Post
            </h1>
            <p className="text-muted-foreground text-lg">
              Provide your topic and constraints. Our AI will research, write, and optimize a complete editorial piece.
            </p>
          </div>

          <WorkspaceBanner />

          <BlogForm
            onGenerate={handleGenerate}
            isOutlineLoading={isOutlineLoading}
            calendarPrefillKey="recuvix_calendar_prefill"
          />

          {/* Inline error after outline generation fails */}
          {outlineError && !isPanelVisible && (
            <div className="mt-4 p-4 rounded-lg border border-destructive/30 bg-destructive/10 text-sm text-destructive space-y-2">
              <p>Couldn&apos;t generate outline: {outlineError}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => pendingDataRef.current && handleGenerate(pendingDataRef.current)}
                  className="text-accent underline underline-offset-2 hover:no-underline"
                >
                  Try again
                </button>
                <span className="text-muted-foreground">or</span>
                <button
                  onClick={handleSkipToGenerate}
                  className="text-muted-foreground hover:text-foreground underline underline-offset-2 hover:no-underline"
                >
                  Generate without preview →
                </button>
              </div>
            </div>
          )}

          {/* Outline preview preference hint */}
          {!preferences.showOutlinePreview && (
            <p className="mt-3 text-xs text-muted-foreground/60">
              Outline preview is off —{" "}
              <button className="underline hover:text-muted-foreground" onClick={() => {
                // NavBar contains the settings trigger; we just link to open settings
                document.getElementById("settings-trigger")?.click();
              }}>
                Turn on in Settings
              </button>
            </p>
          )}
        </div>

        <div className="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-24 h-[calc(100vh-8rem)]">
          <div className="w-full h-full border border-border bg-card rounded-2xl flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-border/20 via-background to-background">
            <div className="w-16 h-16 rounded-2xl bg-border/50 flex items-center justify-center mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
            </div>
            <h2 className="font-heading text-2xl font-bold mb-2">Let&apos;s Build Something Incredible</h2>
            <p className="text-muted-foreground">
              {preferences.showOutlinePreview
                ? "You'll preview the blog structure before the full blog is written — saving API calls on wrong structures."
                : "Once generation begins, you'll see the blog coming to life right here."}
            </p>
            {preferences.showOutlinePreview && (
              <div className="mt-4 flex items-center gap-2 text-xs text-accent bg-accent/10 border border-accent/20 rounded-lg px-3 py-2">
                <Settings size={12} />
                Outline preview is enabled
              </div>
            )}
          </div>

          <Card className="mt-8 bg-gradient-to-br from-[#0d0d0d] to-background border-white/5 overflow-hidden group hover:border-accent/40 transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:bg-accent/20 transition-all">
                  <Mic className="text-accent w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg font-syne italic">Voice Studio</h3>
                  <p className="text-xs text-white/40">Turn audio into SEO content</p>
                </div>
              </div>
              <p className="text-sm text-white/60 mb-6 leading-relaxed">
                Recording a podcast or just have some thoughts? Our Voice Studio transcribes and crafts professional articles from your speech.
              </p>
              <Link href="/voice" className="w-full">
                <Button className="w-full bg-accent/10 text-accent border border-accent/20 hover:bg-accent hover:text-black font-bold h-11">
                  Open Studio ✨
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Outline Preview Panel */}
      <OutlinePreviewPanel
        outline={outline}
        generationInput={{ wordCount: pendingDataRef.current?.wordCount || 1500 }}
        isVisible={isPanelVisible || isOutlineLoading}
        isLoading={isOutlineLoading}
        historyLength={outlineHistory.length}
        historyIndex={historyIndex}
        regenerationError={null}
        fromResearch={false}
        onConfirm={handleConfirm}
        onRegenerate={regenerateOutline}
        onClose={closePanel}
        onUpdateH1={updateH1}
        onUpdateH2={updateH2}
        onAddH2={addH2}
        onRemoveH2={handleRemoveH2}
        onRestoreH2={restoreH2}
        onReorderH2s={reorderH2s}
        onNavigateHistory={navigateHistory}
        approveOutline={approveOutline}
      />
    </div>
  );
}
