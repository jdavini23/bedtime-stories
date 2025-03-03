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
