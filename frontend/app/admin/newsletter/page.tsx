import React from 'react';
import { getNewsletterSubscribers, getNewsletterHistory } from '@/lib/db/newsletterService';
import AdminNewsletterClientPage from '@/components/admin/newsletter/AdminNewsletterClientPage';

export default async function AdminNewsletterPage() {
    const subscribers = await getNewsletterSubscribers();
    const history = await getNewsletterHistory();

    return (
        <AdminNewsletterClientPage
            subscribers={subscribers}
            history={history}
        />
    );
}
