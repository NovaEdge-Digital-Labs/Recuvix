import { LinkingPage } from '@/components/linking/LinkingPage';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export const metadata = {
    title: 'Internal Linking Studio | Recuvix',
    description: 'Analyse and manage internal links across your blog library.',
};

export default function Page() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#070708] flex items-center justify-center">
                <Loader2 className="h-12 w-12 text-accent animate-spin" />
            </div>
        }>
            <LinkingPage />
        </Suspense>
    );
}
