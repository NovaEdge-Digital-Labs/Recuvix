'use client'

import React from 'react';
import LegalLayout from '@/components/legal/LegalLayout';
import { LegalSection } from '@/components/legal/LegalSection';
import { LegalCallout } from '@/components/legal/LegalCallout';
import { useLegalTOC } from '@/hooks/useLegalTOC';

const SECTIONS = [
    { id: 'introduction', title: '1. Introduction' },
    { id: 'collect', title: '2. Information We Collect' },
    { id: 'use', title: '3. How We Use Your Information' },
    { id: 'voice', title: '4. Voice Recording Data' },
    { id: 'third-party', title: '5. Third-Party Services' },
    { id: 'storage', title: '6. Data Storage and Security' },
    { id: 'retention', title: '7. Data Retention' },
    { id: 'rights', title: '8. Your Rights' },
    { id: 'children', title: '9. Children\'s Privacy' },
    { id: 'international', title: '10. International Transfers' },
    { id: 'cookies', title: '11. Cookies and Tracking' },
    { id: 'changes', title: '12. Changes to This Policy' },
    { id: 'contact', title: '13. Contact Us' },
];

export function PrivacyContent() {
    const activeId = useLegalTOC(SECTIONS.map(s => s.id));

    return (
        <LegalLayout
            label="Legal"
            title="Privacy Policy"
            subtitle="How Recuvix collects, uses, and protects your personal data. We value your privacy as much as you do."
            lastUpdated="March 17, 2026"
            effectiveDate="March 17, 2026"
            sections={SECTIONS}
            activeId={activeId}
        >
            <LegalSection id="introduction" title="1. Introduction">
                <p>
                    Welcome to Recuvix ("we", "us", "our"). Recuvix is an AI-powered blog generation platform operated by Recuvix Technologies, a company incorporated in India.
                </p>
                <p>
                    This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you use our platform at recuvix.in and related services.
                </p>
                <LegalCallout>
                    <strong>Plain English summary:</strong> We collect only what we need to run the service. We never sell your data. Your LLM API keys are never stored on our servers. You can delete your account and all data at any time.
                </LegalCallout>
                <p>
                    By using Recuvix, you agree to this Privacy Policy. If you disagree, please do not use our service.
                </p>
            </LegalSection>

            <LegalSection id="collect" title="2. Information We Collect">
                <h3>2.1 Information you provide directly</h3>
                <p><strong>Account information:</strong></p>
                <ul>
                    <li>Email address</li>
                    <li>Full name (optional)</li>
                    <li>Profile photo (if signing in via Google)</li>
                    <li>Password (hashed using bcrypt — we never store plain-text passwords)</li>
                </ul>

                <p><strong>Payment information:</strong></p>
                <ul>
                    <li>Transaction ID (from Razorpay)</li>
                    <li>Payment amount and timestamp</li>
                    <li>Pack purchased</li>
                </ul>
                <p>
                    We do NOT collect or store: Credit card numbers, CVV codes, or bank account details. All payment processing is handled by Razorpay, a PCI DSS Level 1 certified payment processor.
                </p>

                <p><strong>Content you create:</strong></p>
                <ul>
                    <li>Blog topics, titles, and generated content</li>
                    <li>Uploaded brand assets (logos, images)</li>
                    <li>Workspace details and member lists</li>
                    <li>Voice recordings (temporarily, see Section 4)</li>
                    <li>Calendar entries and keyword research</li>
                    <li>Internal linking strategies</li>
                </ul>

                <p><strong>Support communications:</strong></p>
                <p>If you contact us, we keep records of the communication to help resolve your issue.</p>

                <h3>2.2 Information collected automatically</h3>
                <p><strong>Usage data:</strong></p>
                <ul>
                    <li>Pages visited and features used</li>
                    <li>Blog generation count and types</li>
                    <li>Error logs and performance data</li>
                    <li>Timestamps of key actions</li>
                </ul>

                <p><strong>Device and browser data:</strong></p>
                <ul>
                    <li>Browser type and version</li>
                    <li>Operating system</li>
                    <li>Screen resolution</li>
                    <li>IP address (used for security, not tracking)</li>
                </ul>

                <p><strong>Cookies:</strong></p>
                <table>
                    <thead>
                        <tr>
                            <th>Cookie</th>
                            <th>Purpose</th>
                            <th>Duration</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>sb-access-token</td>
                            <td>Supabase authentication session</td>
                            <td>1 hour</td>
                        </tr>
                        <tr>
                            <td>sb-refresh-token</td>
                            <td>Keeps you logged in</td>
                            <td>7 days</td>
                        </tr>
                        <tr>
                            <td>recuvix_prefs</td>
                            <td>UI preferences (theme, defaults)</td>
                            <td>1 year</td>
                        </tr>
                        <tr>
                            <td>_ga</td>
                            <td>Google Analytics (if enabled)</td>
                            <td>2 years</td>
                        </tr>
                    </tbody>
                </table>

                <h3>2.3 What we do NOT collect</h3>
                <ul>
                    <li>Your LLM API keys (stored only in your browser)</li>
                    <li>The content of your API key requests to AI providers</li>
                    <li>Biometric data</li>
                    <li>Government ID numbers</li>
                    <li>Your precise GPS location</li>
                </ul>
            </LegalSection>

            <LegalSection id="use" title="3. How We Use Your Information">
                <p>We use the information we collect to:</p>
                <p><strong>Provide the service:</strong></p>
                <ul>
                    <li>Create and manage your account</li>
                    <li>Process credit purchases and maintain your balance</li>
                    <li>Generate blogs and SEO content on your behalf</li>
                    <li>Store generated blogs in your history</li>
                    <li>Enable team workspace features</li>
                </ul>

                <p><strong>Improve the service:</strong></p>
                <ul>
                    <li>Understand which features are used most</li>
                    <li>Debug errors and performance issues</li>
                    <li>Develop new features based on usage patterns</li>
                </ul>

                <p><strong>Communicate with you:</strong></p>
                <ul>
                    <li>Send transactional emails (payment receipts, password resets, credit refund notifications)</li>
                    <li>Respond to support requests</li>
                    <li>Send product updates (you can unsubscribe anytime)</li>
                </ul>

                <p><strong>Security and fraud prevention:</strong></p>
                <ul>
                    <li>Detect and prevent abuse</li>
                    <li>Enforce our Terms of Service</li>
                    <li>Protect other users from harm</li>
                </ul>

                <p><strong>Legal compliance:</strong></p>
                <ul>
                    <li>Comply with Indian law and regulations</li>
                    <li>Respond to lawful government requests</li>
                    <li>Maintain records required by law</li>
                </ul>

                <p><strong>We do NOT:</strong></p>
                <ul>
                    <li>Sell your personal data to any third party</li>
                    <li>Use your content to train AI models</li>
                    <li>Display advertising based on your data</li>
                    <li>Share your data with marketers</li>
                </ul>
            </LegalSection>

            <LegalSection id="voice" title="4. Voice Recording Data">
                <p>If you use the Voice to Blog feature:</p>
                <p><strong>What we collect:</strong></p>
                <ul>
                    <li>Your audio recording (uploaded to secure storage)</li>
                    <li>The transcription produced by OpenAI Whisper</li>
                    <li>The structured transcript used for blog generation</li>
                </ul>

                <p><strong>How it is used:</strong></p>
                <p>Your audio is sent to OpenAI's Whisper API for transcription. OpenAI's privacy policy governs their handling of this data.</p>

                <p><strong>Retention:</strong></p>
                <p>Audio files are automatically deleted from our servers within 24 hours of successful blog generation. Transcripts are retained as part of your blog history until you delete them.</p>

                <p><strong>Your control:</strong></p>
                <p>You can delete any voice recording and its transcript from your account at any time.</p>
            </LegalSection>

            <LegalSection id="third-party" title="5. Third-Party Services">
                <p>We use these third-party services. Each has its own privacy policy:</p>
                <table>
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Purpose</th>
                            <th>Data shared</th>
                            <th>Policy</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Supabase</td>
                            <td>Authentication and database</td>
                            <td>Email, account data</td>
                            <td><a href="https://supabase.com/privacy" target="_blank">supabase.com/privacy</a></td>
                        </tr>
                        <tr>
                            <td>Razorpay</td>
                            <td>Payment processing</td>
                            <td>Name, email, payment</td>
                            <td><a href="https://razorpay.com/privacy" target="_blank">razorpay.com/privacy</a></td>
                        </tr>
                        <tr>
                            <td>Cloudinary</td>
                            <td>Image storage</td>
                            <td>Uploaded images</td>
                            <td><a href="https://cloudinary.com/privacy" target="_blank">cloudinary.com/privacy</a></td>
                        </tr>
                        <tr>
                            <td>OpenAI</td>
                            <td>Whisper transcription</td>
                            <td>Audio recordings</td>
                            <td><a href="https://openai.com/privacy" target="_blank">openai.com/privacy</a></td>
                        </tr>
                        <tr>
                            <td>Resend</td>
                            <td>Transactional email</td>
                            <td>Email address, name</td>
                            <td><a href="https://resend.com/privacy" target="_blank">resend.com/privacy</a></td>
                        </tr>
                        <tr>
                            <td>Google (OAuth)</td>
                            <td>Sign-in option</td>
                            <td>Email, name, photo</td>
                            <td><a href="https://policies.google.com/privacy" target="_blank">policies.google.com/privacy</a></td>
                        </tr>
                    </tbody>
                </table>

                <p><strong>AI providers (Claude, ChatGPT, Gemini, Grok):</strong></p>
                <p>If you use BYOK mode, your API key and content requests go directly from your browser to the AI provider. Recuvix does not proxy or log these requests.</p>
                <p>If you use Managed Mode, your blog topic and generation parameters are sent to our server, which calls the AI provider using our platform key. We do not store the raw AI provider request/reponse.</p>
            </LegalSection>

            <LegalSection id="storage" title="6. Data Storage and Security">
                <h3>6.1 Where your data is stored</h3>
                <p>Your data is stored on:</p>
                <ul>
                    <li>Supabase (primary database): hosted on AWS in the ap-south-1 (Mumbai) region</li>
                    <li>Cloudinary CDN: globally distributed</li>
                    <li>Supabase Storage: AWS S3 (Mumbai region)</li>
                </ul>
                <p>We choose India-region hosting wherever possible to comply with data localisation principles.</p>

                <h3>6.2 Security measures</h3>
                <ul>
                    <li><strong>Encryption in transit:</strong> All data transmitted over HTTPS using TLS 1.3</li>
                    <li><strong>Encryption at rest:</strong> Database encrypted using AES-256</li>
                    <li><strong>Row-level security:</strong> Supabase RLS ensures users can only access their own data</li>
                    <li><strong>API key encryption:</strong> Tenant LLM keys stored using AES-256-CBC with a server-side secret</li>
                    <li><strong>Password hashing:</strong> bcrypt with salt rounds</li>
                    <li><strong>SSRF protection:</strong> Competitor scraper validates all URLs against private IP blocklists</li>
                    <li><strong>Rate limiting:</strong> All API endpoints rate-limited to prevent abuse</li>
                </ul>

                <h3>6.3 Data breach response</h3>
                <p>In the event of a data breach:</p>
                <ul>
                    <li>We will notify affected users within 72 hours of discovery</li>
                    <li>We will notify relevant authorities as required by law</li>
                    <li>We will publish a post-mortem within 30 days</li>
                </ul>
            </LegalSection>

            <LegalSection id="retention" title="7. Data Retention">
                <p>We retain your data for as long as necessary:</p>
                <table>
                    <thead>
                        <tr>
                            <th>Data type</th>
                            <th>Retention period</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Account information</td>
                            <td>Until account deletion</td>
                        </tr>
                        <tr>
                            <td>Generated blogs</td>
                            <td>Until deleted by you</td>
                        </tr>
                        <tr>
                            <td>Voice recordings (audio)</td>
                            <td>24 hours after generation</td>
                        </tr>
                        <tr>
                            <td>Voice transcripts</td>
                            <td>Until deleted by you</td>
                        </tr>
                        <tr>
                            <td>Payment records</td>
                            <td>7 years (Indian tax law requirement)</td>
                        </tr>
                        <tr>
                            <td>Support communications</td>
                            <td>3 years</td>
                        </tr>
                        <tr>
                            <td>Usage logs</td>
                            <td>90 days</td>
                        </tr>
                        <tr>
                            <td>Error logs</td>
                            <td>30 days</td>
                        </tr>
                        <tr>
                            <td>Deleted account data</td>
                            <td>Permanently deleted within 30 days</td>
                        </tr>
                    </tbody>
                </table>
                <p><strong>Exception:</strong> Payment records must be retained for 7 years under the Indian Income Tax Act.</p>
            </LegalSection>

            <LegalSection id="rights" title="8. Your Rights">
                <p>You have the following rights regarding your data:</p>
                <p><strong>Right to access:</strong> Request a copy of all personal data we hold about you. We will respond within 30 days.</p>
                <p><strong>Right to correction:</strong> Update incorrect information via your account settings.</p>
                <p><strong>Right to deletion:</strong> Delete your account and all associated data from Settings → Account.</p>
                <p><strong>Right to data portability:</strong> Export all your blogs in HTML, Markdown, or XML format.</p>
                <p><strong>Right to restrict processing:</strong> Object to specific uses of your data by contacting legal@recuvix.in.</p>
                <p><strong>Right to withdraw consent:</strong> Withdraw consent for non-essential processing at any time.</p>

                <p>To exercise any of these rights, email: <strong>legal@recuvix.in</strong></p>
            </LegalSection>

            <LegalSection id="children" title="9. Children's Privacy">
                <p>Recuvix is not intended for users under 18 years of age. We do not knowingly collect personal information from minors.</p>
                <p>If you believe a minor has provided us with personal information, please contact us and we will delete it promptly.</p>
            </LegalSection>

            <LegalSection id="international" title="10. International Transfers">
                <p>Your data may be processed in countries other than India when we use third-party services like Cloudinary (USA) and Resend (USA).</p>
                <p>These transfers are governed by appropriate safeguards including standard contractual clauses.</p>
            </LegalSection>

            <LegalSection id="cookies" title="11. Cookies and Tracking">
                <p>We use minimal cookies essential for service functionality. We do not use advertising cookies or cross-site tracking.</p>
                <p>If you use a browser extension to block trackers, our site will continue to function normally. Only authentication cookies are strictly necessary.</p>
            </LegalSection>

            <LegalSection id="changes" title="12. Changes to This Policy">
                <p>We may update this Privacy Policy from time to time. When we do:</p>
                <ul>
                    <li>The "Last updated" date will change</li>
                    <li>Significant changes will be notified via email</li>
                    <li>Continued use after changes constitutes acceptance of the new policy</li>
                </ul>
            </LegalSection>

            <LegalSection id="contact" title="13. Contact Us">
                <p>For privacy questions or requests:</p>
                <p><strong>Email:</strong> legal@recuvix.in</p>
                <p><strong>Response time:</strong> Within 5 business days</p>
                <p><strong>Address:</strong> Recuvix Technologies, India</p>
            </LegalSection>
        </LegalLayout>
    );
}
