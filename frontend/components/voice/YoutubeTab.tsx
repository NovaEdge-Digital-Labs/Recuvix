import React, { useState } from 'react';
import { Youtube, Link2, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";

export const YoutubeTab: React.FC = () => {
    const [url, setUrl] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.includes('youtube.com') && !url.includes('youtu.be')) return;
        setShowModal(true);
    };

    return (
        <div className="flex flex-col items-center justify-center py-8 gap-6 min-h-[400px]">
            <div className="w-full max-w-lg bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-4 text-yellow-200/80">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p className="text-sm italic">
                    Important: Only use videos you own or have rights to. Downloading YouTube content without permission may violate YouTube's Terms of Service.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-lg flex flex-col gap-4">
                <div className="relative">
                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Paste YouTube URL here..."
                        className="h-14 pl-12 bg-white/5 border-white/10 rounded-xl focus:border-accent"
                    />
                </div>
                <Button
                    type="submit"
                    className="h-12 bg-accent text-black font-bold"
                    disabled={!url}
                >
                    Extract & Transcribe
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </form>

            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="bg-[#0d0d0d] border-white/10">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Youtube className="w-6 h-6 text-red-500" />
                            YouTube extraction coming soon
                        </DialogTitle>
                        <DialogDescription className="text-white/60 pt-4">
                            Direct YouTube extraction is temporarily disabled for legal safety while we finalize rights management.
                            <br /><br />
                            <b>For now, please download the audio from YouTube manually and upload it using the "Upload File" tab.</b>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-3">
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10 flex items-center justify-between">
                            <span className="text-sm font-medium">1. Convert to MP3</span>
                            <a
                                href="https://ytmp3.cc"
                                target="_blank"
                                rel="noreferrer"
                                className="text-accent text-xs font-bold hover:underline"
                            >
                                Open ytmp3.cc
                            </a>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                            <span className="text-sm font-medium">2. Upload file here</span>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => setShowModal(false)} className="bg-accent text-black font-bold">
                            I'll upload the file
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
