type InvitationEmailParams = {
    inviterName: string;
    inviterEmail: string;
    workspaceName: string;
    inviteeEmail: string;
    role: string;
    invitationToken: string;
    appUrl: string;
};

export async function sendWorkspaceInvitation({
    inviterName,
    workspaceName,
    inviteeEmail,
    role,
    invitationToken,
    appUrl,
}: InvitationEmailParams): Promise<void> {
    const inviteUrl = `${appUrl}/api/workspaces/accept-invite?token=${invitationToken}`;

    if (process.env.RESEND_API_KEY) {
        try {
            const { Resend } = await import('resend');
            const resend = new Resend(process.env.RESEND_API_KEY);
            await resend.emails.send({
                from: 'Recuvix <noreply@recuvix.in>',
                to: inviteeEmail,
                subject: `${inviterName} invited you to join ${workspaceName} on Recuvix`,
                html: buildInvitationEmailHtml({
                    inviterName,
                    workspaceName,
                    role,
                    inviteUrl,
                }),
            });
            return;
        } catch (error) {
            console.error('Failed to send email via Resend:', error);
        }
    }

    // Fallback: Log for development
    console.log('--- WORKSPACE INVITATION ---');
    console.log('To:', inviteeEmail);
    console.log('Workspace:', workspaceName);
    console.log('Inviter:', inviterName);
    console.log('Role:', role);
    console.log('Accept URL:', inviteUrl);
    console.log('---------------------------');
}

function buildInvitationEmailHtml({
    inviterName,
    workspaceName,
    role,
    inviteUrl,
}: {
    inviterName: string;
    workspaceName: string;
    role: string;
    inviteUrl: string;
}): string {
    return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0d1117; color: #e6edf3; border-radius: 8px;">
      <h2 style="color: #58a6ff;">Join your team on Recuvix</h2>
      <p style="font-size: 16px;">Hello,</p>
      <p style="font-size: 16px;">
        <strong>${inviterName}</strong> has invited you to join the <strong>${workspaceName}</strong> workspace as a <strong>${role}</strong>.
      </p>
      <div style="margin: 30px 0; text-align: center;">
        <a href="${inviteUrl}" style="background-color: #238636; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Accept Invitation</a>
      </div>
      <p style="font-size: 14px; color: #8b949e;">
        This invitation will expire in 7 days. If you weren't expecting this invitation, you can safely ignore this email.
      </p>
      <hr style="border: none; border-top: 1px solid #30363d; margin: 20px 0;" />
      <p style="font-size: 12px; color: #8b949e; text-align: center;">
        Recuvix — AI-Powered SEO Blog Generation
      </p>
    </div>
  `;
}
