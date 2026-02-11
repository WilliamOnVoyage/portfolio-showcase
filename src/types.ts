export interface Project {
  id: string; // usually repo name or full_name
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  is_private: boolean;
  topics: string[];

  // Custom fields from overrides
  techStack?: string[];
  category?: string;
  featured?: boolean;
  mockup?: string | null;
  longDescription?: string | null;
  hidden?: boolean;

  // Contract fields
  tagline?: string | null;
  demoUrl?: string | null;
  liveUrl?: string | null;
  thumbnail?: string | null;
  publicDescription?: string | null;
}

export interface ProjectOverride {
  description?: string;
  techStack?: string[];
  category?: string;
  featured?: boolean;
  mockup?: string | null;
  longDescription?: string | null;
  hidden?: boolean;
}
