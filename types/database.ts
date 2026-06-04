// Este archivo se sobreescribe con:
//   npm run supabase:types
// Una vez que el proyecto de Supabase esté creado y las migraciones ejecutadas.
//
// Hasta entonces, este placeholder permite que el código TypeScript compile.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id:           string;
          email:        string;
          display_name: string | null;
          timezone:     string;
          units:        "metric" | "imperial";
          created_at:   string;
          updated_at:   string;
        };
        Insert: {
          id:            string;
          email:         string;
          display_name?: string | null;
          timezone?:     string;
          units?:        "metric" | "imperial";
        };
        Update: {
          display_name?: string | null;
          timezone?:     string;
          units?:        "metric" | "imperial";
          updated_at?:   string;
        };
      };
      health_metrics: {
        Row: {
          id:          string;
          user_id:     string;
          metric_type: string;
          value:       number;
          unit:        string;
          source:      string;
          metadata:    Json | null;
          recorded_at: string;
          synced_at:   string;
          created_at:  string;
        };
        Insert: {
          id?:         string;
          user_id:     string;
          metric_type: string;
          value:       number;
          unit:        string;
          source:      string;
          metadata?:   Json | null;
          recorded_at: string;
          synced_at?:  string;
        };
        Update: {
          metadata?: Json | null;
        };
      };
      sync_checkpoints: {
        Row: {
          id:             string;
          user_id:        string;
          metric_type:    string;
          last_synced_at: string | null;
          status:         string;
          records_synced: number;
          created_at:     string;
          updated_at:     string;
        };
        Insert: {
          id?:             string;
          user_id:         string;
          metric_type:     string;
          last_synced_at?: string | null;
          status?:         string;
          records_synced?: number;
        };
        Update: {
          last_synced_at?: string | null;
          status?:         string;
          records_synced?: number;
          updated_at?:     string;
        };
      };
    };
    Views:     Record<string, never>;
    Functions: Record<string, never>;
    Enums:     Record<string, never>;
  };
}
