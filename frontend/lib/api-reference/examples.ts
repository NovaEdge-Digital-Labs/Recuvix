export const CODE_EXAMPLES = {
  'blog-generate': {
    curl: `curl -X POST https://recuvix.in/api/blog/generate \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "topic": "Digital Marketing Tips for Indian Startups",
    "country": "india",
    "tone": "professional",
    "wordCount": 1500,
    "outputFormat": "html",
    "llmProvider": "claude",
    "apiKey": "sk-ant-..."
  }'`,
    typescript: `const response = await fetch('https://recuvix.in/api/blog/generate', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${supabaseJwt}\`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    topic: 'Digital Marketing Tips for Indian Startups',
    country: 'india',
    llmProvider: 'claude',
    apiKey: process.env.ANTHROPIC_API_KEY,
  }),
})

const reader = response.body?.getReader()
const decoder = new TextDecoder()

while (true) {
  const { done, value } = await reader!.read()
  if (done) break
  const chunk = decoder.decode(value)
  console.log(chunk)
}`,
    python: `import requests
import json

url = "https://recuvix.in/api/blog/generate"
headers = {
    "Authorization": f"Bearer {jwt_token}",
    "Content-Type": "application/json"
}
payload = {
    "topic": "Digital Marketing Tips for Indian Startups",
    "country": "india",
    "llmProvider": "claude",
    "apiKey": anthropic_key
}

with requests.post(url, headers=headers, json=payload, stream=True) as response:
    for line in response.iter_lines():
        if line:
            print(json.loads(line.decode('utf-8')))`
  },
  'outline-generate': {
    curl: `curl -X POST https://recuvix.in/api/outline/generate \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -d '{ "topic": "AI Trends", "country": "india", "llmProvider": "claude" }'`,
    typescript: `// TypeScript example for outline generation...`,
    python: `// Python example for outline generation...`
  },
  'titles-suggest': {
    curl: `curl -X POST https://recuvix.in/api/titles/suggest \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -d '{ "topic": "AI Marketing" }'`,
    typescript: `// TypeScript example for title suggestions...`,
    python: `// Python example for title suggestions...`
  },
  'seo-meta': {
    curl: `curl -X POST https://recuvix.in/api/seo/meta \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -d '{ "blogId": "..." }'`,
    typescript: `// TypeScript example for SEO meta...`,
    python: `// Python example for SEO meta...`
  },
  'voice-transcribe': {
    curl: `curl -X POST https://recuvix.in/api/voice/transcribe \\
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \\
  -d '{ "audioUrl": "..." }'`,
    typescript: `// TypeScript example for voice transcription...`,
    python: `// Python example for voice transcription...`
  }
};
