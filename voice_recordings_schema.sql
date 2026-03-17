-- ============================================
-- VOICE RECORDINGS TABLE
-- Tracks all voice inputs and transcriptions
-- ============================================
create table if not exists public.voice_recordings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id)
    on delete cascade not null,
  workspace_id uuid references public.workspaces(id)
    on delete cascade,

  -- Input source
  source_type text not null
    check (source_type in (
      'browser_recording',
      'file_upload',
      'youtube_url'
    )),
  original_filename text,
  youtube_url text,
  audio_duration_seconds integer,
  -- Detected from the audio file
  file_size_bytes integer,
  audio_language text,
  -- ISO code detected by Whisper

  -- Storage
  audio_storage_path text,
  -- Path in Supabase Storage (temp, deleted after)
  audio_storage_expires_at timestamptz,
  -- Auto-delete after 24 hours

  -- Transcription
  transcript_raw text,
  -- Raw Whisper output (unprocessed)
  transcript_cleaned text,
  -- After filler word removal
  transcript_structured text,
  -- After LLM structuring
  word_count_transcript integer,
  transcription_status text not null
    default 'pending'
    check (transcription_status in (
      'pending', 'processing', 'complete',
      'failed', 'chunking'
    )),
  transcription_error text,
  whisper_segments jsonb,
  -- Full Whisper verbose_json segments
  -- (for word-level editing later)

  -- Blog generation link
  blog_id uuid references public.blogs(id)
    on delete set null,
  generation_status text default 'pending'
    check (generation_status in (
      'pending', 'in_progress', 'complete',
      'failed', 'skipped'
    )),

  -- Metadata
  detected_topics text[],
  -- Auto-detected from transcript
  detected_keywords text[],
  speaker_name text,
  -- For podcasts: who is speaking

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists vr_user_idx
  on public.voice_recordings(
    user_id, created_at desc);
create index if not exists vr_workspace_idx
  on public.voice_recordings(
    workspace_id, created_at desc)
  where workspace_id is not null;

alter table public.voice_recordings
  enable row level security;

drop policy if exists "Users manage own voice recordings" on public.voice_recordings;
create policy "Users manage own voice recordings"
  on public.voice_recordings for all
  using (
    auth.uid() = user_id
    or (
      workspace_id is not null
      and exists (
        select 1 from public.workspace_members wm
        where wm.workspace_id =
          voice_recordings.workspace_id
          and wm.user_id = auth.uid()
          and wm.status = 'active'
      )
    )
  );

-- updated_at trigger
drop trigger if exists set_voice_recordings_updated_at on public.voice_recordings;
create trigger set_voice_recordings_updated_at
  before update on public.voice_recordings
  for each row execute procedure
  public.set_updated_at();
