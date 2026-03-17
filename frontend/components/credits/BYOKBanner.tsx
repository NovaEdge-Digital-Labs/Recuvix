import { Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function BYOKBanner() {
    return (
        <div className="relative mt-24 overflow-hidden rounded-3xl bg-slate-900 px-6 py-12 sm:px-12 sm:py-16">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <Key className="w-64 h-64 text-white -rotate-12" />
            </div>

            <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                    Prefer to bring your own key?
                </h2>
                <p className="mt-6 text-lg leading-8 text-zinc-300">
                    We support BYOK (Bring Your Own Key) for all major LLM providers.
                    Use your own API keys for unlimited generation without purchasing credits.
                </p>
                <div className="flex items-center gap-6 mt-10">
                    <Link href="/onboarding">
                        <Button size="lg" className="bg-accent text-zinc-950 hover:bg-accent/90 font-bold px-8">
                            Setup API Keys
                        </Button>
                    </Link>
                    <Link href="/profile" className="text-sm font-semibold leading-6 text-zinc-300 hover:text-white transition-colors">
                        Learn more <span aria-hidden="true">→</span>
                    </Link>
                </div>
            </div>

            {/* Abstract circles */}
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"></div>
        </div>
    );
}
