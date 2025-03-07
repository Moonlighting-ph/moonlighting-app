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
      job_applications: {
        Row: {
          ai_match_score: number | null
          applied_date: string | null
          id: string
          job_id: string | null
          moonlighter_id: string | null
          notes: string | null
          profile_info: Json | null
          status: string
        }
        Insert: {
          ai_match_score?: number | null
          applied_date?: string | null
          id?: string
          job_id?: string | null
          moonlighter_id?: string | null
          notes?: string | null
          profile_info?: Json | null
          status?: string
        }
        Update: {
          ai_match_score?: number | null
          applied_date?: string | null
          id?: string
          job_id?: string | null
          moonlighter_id?: string | null
          notes?: string | null
          profile_info?: Json | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          company: string
          deadline: string | null
          description: string
          experience_level: string | null
          id: string
          is_urgent: boolean | null
          location: string | null
          posted_date: string | null
          provider_id: string | null
          requirements: Json | null
          responsibilities: Json | null
          salary: string | null
          specialization: string | null
          title: string
          type: string
        }
        Insert: {
          company: string
          deadline?: string | null
          description: string
          experience_level?: string | null
          id?: string
          is_urgent?: boolean | null
          location?: string | null
          posted_date?: string | null
          provider_id?: string | null
          requirements?: Json | null
          responsibilities?: Json | null
          salary?: string | null
          specialization?: string | null
          title: string
          type: string
        }
        Update: {
          company?: string
          deadline?: string | null
          description?: string
          experience_level?: string | null
          id?: string
          is_urgent?: boolean | null
          location?: string | null
          posted_date?: string | null
          provider_id?: string | null
          requirements?: Json | null
          responsibilities?: Json | null
          salary?: string | null
          specialization?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      manual_payments: {
        Row: {
          amount: number
          application_id: string | null
          created_at: string | null
          id: string
          job_id: string | null
          moonlighter_id: string | null
          notes: string | null
          payment_details: string
          payment_method_id: string | null
          payment_method_type: string
          provider_id: string | null
          reference_number: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          application_id?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          moonlighter_id?: string | null
          notes?: string | null
          payment_details: string
          payment_method_id?: string | null
          payment_method_type: string
          provider_id?: string | null
          reference_number?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          application_id?: string | null
          created_at?: string | null
          id?: string
          job_id?: string | null
          moonlighter_id?: string | null
          notes?: string | null
          payment_details?: string
          payment_method_id?: string | null
          payment_method_type?: string
          provider_id?: string | null
          reference_number?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "manual_payments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manual_payments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manual_payments_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          created_at: string | null
          details: string
          id: string
          is_default: boolean | null
          method: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          details: string
          id?: string
          is_default?: boolean | null
          method: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          details?: string
          id?: string
          is_default?: boolean | null
          method?: string
          user_id?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          application_id: string | null
          created_at: string | null
          currency: string
          id: string
          moonlighter_id: string | null
          provider_id: string | null
          status: string
          stripe_payment_intent_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          application_id?: string | null
          created_at?: string | null
          currency?: string
          id?: string
          moonlighter_id?: string | null
          provider_id?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          application_id?: string | null
          created_at?: string | null
          currency?: string
          id?: string
          moonlighter_id?: string | null
          provider_id?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      prc_licenses: {
        Row: {
          created_at: string
          id: string
          license_number: string
          profession: string
          status: string
          updated_at: string
          user_id: string
          verification_date: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          license_number: string
          profession: string
          status?: string
          updated_at?: string
          user_id: string
          verification_date?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          license_number?: string
          profession?: string
          status?: string
          updated_at?: string
          user_id?: string
          verification_date?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          bio: string | null
          city: string | null
          created_at: string
          email: string
          emergency_contact: string | null
          emergency_phone: string | null
          first_name: string
          id: string
          last_name: string
          phone: string | null
          postal_code: string | null
          region: string | null
          specialization: string | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
          years_of_experience: number | null
        }
        Insert: {
          address?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          email: string
          emergency_contact?: string | null
          emergency_phone?: string | null
          first_name: string
          id: string
          last_name: string
          phone?: string | null
          postal_code?: string | null
          region?: string | null
          specialization?: string | null
          updated_at?: string
          user_type: Database["public"]["Enums"]["user_type"]
          years_of_experience?: number | null
        }
        Update: {
          address?: string | null
          bio?: string | null
          city?: string | null
          created_at?: string
          email?: string
          emergency_contact?: string | null
          emergency_phone?: string | null
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          postal_code?: string | null
          region?: string | null
          specialization?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
          years_of_experience?: number | null
        }
        Relationships: []
      }
      registrations: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          profession: string | null
          type: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          profession?: string | null
          type: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          profession?: string | null
          type?: string
        }
        Relationships: []
      }
      verification_appeals: {
        Row: {
          appeal_reason: string
          created_at: string
          id: string
          license_id: string
          reviewed_by: string | null
          reviewer_notes: string | null
          status: string
          supporting_documents: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          appeal_reason: string
          created_at?: string
          id?: string
          license_id: string
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: string
          supporting_documents?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          appeal_reason?: string
          created_at?: string
          id?: string
          license_id?: string
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: string
          supporting_documents?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_appeals_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "prc_licenses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_profile_auth_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      user_type: "provider" | "moonlighter" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
