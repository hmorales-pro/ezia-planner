export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_tier: 'free' | 'pro' | 'team'
          ai_requests_count: number
          ai_requests_limit: number
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'pro' | 'team'
          ai_requests_count?: number
          ai_requests_limit?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: 'free' | 'pro' | 'team'
          ai_requests_count?: number
          ai_requests_limit?: number
        }
      }
      events: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          title: string
          description: string | null
          start_time: string
          end_time: string
          location: string | null
          google_calendar_id: string | null
          contact_id: string | null
          tags: string[]
          status: 'scheduled' | 'completed' | 'cancelled'
          ai_summary: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          title: string
          description?: string | null
          start_time: string
          end_time: string
          location?: string | null
          google_calendar_id?: string | null
          contact_id?: string | null
          tags?: string[]
          status?: 'scheduled' | 'completed' | 'cancelled'
          ai_summary?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          location?: string | null
          google_calendar_id?: string | null
          contact_id?: string | null
          tags?: string[]
          status?: 'scheduled' | 'completed' | 'cancelled'
          ai_summary?: string | null
        }
      }
      contacts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          name: string
          email: string | null
          phone: string | null
          company: string | null
          notes: string | null
          tags: string[]
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          name: string
          email?: string | null
          phone?: string | null
          company?: string | null
          notes?: string | null
          tags?: string[]
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          name?: string
          email?: string | null
          phone?: string | null
          company?: string | null
          notes?: string | null
          tags?: string[]
        }
      }
      emails: {
        Row: {
          id: string
          created_at: string
          user_id: string
          gmail_id: string
          thread_id: string
          subject: string
          from: string
          to: string[]
          cc: string[]
          body: string
          received_at: string
          is_read: boolean
          needs_reply: boolean
          needs_followup: boolean
          contact_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          gmail_id: string
          thread_id: string
          subject: string
          from: string
          to: string[]
          cc?: string[]
          body: string
          received_at: string
          is_read?: boolean
          needs_reply?: boolean
          needs_followup?: boolean
          contact_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          gmail_id?: string
          thread_id?: string
          subject?: string
          from?: string
          to?: string[]
          cc?: string[]
          body?: string
          received_at?: string
          is_read?: boolean
          needs_reply?: boolean
          needs_followup?: boolean
          contact_id?: string | null
        }
      }
      tasks: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          title: string
          description: string | null
          due_date: string | null
          completed: boolean
          event_id: string | null
          contact_id: string | null
          priority: 'low' | 'medium' | 'high'
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          title: string
          description?: string | null
          due_date?: string | null
          completed?: boolean
          event_id?: string | null
          contact_id?: string | null
          priority?: 'low' | 'medium' | 'high'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          title?: string
          description?: string | null
          due_date?: string | null
          completed?: boolean
          event_id?: string | null
          contact_id?: string | null
          priority?: 'low' | 'medium' | 'high'
        }
      }
      integrations: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          type: 'google_calendar' | 'gmail' | 'outlook'
          access_token: string
          refresh_token: string
          expires_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          type: 'google_calendar' | 'gmail' | 'outlook'
          access_token: string
          refresh_token: string
          expires_at: string
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          type?: 'google_calendar' | 'gmail' | 'outlook'
          access_token?: string
          refresh_token?: string
          expires_at?: string
          is_active?: boolean
        }
      }
    }
  }
}
