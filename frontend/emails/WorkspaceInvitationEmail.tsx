import {
    Button,
    Heading,
    Section,
    Text,
} from '@react-email/components';
import * as React from 'react';
import { BaseLayout } from './BaseLayout';

interface WorkspaceInvitationEmailProps {
    inviterName?: string;
    workspaceName?: string;
    inviteLink?: string;
}

export const WorkspaceInvitationEmail = ({
    inviterName = 'Someone',
    workspaceName = 'a Recuvix Workspace',
    inviteLink = 'https://recuvix.com/invites/join',
}: WorkspaceInvitationEmailProps) => {
    return (
        <BaseLayout previewText={`Join ${workspaceName} on Recuvix.`}>
            <Section>
                <Heading className="text-white text-2xl font-bold mb-4">
                    You've been invited!
                </Heading>
                <Text className="text-neutral-400 text-base leading-7">
                    <span className="text-white font-medium">{inviterName}</span> has invited you to collaborate on
                    <span className="text-white font-medium"> {workspaceName}</span>.
                </Text>
                <Section className="mt-8 text-center">
                    <Button
                        className="bg-accent text-black font-bold py-3 px-6 rounded-xl"
                        href={inviteLink}
                    >
                        Accept Invitation
                    </Button>
                </Section>
                <Text className="text-neutral-400 text-sm leading-6 mt-8">
                    Join your team to start generating and editing content together.
                </Text>
            </Section>
        </BaseLayout>
    );
};

export default WorkspaceInvitationEmail;
