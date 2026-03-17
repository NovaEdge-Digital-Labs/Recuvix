import {
    Button,
    Heading,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/EmailLayout';

interface WorkspaceInviteEmailProps {
    inviterName: string;
    workspaceName: string;
    inviteLink: string;
}

export const WorkspaceInviteEmail = ({
    inviterName = 'Someone',
    workspaceName = 'a Workspace',
    inviteLink = '#',
}: WorkspaceInviteEmailProps) => {
    return (
        <EmailLayout previewText={`${inviterName} invited you to ${workspaceName} on Recuvix`}>
            <Heading className="text-2xl font-bold text-gray-900 mb-6">
                Join the Team
            </Heading>

            <Text className="text-gray-700 leading-7 mb-8">
                <strong>{inviterName}</strong> has invited you to collaborate on the <strong>{workspaceName}</strong> workspace.
                Join now to start generating and managing high-quality content together.
            </Text>

            <Section className="text-center mb-10">
                <Button
                    href={inviteLink}
                    className="bg-[#e8ff47] text-black px-8 py-4 rounded-xl font-bold text-sm no-underline inline-block"
                >
                    Accept Invitation →
                </Button>
            </Section>

            <Section className="border-t border-gray-100 pt-6">
                <Text className="text-sm text-gray-500 m-0">
                    Note: This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
                </Text>
            </Section>
        </EmailLayout>
    );
};

export default WorkspaceInviteEmail;
