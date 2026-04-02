// Auto-generated Supabase types — run `pnpm db:types` to regenerate
// This file will be overwritten by: supabase gen types typescript

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
      destinations: {
        Row: {
          id: string;
          slug: string;
          name: string;
          country: string;
          country_code: string;
          continent: string;
          lat: number;
          lng: number;
          description: string | null;
          meta_title: string | null;
          meta_description: string | null;
          hero_image_url: string | null;
          climate: string | null;
          best_season: string[] | null;
          tags: string[] | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["destinations"]["Row"],
          "id" | "created_at" | "updated_at" | "is_active"
        > &
          Partial<
            Pick<
              Database["public"]["Tables"]["destinations"]["Row"],
              "id" | "created_at" | "updated_at" | "is_active"
            >
          >;
        Update: Partial<
          Database["public"]["Tables"]["destinations"]["Row"]
        >;
      };
      users: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          visited_countries: string[];
          xp: number;
          level: number;
          is_public: boolean;
          fcm_token: string | null;
          notification_prefs: Json;
          role: "user" | "admin" | "moderator" | "support";
          created_at: string;
          updated_at: string;
        };
        Insert: Pick<Database["public"]["Tables"]["users"]["Row"], "id"> &
          Partial<
            Omit<Database["public"]["Tables"]["users"]["Row"], "id">
          >;
        Update: Partial<Database["public"]["Tables"]["users"]["Row"]>;
      };
      offers: {
        Row: {
          id: string;
          destination_id: string;
          type: "pauschal" | "hotel" | "flug" | "lastminute" | "kreuzfahrt";
          title: string;
          provider: string | null;
          price_cents: number;
          original_price_cents: number | null;
          currency: string;
          departure_airport: string | null;
          departure_date: string | null;
          return_date: string | null;
          duration_nights: number | null;
          board_type: string | null;
          hotel_stars: number | null;
          hotel_name: string | null;
          image_url: string | null;
          affiliate_url: string;
          source: string;
          external_id: string | null;
          is_active: boolean;
          collected_at: string;
          expires_at: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["offers"]["Row"],
          "id" | "created_at" | "collected_at" | "is_active" | "currency"
        > &
          Partial<
            Pick<
              Database["public"]["Tables"]["offers"]["Row"],
              "id" | "created_at" | "collected_at" | "is_active" | "currency"
            >
          >;
        Update: Partial<Database["public"]["Tables"]["offers"]["Row"]>;
      };
      admin_crm_tickets: {
        Row: {
          id: string;
          anbieter_id: string;
          betreff: string;
          nachricht: string;
          typ: "intern" | "email_gesendet" | "email_empfangen" | "anruf" | "dokument" | "auszahlung" | "sonstiges";
          status: "offen" | "in_bearbeitung" | "erledigt";
          prioritaet: "niedrig" | "normal" | "hoch" | "dringend";
          erstellt_von: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["admin_crm_tickets"]["Row"], "id" | "created_at" | "updated_at"> & Partial<Pick<Database["public"]["Tables"]["admin_crm_tickets"]["Row"], "id" | "created_at" | "updated_at">>;
        Update: Partial<Database["public"]["Tables"]["admin_crm_tickets"]["Row"]>;
      };
      reports: {
        Row: {
          id: string;
          user_id: string;
          destination_id: string | null;
          title: string;
          content: string;
          rating: number | null;
          travel_date: string | null;
          images: string[] | null;
          likes_count: number;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["reports"]["Row"],
          | "id"
          | "created_at"
          | "updated_at"
          | "likes_count"
          | "is_published"
        > &
          Partial<
            Pick<
              Database["public"]["Tables"]["reports"]["Row"],
              | "id"
              | "created_at"
              | "updated_at"
              | "likes_count"
              | "is_published"
            >
          >;
        Update: Partial<Database["public"]["Tables"]["reports"]["Row"]>;
      };
      achievements: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string;
          icon: string;
          xp_reward: number;
          condition: Json;
          category: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["achievements"]["Row"],
          "id" | "created_at" | "xp_reward" | "category"
        > &
          Partial<
            Pick<
              Database["public"]["Tables"]["achievements"]["Row"],
              "id" | "created_at" | "xp_reward" | "category"
            >
          >;
        Update: Partial<
          Database["public"]["Tables"]["achievements"]["Row"]
        >;
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          destination_id: string;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["favorites"]["Row"],
          "id" | "created_at"
        > &
          Partial<
            Pick<
              Database["public"]["Tables"]["favorites"]["Row"],
              "id" | "created_at"
            >
          >;
        Update: Partial<
          Database["public"]["Tables"]["favorites"]["Row"]
        >;
      };
      price_alerts: {
        Row: {
          id: string;
          user_id: string;
          destination_id: string;
          max_price_cents: number;
          offer_type: string;
          departure_airports: string[] | null;
          is_active: boolean;
          last_triggered_at: string | null;
          created_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["price_alerts"]["Row"],
          "id" | "created_at" | "is_active" | "offer_type"
        > &
          Partial<
            Pick<
              Database["public"]["Tables"]["price_alerts"]["Row"],
              "id" | "created_at" | "is_active" | "offer_type"
            >
          >;
        Update: Partial<
          Database["public"]["Tables"]["price_alerts"]["Row"]
        >;
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          unlocked_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["user_achievements"]["Row"],
          "id" | "unlocked_at"
        > &
          Partial<
            Pick<
              Database["public"]["Tables"]["user_achievements"]["Row"],
              "id" | "unlocked_at"
            >
          >;
        Update: Partial<
          Database["public"]["Tables"]["user_achievements"]["Row"]
        >;
      };
      anbieter_profile: {
        Row: {
          id: string; user_id: string | null; name: string; email: string;
          status: string; verifiziert: boolean; telefon: string | null;
          website: string | null; webseite: string | null; bio: string | null;
          beschreibung: string | null; adresse: string | null; strasse: string | null;
          plz: string | null; stadt: string | null; land_name: string | null;
          kategorie: string | null; iban: string | null; bic: string | null;
          kontoinhaber: string | null; umsatzsteuer_id: string | null;
          steuernummer: string | null; dokument_ausweis: string | null;
          dokument_nachweis: string | null; dokument_url: string | null;
          stripe_account_id: string | null; stripe_onboarding_complete: boolean;
          sprachen: string[] | null; erfahrung_jahre: number | null;
          instagram: string | null; tripadvisor: string | null;
          avatar_url: string | null; created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["anbieter_profile"]["Row"]> & { name: string; email: string };
        Update: Partial<Database["public"]["Tables"]["anbieter_profile"]["Row"]>;
      };
      angebote: {
        Row: {
          id: string; anbieter_id: string | null; titel: string; slug: string;
          kurzbeschreibung: string | null; beschreibung: string | null;
          kategorie: string | null; ziel: string | null; land: string | null;
          preis: number; preistyp: string; dauer: string | null;
          max_teilnehmer: number | null; sprachen: string[] | null;
          highlights: string[] | null; inbegriffen: string[] | null;
          nicht_inbegriffen: string[] | null; treffpunkt: string | null;
          treffpunkt_hinweis: string | null; foto_url: string | null;
          fotos: string[] | null; status: string | null;
          created_at: string; updated_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["angebote"]["Row"]> & { titel: string; slug: string; preis: number; preistyp: string };
        Update: Partial<Database["public"]["Tables"]["angebote"]["Row"]>;
      };
      buchungen: {
        Row: {
          id: string; buchungs_nummer: string; angebot_id: string | null;
          anbieter_id: string | null; kunden_name: string; kunden_email: string;
          kunden_telefon: string | null; datum: string; personen: number;
          gesamtpreis: number; provision_betrag: number; auszahlungs_betrag: number;
          status: string | null; stripe_payment_intent_id: string | null;
          stripe_payment_status: string | null; stripe_checkout_session_id: string | null;
          qr_token: string | null; eingeloest_at: string | null;
          notiz: string | null; created_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["buchungen"]["Row"]> & {
          buchungs_nummer: string; kunden_name: string; kunden_email: string;
          datum: string; personen: number; gesamtpreis: number;
          provision_betrag: number; auszahlungs_betrag: number;
        };
        Update: Partial<Database["public"]["Tables"]["buchungen"]["Row"]>;
      };
      auszahlungen: {
        Row: {
          id: string; anbieter_id: string; betrag: number; status: string;
          buchungs_ids: string[]; referenz: string | null; notiz: string | null;
          stripe_transfer_id: string | null; created_at: string;
          ueberwiesen_at: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["auszahlungen"]["Row"]> & { anbieter_id: string; betrag: number; status: string; buchungs_ids: string[] };
        Update: Partial<Database["public"]["Tables"]["auszahlungen"]["Row"]>;
      };
      werbeplaetze_buchungen: {
        Row: {
          id: string; anbieter_id: string; angebot_id: string | null;
          paket: string; zielseite: string | null; laufzeit_monate: number;
          preis_monatlich: number; preis_gesamt: number; status: string;
          admin_notiz: string | null; placement_info: string | null;
          starts_at: string | null; ends_at: string | null;
          stripe_checkout_session_id: string | null;
          stripe_payment_intent_id: string | null; bezahlt_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["werbeplaetze_buchungen"]["Row"]> & {
          anbieter_id: string; paket: string; laufzeit_monate: number;
          preis_monatlich: number; preis_gesamt: number; status: string;
        };
        Update: Partial<Database["public"]["Tables"]["werbeplaetze_buchungen"]["Row"]>;
      };
    };
  };
}
