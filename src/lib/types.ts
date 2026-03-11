export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  draft: boolean;
  cover_image: string | null;
  pub_date: string;
  created_at: string;
  updated_at: string;
}

// Fila cruda de SQLite antes de normalizar
export interface BlogPostRow {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string;       // JSON array string: '["tag1","tag2"]'
  draft: number;      // 0 o 1
  cover_image: string | null;
  pub_date: string;
  created_at: string;
  updated_at: string;
}
