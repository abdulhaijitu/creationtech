export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      attendance: {
        Row: {
          check_in: string | null
          check_out: string | null
          created_at: string
          date: string
          employee_id: string
          id: string
          notes: string | null
          status: string
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          date: string
          employee_id: string
          id?: string
          notes?: string | null
          status?: string
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          date?: string
          employee_id?: string
          id?: string
          notes?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_categories: {
        Row: {
          created_at: string
          id: string
          name_bn: string | null
          name_en: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name_bn?: string | null
          name_en: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name_bn?: string | null
          name_en?: string
          slug?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          author_name: string | null
          category_id: string | null
          content_bn: string | null
          content_en: string | null
          created_at: string
          excerpt_bn: string | null
          excerpt_en: string | null
          featured_image_url: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string
          status: string | null
          tags: string[] | null
          title_bn: string | null
          title_en: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          category_id?: string | null
          content_bn?: string | null
          content_en?: string | null
          created_at?: string
          excerpt_bn?: string | null
          excerpt_en?: string | null
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title_bn?: string | null
          title_en: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          category_id?: string | null
          content_bn?: string | null
          content_en?: string | null
          created_at?: string
          excerpt_bn?: string | null
          excerpt_en?: string | null
          featured_image_url?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title_bn?: string | null
          title_en?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      business_info: {
        Row: {
          created_at: string
          id: string
          key: string
          metadata: Json | null
          updated_at: string
          value_bn: string | null
          value_en: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          metadata?: Json | null
          updated_at?: string
          value_bn?: string | null
          value_en?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          metadata?: Json | null
          updated_at?: string
          value_bn?: string | null
          value_en?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          company: string | null
          created_at: string
          created_by: string | null
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          company?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          company?: string | null
          created_at?: string
          created_by?: string | null
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          message: string
          notes: string | null
          phone: string | null
          status: string | null
          subject: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          message: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          message?: string
          notes?: string | null
          phone?: string | null
          status?: string | null
          subject?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          address: string | null
          avatar_url: string | null
          created_at: string
          department_id: string | null
          designation: string | null
          documents: Json | null
          email: string | null
          emergency_contact: string | null
          employee_id: string
          full_name: string
          id: string
          join_date: string | null
          notes: string | null
          phone: string | null
          salary: number | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          department_id?: string | null
          designation?: string | null
          documents?: Json | null
          email?: string | null
          emergency_contact?: string | null
          employee_id: string
          full_name: string
          id?: string
          join_date?: string | null
          notes?: string | null
          phone?: string | null
          salary?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          department_id?: string | null
          designation?: string | null
          documents?: Json | null
          email?: string | null
          emergency_contact?: string | null
          employee_id?: string
          full_name?: string
          id?: string
          join_date?: string | null
          notes?: string | null
          phone?: string | null
          salary?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          amount: number
          created_at: string
          description: string
          display_order: number | null
          id: string
          invoice_id: string
          quantity: number
          unit_price: number
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          display_order?: number | null
          id?: string
          invoice_id: string
          quantity?: number
          unit_price: number
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          display_order?: number | null
          id?: string
          invoice_id?: string
          quantity?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          client_address: string | null
          client_email: string | null
          client_id: string | null
          client_name: string
          client_phone: string | null
          created_at: string
          created_by: string | null
          discount_amount: number | null
          due_date: string | null
          id: string
          invoice_number: string
          issue_date: string
          notes: string | null
          paid_amount: number | null
          paid_at: string | null
          status: string
          subtotal: number
          tax_amount: number | null
          tax_rate: number | null
          terms: string | null
          total: number
          updated_at: string
        }
        Insert: {
          client_address?: string | null
          client_email?: string | null
          client_id?: string | null
          client_name: string
          client_phone?: string | null
          created_at?: string
          created_by?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_number: string
          issue_date?: string
          notes?: string | null
          paid_amount?: number | null
          paid_at?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          terms?: string | null
          total?: number
          updated_at?: string
        }
        Update: {
          client_address?: string | null
          client_email?: string | null
          client_id?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string
          created_by?: string | null
          discount_amount?: number | null
          due_date?: string | null
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string | null
          paid_amount?: number | null
          paid_at?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          terms?: string | null
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          cover_letter: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          job_id: string | null
          phone: string | null
          position: string
          resume_url: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          job_id?: string | null
          phone?: string | null
          position: string
          resume_url?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          cover_letter?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          job_id?: string | null
          phone?: string | null
          position?: string
          resume_url?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_listings: {
        Row: {
          created_at: string
          department: string | null
          description_bn: string | null
          description_en: string | null
          id: string
          is_active: boolean | null
          job_type: string | null
          location: string | null
          requirements: string[] | null
          title_bn: string | null
          title_en: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          description_bn?: string | null
          description_en?: string | null
          id?: string
          is_active?: boolean | null
          job_type?: string | null
          location?: string | null
          requirements?: string[] | null
          title_bn?: string | null
          title_en: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          description_bn?: string | null
          description_en?: string | null
          id?: string
          is_active?: boolean | null
          job_type?: string | null
          location?: string | null
          requirements?: string[] | null
          title_bn?: string | null
          title_en?: string
          updated_at?: string
        }
        Relationships: []
      }
      meeting_requests: {
        Row: {
          additional_notes: string | null
          company: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          meeting_topic: string
          notes: string | null
          phone: string
          preferred_date: string | null
          preferred_time: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          additional_notes?: string | null
          company?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          meeting_topic: string
          notes?: string | null
          phone: string
          preferred_date?: string | null
          preferred_time?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          additional_notes?: string | null
          company?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          meeting_topic?: string
          notes?: string | null
          phone?: string
          preferred_date?: string | null
          preferred_time?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      page_content: {
        Row: {
          content_bn: string | null
          content_en: string | null
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean | null
          meta_description_bn: string | null
          meta_description_en: string | null
          meta_title_bn: string | null
          meta_title_en: string | null
          page_slug: string
          section_key: string
          title_bn: string | null
          title_en: string | null
          updated_at: string
        }
        Insert: {
          content_bn?: string | null
          content_en?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          meta_description_bn?: string | null
          meta_description_en?: string | null
          meta_title_bn?: string | null
          meta_title_en?: string | null
          page_slug: string
          section_key: string
          title_bn?: string | null
          title_en?: string | null
          updated_at?: string
        }
        Update: {
          content_bn?: string | null
          content_en?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          meta_description_bn?: string | null
          meta_description_en?: string | null
          meta_title_bn?: string | null
          meta_title_en?: string | null
          page_slug?: string
          section_key?: string
          title_bn?: string | null
          title_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      portfolio_projects: {
        Row: {
          category: string | null
          client_bn: string | null
          client_en: string | null
          created_at: string
          description_bn: string | null
          description_en: string | null
          display_order: number | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          result_bn: string | null
          result_en: string | null
          slug: string
          tags: string[] | null
          title_bn: string | null
          title_en: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          client_bn?: string | null
          client_en?: string | null
          created_at?: string
          description_bn?: string | null
          description_en?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          result_bn?: string | null
          result_en?: string | null
          slug: string
          tags?: string[] | null
          title_bn?: string | null
          title_en: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          client_bn?: string | null
          client_en?: string | null
          created_at?: string
          description_bn?: string | null
          description_en?: string | null
          display_order?: number | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          result_bn?: string | null
          result_en?: string | null
          slug?: string
          tags?: string[] | null
          title_bn?: string | null
          title_en?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      proposals: {
        Row: {
          client_company: string | null
          client_email: string | null
          client_id: string | null
          client_name: string
          client_phone: string | null
          created_at: string
          created_by: string | null
          deliverables: string | null
          id: string
          notes: string | null
          pricing_summary: string | null
          proposal_number: string
          scope_of_work: string | null
          status: string
          terms: string | null
          timeline: string | null
          title: string
          total_amount: number | null
          updated_at: string
          valid_until: string | null
          version: number | null
        }
        Insert: {
          client_company?: string | null
          client_email?: string | null
          client_id?: string | null
          client_name: string
          client_phone?: string | null
          created_at?: string
          created_by?: string | null
          deliverables?: string | null
          id?: string
          notes?: string | null
          pricing_summary?: string | null
          proposal_number: string
          scope_of_work?: string | null
          status?: string
          terms?: string | null
          timeline?: string | null
          title: string
          total_amount?: number | null
          updated_at?: string
          valid_until?: string | null
          version?: number | null
        }
        Update: {
          client_company?: string | null
          client_email?: string | null
          client_id?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string
          created_by?: string | null
          deliverables?: string | null
          id?: string
          notes?: string | null
          pricing_summary?: string | null
          proposal_number?: string
          scope_of_work?: string | null
          status?: string
          terms?: string | null
          timeline?: string | null
          title?: string
          total_amount?: number | null
          updated_at?: string
          valid_until?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "proposals_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      quotation_items: {
        Row: {
          amount: number
          created_at: string
          description: string
          display_order: number | null
          id: string
          quantity: number
          quotation_id: string
          unit_price: number
        }
        Insert: {
          amount: number
          created_at?: string
          description: string
          display_order?: number | null
          id?: string
          quantity?: number
          quotation_id: string
          unit_price: number
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          display_order?: number | null
          id?: string
          quantity?: number
          quotation_id?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "quotation_items_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      quotations: {
        Row: {
          client_address: string | null
          client_email: string | null
          client_id: string | null
          client_name: string
          client_phone: string | null
          created_at: string
          created_by: string | null
          discount_amount: number | null
          id: string
          issue_date: string
          notes: string | null
          quotation_number: string
          status: string
          subtotal: number
          tax_amount: number | null
          tax_rate: number | null
          terms: string | null
          total: number
          updated_at: string
          valid_until: string | null
        }
        Insert: {
          client_address?: string | null
          client_email?: string | null
          client_id?: string | null
          client_name: string
          client_phone?: string | null
          created_at?: string
          created_by?: string | null
          discount_amount?: number | null
          id?: string
          issue_date?: string
          notes?: string | null
          quotation_number: string
          status?: string
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          terms?: string | null
          total?: number
          updated_at?: string
          valid_until?: string | null
        }
        Update: {
          client_address?: string | null
          client_email?: string | null
          client_id?: string | null
          client_name?: string
          client_phone?: string | null
          created_at?: string
          created_by?: string | null
          discount_amount?: number | null
          id?: string
          issue_date?: string
          notes?: string | null
          quotation_number?: string
          status?: string
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          terms?: string | null
          total?: number
          updated_at?: string
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_requests: {
        Row: {
          budget: string | null
          company: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          notes: string | null
          phone: string | null
          project_details: string
          service_interest: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          budget?: string | null
          company?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          notes?: string | null
          phone?: string | null
          project_details: string
          service_interest?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          budget?: string | null
          company?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          project_details?: string
          service_interest?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          description_bn: string | null
          description_en: string | null
          display_order: number | null
          features: Json | null
          icon: string | null
          id: string
          is_active: boolean | null
          slug: string
          title_bn: string | null
          title_en: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_bn?: string | null
          description_en?: string | null
          display_order?: number | null
          features?: Json | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          slug: string
          title_bn?: string | null
          title_en: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_bn?: string | null
          description_en?: string | null
          display_order?: number | null
          features?: Json | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          slug?: string
          title_bn?: string | null
          title_en?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          content_bn: string | null
          content_en: string | null
          created_at: string
          id: string
          key: string
          updated_at: string
        }
        Insert: {
          content_bn?: string | null
          content_en?: string | null
          created_at?: string
          id?: string
          key: string
          updated_at?: string
        }
        Update: {
          content_bn?: string | null
          content_en?: string | null
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          display_order: number | null
          id: string
          is_active: boolean | null
          name_bn: string | null
          name_en: string
          quote_bn: string | null
          quote_en: string
          role_bn: string | null
          role_en: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name_bn?: string | null
          name_en: string
          quote_bn?: string | null
          quote_en: string
          role_bn?: string | null
          role_en?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name_bn?: string | null
          name_en?: string
          quote_bn?: string | null
          quote_en?: string
          role_bn?: string | null
          role_en?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_employee_id: { Args: never; Returns: string }
      generate_invoice_number: { Args: never; Returns: string }
      generate_proposal_number: { Args: never; Returns: string }
      generate_quotation_number: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "manager" | "developer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "developer"],
    },
  },
} as const
