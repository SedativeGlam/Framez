export interface User {
  id: string;
  email: string;
  display_name: string;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  content: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}
