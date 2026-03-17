import DocsLayout from "@/components/docs/DocsLayout";
import Callout from "@/components/docs/Callout";

export default function VoiceToBlogPage() {
    return (
        <DocsLayout
            title="Voice to Blog"
            description="Transform voice recordings, podcasts, or notes into polished, SEO-optimized articles."
            breadcrumbs={[
                { label: "Guides", href: "/docs" },
                { label: "Voice to Blog", href: "/docs/guides/voice-to-blog" }
            ]}
        >
            <h2 id="how-it-works">How it works</h2>
            <p>
                Voice to Blog allows you to speak your thoughts and turn them into structured blog posts. It's perfect for thought leaders, podcasters, and busy entrepreneurs.
            </p>

            <h2 id="supported-formats">Supported Formats</h2>
            <ul>
                <li><strong>Audio</strong>: MP3, WAV, M4A, OGG, FLAC.</li>
                <li><strong>Video</strong>: MP4, WebM.</li>
                <li><strong>Max Size</strong>: 100MB per file.</li>
            </ul>

            <h2 id="process">The Transformation Process</h2>
            <ol>
                <li><strong>Upload</strong>: Upload your audio/video file to the Voice Studio.</li>
                <li><strong>Transcribe</strong>: AI accurately transcribes your speech.</li>
                <li><strong>Restructure</strong>: Our SEO engine restructures the transcript into a professional blog format.</li>
                <li><strong>Optimize</strong>: The blog is optimized for your target keywords and audience.</li>
            </ol>
        </DocsLayout>
    );
}
