export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      api_keys: {
        Row: {
          created_at: string | null
          encrypted_key: string
          id: string
          is_default: boolean | null
          is_valid: boolean | null
          key_hint: string | null
          last_tested_at: string | null
          provider: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          encrypted_key: string
          id?: string
          is_default?: boolean | null
          is_valid?: boolean | null
          key_hint?: string | null
          last_tested_at?: string | null
          provider?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          encrypted_key?: string
          id?: string
          is_default?: boolean | null
          is_valid?: boolean | null
          key_hint?: string | null
          last_tested_at?: string | null
          provider?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      applied_internal_links: {
        Row: {
          anchor_text: string
          applied_at: string
          created_at: string
          id: string
          is_active: boolean
          removed_at: string | null
          removed_reason: string | null
          section_h2: string | null
          source_blog_id: string
          suggestion_id: string | null
          target_blog_id: string
          target_url: string
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          anchor_text: string
          applied_at?: string
          created_at?: string
          id?: string
          is_active?: boolean
          removed_at?: string | null
          removed_reason?: string | null
          section_h2?: string | null
          source_blog_id: string
          suggestion_id?: string | null
          target_blog_id: string
          target_url: string
          user_id: string
          workspace_id?: string | null
        }
        Update: {
          anchor_text?: string
          applied_at?: string
          created_at?: string
          id?: string
          is_active?: boolean
          removed_at?: string | null
          removed_reason?: string | null
          section_h2?: string | null
          source_blog_id?: string
          suggestion_id?: string | null
          target_blog_id?: string
          target_url?: string
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applied_internal_links_source_blog_id_fkey"
            columns: ["source_blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applied_internal_links_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "internal_link_suggestions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applied_internal_links_target_blog_id_fkey"
            columns: ["target_blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applied_internal_links_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_avatar_url: string | null
          author_name: string
          category: string
          content: string
          cover_image_url: string | null
          created_at: string
          excerpt: string
          id: string
          is_featured: boolean
          is_published: boolean
          published_at: string
          read_time_minutes: number
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          author_avatar_url?: string | null
          author_name: string
          category: string
          content: string
          cover_image_url?: string | null
          created_at?: string
          excerpt: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          published_at?: string
          read_time_minutes?: number
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          author_avatar_url?: string | null
          author_name?: string
          category?: string
          content?: string
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          is_featured?: boolean
          is_published?: boolean
          published_at?: string
          read_time_minutes?: number
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blogs: {
        Row: {
          approval_status: string | null
          approved_outline: Json | null
          blog_html: string | null
          blog_markdown: string | null
          country: string | null
          created_at: string | null
          edit_count: number | null
          edit_history: Json | null
          excerpt: string | null
          focus_keyword: string | null
          format: string | null
          generated_by: string | null
          generation_input: Json | null
          generation_time_seconds: number | null
          has_wordpress_post: boolean | null
          id: string
          internal_links_count: number
          is_starred: boolean | null
          language_code: string | null
          last_viewed_at: string | null
          link_index: Json | null
          meta_description: string | null
          meta_title: string | null
          model: string
          parent_blog_id: string | null
          secondary_keywords: string[] | null
          seo_meta: Json | null
          slug: string | null
          tags: string[] | null
          tenant_id: string | null
          thumbnail_url: string | null
          title: string
          topic: string
          updated_at: string | null
          user_id: string
          word_count: number | null
          wordpress_post_id: number | null
          wordpress_url: string | null
          workspace_id: string | null
        }
        Insert: {
          approval_status?: string | null
          approved_outline?: Json | null
          blog_html?: string | null
          blog_markdown?: string | null
          country?: string | null
          created_at?: string | null
          edit_count?: number | null
          edit_history?: Json | null
          excerpt?: string | null
          focus_keyword?: string | null
          format?: string | null
          generated_by?: string | null
          generation_input?: Json | null
          generation_time_seconds?: number | null
          has_wordpress_post?: boolean | null
          id?: string
          internal_links_count?: number
          is_starred?: boolean | null
          language_code?: string | null
          last_viewed_at?: string | null
          link_index?: Json | null
          meta_description?: string | null
          meta_title?: string | null
          model: string
          parent_blog_id?: string | null
          secondary_keywords?: string[] | null
          seo_meta?: Json | null
          slug?: string | null
          tags?: string[] | null
          tenant_id?: string | null
          thumbnail_url?: string | null
          title: string
          topic: string
          updated_at?: string | null
          user_id: string
          word_count?: number | null
          wordpress_post_id?: number | null
          wordpress_url?: string | null
          workspace_id?: string | null
        }
        Update: {
          approval_status?: string | null
          approved_outline?: Json | null
          blog_html?: string | null
          blog_markdown?: string | null
          country?: string | null
          created_at?: string | null
          edit_count?: number | null
          edit_history?: Json | null
          excerpt?: string | null
          focus_keyword?: string | null
          format?: string | null
          generated_by?: string | null
          generation_input?: Json | null
          generation_time_seconds?: number | null
          has_wordpress_post?: boolean | null
          id?: string
          internal_links_count?: number
          is_starred?: boolean | null
          language_code?: string | null
          last_viewed_at?: string | null
          link_index?: Json | null
          meta_description?: string | null
          meta_title?: string | null
          model?: string
          parent_blog_id?: string | null
          secondary_keywords?: string[] | null
          seo_meta?: Json | null
          slug?: string | null
          tags?: string[] | null
          tenant_id?: string | null
          thumbnail_url?: string | null
          title?: string
          topic?: string
          updated_at?: string | null
          user_id?: string
          word_count?: number | null
          wordpress_post_id?: number | null
          wordpress_url?: string | null
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blogs_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blogs_parent_blog_id_fkey"
            columns: ["parent_blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blogs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "wl_tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blogs_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_entries: {
        Row: {
          ai_suggestion_reason: string | null
          assigned_to: string | null
          assigned_to_name: string | null
          blog_id: string | null
          category: string | null
          content_type: string | null
          country: string
          created_at: string
          estimated_difficulty: string | null
          estimated_search_volume: string | null
          focus_keyword: string
          id: string
          is_ai_suggested: boolean
          notes: string | null
          priority: string
          published_url: string | null
          research_history_id: string | null
          scheduled_date: string
          scheduled_time: string | null
          seasonality_note: string | null
          secondary_keywords: string[]
          status: string
          tags: string[]
          target_tone: string | null
          target_word_count: number | null
          title: string
          topic: string
          trend_context: string | null
          updated_at: string
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          ai_suggestion_reason?: string | null
          assigned_to?: string | null
          assigned_to_name?: string | null
          blog_id?: string | null
          category?: string | null
          content_type?: string | null
          country?: string
          created_at?: string
          estimated_difficulty?: string | null
          estimated_search_volume?: string | null
          focus_keyword?: string
          id?: string
          is_ai_suggested?: boolean
          notes?: string | null
          priority?: string
          published_url?: string | null
          research_history_id?: string | null
          scheduled_date: string
          scheduled_time?: string | null
          seasonality_note?: string | null
          secondary_keywords?: string[]
          status?: string
          tags?: string[]
          target_tone?: string | null
          target_word_count?: number | null
          title: string
          topic: string
          trend_context?: string | null
          updated_at?: string
          user_id: string
          workspace_id?: string | null
        }
        Update: {
          ai_suggestion_reason?: string | null
          assigned_to?: string | null
          assigned_to_name?: string | null
          blog_id?: string | null
          category?: string | null
          content_type?: string | null
          country?: string
          created_at?: string
          estimated_difficulty?: string | null
          estimated_search_volume?: string | null
          focus_keyword?: string
          id?: string
          is_ai_suggested?: boolean
          notes?: string | null
          priority?: string
          published_url?: string | null
          research_history_id?: string | null
          scheduled_date?: string
          scheduled_time?: string | null
          seasonality_note?: string | null
          secondary_keywords?: string[]
          status?: string
          tags?: string[]
          target_tone?: string | null
          target_word_count?: number | null
          title?: string
          topic?: string
          trend_context?: string | null
          updated_at?: string
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_entries_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_entries_research_history_id_fkey"
            columns: ["research_history_id"]
            isOneToOne: false
            referencedRelation: "research_history"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_entries_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_settings: {
        Row: {
          ai_suggestions_enabled: boolean | null
          auto_fill_gaps: boolean | null
          created_at: string
          default_country: string | null
          default_publishing_frequency: string | null
          default_view: string | null
          include_seasonal_topics: boolean | null
          include_trending_topics: boolean | null
          primary_niche: string | null
          reminder_days_before: number | null
          start_day_of_week: number | null
          target_blogs_per_month: number | null
          updated_at: string
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          ai_suggestions_enabled?: boolean | null
          auto_fill_gaps?: boolean | null
          created_at?: string
          default_country?: string | null
          default_publishing_frequency?: string | null
          default_view?: string | null
          include_seasonal_topics?: boolean | null
          include_trending_topics?: boolean | null
          primary_niche?: string | null
          reminder_days_before?: number | null
          start_day_of_week?: number | null
          target_blogs_per_month?: number | null
          updated_at?: string
          user_id: string
          workspace_id?: string | null
        }
        Update: {
          ai_suggestions_enabled?: boolean | null
          auto_fill_gaps?: boolean | null
          created_at?: string
          default_country?: string | null
          default_publishing_frequency?: string | null
          default_view?: string | null
          include_seasonal_topics?: boolean | null
          include_trending_topics?: boolean | null
          primary_niche?: string | null
          reminder_days_before?: number | null
          start_day_of_week?: number | null
          target_blogs_per_month?: number | null
          updated_at?: string
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_settings_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          ip_address: string | null
          message: string
          name: string
          priority: string | null
          resolution_note: string | null
          resolved_at: string | null
          status: string
          subject: string
          ticket_id: string
          topic: string
          updated_at: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          ip_address?: string | null
          message: string
          name: string
          priority?: string | null
          resolution_note?: string | null
          resolved_at?: string | null
          status?: string
          subject: string
          ticket_id: string
          topic: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          ip_address?: string | null
          message?: string
          name?: string
          priority?: string | null
          resolution_note?: string | null
          resolved_at?: string | null
          status?: string
          subject?: string
          ticket_id?: string
          topic?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      credit_grants: {
        Row: {
          created_at: string
          credits_amount: number
          expires_at: string | null
          granted_by: string
          granted_by_user_id: string | null
          id: string
          note: string | null
          reason: string
          rule_id: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_amount: number
          expires_at?: string | null
          granted_by: string
          granted_by_user_id?: string | null
          id?: string
          note?: string | null
          reason: string
          rule_id?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits_amount?: number
          expires_at?: string | null
          granted_by?: string
          granted_by_user_id?: string | null
          id?: string
          note?: string | null
          reason?: string
          rule_id?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_grants_rule_id_fkey"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "credit_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_rules: {
        Row: {
          condition_country: string | null
          condition_min_blogs: number | null
          created_at: string
          credits_amount: number
          credits_expire_days: number | null
          id: string
          is_active: boolean
          max_grants_per_user: number
          name: string
          trigger_event: string
          updated_at: string
        }
        Insert: {
          condition_country?: string | null
          condition_min_blogs?: number | null
          created_at?: string
          credits_amount: number
          credits_expire_days?: number | null
          id?: string
          is_active?: boolean
          max_grants_per_user?: number
          name: string
          trigger_event: string
          updated_at?: string
        }
        Update: {
          condition_country?: string | null
          condition_min_blogs?: number | null
          created_at?: string
          credits_amount?: number
          credits_expire_days?: number | null
          id?: string
          is_active?: boolean
          max_grants_per_user?: number
          name?: string
          trigger_event?: string
          updated_at?: string
        }
        Relationships: []
      }
      credit_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          metadata: Json | null
          profile_id: string | null
          type: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          metadata?: Json | null
          profile_id?: string | null
          type: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          profile_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "credit_transactions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gsc_configs: {
        Row: {
          access_token: string
          connected_at: string | null
          id: string
          refresh_token: string
          site_url: string
          token_expiry: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          connected_at?: string | null
          id?: string
          refresh_token: string
          site_url: string
          token_expiry: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          connected_at?: string | null
          id?: string
          refresh_token?: string
          site_url?: string
          token_expiry?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      internal_link_suggestions: {
        Row: {
          anchor_text: string
          applied_at: string | null
          computed_at: string
          computed_by: string
          context_sentence: string
          created_at: string
          id: string
          placement_type: string
          rejected_reason: string | null
          relevance_score: number
          score_breakdown: Json | null
          section_h2: string | null
          source_blog_id: string
          status: string
          target_blog_id: string
          target_focus_keyword: string | null
          target_slug: string | null
          target_title: string
          target_url: string | null
          updated_at: string
          user_id: string
          workspace_id: string | null
        }
        Insert: {
          anchor_text: string
          applied_at?: string | null
          computed_at?: string
          computed_by?: string
          context_sentence: string
          created_at?: string
          id?: string
          placement_type: string
          rejected_reason?: string | null
          relevance_score: number
          score_breakdown?: Json | null
          section_h2?: string | null
          source_blog_id: string
          status?: string
          target_blog_id: string
          target_focus_keyword?: string | null
          target_slug?: string | null
          target_title: string
          target_url?: string | null
          updated_at?: string
          user_id: string
          workspace_id?: string | null
        }
        Update: {
          anchor_text?: string
          applied_at?: string | null
          computed_at?: string
          computed_by?: string
          context_sentence?: string
          created_at?: string
          id?: string
          placement_type?: string
          rejected_reason?: string | null
          relevance_score?: number
          score_breakdown?: Json | null
          section_h2?: string | null
          source_blog_id?: string
          status?: string
          target_blog_id?: string
          target_focus_keyword?: string | null
          target_slug?: string | null
          target_title?: string
          target_url?: string | null
          updated_at?: string
          user_id?: string
          workspace_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "internal_link_suggestions_source_blog_id_fkey"
            columns: ["source_blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internal_link_suggestions_target_blog_id_fkey"
            columns: ["target_blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internal_link_suggestions_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_sends: {
        Row: {
          click_count: number | null
          created_at: string | null
          html_content: string
          id: string
          open_count: number | null
          preview_text: string | null
          recipient_count: number | null
          scheduled_at: string | null
          sent_at: string | null
          status: string | null
          subject: string
        }
        Insert: {
          click_count?: number | null
          created_at?: string | null
          html_content: string
          id?: string
          open_count?: number | null
          preview_text?: string | null
          recipient_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject: string
        }
        Update: {
          click_count?: number | null
          created_at?: string | null
          html_content?: string
          id?: string
          open_count?: number | null
          preview_text?: string | null
          recipient_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          name: string | null
          source: string | null
          status: string | null
          subscribed_at: string | null
          unsubscribe_token: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          name?: string | null
          source?: string | null
          status?: string | null
          subscribed_at?: string | null
          unsubscribe_token?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          name?: string | null
          source?: string | null
          status?: string | null
          subscribed_at?: string | null
          unsubscribe_token?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          link: string | null
          message: string
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message: string
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      platform_api_keys: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          key_value: string
          provider: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          key_value: string
          provider: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          key_value?: string
          provider?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          admin_labels: string[] | null
          admin_note: string | null
          admin_notes: string | null
          avatar_url: string | null
          blogs_generated_count: number | null
          country: string | null
          created_at: string | null
          credits_balance: number | null
          email: string
          full_name: string | null
          id: string
          is_suspended: boolean | null
          last_active_at: string | null
          managed_mode_enabled: boolean | null
          plan: string | null
          plan_expires_at: string | null
          preferences: Json | null
          referral_code: string | null
          referred_by_user_id: string | null
          suspended_reason: string | null
          suspension_reason: string | null
          tenant_id: string | null
          total_blogs_generated: number | null
          total_credits_purchased: number | null
          total_free_credits_received: number | null
          total_referral_credits_earned: number | null
          total_referrals: number | null
          total_words_generated: number | null
          updated_at: string | null
          user_label: string | null
        }
        Insert: {
          admin_labels?: string[] | null
          admin_note?: string | null
          admin_notes?: string | null
          avatar_url?: string | null
          blogs_generated_count?: number | null
          country?: string | null
          created_at?: string | null
          credits_balance?: number | null
          email: string
          full_name?: string | null
          id: string
          is_suspended?: boolean | null
          last_active_at?: string | null
          managed_mode_enabled?: boolean | null
          plan?: string | null
          plan_expires_at?: string | null
          preferences?: Json | null
          referral_code?: string | null
          referred_by_user_id?: string | null
          suspended_reason?: string | null
          suspension_reason?: string | null
          tenant_id?: string | null
          total_blogs_generated?: number | null
          total_credits_purchased?: number | null
          total_free_credits_received?: number | null
          total_referral_credits_earned?: number | null
          total_referrals?: number | null
          total_words_generated?: number | null
          updated_at?: string | null
          user_label?: string | null
        }
        Update: {
          admin_labels?: string[] | null
          admin_note?: string | null
          admin_notes?: string | null
          avatar_url?: string | null
          blogs_generated_count?: number | null
          country?: string | null
          created_at?: string | null
          credits_balance?: number | null
          email?: string
          full_name?: string | null
          id?: string
          is_suspended?: boolean | null
          last_active_at?: string | null
          managed_mode_enabled?: boolean | null
          plan?: string | null
          plan_expires_at?: string | null
          preferences?: Json | null
          referral_code?: string | null
          referred_by_user_id?: string | null
          suspended_reason?: string | null
          suspension_reason?: string | null
          tenant_id?: string | null
          total_blogs_generated?: number | null
          total_credits_purchased?: number | null
          total_free_credits_received?: number | null
          total_referral_credits_earned?: number | null
          total_referrals?: number | null
          total_words_generated?: number | null
          updated_at?: string | null
          user_label?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "wl_tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      ranking_snapshots: {
        Row: {
          clicks: number | null
          created_at: string | null
          ctr: number | null
          id: string
          impressions: number | null
          keyword: string
          position: number | null
          snapshot_date: string
          tracked_blog_id: string
          user_id: string
        }
        Insert: {
          clicks?: number | null
          created_at?: string | null
          ctr?: number | null
          id?: string
          impressions?: number | null
          keyword: string
          position?: number | null
          snapshot_date?: string
          tracked_blog_id: string
          user_id: string
        }
        Update: {
          clicks?: number | null
          created_at?: string | null
          ctr?: number | null
          id?: string
          impressions?: number | null
          keyword?: string
          position?: number | null
          snapshot_date?: string
          tracked_blog_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ranking_snapshots_tracked_blog_id_fkey"
            columns: ["tracked_blog_id"]
            isOneToOne: false
            referencedRelation: "tracked_blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      razorpay_orders: {
        Row: {
          amount_inr: number
          created_at: string
          credits: number
          id: string
          pack_id: string
          profile_id: string | null
          razorpay_order_id: string
          receipt: string | null
          status: string
        }
        Insert: {
          amount_inr: number
          created_at?: string
          credits: number
          id?: string
          pack_id: string
          profile_id?: string | null
          razorpay_order_id: string
          receipt?: string | null
          status?: string
        }
        Update: {
          amount_inr?: number
          created_at?: string
          credits?: number
          id?: string
          pack_id?: string
          profile_id?: string | null
          razorpay_order_id?: string
          receipt?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "razorpay_orders_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          converted_at: string | null
          created_at: string | null
          credits_rewarded: number | null
          id: string
          referral_code: string
          referred_user_id: string | null
          referrer_user_id: string
          rewarded_at: string | null
          signed_up_at: string | null
          status: string | null
        }
        Insert: {
          converted_at?: string | null
          created_at?: string | null
          credits_rewarded?: number | null
          id?: string
          referral_code: string
          referred_user_id?: string | null
          referrer_user_id: string
          rewarded_at?: string | null
          signed_up_at?: string | null
          status?: string | null
        }
        Update: {
          converted_at?: string | null
          created_at?: string | null
          credits_rewarded?: number | null
          id?: string
          referral_code?: string
          referred_user_id?: string | null
          referrer_user_id?: string
          rewarded_at?: string | null
          signed_up_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
      research_history: {
        Row: {
          country: string
          created_at: string | null
          id: string
          model: string
          niche: string
          topics: Json | null
          user_id: string
        }
        Insert: {
          country: string
          created_at?: string | null
          id?: string
          model: string
          niche: string
          topics?: Json | null
          user_id: string
        }
        Update: {
          country?: string
          created_at?: string | null
          id?: string
          model?: string
          niche?: string
          topics?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      tracked_blogs: {
        Row: {
          added_at: string | null
          blog_id: string | null
          created_at: string | null
          focus_keyword: string | null
          id: string
          notes: string | null
          published_at: string | null
          secondary_keywords: string[] | null
          slug: string | null
          source_type: string | null
          status: string | null
          title: string
          url: string
          user_id: string
        }
        Insert: {
          added_at?: string | null
          blog_id?: string | null
          created_at?: string | null
          focus_keyword?: string | null
          id: string
          notes?: string | null
          published_at?: string | null
          secondary_keywords?: string[] | null
          slug?: string | null
          source_type?: string | null
          status?: string | null
          title: string
          url: string
          user_id: string
        }
        Update: {
          added_at?: string | null
          blog_id?: string | null
          created_at?: string | null
          focus_keyword?: string | null
          id?: string
          notes?: string | null
          published_at?: string | null
          secondary_keywords?: string[] | null
          slug?: string | null
          source_type?: string | null
          status?: string | null
          title?: string
          url?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tracked_blogs_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_recordings: {
        Row: {
          audio_duration_seconds: number | null
          audio_language: string | null
          audio_storage_expires_at: string | null
          audio_storage_path: string | null
          blog_id: string | null
          created_at: string
          detected_keywords: string[] | null
          detected_topics: string[] | null
          file_size_bytes: number | null
          generation_status: string | null
          id: string
          original_filename: string | null
          source_type: string
          speaker_name: string | null
          transcript_cleaned: string | null
          transcript_raw: string | null
          transcript_structured: string | null
          transcription_error: string | null
          transcription_status: string
          updated_at: string
          user_id: string
          whisper_segments: Json | null
          word_count_transcript: number | null
          workspace_id: string | null
          youtube_url: string | null
        }
        Insert: {
          audio_duration_seconds?: number | null
          audio_language?: string | null
          audio_storage_expires_at?: string | null
          audio_storage_path?: string | null
          blog_id?: string | null
          created_at?: string
          detected_keywords?: string[] | null
          detected_topics?: string[] | null
          file_size_bytes?: number | null
          generation_status?: string | null
          id?: string
          original_filename?: string | null
          source_type: string
          speaker_name?: string | null
          transcript_cleaned?: string | null
          transcript_raw?: string | null
          transcript_structured?: string | null
          transcription_error?: string | null
          transcription_status?: string
          updated_at?: string
          user_id: string
          whisper_segments?: Json | null
          word_count_transcript?: number | null
          workspace_id?: string | null
          youtube_url?: string | null
        }
        Update: {
          audio_duration_seconds?: number | null
          audio_language?: string | null
          audio_storage_expires_at?: string | null
          audio_storage_path?: string | null
          blog_id?: string | null
          created_at?: string
          detected_keywords?: string[] | null
          detected_topics?: string[] | null
          file_size_bytes?: number | null
          generation_status?: string | null
          id?: string
          original_filename?: string | null
          source_type?: string
          speaker_name?: string | null
          transcript_cleaned?: string | null
          transcript_raw?: string | null
          transcript_structured?: string | null
          transcription_error?: string | null
          transcription_status?: string
          updated_at?: string
          user_id?: string
          whisper_segments?: Json | null
          word_count_transcript?: number | null
          workspace_id?: string | null
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "voice_recordings_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "voice_recordings_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      wl_domain_verifications: {
        Row: {
          created_at: string
          domain: string
          id: string
          last_check_at: string | null
          tenant_id: string
          verification_attempts: number | null
          verification_token: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          domain: string
          id?: string
          last_check_at?: string | null
          tenant_id: string
          verification_attempts?: number | null
          verification_token: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          domain?: string
          id?: string
          last_check_at?: string | null
          tenant_id?: string
          verification_attempts?: number | null
          verification_token?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wl_domain_verifications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "wl_tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      wl_revenue_transactions: {
        Row: {
          created_at: string
          credit_transaction_id: string | null
          gross_amount_inr: number
          id: string
          payout_date: string | null
          payout_reference: string | null
          payout_status: string
          platform_share_inr: number
          revenue_share_percent: number
          tenant_id: string
          tenant_share_inr: number
        }
        Insert: {
          created_at?: string
          credit_transaction_id?: string | null
          gross_amount_inr: number
          id?: string
          payout_date?: string | null
          payout_reference?: string | null
          payout_status?: string
          platform_share_inr: number
          revenue_share_percent: number
          tenant_id: string
          tenant_share_inr: number
        }
        Update: {
          created_at?: string
          credit_transaction_id?: string | null
          gross_amount_inr?: number
          id?: string
          payout_date?: string | null
          payout_reference?: string | null
          payout_status?: string
          platform_share_inr?: number
          revenue_share_percent?: number
          tenant_id?: string
          tenant_share_inr?: number
        }
        Relationships: [
          {
            foreignKeyName: "wl_revenue_transactions_credit_transaction_id_fkey"
            columns: ["credit_transaction_id"]
            isOneToOne: false
            referencedRelation: "credit_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wl_revenue_transactions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "wl_tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      wl_tenant_users: {
        Row: {
          id: string
          joined_at: string
          last_active_at: string | null
          role: string
          status: string
          tenant_id: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string
          last_active_at?: string | null
          role?: string
          status?: string
          tenant_id: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string
          last_active_at?: string | null
          role?: string
          status?: string
          tenant_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wl_tenant_users_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "wl_tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      wl_tenants: {
        Row: {
          allow_email_signup: boolean | null
          allow_google_oauth: boolean | null
          brand_background_color: string | null
          brand_favicon_url: string | null
          brand_font_body: string | null
          brand_font_heading: string | null
          brand_logo_url: string | null
          brand_primary_color: string | null
          brand_secondary_color: string | null
          brand_tagline: string | null
          brand_text_color: string | null
          clarity_project_id: string | null
          created_at: string
          credit_markup_percent: number | null
          credit_pack_prices: Json | null
          custom_domain: string | null
          custom_domain_verification_token: string | null
          custom_domain_verified: boolean | null
          custom_email_from_address: string | null
          custom_email_from_name: string | null
          features_enabled: Json
          ga4_measurement_id: string | null
          help_url: string | null
          id: string
          last_active_at: string | null
          licence_plan: string
          licence_renews_at: string | null
          licence_starts_at: string | null
          licence_status: string
          max_blogs_per_user_per_day: number | null
          max_users: number | null
          max_workspaces: number | null
          monthly_licence_fee_inr: number | null
          name: string
          owner_email: string
          owner_user_id: string
          privacy_policy_url: string | null
          require_email_verification: boolean | null
          revenue_share_percent: number | null
          slug: string
          ssl_provisioned: boolean | null
          subdomain: string | null
          support_email: string | null
          tenant_claude_key_encrypted: string | null
          tenant_gemini_key_encrypted: string | null
          tenant_grok_key_encrypted: string | null
          tenant_openai_key_encrypted: string | null
          tenant_whisper_key_encrypted: string | null
          terms_url: string | null
          trial_ends_at: string | null
          updated_at: string
        }
        Insert: {
          allow_email_signup?: boolean | null
          allow_google_oauth?: boolean | null
          brand_background_color?: string | null
          brand_favicon_url?: string | null
          brand_font_body?: string | null
          brand_font_heading?: string | null
          brand_logo_url?: string | null
          brand_primary_color?: string | null
          brand_secondary_color?: string | null
          brand_tagline?: string | null
          brand_text_color?: string | null
          clarity_project_id?: string | null
          created_at?: string
          credit_markup_percent?: number | null
          credit_pack_prices?: Json | null
          custom_domain?: string | null
          custom_domain_verification_token?: string | null
          custom_domain_verified?: boolean | null
          custom_email_from_address?: string | null
          custom_email_from_name?: string | null
          features_enabled?: Json
          ga4_measurement_id?: string | null
          help_url?: string | null
          id?: string
          last_active_at?: string | null
          licence_plan?: string
          licence_renews_at?: string | null
          licence_starts_at?: string | null
          licence_status?: string
          max_blogs_per_user_per_day?: number | null
          max_users?: number | null
          max_workspaces?: number | null
          monthly_licence_fee_inr?: number | null
          name: string
          owner_email: string
          owner_user_id: string
          privacy_policy_url?: string | null
          require_email_verification?: boolean | null
          revenue_share_percent?: number | null
          slug: string
          ssl_provisioned?: boolean | null
          subdomain?: string | null
          support_email?: string | null
          tenant_claude_key_encrypted?: string | null
          tenant_gemini_key_encrypted?: string | null
          tenant_grok_key_encrypted?: string | null
          tenant_openai_key_encrypted?: string | null
          tenant_whisper_key_encrypted?: string | null
          terms_url?: string | null
          trial_ends_at?: string | null
          updated_at?: string
        }
        Update: {
          allow_email_signup?: boolean | null
          allow_google_oauth?: boolean | null
          brand_background_color?: string | null
          brand_favicon_url?: string | null
          brand_font_body?: string | null
          brand_font_heading?: string | null
          brand_logo_url?: string | null
          brand_primary_color?: string | null
          brand_secondary_color?: string | null
          brand_tagline?: string | null
          brand_text_color?: string | null
          clarity_project_id?: string | null
          created_at?: string
          credit_markup_percent?: number | null
          credit_pack_prices?: Json | null
          custom_domain?: string | null
          custom_domain_verification_token?: string | null
          custom_domain_verified?: boolean | null
          custom_email_from_address?: string | null
          custom_email_from_name?: string | null
          features_enabled?: Json
          ga4_measurement_id?: string | null
          help_url?: string | null
          id?: string
          last_active_at?: string | null
          licence_plan?: string
          licence_renews_at?: string | null
          licence_starts_at?: string | null
          licence_status?: string
          max_blogs_per_user_per_day?: number | null
          max_users?: number | null
          max_workspaces?: number | null
          monthly_licence_fee_inr?: number | null
          name?: string
          owner_email?: string
          owner_user_id?: string
          privacy_policy_url?: string | null
          require_email_verification?: boolean | null
          revenue_share_percent?: number | null
          slug?: string
          ssl_provisioned?: boolean | null
          subdomain?: string | null
          support_email?: string | null
          tenant_claude_key_encrypted?: string | null
          tenant_gemini_key_encrypted?: string | null
          tenant_grok_key_encrypted?: string | null
          tenant_openai_key_encrypted?: string | null
          tenant_whisper_key_encrypted?: string | null
          terms_url?: string | null
          trial_ends_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      wordpress_connections: {
        Row: {
          app_password: string
          authors: Json | null
          categories: Json | null
          connected_at: string | null
          created_at: string | null
          default_category_id: number | null
          default_status: string | null
          id: string
          is_default: boolean | null
          label: string
          last_tested_at: string | null
          site_title: string | null
          site_url: string
          user_id: string
          username: string
          wordpress_version: string | null
        }
        Insert: {
          app_password: string
          authors?: Json | null
          categories?: Json | null
          connected_at?: string | null
          created_at?: string | null
          default_category_id?: number | null
          default_status?: string | null
          id?: string
          is_default?: boolean | null
          label: string
          last_tested_at?: string | null
          site_title?: string | null
          site_url: string
          user_id: string
          username: string
          wordpress_version?: string | null
        }
        Update: {
          app_password?: string
          authors?: Json | null
          categories?: Json | null
          connected_at?: string | null
          created_at?: string | null
          default_category_id?: number | null
          default_status?: string | null
          id?: string
          is_default?: boolean | null
          label?: string
          last_tested_at?: string | null
          site_title?: string | null
          site_url?: string
          user_id?: string
          username?: string
          wordpress_version?: string | null
        }
        Relationships: []
      }
      workspace_activity: {
        Row: {
          actor_id: string | null
          created_at: string
          id: string
          metadata: Json | null
          type: string
          workspace_id: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          type: string
          workspace_id: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          type?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_activity_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_members: {
        Row: {
          id: string
          invitation_expires_at: string | null
          invitation_token: string | null
          invited_by: string | null
          invited_email: string | null
          joined_at: string
          role: string
          status: string
          updated_at: string | null
          user_id: string | null
          workspace_id: string
        }
        Insert: {
          id?: string
          invitation_expires_at?: string | null
          invitation_token?: string | null
          invited_by?: string | null
          invited_email?: string | null
          joined_at?: string
          role: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
          workspace_id: string
        }
        Update: {
          id?: string
          invitation_expires_at?: string | null
          invitation_token?: string | null
          invited_by?: string | null
          invited_email?: string | null
          joined_at?: string
          role?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          brand_address: string | null
          brand_facebook_handle: string | null
          brand_instagram_handle: string | null
          brand_logo_url: string | null
          brand_phone: string | null
          brand_user_image_url: string | null
          brand_website_url: string | null
          brand_x_handle: string | null
          brand_youtube_handle: string | null
          created_at: string
          credits_balance: number | null
          default_country: string | null
          default_output_format: string | null
          default_tone: string | null
          default_word_count: number | null
          description: string | null
          id: string
          max_members: number | null
          name: string
          owner_id: string
          plan: string | null
          slug: string
          tenant_id: string | null
          updated_at: string
        }
        Insert: {
          brand_address?: string | null
          brand_facebook_handle?: string | null
          brand_instagram_handle?: string | null
          brand_logo_url?: string | null
          brand_phone?: string | null
          brand_user_image_url?: string | null
          brand_website_url?: string | null
          brand_x_handle?: string | null
          brand_youtube_handle?: string | null
          created_at?: string
          credits_balance?: number | null
          default_country?: string | null
          default_output_format?: string | null
          default_tone?: string | null
          default_word_count?: number | null
          description?: string | null
          id?: string
          max_members?: number | null
          name: string
          owner_id: string
          plan?: string | null
          slug: string
          tenant_id?: string | null
          updated_at?: string
        }
        Update: {
          brand_address?: string | null
          brand_facebook_handle?: string | null
          brand_instagram_handle?: string | null
          brand_logo_url?: string | null
          brand_phone?: string | null
          brand_user_image_url?: string | null
          brand_website_url?: string | null
          brand_x_handle?: string | null
          brand_youtube_handle?: string | null
          created_at?: string
          credits_balance?: number | null
          default_country?: string | null
          default_output_format?: string | null
          default_tone?: string | null
          default_word_count?: number | null
          description?: string | null
          id?: string
          max_members?: number | null
          name?: string
          owner_id?: string
          plan?: string | null
          slug?: string
          tenant_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "wl_tenants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_credits: {
        Args: {
          credit_amount: number
          pack: string
          rzp_order_id: string
          user_id: string
        }
        Returns: boolean
      }
      apply_credit_grant:
        | {
            Args: {
              p_credits: number
              p_expires_days?: number
              p_granted_by?: string
              p_granted_by_user_id?: string
              p_note?: string
              p_reason: string
              p_rule_id?: string
              p_user_id: string
            }
            Returns: string
          }
        | {
            Args: {
              p_credits: number
              p_expires_at: string
              p_granted_by: string
              p_granted_by_user_id: string
              p_note: string
              p_reason: string
              p_rule_id: string
              p_user_id: string
            }
            Returns: string
          }
      check_is_workspace_member: { Args: { ws_id: string }; Returns: boolean }
      check_is_workspace_role: {
        Args: { required_roles: string[]; ws_id: string }
        Returns: boolean
      }
      deduct_credit: { Args: { user_id: string }; Returns: boolean }
      deduct_workspace_credit: {
        Args: {
          p_blog_topic: string
          p_user_id: string
          p_workspace_id: string
        }
        Returns: Json
      }
      evaluate_credit_rules: {
        Args: { p_metadata?: Json; p_trigger_event: string; p_user_id: string }
        Returns: undefined
      }
      expire_free_credits: { Args: never; Returns: number }
      generate_ticket_id: { Args: never; Returns: string }
      get_calendar_month_stats: {
        Args: {
          p_month: number
          p_user_id: string
          p_workspace_id?: string
          p_year: number
        }
        Returns: Json
      }
      get_link_graph: {
        Args: { p_user_id: string; p_workspace_id?: string }
        Returns: {
          anchor_texts: string[]
          link_count: number
          source_id: string
          source_slug: string
          source_title: string
          target_id: string
          target_slug: string
          target_title: string
        }[]
      }
      get_orphan_blogs: {
        Args: { p_user_id: string; p_workspace_id?: string }
        Returns: {
          blog_id: string
          created_at: string
          focus_keyword: string
          inbound_links: number
          outbound_links: number
          title: string
        }[]
      }
      get_tenant_by_hostname: {
        Args: { p_hostname: string }
        Returns: {
          brand_background_color: string
          brand_favicon_url: string
          brand_font_body: string
          brand_font_heading: string
          brand_logo_url: string
          brand_primary_color: string
          brand_secondary_color: string
          brand_tagline: string
          brand_text_color: string
          custom_domain: string
          features_enabled: Json
          licence_status: string
          name: string
          slug: string
          subdomain: string
          tenant_id: string
        }[]
      }
      get_tenant_llm_key: {
        Args: { p_provider: string; p_tenant_id: string }
        Returns: string
      }
      get_user_admin_stats: { Args: { p_user_id: string }; Returns: Json }
      increment_referral_credits: {
        Args: { p_amount: number; p_user_id: string }
        Returns: undefined
      }
      increment_total_referrals: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      mark_missed_entries: { Args: { p_user_id: string }; Returns: number }
      update_blog_link_index: {
        Args: {
          p_blog_id: string
          p_internal_links_count: number
          p_link_index: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
