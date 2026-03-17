import { createServerSupabaseClient } from '@/lib/supabase/server';
import { VoiceHistoryRow } from '@/components/voice/VoiceHistoryRow';
import { Mic, History } from 'lucide-react';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default async function VoiceHistoryPage() {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: recordings } = await supabase
        .from('voice_recordings')
        .select(`
      *,
      blogs (
        title
      )
    `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return (
        <main className="min-h-screen bg-[#050505] text-white py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20">
                            <Mic className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold font-syne italic">Voice Recordings</h1>
                            <p className="text-sm text-white/40 font-medium">Your archive of spoken insights and ideas.</p>
                        </div>
                    </div>
                    <Link
                        href="/voice"
                        className={cn(buttonVariants(), "bg-white text-black font-bold h-11 px-6 rounded-xl hover:bg-white/90")}
                    >
                        Open Voice Studio
                    </Link>
                </div>

                <div className="flex flex-col gap-4">
                    {recordings && recordings.length > 0 ? (
                        recordings.map((rec: any) => (
                            <VoiceHistoryRow key={rec.id} recording={rec} />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-white/5 rounded-3xl">
                            <History className="w-12 h-12 text-white/10 mb-4" />
                            <h3 className="text-xl font-bold mb-2">No recordings yet</h3>
                            <p className="text-white/40 max-w-xs mb-8">Record your first audio clip to see it appear in your history.</p>
                            <Link
                                href="/voice"
                                className={cn(buttonVariants({ variant: 'outline' }))}
                            >
                                Start Recording
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
