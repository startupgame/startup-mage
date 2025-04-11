export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      funding_types: {
        Row: {
          created_at: string | null
          description: string | null
          format: string
          id: string
          type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          format: string
          id?: string
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          format?: string
          id?: string
          type?: string
        }
        Relationships: []
      }
      startup_cards: {
        Row: {
          competitors: string | null
          created_at: string | null
          customer_quote: string | null
          financials: string | null
          funding_ask: number
          funding_format: string | null
          funding_type: string | null
          hook: string | null
          id: string
          market_size: string | null
          name: string
          problem: string | null
          roi_potential: number
          solution: string | null
          team: string | null
          traction: string | null
          use_of_funds: string | null
        }
        Insert: {
          competitors?: string | null
          created_at?: string | null
          customer_quote?: string | null
          financials?: string | null
          funding_ask: number
          funding_format?: string | null
          funding_type?: string | null
          hook?: string | null
          id?: string
          market_size?: string | null
          name: string
          problem?: string | null
          roi_potential: number
          solution?: string | null
          team?: string | null
          traction?: string | null
          use_of_funds?: string | null
        }
        Update: {
          competitors?: string | null
          created_at?: string | null
          customer_quote?: string | null
          financials?: string | null
          funding_ask?: number
          funding_format?: string | null
          funding_type?: string | null
          hook?: string | null
          id?: string
          market_size?: string | null
          name?: string
          problem?: string | null
          roi_potential?: number
          solution?: string | null
          team?: string | null
          traction?: string | null
          use_of_funds?: string | null
        }
        Relationships: []
      }
      startup_pitches: {
        Row: {
          business_model: string | null
          competitive_advantage: string | null
          created_at: string | null
          exit_strategy: string | null
          growth_strategy: string | null
          id: string
          pitch_deck_url: string | null
          pitch_summary: string | null
          pitch_title: string
          risk_factors: string | null
          startup_id: string
          target_audience: string | null
          video_url: string | null
        }
        Insert: {
          business_model?: string | null
          competitive_advantage?: string | null
          created_at?: string | null
          exit_strategy?: string | null
          growth_strategy?: string | null
          id?: string
          pitch_deck_url?: string | null
          pitch_summary?: string | null
          pitch_title: string
          risk_factors?: string | null
          startup_id: string
          target_audience?: string | null
          video_url?: string | null
        }
        Update: {
          business_model?: string | null
          competitive_advantage?: string | null
          created_at?: string | null
          exit_strategy?: string | null
          growth_strategy?: string | null
          id?: string
          pitch_deck_url?: string | null
          pitch_summary?: string | null
          pitch_title?: string
          risk_factors?: string | null
          startup_id?: string
          target_audience?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "startup_pitches_startup_id_fkey"
            columns: ["startup_id"]
            isOneToOne: false
            referencedRelation: "startup_cards"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
