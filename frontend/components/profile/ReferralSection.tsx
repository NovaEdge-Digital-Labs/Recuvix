'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, Share2, Users, CreditCard, Sparkles, MessageCircle, Twitter, Linkedin } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export const ReferralSection = () => {
    const { profile } = useAuth();
    const [referrals, setReferrals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    const referralCode = profile?.referral_code || '';
    const referralLink = `https://recuvix.app/signup?ref=${referralCode}`;

    useEffect(() => {
        const fetchReferrals = async () => {
            if (!profile?.id) return;
            const supabase = createClient();
            const { data, error } = await supabase
                .from('referrals')
                .select('*')
                .eq('referrer_user_id', profile.id)
                .order('created_at', { ascending: false });

            if (!error && data) {
                setReferrals(data);
            }
            setIsLoading(false);
        };

        fetchReferrals();
    }, [profile?.id]);

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        toast.success('Referral link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
    };

    const shareUrls = {
        whatsapp: `https://wa.me/?text=I've been using Recuvix to generate SEO blogs in 3 minutes. Try it free: ${referralLink}`,
        twitter: `https://twitter.com/intent/tweet?text=I've been using Recuvix to generate SEO blogs in 3 minutes. Try it free:&url=${referralLink}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${referralLink}`
    };

    const successfulReferrals = referrals.filter(r => r.status === 'rewarded' || r.status === 'converted').length;
    const creditsEarned = profile?.total_referral_credits_earned || 0;

    const maskEmail = (email: string) => {
        if (!email) return 'User';
        const [name, domain] = email.split('@');
        return `${name[0]}***@${domain}`;
    };

    return (
        <div id="refer" className="bg-card border border-border rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="p-6 md:p-8 bg-gradient-to-br from-accent/5 via-background to-background">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest">
                            <Sparkles size={14} />
                            Refer & Earn
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">Invite friends, earn credits</h2>
                        <p className="text-muted-foreground text-sm max-w-sm">
                            Earn 5 free credits for every person you refer who generates their first blog.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="px-5 py-4 bg-background/50 border border-border rounded-xl text-center">
                            <div className="text-xs text-muted-foreground font-medium mb-1">Total Referred</div>
                            <div className="text-xl font-bold text-foreground">{referrals.length}</div>
                        </div>
                        <div className="px-5 py-4 bg-accent/10 border border-accent/20 rounded-xl text-center">
                            <div className="text-xs text-accent font-bold mb-1">Credits Earned</div>
                            <div className="text-xl font-bold text-accent">{creditsEarned}</div>
                        </div>
                    </div>
                </div>

                {/* Referral Link */}
                <div className="mt-8 space-y-3">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Your Unique Referral Link</label>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 bg-zinc-950 border border-zinc-900 rounded-xl px-4 py-3 text-sm text-zinc-400 font-mono truncate">
                            {referralLink}
                        </div>
                        <button
                            onClick={handleCopy}
                            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${copied ? 'bg-green-500 text-white' : 'bg-accent text-black hover:bg-accent/90 shadow-lg shadow-accent/20'}`}
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                            {copied ? 'Copied' : 'Copy Link'}
                        </button>
                    </div>
                </div>

                {/* Social Share */}
                <div className="mt-8 flex flex-wrap gap-4">
                    <a href={shareUrls.whatsapp} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 rounded-xl hover:bg-[#25D366]/20 transition-all font-medium text-sm">
                        <MessageCircle size={18} />
                        WhatsApp
                    </a>
                    <a href={shareUrls.twitter} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 bg-sky-500/10 text-sky-500 border border-sky-500/20 rounded-xl hover:bg-sky-500/20 transition-all font-medium text-sm">
                        <Twitter size={18} />
                        Twitter
                    </a>
                    <a href={shareUrls.linkedin} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600/10 text-blue-600 border border-blue-600/20 rounded-xl hover:bg-blue-600/20 transition-all font-medium text-sm">
                        <Linkedin size={18} />
                        LinkedIn
                    </a>
                </div>
            </div>

            {/* How it works */}
            <div className="p-6 md:p-8 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-border/50 flex items-center justify-center shrink-0 font-bold text-accent">1</div>
                    <div className="space-y-1">
                        <h4 className="font-bold text-sm">Share Link</h4>
                        <p className="text-xs text-muted-foreground">Send your unique link to friends or colleagues.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-border/50 flex items-center justify-center shrink-0 font-bold text-accent">2</div>
                    <div className="space-y-1">
                        <h4 className="font-bold text-sm">Friend Joins</h4>
                        <p className="text-xs text-muted-foreground">They sign up and generate their first blog post.</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-border/50 flex items-center justify-center shrink-0 font-bold text-accent">3</div>
                    <div className="space-y-1">
                        <h4 className="font-bold text-sm">Earn Credits</h4>
                        <p className="text-xs text-muted-foreground">You get 5 free credits added instantly.</p>
                    </div>
                </div>
            </div>

            {/* History Table */}
            {referrals.length > 0 && (
                <div className="border-t border-border">
                    <div className="px-6 py-4 bg-muted/30 border-b border-border">
                        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Referral History</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-xs text-muted-foreground border-b border-border">
                                    <th className="px-6 py-3 font-medium">Date</th>
                                    <th className="px-6 py-3 font-medium">Friend</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {referrals.map((ref) => (
                                    <tr key={ref.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 text-zinc-400">
                                            {new Date(ref.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-foreground">
                                            {ref.email ? maskEmail(ref.email) : 'Recuvix User'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {ref.status === 'rewarded' && (
                                                <span className="px-2.5 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-500/20">Rewarded</span>
                                            )}
                                            {ref.status === 'converted' && (
                                                <span className="px-2.5 py-1 bg-accent/10 text-accent rounded-full text-[10px] font-bold uppercase tracking-wider border border-accent/20">Generated</span>
                                            )}
                                            {ref.status === 'signed_up' && (
                                                <span className="px-2.5 py-1 bg-blue-500/10 text-blue-500 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">Signed Up</span>
                                            )}
                                            {ref.status === 'pending' && (
                                                <span className="px-2.5 py-1 bg-zinc-500/10 text-zinc-500 rounded-full text-[10px] font-bold uppercase tracking-wider border border-zinc-500/20">Pending</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};
