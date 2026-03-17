import { HistoryPage } from '@/components/history/HistoryPage';

export const metadata = {
    title: 'Blog History | Recuvix',
    description: 'Manage and search your previously generated blogs.',
};

export default function History() {
    return (
        <main className="min-h-screen bg-background">
            <HistoryPage />
        </main>
    );
}
