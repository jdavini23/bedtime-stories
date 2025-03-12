export interface User {
  id: string;
  auth_id: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Story {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Preference {
  id: string;
  preferences: {
    childName?: string;
    childAge?: number;
    theme?: string;
    characters?: string[];
    setting?: string;
    length?: 'short' | 'medium' | 'long';
    [key: string]: any;
  };
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Subscription {
  id: string;
  plan: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export type Tables = {
  users: User;
  stories: Story;
  preferences: Preference;
  subscriptions: Subscription;
};

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      stories: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          user_id: string;
          preferences: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          preferences: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
