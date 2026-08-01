// ─── Supabase row types ────────────────────────────────────────────────────

export interface UrlType {
  id: string;
  user_id: string;
  title: string;
  original_url: string;
  short_url: string;
  custom_url: string | null;
  qr: string;
  created_at: string;
}

export interface ClickType {
  id: string;
  url_id: string;
  device: string;
  country: string | null;
  city: string | null;
  created_at: string;
}
