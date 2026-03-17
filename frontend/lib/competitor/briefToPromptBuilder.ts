export interface CompetitorBriefForPrompt {
    competitorUrl: string;
    contentWeaknesses: string[];
    briefInstructions: string;
    uniqueAngles: string[];
    avoidList: string[];
}

export function buildCompetitorPromptInstructions(data: CompetitorBriefForPrompt): string {
    return `
COMPETITOR ANALYSIS BRIEF — FOLLOW THESE INSTRUCTIONS:

You are writing a blog post specifically designed to outrank:
${data.competitorUrl}

Their content has these weaknesses you must address:
${data.contentWeaknesses.slice(0, 3).map(w => `- ${w}`).join('\n')}

For each section, follow these specific instructions:
${data.briefInstructions}

These are the unique angles that will differentiate your blog:
${data.uniqueAngles.map(a => `- ${a}`).join('\n')}

CRITICAL: Do not make these mistakes the competitor made:
${data.avoidList.map(m => `- ${m}`).join('\n')}
`;
}
